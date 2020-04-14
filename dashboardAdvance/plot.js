function draw() {
    let globalStart = 0;

    function dataTranspose(data, start, end, index, stat) {
        let dat = [];
        let value = 'data[index].' + stat + '[i]';
        for (let i = start; i < end; i++) {
            dat.push({x: data[index].x[i], y: eval(value),
                resting_line:eval(data[index].resting), exercise_line: eval(data[index].exercise)})
        }
        return dat;
    }

    // function segregate(data, elapsedTime){
    //     if (elapsedTime ===  ""){
    //         return []
    //     }
    //     else {
    //         result = dataTranspose(data, globalStart, elapsedTime);
    //         globalStart = elapsedTime;
    //     }
    //
    //     return result;
    // }

//Read the data
    let myData;
    function getData() {
        d3.csv("MasterSportDatabase.csv",
            function (d) {
                // Resting-Elapsed,Exercise-Elapsed,Recovery-Elapsed
                // console.log(d[stat], 'RR');
                return {
                    x: [...Array(JSON.parse(d['HR']).length).keys()],
                    HR: JSON.parse(d['HR']),
                    RR: JSON.parse(d['RR']),
                    BR: JSON.parse(d['BR']),
                    resting: d['Resting-Elapsed'], exercise: d['Exercise-Elapsed'], recovery: d['Recovery-Elapsed'],
                    sport: d['Sport'], subject: d['Subject']
                }
            },
            function (data) {
                drawPlot('HR', data);
                drawPlot('BR', data);
                drawPlot('RR', data);
                // console.log(data);
                // console.log(data[0].resting);
                // data = dataTranspose(data, 0, data[0].resting);
                // data_hr_resting = segregate(data, data[0].resting);
                // console.log(data[index].y.length);

                // data_hr_recovery = segregate(data, data[0].recovery);
                // console.log(stat, transposedData);

                // drawPlot(stat);
                // console.log(transposedData);
                // console.log(data);
                // console.log((data[0].y[0]));
            });
    }
    getData();

    function drawPlot(stat, data) {
        let index = 1;
        data = dataTranspose(data, globalStart, data[index].x.length, index, stat);
        console.log(data[index].resting_line);
        var margin = {top: 10, right: 30, bottom: 30, left: 60},
            width = 1500 - margin.left - margin.right,
            height = 320 - margin.top - margin.bottom;

        var svg = d3.select("#linePlots")
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");

        var x = d3.scaleLinear()
            .domain([0, d3.max(data, function (d) {
                return d.x;
            })])
            .range([0, width]);
        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x));


        // X label
        svg.append("text")
            .attr('font-weight',900)
            .attr("transform", "translate(" + (width / 2) + " ," + (height + margin.bottom) + ")")
            .style("text-anchor", "middle")
            .text("Time");


        // Add Y axis
        var y = d3.scaleLinear()
            .domain([0, d3.max(data, function (d) {
                return +d.y;
            })])
            .range([height, 0]);
        svg.append("g")
            .call(d3.axisLeft(y));

        // Add y label

        svg.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 0 - margin.left)
            .attr("x",0 - (height / 2))
            .attr("dy", "1em")
            .attr('font-weight',900)
            .style("text-anchor", "middle")
            .text(stat);

        // Add demarcations
        var resting_demarc = svg.append("line")
            .style("stroke-dasharray", "3,3")
            .attr("x1", x(data[index].resting_line))
            .attr("y1", height)
            .attr("x2", x(data[index].resting_line))
            .attr("y2", 0)
            .attr("stroke-width", 2)
            .attr("stroke", "black");

        var text = svg
            .append("text")
            .attr('font-weight',900)
            .attr('transform', 'translate('+x(data[index].resting_line+30)+','+height/1.5+')rotate(-90)')
            .text("Exercise phase starts");
            // .attr('transform', 'rotate(90 -10 10)');

        var exercise_demarc = svg.append("line")
            .style("stroke-dasharray", "3,3")
            .attr("x1", x(data[index].exercise_line))
            .attr("y1", height)
            .attr("x2", x(data[index].exercise_line))
            .attr("y2", 0)
            .attr("stroke-width", 2)
            .attr("stroke", "black");

        var text = svg
            .append("text")
            .attr('font-weight',900)
            .attr('transform', 'translate('+x(data[index].exercise_line+30)+','+height/1.5+')rotate(-90)')
            .text("Recovery phase starts");
        // .attr('transform', 'rotate(90 -10 10)');


        // Add the line
        svg.append("path")
            .datum(data)
            .attr("fill", "none")
            .attr("stroke", "steelblue")
            .attr("stroke-width", 1.5)
            .attr("d", d3.line()
                .x(function (d) {
                    return x(d.x)
                })
                .y(function (d) {
                    return y(d.y)
                })
            )
    }

}