var margin = {top: 20, right: 20, bottom: 30, left: 70},
width = 960 - margin.left - margin.right,
height = 500 - margin.top - margin.bottom;

// Define x and y scales for the chart
var x = d3.scaleLinear()
          .range([0,width]);
var y = d3.scaleLinear().range([height,0]);

// Define the axes
var xAxis = d3.axisBottom().scale(x);
var yAxis = d3.axisLeft().scale(y);

// Select the chart
var chart = d3.select("#linearAvgGraph").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


chart.selectAll(".dots")
    .data(scatterTimes)
    .enter().append("circle")
    .attr("class", "dot")
    .attr("r", 4.5)
    .attr("cx", (d) => x(d.x))
    .attr("cy", (d) => y(d.y))
    .style("fill", (d) => (d.color));




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

// setup fill color

// var cValue = function(d) { return d.Manufacturer;},
//     color = d3.scale.category10();




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

// load data
// d3.csv("cereal.csv", function(error, data) {

// // change string (from CSV) into number format
// data.forEach(function(d) {
//     d.Calories = +d.Calories;
//     d["Protein (g)"] = +d["Protein (g)"];
// //    console.log(d);
// });



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
