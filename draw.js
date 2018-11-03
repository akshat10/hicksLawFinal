var data = [];
var item= [];
var choices = [];
var chart;

let chartExists = false;


$(document).ready(function () {
    loadData();
    wireButtonClickEvents();
});

function loadData() {
    d3.csv("data/candyData.csv",function(d){
        data = d;
        d3.selectAll(".myCheckbox").on("change",filterFromCheckbox);
        visualizeBarChart(findDataItem(),"winpercent")
        d3.select("#all").property("disabled", false).property("checked",true);
    });
}

function findDataItem() {
    
    var filteredData = data.filter(function(d){
        var isReturned = true;
        choices.forEach(function(a){
            if (d[a] == "0"){
                isReturned = false;
            }
        });
        return isReturned;
    });

    return filteredData;
}

function filterFromCheckbox(){
    
    choices = [];

    d3.selectAll(".myCheckbox").each(function(d){
        cb = d3.select(this);
        if(cb.property("checked")){
            choices.push(cb.property("value"));
        }
      });
    
    // if(choices.includes("all")){
    //     d3.selectAll(".myCheckbox").each(function(d){
    //         cb = d3.select(this).property("checked", false);
    //         // cb.property("disabled", true);
    //     });
    //     d3.select("#all").property("disabled", false).property("checked", true);
    //     choices = ["all"]
    // }

    // if(!(choices.includes("all"))){
    //     d3.selectAll(".myCheckbox").property("disabled", false);
    // }

    if(choices.length > 1){
        d3.select("#all").property("disabled", false).property("checked",false);
    }


    d3.select(".current").classed("current", false);
    d3.selectAll("#rank").classed("current", true);

    $("#chart1").empty();
    visualizeBarChart(findDataItem(), "winpercent");    

}


function wireButtonClickEvents() {

    d3.selectAll("#rank").on("click", function () {
        d3.select(".current").classed("current", false);
        d3.select(this).classed("current", true);
        sortBarChart(findDataItem(), "winpercent");    
    });

    d3.selectAll("#price").on("click", function () {
        d3.selectAll(".current").classed("current", false);
        d3.select(this).classed("current", true);
        sortBarChart(findDataItem(), "pricepercent");    
    });

    d3.selectAll("#sugar").on("click", function () {
        
        d3.selectAll(".current").classed("current", false);
        d3.select(this).classed("current", true);
        sortBarChart(findDataItem(),"sugarpercent");

    });


}



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


