var height = window.innerHeight;
var width = window.innerWidth;

// Margin for SVG graphics
var margin = {
  top: 20,
  bottom: 60,
  right: 20,
  left: 120,
  xscale: 130,
  xlabel: 110,
  ylabel: 110
};

// Create the SVG canvas
var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", width)
  .attr("height", height)
  .attr("class", "chart");

// Part 1a: The axis label below the X axis
svg.append("g").attr("class", "x_axis_label");
var xlabel = d3.select(".x_axis_label");

// x-axis label: Poverty
xlabel
  .append("text")
  .attr("y", -26)
  .attr("label_name", "poverty")
  .attr("label_axis", "x")
  .attr("class", "aText active x")
  .text("In Poverty (%)");

// x, y coordinates for x-axis label  
xlabel.attr(
  "transform",
  "translate(" +
  ((width - margin.xlabel) / 2 + margin.xlabel) + ", " +
  (height - margin.bottom) +
  ")"
);

// Part 1b: The axis label next to the Y axis
svg.append("g").attr("class", "y_axis_label");
var ylabel = d3.select(".y_axis_label");

// y-axis label: Obesity
ylabel
  .append("text")
  .attr("y", -26)
  .attr("label_name", "obesity")
  .attr("label_axis", "y")
  .attr("class", "aText active y")
  .text("Obese (%)");

// Rotate y-axis label to 90 degrees
ylabel.attr(
  "transform",
  "translate(" +
  margin.left + ", " +
  ((height + margin.ylabel) / 2 - margin.ylabel) + ")rotate(-90)"
);

//===============================================

d3.csv("assets/data/data.csv").then(function (theData) {
  var currentAxisLabelX = "poverty";
  var currentAxisLabelY = "obesity";

  // Part 2a: The x-axis scale
  var xMin;
  var xMax;

  xMin = d3.min(theData, function (d) {
    return parseFloat(d[currentAxisLabelX]) * 0.90;
  });

  xMax = d3.max(theData, function (d) {
    return parseFloat(d[currentAxisLabelX]) * 1.10;
  });

  var x_Scale = d3
    .scaleLinear()
    .domain([xMin, xMax])
    .range([margin.xscale, width - margin.right]);

  var xAxis = d3.axisBottom(x_Scale);

  xAxis.ticks(10);

  svg
    .append("g")
    .call(xAxis)
    .attr("class", "xAxis")
    .attr("transform", "translate(0," + (height - margin.xscale) + ")");

  // Part 2b: The y-axis scale
  var yMin;
  var yMax;

  yMin = d3.min(theData, function (d) {
    return parseFloat(d[currentAxisLabelY]) * 0.90;
  });

  yMax = d3.max(theData, function (d) {
    return parseFloat(d[currentAxisLabelY]) * 1.10;
  });

  var y_Scale = d3
    .scaleLinear()
    .domain([yMin, yMax])
    // Height is inverses due to how d3 calc's y-axis placement
    .range([height - margin.xscale, margin.right]);

  var yAxis = d3.axisLeft(y_Scale);

  yAxis.ticks(10);

  svg
    .append("g")
    .call(yAxis)
    .attr("class", "yAxis")
    .attr("transform", "translate(" + (margin.xscale) + ", 0)");


  // Part 3: The tooltip popup on mouse move-over
  var toolTip = d3
    .tip()
    .attr("class", "d3-tip")
    .offset([30, 60])
    .html(function (d) {
      var theState = "<div>" + d.state + "</div>";
      var theX = "<div>" + currentAxisLabelX + ": " + d[currentAxisLabelX] + "%</div>";
      var theY = "<div>" + currentAxisLabelY + ": " + d[currentAxisLabelY] + "%</div>";

      return theState + theX + theY;
    });

  svg.call(toolTip);

  // Part 4: The circle bubbles
  circRadius = 10;

  var circle_bubble = svg.selectAll("g theCircles").data(theData).enter();

  circle_bubble
    .append("circle")
    // These attr's specify location, size and class.
    .attr("cx", function (d) {
      return x_Scale(d[currentAxisLabelX]);
    })
    .attr("cy", function (d) {
      return y_Scale(d[currentAxisLabelY]);
    })
    .attr("r", circRadius)
    .attr("class", function (d) {
      return "stateCircle " + d.abbr;
    })
    // Hover rules
    .on("mouseover", function (d) {
      // Show the tooltip
      toolTip.show(d, this);
      // Highlight the state circle's border
      d3.select(this).style("stroke", "#323232");
    })
    .on("mouseout", function (d) {
      // Remove the tooltip
      toolTip.hide(d);
      // Remove highlight
      d3.select(this).style("stroke", "#e3e3e3");
    });

  // Part 5: The (abbr state) text inside the circle bubbles
  circle_bubble
    .append("text")
    .text(function (d) {
      return d.abbr;
    })
    // Now place the text using our scale.
    .attr("dx", function (d) {
      return x_Scale(d[currentAxisLabelX]);
    })
    .attr("dy", function (d) {
      return y_Scale(d[currentAxisLabelY]) + circRadius / 2.5;
    })
    .attr("font-size", circRadius)
    .attr("class", "stateText")
    .on("mouseover", function (d) {
      toolTip.show(d);
      d3.select("." + d.abbr).style("stroke", "#323232");
    })
    .on("mouseout", function (d) {
      toolTip.hide(d);
      d3.select("." + d.abbr).style("stroke", "#e3e3e3");
    });

})




