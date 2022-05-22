/*var svg = d3.select("#ierarchy"),
    width = +svg.attr("width"),
    height = +svg.attr("height"),
    i = svg.append("g").attr("transform", "translate(50,50)"); */

var margin = { top: 10, right: 10, bottom: 10, left: 10 },
    width = d3.select("#ierarchy").node().getBoundingClientRect().width - margin.left - margin.right,
    height = 920 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#ierarchy")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)

i = svg.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var tree = d3.tree()
    .size([height - 10, width - 10])
    //.size([height, width]);

var cluster = d3.cluster()
    /*.size([height, width - 160]); */
    .size([height, width]);

var stratify = d3.stratify()
    .parentId(function(d) {
        return d.id.substring(0, d.id.lastIndexOf("."));
    });

d3.csv("data.csv", function(error, data, ) {
    if (error) throw error;

    function update(f) {

        var filtered = data.filter(function(d) { return d.district === f })

        var root = stratify(filtered)
            .sort(function(a, b) {
                return (a.height - b.height) || a.id.localeCompare(b.id);
            });

        cluster(root);



        var link = i.selectAll(".link")
            .data(root.descendants().slice(1))
            .enter().append("path")
            .attr("class", "link")
            .attr("d", diagonal);



        var node = i.selectAll(".node")
            .data(root.descendants())
            .enter().append("g")
            .attr("class", function(d) {
                return "node" + (d.children ? " node--internal" : " node--leaf");
            })
            .attr("transform", function(d) {
                return "translate(" + d.y + "," + d.x + ")";
            });

        node.append("circle")
            .attr("r", 2.5);
        //.attr("class", 'sircle');

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

        var leafs = document.getElementsByClassName("node node--leaf"); // перебираємо кожен підрозділ, який є класом
        console.log(leafs)

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
                .attr("class", leafs[z].__data__.id.substring(leafs[z].__data__.id.lastIndexOf(".") + 1));

            texts = elem.selectAll("text")

            texts
                .attr("class", leafs[z].__data__.id.substring(leafs[z].__data__.id.lastIndexOf(".") + 1));

            /*texts.onmouseover = function() {
                this.style.opacity = "1";
                this.style.color = 'red';
                this.style.strokewidth = "5";
            };
            texts.onmouseleave = function() {
                this.style.opacity = "0.4";
                this.style.color = 'black';
                this.style.strokewidth = "0.5";
            }
            texts.onclick = function() { // додаємо функцію по кліку друкувати в консоль
                    console.log(this);
                } */
            //leafs[z].selectAll('circle')
            //    .attr("class", 'sircle')

            //leafs[z].onclick = function() { // додаємо функцію по кліку друкувати в консоль
            //    console.log(this);
            //}
        }

        d3.selectAll("input")
            .on("change", changed);

        var timeout = setTimeout(function() {
            d3.select("input[value=\"tree\"]")
                .property("checked", true)
                .dispatch("change");
        }, 1000);

        function changed() {
            timeout = clearTimeout(timeout);
            (this.value === "tree" ? tree : cluster)(root);
            var t = d3.transition().duration(750);
            node.transition(t).attr("transform", function(d) {
                return "translate(" + d.y + "," + d.x + ")";
            });
            link.transition(t).attr("d", diagonal);
        }
    }
    // When the button is changed, run the updateChart function
    d3.select("#district_selector").on("change", function(d) {
        // recover the option that has been chosen
        var selectedOption = d3.select(this).property("value")
        console.log(selectedOption)
            // run the updateChart function with this selected option
        update(selectedOption)
    })
    update("Западный военный округ")
});

function diagonal(d) {
    return "M" + d.y + "," + d.x +
        "C" + (d.parent.y + 100) + "," + d.x +
        " " + (d.parent.y + 100) + "," + d.parent.x +
        " " + d.parent.y + "," + d.parent.x;
}