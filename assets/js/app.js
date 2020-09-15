// @TODO: YOUR CODE HERE!

// svg container
var svgHeight = 960;
var svgWidth = 500;

// margins
var margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 100
};

// chart area minus margins
var chartHeight = svgHeight - margin.top - margin.bottom;
var chartWidth = svgWidth - margin.left - margin.right;

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
      .domain([8.5, d3.max(healthData, d => d.poverty)])
      .range([0, chartWidth]);

var yLinearScale = d3.scaleLinear()
      .domain([0, d3.max(healthData, d => d.healthcare)])
      .range([chartHeight, 0]);

// // create axes
var yAxis = d3.axisLeft(yLinearScale);
var xAxis = d3.axisBottom(xLinearScale);

// Step 4: Append Axes to the chart
    // ==============================
    chartGroup.append("g")
      .attr("transform", `translate(0, ${chartHeight})`)
      .call(xAxis);

    chartGroup.append("g")
      .call(yAxis);

    // Step 5: Create Circles
    // ==============================
    var circlesGroup = chartGroup.selectAll("circle").data(healthData).enter()
    circlesGroup.append("circle")
    .attr("cx", d => xLinearScale(d.poverty))
    .attr("cy", d => yLinearScale(d.healthcare))
    .attr("r", "15")
    .attr("fill", "blue")
    .attr("opacity", ".5");

    // .on("click", function(data) {     
    //   toolTip.show(data,this);
    // });

    circlesGroup.append("text")
    .text(function(d){
      return d.abbr;
    })
      .attr("dx", d => xLinearScale(d.poverty))
      .attr("dy", d => yLinearScale(d.healthcare)+10/2.5)
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
    // ==============================
    var toolTip = d3.tip()
      .attr("class", "tooltip")
      .offset([80, -60])
      .html(function(d) {
        return (`${d.state}<br>Hair length: ${d.poverty}<br>Hits: ${d.healthcare}`);
      });

    // Step 7: Create tooltip in the chart
    // ==============================
    chartGroup.call(toolTip);

    // Step 8: Create event listeners to display and hide the tooltip
    // ==============================
    circlesGroup.on("click", function(data) {
      toolTip.show(data, this);
    })
      // // onmouseout event
      // .on("mouseout", function(data) {
      //   toolTip.hide(data, this);
      // });

    // Create axes labels
    chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left - 30)
      .attr("x", 0 - (chartHeight / 2))
      .attr("dy", "1em")
      .attr("class", "axisText")
      .text("Lacks of Healthcare");

    chartGroup.append("text")
      .attr("transform", `translate(${chartWidth / 2}, ${chartHeight + margin.top + 50})`)
      .attr("class", "axisText")
      .text("Poverty");
  }).catch(function(error) {
    console.log(error);
  });