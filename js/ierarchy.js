function ierarchyPainter() {
    //console.log('from function ierarchy')
    var margin = { top: 10, right: 150, bottom: 10, left: 100 },
        width = d3.select("#ierarchy").node().getBoundingClientRect().width - margin.left - margin.right,
        //height = d3.select("#ierarchy").node().getBoundingClientRect().height - margin.top - margin.bottom;
        height = 2000
        //console.log(height)

    var svg = d3.select("#ierarchy")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)

    //console.log(svg)


    d3.csv("data.csv", function(error, data, ) {
        if (error) throw error;

        function update(f) {

            try {
                var rem = svg_i.selectAll("svg")
                    //console.log(rem)
                rem.remove();
            } catch {
                console.log('error')
            }

            try {
                var ges = svg.selectAll("g")
                    //console.log(ges)
                ges.remove();
            } catch {
                console.log('error_2')
            }

            var cluster = d3.cluster()
                .size([height, width - 160]);
            //.size([height, width]);
            //.size([200, 200]);

            var stratify = d3.stratify()
                .parentId(function(d) {
                    return d.id.substring(0, d.id.lastIndexOf("."));
                });

            i = svg.append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
                .attr("width", '99vw')
                .attr("height", '100%')

            i
                .transition()
                .duration(750);


            var filtered = data.filter(function(d) { return d.district === f })

            var root = stratify(filtered)
                .sort(function(a, b) {
                    return (a.height - b.height) || a.id.localeCompare(b.id);
                });

            cluster(root);
            //console.log(root)

            var link = i.selectAll(".link")
                .data(root.descendants().slice(1))
                .enter().append("path")
                .attr("class", function(d) {
                    //console.log(d)
                    return d.data.unit_en + " " + d.data.crimes + " link"
                })
                .attr("d", diagonal);

            var node = i.selectAll(".node")
                .data(root.descendants())
                .enter().append("g")
                .attr("class", function(d) {
                    //console.log(d.children)
                    return "node " + (d.children ? "node node--internal" : " node--leaf");
                })
                .attr("transform", function(d) {
                    //console.log(d.y)
                    return "translate(" + d.y + "," + d.x + ")";
                });



            node.append("circle")
                .attr("r", 2.5);

            node.append("text")
                .attr("dy", 3)
                .attr("x", function(d) {
                    return d.children ? -5 : 5;
                })
                .style("text-anchor", function(d) {
                    return d.children ? "end" : "start";
                })
                .text(function(d) {
                    t = d.id.substring(d.id.lastIndexOf(".") + 1)
                        //console.log(t)
                    return t;
                });

            var tooltip = d3.select("#ierarchy")
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
                //console.log(d3.select(this)._groups[0][0].__data__.x)
                //console.log(this.__data__)
                tooltip
                    .html(
                        "<b>Назва:</b> " + this.__data__.data.id.substring(d.id.lastIndexOf(".") + 1) + "<br>" +
                        "<b>Військова частина:</b> " + this.__data__.data.mil_part + "<br>" +
                        "<b>Населений пункт:</b> " + this.__data__.data.city + "<br>" +
                        "<b>Регіон:</b> " + this.__data__.data.region + "<br>"
                    )
                    .style("left", (this.__data__.y - 90) + "px") // It is important to put the +90: other wise the tooltip is exactly where the point is an it creates a weird effect
                    .style("top", (this.__data__.x) + "px")
                    .style("opacity", 1)
            }

            /*var mousemove = function(d) {
                //console.log(this)
                tooltip
                    .html("this is tooltip " + this.__data__.x + " " + this.__data__.y)
                    .style("left", (this.__data__.y - 90) + "px") // It is important to put the +90: other wise the tooltip is exactly where the point is an it creates a weird effect
                    .style("top", (this.__data__.x) + "px")
                    //.style("left", (0) + "px") // It is important to put the +90: other wise the tooltip is exactly where the point is an it creates a weird effect
                    //.style("top", (0) + "px")
            } */


            // A function that change this tooltip when the leaves a point: just need to set opacity to 0 again
            var mouseleave = function(d) {
                    //console.log('mouseleave')
                    tooltip
                        .transition()
                        .duration(200)
                        .style("opacity", 0)
                }
                /*node
                   .on("mouseover", mouseover)
                   //.on("mousemove", mousemove)
                   .on("mouseleave", mouseleave) */

            var leafs = document.getElementsByClassName("node node--leaf"); // перебираємо кожен підрозділ, який є класом
            //console.log(leafs)

            for (var z = 0; z < leafs.length; z++) {
                //console.log(leafs[z].__data__.id)
                //console.log(leafs[z].__data__.id.substring(leafs[z].__data__.id.lastIndexOf(".") + 1))
                //console.log(leafs[z].__data__.id)
                //console.log(leafs[z])
                elem = d3.select(leafs[z])
                    //console.log(elem)
                circles = elem.selectAll("circle")

                //console.log(circles)

                circles
                    .attr("class", leafs[z].__data__.data.unit_en + " " + leafs[z].__data__.data.crimes);

                texts = elem.selectAll("text")

                texts
                    .attr("class", leafs[z].__data__.data.unit_en + " " + leafs[z].__data__.data.crimes);
            }
            internals = document.getElementsByClassName("node node--internal"); // перебираємо кожен підрозділ, який є класом

            for (var x = 0; x < internals.length; x++) {
                //console.log(internals[x]) // перебираємо всі об'єкти із класом node node--internal все що нижче відноситься до кожного окремого об'єкту
                //console.log(internals[x].__data__.id) // перебираємо всі об'єкти із класом node node--internal все що нижче відноситься до кожного окремого об'єкту
                var classesList = []

                for (var y = 0; y < internals[x].__data__.children.length; y++) {
                    //console.log(internals[x].__data__.children[y].data.unit_en)
                    classesList.push(internals[x].__data__.children[y].data.unit_en)
                    try {
                        for (var z = 0; z < internals[x].__data__.children[y].children.length; z++) {
                            //console.log(internals[x].__data__.children[y].children[z].data.unit_en)
                            classesList.push(internals[x].__data__.children[y].children[z].data.unit_en)
                            try {
                                for (var q = 0; q < internals[x].__data__.children[y].children[z].children.length; q++) {
                                    //console.log(internals[x].__data__.children[y].children[z].children[q].data.unit_en)
                                    classesList.push(internals[x].__data__.children[y].children[z].children[q].data.unit_en)
                                }
                            } catch {}
                        }
                    } catch {}
                }

                //console.log(classesList)
                for (var k = 0; k < classesList.length; k++) {
                    try {
                        for (var u = 0; u < internals[x].childNodes.length; u++) {
                            internals[x].childNodes[u].classList.add(classesList[k]);
                        }
                    } catch {}
                }
                //console.log(internals[x])
            }
            links = document.getElementsByClassName("link")

            for (var x = 0; x < links.length; x++) {
                //console.log(links[x])

                var classesList = []
                try {
                    for (var y = 0; y < links[x].__data__.children.length; y++) {
                        //console.log(links[x].__data__.children[y].data.unit_en)
                        classesList.push(links[x].__data__.children[y].data.unit_en)
                        try {
                            for (var z = 0; z < links[x].__data__.children[y].children.length; z++) {
                                //console.log(links[x].__data__.children[y].children[z].data.unit_en)
                                classesList.push(links[x].__data__.children[y].children[z].data.unit_en)
                                try {
                                    for (var q = 0; q < links[x].__data__.children[y].children[z].children.length; q++) {
                                        //console.log(internals[x].__data__.children[y].children[z].children[q].data.unit_en)
                                        classesList.push(links[x].__data__.children[y].children[z].children[q].data.unit_en)
                                    }
                                } catch {}
                            }
                        } catch {}
                    }

                } catch {}
                //console.log(classesList)
                for (var k = 0; k < classesList.length; k++) {
                    try {
                        links[x].classList.add(classesList[k])
                    } catch {}
                }
            }
            options()


        }
        // When the button is changed, run the updateChart function
        d3.select("#district_selector").on("change", function(d) {
            // recover the option that has been chosen
            var selectedOption = d3.select(this).property("value")
                //console.log(selectedOption)
                // run the updateChart function with this selected option
            update(selectedOption)
        })
        update("Западный военный округ")
    });

    function diagonal(d) {
        return "M" + d.y + "," + d.x +
            "C" + (d.parent.y + 50) + "," + d.x +
            " " + (d.parent.y + 50) + "," + d.parent.x +
            " " + d.parent.y + "," + d.parent.x;
    }
}
ierarchyPainter()