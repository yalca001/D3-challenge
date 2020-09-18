// @TODO: YOUR CODE HERE!

// svg container
var svgHeight = 900;
var svgWidth = 600;

// margins
var margin = {
  top: 20,
  right: 50,
  bottom: 100,
  left: 100
};

// chart area minus margins
var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// create svg container
var svg = d3.select("#scatter").append("svg")
  .attr("height", svgHeight)
  .attr("width", svgWidth);

// shift everything over by the margins
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);
  
// d3.select("body").append("div").attr("class", "tooltip").style("opacity", 0);

// Import Data
d3.csv("assets/data/data.csv").then(function(healthData) {
console.log(healthData)

healthData.forEach(function(data){
  data.poverty = +data.poverty;
  data.healthcare = +data.healthcare;
  
});
// scale y to chart height
var xLinearScale = d3.scaleLinear()
      .domain([8.1, d3.max(healthData, d => d.poverty)])
      .range([0, width]);

var yLinearScale = d3.scaleLinear()
      .domain([4.1, d3.max(healthData, d => d.healthcare)])
      .range([height, 0]);

// // create axes
var xAxis = d3.axisBottom(xLinearScale);
var yAxis = d3.axisLeft(yLinearScale);

// Append Axes to the chart
chartGroup.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(xAxis);

chartGroup.append("g")
    .call(yAxis);

//Create Circles
var circlesGroup = chartGroup.selectAll("circle").data(healthData).enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d.poverty))
    .attr("cy", d => yLinearScale(d.healthcare))
    .attr("r", "15")
    .attr("fill", "lightblue")
    .attr("opacity", ".75");

    // .on("click", function(data) {     
    //   toolTip.show(data,this);
    // });

circlesGroup.append("text")
    .text(function(d){
      return d.abbr;
    })
      .attr("dx", d => xLinearScale(d.poverty))
      .attr("dy", d => yLinearScale(d.healthcare))
      .attr("font-size","9")
      .attr("class","stateText")

      .on("mouseover", function(data, index) {
        toolTip.show(data,this);
      d3.select(this).style("stroke","#323232")
      })
      .on("mouseout", function(data, index) {
          toolTip.hide(data,this)
       d3.select(this).style("stroke","#e3e3e3")
      });

// Step 6: Initialize tool tip

var toolTip = d3.tip()
      .attr("class", "tooltip")
      .offset([80, -60])
      .html(function(d) {
        return (`${d.state}<br>Hair length: ${d.poverty}<br>Hits: ${d.healthcare}`);
      });

// Create tooltip in the chart

    chartGroup.call(toolTip);

// Create event listeners to display and hide the tooltip

    circlesGroup.on("click", function(data) {
      toolTip.show(data, this);
    })

//   // onmouseout event
//   .on("mouseout", function(data) {
//     toolTip.hide(data, this);
//  });
          
// Create circle labels
chartGroup.append("g")
.selectAll("circle")
.data(healthData)
.enter()
.append("text")
.text(d => d.abbr)
.attr("x", d => xLinearScale(d.poverty))
.attr("y", d => yLinearScale(d.healthcare))
.attr("text-anchor", "middle")
.attr("font-size", "10px")
.attr("fill", "white")
.style("font-weight", "bold")
.attr("alignment-baseline", "central");

// Create axes labels
chartGroup.append("text")
.attr("transform", "rotate(-90)")
.attr("y", 0 - margin.left + 40)
.attr("x", 0 - (height / 2))
.attr("dy", "1em")
.attr("class", "axisText")
.text("Lacks of Healthcare (%)");

chartGroup.append("text")
.attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
.attr("class", "axisText")
.text("In Poverty (%)");
}).catch(function(error) {
console.log(error);
});