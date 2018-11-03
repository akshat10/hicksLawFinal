var linearColors = ["#FF530D","#E82C0C","#FF0000","#E80C7A","#FF0DFF","#A40DFF","#0DFFF7","#0DFF10","#FFC700"];



var newArray = [];

var startTime;
var endTime; 

var currentIndex;

var scatterExist = false;

var times = {
    2:[],
    3:[],
    4:[],
    5:[],
    6:[],
    7:[],
    8:[],
};

var Atimes = {
    2:[],
    3:[],
    4:[],
    5:[],
    6:[],
    7:[],
    8:[],
};

var scatterTimes = [];

var scatterAvgTimes = [];

var avgLinearTime={};



$(".DropdownClass").change(function () {

    if ($(this).attr('name') == 'Count') {
        var number = $(this).val();
        currentIndex = number;
        $('.CommonAttribute').hide().slice( 0, number ).show();
        $('.CommonAttribute').each(function(index){
            $(this).css("fill", "black");
        });
    }

});

$(".linearButton").click(function(){

    $('.CommonAttribute').each(function(index){
        $(this).css("fill",'#'+(Math.random()*0xFF9FFA<<0).toString(16));
    });

    startTime = new Date().getTime();

});

$(".CommonAttribute").click(function(){
    // something();
    endTime = new Date().getTime();



    if(currentIndex == 2){
        // To accomodate for time taken to move to boxes
        times[currentIndex].push((endTime - startTime - 300));
        scatterTimes.push({"x": currentIndex, "y": (endTime - startTime - 300), "color": $(this).css("fill") });
        $('#timeLinear').text( "Time taken: " + (endTime - startTime - 300) + " ms");

    }

    else{
    times[currentIndex].push((endTime - startTime));
    scatterTimes.push({"x": currentIndex, "y": (endTime - startTime), "color": $(this).css("fill") });
    $('#timeLinear').text( "Time taken: " + (endTime - startTime) + " ms");

    }
    
    Atimes[currentIndex] = [];


    Atimes[currentIndex].push(average(times[currentIndex]).toFixed(2));
    avgLinearTime[currentIndex] = average(times[currentIndex]).toFixed(2);
 
    $('#avgTimeLinear').text("Current average time for these number of choices is: " + average(times[currentIndex]).toFixed(2) );
    
    $('.CommonAttribute').each(function(index){
        $(this).css("fill", "black");
    });

    updateScatterPlot(scatterTimes);
    
  

})





var average = arr => arr.reduce( ( p, c ) => p + c, 0 ) / arr.length;




$(document).ready(function() {
    makeScatterPlot([]);
});


var updateScatterPlot = (data) => {
    var margin = {top: 40, right: 20, bottom: 30, left: 70},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;
  


    var x = d3.scaleLinear().range([0, width]);
  
    var y = d3.scaleLinear().range([height, 0]);
  
  
        var xAxis = d3.axisBottom(x).ticks(5);
  
        var yAxis = d3.axisLeft(y);
        
                x.domain([2,9]);
                y.domain([300,1500]);
  
      var chart = d3.select("#finalGraph").attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      chart.selectAll(".dot")
      .data(data)
      .enter().append("circle")
      .attr("class", "dot")
      .attr("r", 7.5)
      .attr("cx", function(d) { return x(d.x); })
      .attr("cy", function(d) { return y(d.y); })
      .style("fill", function(d) { return d.color; })
      .on("mouseover", function(d) {
        tooltip.transition()
            .duration(200)
            .style("opacity", .9);
        tooltip.html(d["x"] + "<br/> (" + (d.x) 
            + ", " + (d.y) + ")")
            .style("left", (d3.event.pageX + 5) + "px")
            .style("top", (d3.event.pageY - 28) + "px");
    })
    .on("mouseout", function(d) {
        tooltip.transition()
            .duration(500)
            .style("opacity", 0);
    });
    
    if(!scatterExist){
    var lg = calcLinear(data, "x", "y", d3.min(data, function(d){ return d.x}), d3.max(data, function(d){ return d.y}));
      chart.append("line")
      .attr("id","regLine")
      .attr("class", "regression")
      .attr("x1", x(lg.ptA.x))
      .attr("y1", y(lg.ptA.y))
      .attr("x2", x(lg.ptB.x))
      .attr("y2", y(lg.ptB.y));
      scatterExist = true;
    }

      else{
        var lg = calcLinear(data, "x", "y", d3.min(data, function(d){ return d.x}), d3.max(data, function(d){ return d.y}));
        d3.select("#regLine")
            .transition()
            .attr("x1", x(lg.ptA.x))
            .attr("y1", y(lg.ptA.y))
            .attr("x2", x(lg.ptB.x))
            .attr("y2", y(lg.ptB.y));
      }
      

        var tooltip = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

        


};


