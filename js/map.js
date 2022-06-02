function mapPainter() {
    // The svg

    /*var svg = d3.select("#map"),
        width = +svg.attr("width"),
        height = +svg.attr("height"); */

    var map_margin = { top: 10, right: 10, bottom: 10, left: 10 },
        map_width = d3.select("#map").node().getBoundingClientRect().width, //- margin.left - margin.right,
        map_height = d3.select("#map").node().getBoundingClientRect().height - map_margin.top - map_margin.bottom;
    //height = 920 - margin.top - margin.bottom;
    console.log(d3.select("#map").node().getBoundingClientRect().height)
    console.log(map_width)
        //console.log(map_height)

    // append the svg object to the body of the page
    var map_svg = d3.select("#map")
        .append("svg")
        .attr("width", map_width) // + map_margin.left + map_margin.right
        .attr("height", map_height + map_margin.top + map_margin.bottom) // + map_margin.top + map_margin.bottom

    map_svg.append('rect')
        .attr("fill", "#d0cfd4")
        .attr('width', '100%')
        .attr('height', '100%')

    map_svg.append("g")
        .attr("transform", "translate(" + map_margin.left + "," + map_margin.top + ")")

    // Map and projection
    var projection = d3.geoMercator()
        .scale(350) //400 350
        .rotate([-90, 0])
        .center([10, 70]) //[0, 70]
        /*.translate([width / 2, height / 2 * 1.3]) */


    d3.csv("map.csv", function(data) {
        options()


        // Create data: coordinates of start and end

        /*
            data.forEach(function(d) {
                data = data.filter(d.ru_f == "")
            }) */

        var link = []
        var points = []
        data.forEach(function(d) {
            d.ua_f = +d.ua_f
            d.ua_s = +d.ua_s
            d.ru_f = +d.ru_f
            d.ru_s = +d.ru_s
            points.push({
                region: d.region,
                unit: d.unit,
                unit_en: d.unit_en,
                crimes: d.crimes,
                city: d.city,
                type: "Point",
                coordinates: [
                    [d.ua_f, d.ua_s],
                    [d.ru_f, d.ru_s]
                ]
            })
            if (d.ua_f == 0) {

            } else {
                link.push({
                    region: d.region,
                    unit: d.unit,
                    unit_en: d.unit_en,
                    crimes: d.crimes,
                    location: d.location,
                    type: "LineString",
                    coordinates: [
                        [d.ua_f, d.ua_s],
                        [d.ru_f, d.ru_s]
                    ]
                })
            }

        });
        //console.log(points)

        //console.log(link)
        // A path generator
        var path = d3.geoPath()
            .projection(projection)

        // Load world shape
        d3.json("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson", function(data) {

            // Draw the map
            map_svg.append("g")
                .selectAll("path")
                .data(data.features)
                .enter().append("path")
                .attr("fill", "#efefef")
                .attr("d", d3.geoPath()
                    .projection(projection)
                )
                .style("stroke", "#d0cfd4")
                .style("stroke-width", 1)

            // Add the lines
            map_svg.selectAll("myPath")
                .data(link)
                .enter()
                .append("path")
                //.attr("class", "path_line")
                .attr("class", function(d) { return d.unit_en + " " + d.crimes })
                //.addclass()
                .attr("d", function(d) { return path(d) })
                .style("fill", "none")
                .style("stroke", "black")
                .style("stroke-width", 1)
                .style("opacity", 0)
                //.on("mouseover", mouseover)
                //.on("mousemove", mousemove)
                //.on("mouseleave", mouseleave)

            map_svg.selectAll("myCircles")
                .data(points)
                .enter()
                .append("circle")
                .attr("class", function(d) { return d.unit_en + " " + d.crimes + " map-circle" })
                .attr("cx", function(d) { return projection(d.coordinates[1])[0] })
                .attr("cy", function(d) { return projection(d.coordinates[1])[1] })
                .attr("r", 3)
                //.attr("class", "circle")
                .style("fill", "blsck")
                .attr("stroke", "grey")
                .attr("stroke-width", 1)
                .attr("fill-opacity", 0.4)


            // додаємо підписи доля населених пунктів в яких дислокуються військові підрозділи російської армії
            text_explainer = map_svg.selectAll(".labels")

            text_explainer
                .data(points)
                .enter().append("text")
                //.attr("class", "text_explainer")
                .attr("class", function(d) { return d.unit_en + " text-explainer" })
                .text(function(d) { return d.city + ", " + d.region })
                .attr("x", function(d) {
                    return projection(d.coordinates[1])[0]
                })
                .attr("y", function(d) { return projection(d.coordinates[1])[1] })
                .style("background-color", "white")
                .style("border", "solid")
                .style("border-width", "1px")
                .style("border-radius", "5px")
                .style("opacity", 0)



            // додамо точки у яких вооють російські підрозділи в Україні
            map_svg.selectAll(".war_points")
                .data(link)
                .enter()
                .append("circle")
                .attr("class", function(d) { return d.unit_en + " war-point" })
                .attr("cx", function(d) { return projection(d.coordinates[0])[0] })
                .attr("cy", function(d) { return projection(d.coordinates[0])[1] })
                .attr("r", 3)
                .style("fill", "grey")
                .attr("stroke", "black")
                .attr("stroke-width", 3)
                .attr("opacity", 0)
                //.on("mouseover", mouseover)
                //.on("mousemove", mousemove)
                //.on("mouseleave", mouseleave)



            // Додаємо підписи територій в яких вооють російські підрозділи в Україні
            text_war_explainer = map_svg.selectAll(".war_explainer")

            text_war_explainer
                .data(link)
                .enter().append("text")
                //.attr("class", "text_explainer")
                .attr("class", function(d) { return d.unit_en + " war-explainer" })
                .text(function(d) { return d.location })
                .attr("x", function(d) {
                    return projection(d.coordinates[0])[0]
                })
                .attr("y", function(d) { return projection(d.coordinates[0])[1] })
                .style("background-color", "white")
                .style("border", "solid")
                .style("border-width", "1px")
                .style("border-radius", "5px")
                .style("opacity", 0)
        })

        options()
    })
}
mapPainter()