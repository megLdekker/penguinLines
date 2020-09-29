



//penguins is the array of data
//target is the selection of the g element to place the graph in
//xscale,yscale are the x and y scales.
var drawLines = function(penguins,target,
                         xScale,yScale)
{
   var lineGenerator = d3.line()
   .x(function(quiz, i)
     {
       return xScale(i);
   })
   .y(function(quiz)
     {
       return yScale(quiz.grade);
   })
   .curve(d3.curveCardinal)
   
   var lines = d3.select("svg")
   .select("#graph")
   .selectAll("g")
   .data(penguins)
   .enter()
   .append("g")
   .classed("line",true)
   .attr("fill","none")
   .attr("stroke","black")
   .attr("stroke-width","5px")
   
   .on("mouseenter",function(penguin)
      {
       var xPos = d3.event.pageX;
       var yPos = d3.event.pageY;
       d3.select("#tooltip")
       .classed("hidden",false)
       .style("top",yPos+"px")
       .style("left",xPos+"px")
       
       console.log("penguin",penguin)
       
       d3.select("img")
       .attr("src","../imgs/"+penguin.picture)
       
       d3.select(this)
       .classed("selected",true)
       
      .raise()
       
       
   })
   .on("mouseleave",function()
      {
       d3.select("#tooltip")
       .classed("hidden",true)
        d3.select(this)
       .classed("selected",false)
   })
   
   lines.append("path")
    .datum(function(penguins)
        {
       return penguins.quizes
   })
   
    .attr("d",lineGenerator)
//console.log("linegen",lineGenerator(penguins))
       }


var makeTranslateString = function(x,y)
{
    return "translate("+x+","+y+")";
}


//graphDim is an object that describes the width and height of the graph area.
//margins is an object that describes the space around the graph
//xScale and yScale are the scales for the x and y scale.
var drawAxes = function(graphDim,margins,
                         xScale,yScale)
{
   var xAxis = d3.axisBottom(xScale)
   d3.select("svg")
    .append("g")
    .attr("transform","translate("+margins.left+","+(margins.top+graphDim.height)+")")
    .call(xAxis);
    var yAxis=d3.axisLeft(yScale);
    d3.select("svg")
    .append("g")
    .attr("transform","translate("+margins.left+","+margins.top+")")
    .call(yAxis);
 
}


//graphDim -object that stores dimensions of the graph area
//margins - object that stores the size of the margins
var drawLabels = function(graphDim,margins)
{
    var labels = d3.select("svg")
    .append("g")
    .classed("labels",true)
    
    labels.append("text")
    .text("Penguin Quizes")
    .classed("title",true)
    .attr("text-anchor","middle")
    .attr("x", margins.left+(graphDim.width/2))
    .attr("y", margins.top+(2))
    
    labels.append("text")
    .text("Day")
    .classed("label", true)
    .attr("text-anchor", "middle")
    .attr("x", margins.left+(graphDim.width/2))
    .attr("y", margins.top+(graphDim.height)+(27))
    
    labels.append("text")
        .text("Quiz Grade")
        .classed("label", true)
        .attr("text-anchor", "middle")
        .attr("transform","translate(10," + (graphDim.height/2)+") rotate(270)")
}




//sets up several important variables and calls the functions for the visualization.
var initGraph = function(penguins)
{
    //size of screen
    var screen = {width:800,height:600}
    //how much space on each side
    var margins = {left:30,right:20,top:20,bottom:30}
    
    
    
    var graph = 
        {
            width:screen.width-margins.left-margins.right,
            height:screen.height - margins.top-margins.bottom
        }
    console.log(graph);
    
    d3.select("svg")
    .attr("width",screen.width)
    .attr("height",screen.height)
    
    var target = d3.select("svg")
    .append("g")
    .attr("id","graph")
    .attr("transform",
          "translate("+margins.left+","+
                        margins.top+")");
    
    var maxDay = d3.max(penguins[0].quizes,
                        function(quiz)
                        {return quiz.day});
    
    var xScale = d3.scaleLinear()
        .domain([1,maxDay])
        .range([0,graph.width])

    var yScale = d3.scaleLinear()
        .domain([0,10])
        .range([graph.height,0])
    
    drawAxes(graph,margins,xScale,yScale);
    drawLines(penguins,target,xScale,yScale);
    drawLabels(graph,margins);
   
}




var successFCN = function(penguins)
{
    console.log("penguins",penguins);
    initGraph(penguins);
}

var failFCN = function(error)
{
    console.log("error",error);
}

var polPromise = d3.json("classData.json")
polPromise.then(successFCN,failFCN);