var makeScatterPlot = (data) => {
    

var margin = {top: 40, right: 20, bottom: 30, left: 70},
  width = 960 - margin.left - margin.right,
  height = 500 - margin.top - margin.bottom;

      var x = d3.scaleLinear()
          .range([0, width]);

      var y = d3.scaleLinear()
          .range([height, 0]);


      var xAxis = d3.axisBottom(x).ticks(5);

      var yAxis = d3.axisLeft(y);
      
      x.domain([2,9]);
      y.domain([300,1500]);

      var chart = d3.select("#linearAvgGraph").append("svg")
          .attr("id","finalGraph")
          .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom)
          .append("g")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


        chart.selectAll(".dot")
        .data(data)
        .enter().append("circle")
        .attr("class", "dot")
        .attr("r", 7.5)
        .attr("cx", function(d) { return x(d.x); })
        .attr("cy", function(d) { return y(d.y); })
        .style("fill", function(d) { return "rgb(169,169,169)"; })
        .on("mouseover", function(d) {
          tooltip.transition()
              .duration(200)
              .style("opacity", .9);
          tooltip.html(d["x"] + "<br/> (" + (d.x) 
              + ", " + (d.y) + ")")
              .style("left", (d3.event.pageX + 5) + "px")
              .style("top", (d3.event.pageY - 28) + "px");
      })
      .on("mouseout", function(d) {
          tooltip.transition()
              .duration(500)
              .style("opacity", 0);
      });


      
      
        chart.append("g")
        .attr("class", "axis")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .append("text")
        .attr("class", "label")
        .attr("x", width)
        .attr("y", -6)
        .style("text-anchor", "end")
        .text("Number of Choices (colors)");

        chart.append("g")
        .attr("class", "axis")
            .attr("class", "y axis")
            .call(yAxis)
          .append("text")
            .attr("class", "label")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .text("Time Taken (in ms)");

        var tooltip = d3.select("body").append("div")
            .attr("class", "tooltip")
            .style("opacity", 0);

       


        


 

   

 

}



function calcLinear(data, x, y, minX, minY){
    /////////
    //SLOPE//
    /////////
  
    // Let n = the number of data points
    var n = data.length;
    console.log(n);
  
    // Get just the points
    var pts = [];
    data.forEach(function(d,i){
      var obj = {};
      obj.x = +d[x];
      obj.y = d[y];
      obj.mult = obj.x*obj.y;
      pts.push(obj);
    });
  
    console.log(pts);
  
    // Let a equal n times the summation of all x-values multiplied by their corresponding y-values
    // Let b equal the sum of all x-values times the sum of all y-values
    // Let c equal n times the sum of all squared x-values
    // Let d equal the squared sum of all x-values
    var sum = 0;
    var xSum = 0;
    var ySum = 0;
    var sumSq = 0;
    
    pts.forEach(function(pt){
      sum = sum + pt.mult;
      xSum = xSum + pt.x;
      ySum = ySum + pt.y;
      sumSq = sumSq + (pt.x * pt.x);
    });
  
    var a = sum * n;
    var b = xSum * ySum;
    var c = sumSq * n;
    var d = xSum * xSum;
  
    // Plug the values that you calculated for a, b, c, and d into the following equation to calculate the slope
    // slope = m = (a - b) / (c - d)
    var m = (a - b) / (c - d);
  
    /////////////
    //INTERCEPT//
    /////////////
  
    // Let e equal the sum of all y-values
    var e = ySum;
  
    // Let f equal the slope times the sum of all x-values
    var f = m * xSum;
  
    // Plug the values you have calculated for e and f into the following equation for the y-intercept
    // y-intercept = b = (e - f) / n
    var b = (e - f) / n;
  
    // Print the equation below the chart
  
    // return an object of two points
    // each point is an object with an x and y coordinate
    return {
      ptA : {
        x: minX,
        y: m * minX + b
      },
      ptB : {
        y: minY,
        x: (minY - b) / m
      }
    }
  
  }
  
  
