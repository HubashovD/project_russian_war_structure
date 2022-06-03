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
        .scale(359) //400 350 360
        .rotate([-90, 0])
        .center([5, 65]) //[0, 70] [5, 70]
        /*.translate([width / 2, height / 2 * 1.3]) */





    d3.csv("map.csv", function(data) {

        d3.json("data/ukraine.geojson", function(error, json) {
            if (error) console.error(error);;

            var map_path = d3.geoPath().projection(projection);
            //console.log(map_path)

            map_svg.selectAll("u_path")
                .data(json.features)
                .enter()
                .append("path")
                .attr("d", map_path)
                .attr("fill", "None")
                .attr("stroke", "black")
                .style("opacity", 0.5);
        });


        /*d3.json("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson", function(data) {

            // Filter data
            data.features = data.features.filter(function(d) { return d.properties.name == "Ukraine" })

            // Draw the map
            map_svg.append("g")
                .selectAll("u_path")
                .data(data.features)
                .enter()
                .append("path")
                .attr("fill", "red")
                .attr("d", d3.geoPath()
                    .projection(projection)
                )
                .style("stroke", "black")
        })
 */


        /* function updateRegion(region) {
             d3.json("data/" + region + ".geojson", function(error, json) {
                 try {
                     var reg = document.getElementById("region")
                         //console.log(reg)
                     reg.remove()
                 } catch {}

                 if (error) console.error(error);;

                 var map_path = d3.geoPath().projection(projection);
                 //console.log(json)

                 map_svg.selectAll("r_path")
                     .data(json.features)
                     .enter()
                     .append("path")
                     .attr("id", "region")
                     .attr("d", map_path)
                     .attr("fill", "None")
                     .attr("stroke", "black")
                     .style("opacity", 0.5);
             });

         } 
        // When the button is changed, run the updateChart function
        d3.select("#district_selector").on("change.map", function(d) {
            console.log("update MAP")
                // recover the option that has been chosen
            var region = d3.select(this).property("value")
                //console.log(selectedOption)
                // run the updateChart function with this selected option
            updateRegion(region)
        })
        updateRegion("Західний військовий округ")*/

        options()
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
                .attr("r", 5)
                //.attr("class", "circle")
                .style("fill", "black")
                //.attr("stroke", "grey")
                //.attr("stroke-width", 1)
                .attr("fill-opacity", 0.5)


            // додаємо підписи доля населених пунктів в яких дислокуються військові підрозділи російської армії
            text_explainer = map_svg.selectAll(".labels")


            text_explainer
                .data(points)
                .enter().append("rect")
                .attr("class", function(d) { return d.unit_en + " text-rect" })
                .attr("x", function(d) {
                    return projection(d.coordinates[1])[0] - 5
                })
                .attr("y", function(d) { return projection(d.coordinates[1])[1] - 15 })
                .attr("height", "20px")
                .attr("width", function(d) { return d.city.length * 10 })
                .style("opacity", 0)
                .style("fill", "black")


            text_explainer
                .data(points)
                .enter().append("text")
                .attr("class", function(d) { return d.unit_en + " text-explainer" })
                .text(function(d) { return d.city })
                .attr("x", function(d) {
                    return projection(d.coordinates[1])[0]
                })
                .attr("y", function(d) { return projection(d.coordinates[1])[1] })
                .style("border", "solid")
                .style("border-width", "1px")
                .style("border-radius", "5px")
                .style("fill", "white")
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
                .attr("opacity", 0)

            // Додаємо підписи територій в яких вооють російські підрозділи в Україні
            text_war_explainer = map_svg.selectAll(".labels")

            text_war_explainer
                .data(link)
                .enter().append("rect")
                .attr("class", function(d) { return d.unit_en + " war-explainer-rect" })
                .attr("x", function(d) {
                    return projection(d.coordinates[0])[0] - 5
                })
                .attr("y", function(d) { return projection(d.coordinates[0])[1] - 15 })
                .attr("height", "20px")
                .attr("width", function(d) { return d.location.length * 10 })
                .style("opacity", 0)
                .style("fill", "red")

            text_war_explainer
                .data(link)
                .enter().append("text")
                .attr("class", function(d) { return d.unit_en + " war-explainer-text" })
                .text(function(d) { return d.location })
                .attr("x", function(d) {
                    return projection(d.coordinates[0])[0]
                })
                .attr("y", function(d) { return projection(d.coordinates[0])[1] })
                .style("border", "solid")
                .style("border-width", "1px")
                .style("border-radius", "5px")
                .style("opacity", 0)
                .style("fill", "white")


        })


        options()
    })

}
mapPainter()