
function visualizeBarChart(dataitems,sortm) {

    dataitems.sort( (a,b)=>(b[sortm] - a[sortm]) );

    var finalRanks = dataitems.sort( (a,b) => ( b["winpercent"] - a["winpercent"]  ) ).map((d)=>(d.competitorname));

    var tooltip = d3.select("#tooltip").attr("class","toolTip");
    tooltip.html(" <h5>Hover over a bar for Candy Information </h5>");
    
    var margin = { top: 20, right: 20, bottom: 120, left:80 },
    width = 1600 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

    var x = d3.scaleBand()
    .domain(dataitems.map(function(d){return d.competitorname}))
    .range([0,width])
    .padding(0.1);

    var y = d3.scaleLinear()
    .domain([0, d3.max(dataitems, function(d){return d.winpercent })])
    .range([height, 0]);


    chart = d3.select("#chart1").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")" );

    chart.selectAll(".bar")
    .data(dataitems, (d) => (d.competitorname))
    .enter().append("rect")
    .attr("class","bar")
    .attr("fill","#f9742f")
    .attr("width", x.bandwidth())
    .attr("y", function (d){return y(d.winpercent);})
    .attr("height", function(d){return height - y(d.winpercent);})
    .transition()
    .attr("x",function(d){return x(d.competitorname);})
    .duration(1000)
    .delay((d,i)=> i*1);


    chart.selectAll(".text")
    .data(dataitems)
    .enter()
    .append('text')
    .attr('class', 'bar-label')
    .attr('fill', 'black')
    .text(function(d) { return (finalRanks.indexOf(d.competitorname) + 1 ) ; })
       .attr('x', function(d) { return x(d.competitorname) + 3; })
       .attr('y', function(d) { return y((+d.winpercent + 1)); })
    .attr('text-anchor','start'); 

    chart.selectAll(".bar")
        .attr("opacity", "0.7") 
        .on("mousemove", function (d) {
            d3.select(this).attr("opacity", "1");
            tooltip.style("left", d3.event.pageX - 5 + "px")
                   .style("top", d3.event.pageY - 7 + "px")
                   .html(
                       "<h5>" +(d.competitorname) + "</h5> "  +
                       "Winning Percentage: " + (d.winpercent) + "<br>" +
                       "Sugar Percentage: " +(d.sugarpercent) + "<br>" +
                       "Price Percentage: " + (d.pricepercent)
                    );
        })
        .on("mouseout", function (d) {
                    d3.select(this).attr("opacity", "0.7");
                    tooltip.html((" <h5>Hover over a bar for Candy Information </h5>"));
    });


    chart
        .append("g")
        .attr("class", "xaxis")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x))
        .selectAll("text")
        .style("text-anchor", "end")
        .transition()
        .delay((d, i) => i * 20)
        .attr("dx", "-.8em")
        .attr("dy", ".15em")
        .attr("transform", "rotate(-50)");



    chart.append("g")
    .call(d3.axisLeft(y));



    
}

function sortBarChart(dataitems,sortm){

    dataitems.sort( (a,b) => (b[sortm] - a[sortm]) );
    
    var margin = { top: 20, right: 20, bottom: 120, left:80 },
    width = 1600 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

    var x = d3.scaleBand()
    .domain(dataitems.map(function(d){return d.competitorname}))
    .range([0,width])
    .padding(0.1);


    var chart = d3.select("#chart1");


    const bars = chart.selectAll(".bar")
                       .data(dataitems, (d) => (d.competitorname));

    bars.order()
        .transition()
        .delay((d, i) => i * 20)
        .attr("x", (d) => x(d.competitorname))
        .duration(1800);


    var xP = d3.scaleBand()
    .domain(dataitems.map(function(d){return d.competitorname}))
    .range([0,width])
    .padding(0.1);

    var transition2 = d3.transition().delay(600).duration(1600);
    transition2.select('.xaxis')
    .call(d3.axisBottom(xP))
    .selectAll("g");    

    transition2.selectAll(".bar-label")
    .attr("x", (d) => x(d.competitorname) + 3 );

}


