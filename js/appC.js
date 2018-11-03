var redColors = ["#C70000","#FC0000","#E50F00","#F00000","#D60000"];

var CendTime; 
var CstartTime;
var CcurrentIndex;

var cChartExist = false;



var CavgLinearTime={};


var Ctimes = {
    2:[],
    3:[],
    4:[],
    5:[],
    6:[],
    7:[],
    8:[],
};

var CAtimes = {
    2:[],
    3:[],
    4:[],
    5:[],
    6:[],
    7:[],
    8:[],
};


var CscatterTimes = [];






$(".CatDropdownClass").change(function () {

    if ($(this).attr('name') == 'Count') {
        var number = $(this).val();
        CcurrentIndex = number;
        $('.CatCommonAttribute').hide().slice( 0, number ).show();
        $('.CatCommonAttribute').each(function(index){
            $(this).css("fill", "black");
        });
    }

    if(!cChartExist){
    CmakeScatterPlot(scatterTimes);
    console.log("BRRSHSH");
    cChartExist = true;
    }

});


$(".linearCButton").click(function(){


    var i = 0 ;
    var lim = Math.floor(CcurrentIndex/2);


    var randomRed = shuffle(redColors);

    $('.CatCommonAttribute').each(function(index){
        // Change this
        if (i < lim){

            $(this).css("fill", randomRed[i]);
            
            i = i+1;
        }
        else{
            $(this).css("fill",'#'+(Math.random()*0xFF9FFA<<0).toString(16));

        }
    });

    CstartTime = new Date().getTime();


});


$(".CatCommonAttribute").click(function(){

    CendTime = new Date().getTime();
    
    if(CcurrentIndex == 2){
        // To accomodate for time taken to move to boxes
        Ctimes[CcurrentIndex].push((CendTime - CstartTime - 300));
        CscatterTimes.push({"x": CcurrentIndex, "y": (CendTime - CstartTime - 300), "color": $(this).css("fill") });
        $('#timeLinear').text( "Time taken: " + (CendTime - CstartTime - 300) + " ms");

    }
    else{
    Ctimes[CcurrentIndex].push((CendTime - CstartTime));
    CscatterTimes.push({"x": CcurrentIndex, "y": (CendTime - CstartTime), "color": $(this).css("fill") });
    
    $('#CtimeLinear').text( "Time taken: " + (CendTime - CstartTime) + " ms");
}
    
    CAtimes[CcurrentIndex] = [];

    CAtimes[CcurrentIndex].push(average(Ctimes[CcurrentIndex]).toFixed(2));
    CavgLinearTime[CcurrentIndex] = average(Ctimes[CcurrentIndex]).toFixed(2);
 
    $('#CavgTimeLinear').text("Current average time for these number of choices is: " + average(Ctimes[CcurrentIndex]).toFixed(2) );
    
    $('.CatCommonAttribute').each(function(index){
        $(this).css("fill", "black");
    });




    var finalDATABRUH = [];
    for(var i = 2 ; i < 9; i++){
        if(CAtimes[i].length >0){
            finalDATABRUH.push({"x": i, "y": (CAtimes[i][0]), "color": "rgb(169,169,169)" });
        }
    }

    console.log(finalDATABRUH);
    CupdateScatterPlot(finalDATABRUH);


})


function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;
  
    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
  
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
  
      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
  
    return array;
}


var CmakeScatterPlot = (data) => {
    

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
    
          var chart = d3.select("#ClinearAvgGraph").append("svg")
              .attr("id","CfinalGraph")
              .attr("width", width + margin.left + margin.right)
              .attr("height", height + margin.top + margin.bottom)
              .append("g")
              .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    
              var lg = calcLinear(data, "x", "y", d3.min(data, function(d){ return d.x}), d3.max(data, function(d){ return d.y}));
              chart.append("line")
              .attr("id","regLine")
              .attr("class", "regression")
              .attr("x1", x(lg.ptA.x))
              .attr("y1", y(lg.ptA.y))
              .attr("x2", x(lg.ptB.x))
              .attr("y2", y(lg.ptB.y));
              scatterExist = true;
          
          
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



    var CupdateScatterPlot = (data) => {

        $('.Cdot').remove();

        var margin = {top: 40, right: 20, bottom: 30, left: 70},
        width = 960 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;
      
    
    
        var x = d3.scaleLinear().range([0, width]);
      
        var y = d3.scaleLinear().range([height, 0]);
      
      
            var xAxis = d3.axisBottom(x).ticks(5);
      
            var yAxis = d3.axisLeft(y);
            
            x.domain([2,9]);
            y.domain([300,1500]);
      
          var chart = d3.select("#CfinalGraph").attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom)
          .append("g")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

          chart.selectAll(".Cdot").remove();

          chart.selectAll(".Cdot")
          .data(data)
          .enter().append("circle")
          .attr("class", "Cdot")
          .attr("r", 7.5)
          .attr("cx", function(d) { return x(d.x); })
          .attr("cy", function(d) { return y(d.y); })
          .style("fill", function(d) { return d.color; });

        chart.selectAll(".Cdot").exit().remove();


        
    
    
            
    
    
    };
    
    