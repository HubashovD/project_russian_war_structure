function listPainter() {
    //var margin = { top: 10, right: 100, bottom: 10, left: 100 },
    //    width = d3.select("#ierarchy").node().getBoundingClientRect().width - margin.left - margin.right,
    //    height = d3.select("#ierarchy").node().getBoundingClientRect().height - margin.top - margin.bottom;
    //height = 920 - margin.top - margin.bottom;

    d3.csv("map.csv", function(data) {
        function update(f) {
            // фільтруємо дані по військовому округу
            var filtered = data.filter(function(d) { return d.district === f })
                //вимірюємо кількість підрозділів в військовому окрузі
                //console.log(filtered.length)

            ierarchy = document.getElementById("ierarchy")

            // видаляємо попередні списки, якщо вони є 
            while (ierarchy.firstChild) {
                ierarchy.removeChild(ierarchy.firstChild)
            }

            //обираємо унікальні армії з військового округу
            army_list = []
            filtered.forEach(function(d) {
                    a_elem = d.army_en.toString()
                    army_list.push(a_elem)
                })
                //console.log(army_list)
            var army_set = new Set(army_list)
                //console.log(army_set)

            // проходимось по кожному унікальному значенню в списку унікальних армій
            army_set.forEach(function(army_en) {
                // відфільтровуємо армію
                army_filtered = filtered.filter(function(a_d) { return a_d.army_en === army_en })
                    //console.log(army_filtered.length)

                var army_main = document.createElement('ul');
                army_main.className = army_en
                army_main.classList.add("army-main")
                army_main.innerHTML = army_filtered[0].army
                ierarchy.appendChild(army_main)

                divisions_list = []
                army_filtered.forEach(function(d) {
                    //console.log(d.division_en)
                    d_elem = d.division_en.toString()
                        //console.log(elem)
                    divisions_list.push(d_elem)
                        //console.log(divisions_list)
                })

                //console.log(divisions_list)
                var division_set = new Set(divisions_list)
                    //console.log(division_set)

                division_set.forEach(function(division_en) {
                    division_filtered = army_filtered.filter(function(d) { return d.division_en === division_en })
                        //console.log(division_filtered)

                    var division_main = document.createElement('ul');
                    division_main.className = division_en;
                    division_main.innerHTML = division_filtered[0].division
                    division_main.classList.add("division-main")
                    army_main.appendChild(division_main)

                    division_filtered.forEach(function(d) {
                        //console.log(d.crimes)
                        var unit_main = document.createElement('li');
                        unit_main.className = d.unit_en;
                        division_main.classList.add(d.unit_en)
                        unit_main.classList.add("unit-main")
                        try {
                            unit_main.classList.add(d.crimes)
                        } catch {}
                        //console.log(d.unit.length)

                        function splitN(str, N) {
                            const words = str.trim().split(/\s+/g);
                            const res = [];
                            let cur_str = words.shift();
                            for (const word of words) {
                                if (cur_str.length + 1 + word.length >= N || cur_str.length >= N) {
                                    res.push(cur_str);
                                    cur_str = word;
                                } else {
                                    cur_str += ' ' + word;
                                }
                            }
                            res.push(cur_str);

                            return res.join('<br>');
                        }
                        //console.log(splitN(d.unit, 20));



                        unit_main.innerHTML = splitN(d.unit, 50)
                        division_main.appendChild(unit_main)
                    })
                })
            })
        }

        d3.select("#district_selector").on("change", function(d) {
            // recover the option that has been chosen
            var selectedOption = d3.select(this).property("value")
                //console.log(selectedOption)
                // run the updateChart function with this selected option
            update(selectedOption)
            options()
        })
        update("Западный военный округ")
    })
}
listPainter()