var makeScatterPlot = () => {
    
    var margin = {top: 20, right: 20, bottom: 30, left: 70},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

    var x = d3.scaleBand()
    .domain(dataitems.map(function(d){return d.x}))
    .range([0,width])
    .padding(0.1);


    var y = d3.scaleLinear()
    .domain([0, d3.max(dataitems, function(d){return d.y })])
    .range([height, 0]);


    // setup x 
    var xValue = function(d) { return d.x;}, // data -> value
        xScale = d3.scale.linear().range([0, width]), // value -> display
        xMap = function(d) { return xScale(xValue(d));}, // data -> display
        xAxis = d3.svg.axis().scale(xScale).orient("bottom");

    // setup y
    var yValue = function(d) { return d.y;}, // data -> value
        yScale = d3.scale.linear().range([height, 0]), // value -> display
        yMap = function(d) { return yScale(yValue(d));}, // data -> display
        yAxis = d3.svg.axis().scale(yScale).orient("left");


    // add the graph canvas to the body of the webpage
    var svg = d3.select("#linearAvgGraph").append("svg")
        .attr("class","michart")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
    .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // add the tooltip area to the webpage
    var tooltip = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);


    // don't want dots overlapping axis, so add in buffer to data domain
    xScale.domain([2,10]);
    yScale.domain([300, 1500]);

    // x-axis
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .append("text")
        .attr("class", "label")
        .attr("x", width)
        .attr("y", -6)
        .style("text-anchor", "end")
        .text("Number of Choices");

    // y-axis
    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("class", "label")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Time taken (ms)");

    // draw dots
    svg.selectAll(".dot")
        .data(scatterTimes)
        .enter().append("circle")
        .attr("class", "dot")
        .attr("r", 3.5)
        .attr("cx", xMap)
        .attr("cy", yMap)
        .style("fill", function(d) { return d.color;}) 
        .on("mouseover", function(d) {
            tooltip.transition()
                .duration(200)
                .style("opacity", .9);
            tooltip.html(d["x"] + "<br/> (" + xValue(d) 
                + ", " + yValue(d) + ")")
                .style("left", (d3.event.pageX + 5) + "px")
                .style("top", (d3.event.pageY - 28) + "px");
        })
        .on("mouseout", function(d) {
            tooltip.transition()
                .duration(500)
                .style("opacity", 0);
        });

    // draw legend
    var legend = svg.selectAll(".legend")
        .data(color.domain())
        .enter().append("g")
        .attr("class", "legend")
        .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

    // draw legend colored rectangles
    legend.append("rect")
        .attr("x", width - 18)
        .attr("width", 18)
        .attr("height", 18)
        .style("fill", color);

    // draw legend text
    legend.append("text")
        .attr("x", width - 24)
        .attr("y", 9)
        .attr("dy", ".35em")
        .style("text-anchor", "end")
        .text(function(d) { return d;});

}



    var x = d3.scaleBand()
    .domain(dataitems.map(function(d){return d.competitorname}))
    .range([0,width])
    .padding(0.1);

    var y = d3.scaleLinear()
    .domain([0, d3.max(dataitems, function(d){return d.winpercent })])
    .range([height, 0]);


    chart = d3.select("#chart1").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")" );

    chart.selectAll(".bar")
    .data(dataitems, (d) => (d.competitorname))
    .enter().append("rect")
    .attr("class","bar")
    .attr("fill","#f9742f")
    .attr("width", x.bandwidth())
    .attr("y", function (d){return y(d.winpercent);})
    .attr("height", function(d){return height - y(d.winpercent);})
    .transition()
    .attr("x",function(d){return x(d.competitorname);})
    .duration(1000)
    .delay((d,i)=> i*1);


    chart.selectAll(".text")
    .data(dataitems)
    .enter()
    .append('text')
    .attr('class', 'bar-label')
    .attr('fill', 'black')
    .text(function(d) { return (finalRanks.indexOf(d.competitorname) + 1 ) ; })
       .attr('x', function(d) { return x(d.competitorname) + 3; })
       .attr('y', function(d) { return y((+d.winpercent + 1)); })
    .attr('text-anchor','start'); 

    chart.selectAll(".bar")
        .attr("opacity", "0.7") 
        .on("mousemove", function (d) {
            d3.select(this).attr("opacity", "1");
            tooltip.style("left", d3.event.pageX - 5 + "px")
                   .style("top", d3.event.pageY - 7 + "px")
                   .html(
                       "<h5>" +(d.competitorname) + "</h5> "  +
                       "Winning Percentage: " + (d.winpercent) + "<br>" +
                       "Sugar Percentage: " +(d.sugarpercent) + "<br>" +
                       "Price Percentage: " + (d.pricepercent)
                    );
        })
        .on("mouseout", function (d) {
                    d3.select(this).attr("opacity", "0.7");
                    tooltip.html((" <h5>Hover over a bar for Candy Information </h5>"));
        });

    chart
        .append("g")
        .attr("class", "xaxis")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x))
        .selectAll("text")
        .style("text-anchor", "end")
        .transition()
        .delay((d, i) => i * 20)
        .attr("dx", "-.8em")
        .attr("dy", ".15em")
        .attr("transform", "rotate(-50)");


    chart.append("g")
    .call(d3.axisLeft(y));


