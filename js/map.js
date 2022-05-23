// The svg

/*var svg = d3.select("#map"),
    width = +svg.attr("width"),
    height = +svg.attr("height"); */


var margin = { top: 20, right: 0, bottom: 50, left: 200 },
    width = d3.select("#map").node().getBoundingClientRect().width - margin.left - margin.right,
    height = 920 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#map")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)

svg.append('rect')
    .attr("fill", "#d0cfd4")
    .attr('width', '100%')
    .attr('height', '100%')

svg.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Map and projection
var projection = d3.geoMercator()
    .scale(200) //400
    .rotate([-90, 0])
    .center([0, 70])
    /*.translate([width / 2, height / 2 * 1.3]) */

// Create data: coordinates of start and end
d3.csv("map.csv", function(data) {

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
        if (d.ua_f == 0) {
            points.push({
                region: d.region,
                unit: d.unit,
                type: "Point",
                coordinates: [
                    [d.ua_f, d.ua_s],
                    [d.ru_f, d.ru_s]
                ]
            })
        } else {
            link.push({
                region: d.region,
                unit: d.unit,
                type: "LineString",
                coordinates: [
                    [d.ua_f, d.ua_s],
                    [d.ru_f, d.ru_s]
                ]
            })
        }

    });

    //console.log(link)
    // A path generator
    var path = d3.geoPath()
        .projection(projection)

    // Load world shape
    d3.json("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson", function(data) {

        /*WRITE A FILTER!!!!*/
        /*data.features = data.features.filter(function(d) {
                console.log(d.properties.name)
                return d.properties.name == 'Russia'
            }) */


        // Draw the map
        svg.append("g")
            .selectAll("path")
            .data(data.features)
            .enter().append("path")
            .attr("fill", "#efefef")
            .attr("d", d3.geoPath()
                .projection(projection)
            )
            .style("stroke", "#d0cfd4")
            .style("stroke-width", 1)




        var tooltip = d3.select("#map")
            .append("div")
            .style("opacity", 0)
            .attr("class", "tooltip")
            .style("background-color", "white")
            .style("border", "solid")
            .style("border-width", "1px")
            .style("border-radius", "5px")
            .style("padding", "10px")



        // A function that change this tooltip when the user hover a point.
        // Its opacity is set to 1: we can now see it. Plus it set the text and position of tooltip depending on the datapoint (d)
        var mouseover = function(d) {
            tooltip
                .style("opacity", 1)
        }

        var mousemove = function(d) {
            tooltip
                .html("this is tooltip " + d.coordinates)
                .style("left", (d3.mouse(this)[0]) + "px") // It is important to put the +90: other wise the tooltip is exactly where the point is an it creates a weird effect
                .style("top", (d3.mouse(this)[1]) + "px")
        }


        // A function that change this tooltip when the leaves a point: just need to set opacity to 0 again
        var mouseleave = function(d) {
            tooltip
                .transition()
                .duration(200)
                .style("opacity", 0)
        }


        // Add the lines
        svg.selectAll("myPath")
            .data(link)
            .enter()
            .append("path")
            //.attr("class", "path_line")
            .attr("class", function(d) { return d.unit })
            .attr("d", function(d) { return path(d) })
            .style("fill", "none")
            .style("stroke", "black")
            .style("stroke-width", 1)
            .style("opacity", 0.5)
            .on("mouseover", mouseover)
            .on("mousemove", mousemove)
            .on("mouseleave", mouseleave)

        svg.selectAll("myCircles")
            .data(points)
            .enter()
            .append("circle")
            .attr("class", function(d) { return d.unit })
            .attr("cx", function(d) { return projection(d.coordinates[1])[0] })
            .attr("cy", function(d) { return projection(d.coordinates[1])[1] })
            .attr("r", 3)
            //.attr("class", "circle")
            .style("fill", "69b3a2")
            .attr("stroke", "#69b3a2")
            .attr("stroke-width", 3)
            .attr("fill-opacity", .4)
            .on("mouseover", mouseover)
            .on("mousemove", mousemove)
            .on("mouseleave", mouseleave)

        /*
                // add the points
                link.forEach(function(d) {
                    var photo = document.getElementsByClassName(d.unit); //перебираємо кожен підрозділ, який є класом
                    //console.log(photo)
                    for (var i = 0; i < photo.length; i++) {
                        try { // до кожного підрозідлу перебираємо всі елементи
                            //console.log(i)
                            //console.log(photo[i])
                            //var elem = document.getElementsByClassName(photo[i]);
                            //console.log(elem)
                            photo[i].onmouseover = function() {
                                this.style.opacity = "1";
                                this.style.stroke = 'red';
                                this.style.strokewidth = "5";
                            };
                            photo[i].onmouseleave = function() {
                                this.style.opacity = "0.4";
                                this.style.stroke = 'black';
                                this.style.strokewidth = "0.5";
                            }
                            photo[i].onclick = function() { // додаємо функцію по кліку друкувати в консоль
                                console.log(this);
                            }
                        } catch {
                            continue
                        }
                    };
                }) */





    })
})