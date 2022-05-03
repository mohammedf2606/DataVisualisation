// Global variables.
let opacity = 0.7
let animationDuration = 100
let width = 800
let height = 800
let margins = {"left": 60, "right": 40, "top": 100, "bottom": 80};
let maxXSeen = 1
let maxYSeen = 1
const dataSourcePath = "assets/data/covidReports_countries.csv"

// Initialize tooltip.
let tooltipDiv = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

// Main svg element.
let svg = d3.select("#GraphDiv")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", "translate(" + margins.left + "," + margins.top + ")");

// Define axes ranges.
let xRange = d3.scaleLinear().domain([0, 1500000]).range([0, width - margins.left - margins.right]);
let yRange = d3.scaleLinear().domain([0, 18000]).range([height - margins.top - margins.bottom, 0]);
let popRange = d3.scaleLinear().domain([1000000, 1500000000]).range([5, 20]);

// Create axes.
let xAxis = d3.axisBottom(xRange).tickPadding(2);
let yAxis = d3.axisLeft(yRange).tickPadding(2);

// Add axes to the SVG.
svg.append("g").attr("class", "x axis").attr("transform", "translate(0, " + yRange.range()[0] + ")").call(xAxis);
svg.append("g").attr("class", "y axis").call(yAxis);

// Add axes labels.
svg.append("text")
    .attr("y", height - (margins.bottom + 40))
    .attr("x", (width / 2) - 20)
    .style("text-anchor", "middle")
    .text("Total cases");

svg.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margins.left)
    .attr("x",0 - (height / 2) + 100)
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .text("Total deaths");

// Load the covid reports dataset.
d3.csv(dataSourcePath).then(function(data) {
    // Filter records by the initial date.
    let dataUniqueDates = [...new Set(data.map(d => d.dateRep))]
    let dataUniqueDatesFormatted = dataUniqueDates.map(function (d) {return new Date(d)})
    let currentDate = formTime(dataUniqueDatesFormatted[0])
    let newData = filterDataByDate(data, currentDate)

    // Rescale axes.
    rescaleAxes(svg, newData, dataUniqueDatesFormatted[0])

    // Add legends.
    addContinentColourLegend(svg, [...new Set(data.map(d => d.continentExp))])
    addRValueBorderLegend(svg)
    addPopulationSizeLegend(svg)

    // Build slider using unique dates from the dataset.
    let slider = d3.sliderLeft()
        .min(d3.min(dataUniqueDatesFormatted))
        .max(d3.max(dataUniqueDatesFormatted))
        .step(1000 * 60 * 60 * 24 * 7)
        .height(height - 100)
        .tickValues(dataUniqueDatesFormatted)
        .tickFormat(d3.timeFormat("%Y-%m-%d"))
        .default(d3.min(dataUniqueDatesFormatted))

    // Place slider.
    let gVertical = d3.select('div#slider-vertical')
        .append('svg')
        .attr('width', 120)
        .attr('height', height - 50)
        .append('g')
        .attr('transform', 'translate(100,20)');
    gVertical.call(slider);

    // Plot the marks in the scatter graph.
    svg.append("g")
        .selectAll("circle")
        .data(newData)
        .enter()
        .append("circle")
        .attr("r", function(d) { return popRange(d.popData2019); })
        .attr("cx", function(d) { return xRange(d.cases); })
        .attr("cy", function(d) { return yRange(d.deaths); })
        .style("stroke-width", "2px")
        .style("stroke", function(d) { return borderColourPicker(d.rValueNominal)})
        .style("fill", function(d) { return continentColourEncoder(d.continentExp); })
        .style("opacity", opacity)

        // Add the tooltip to each marker.
        .on("mouseover", function(d) {
            tooltipDiv.transition()
                .duration(100)
                .style("opacity", .9);
            tooltipDiv.html(d.countriesAndTerritories +
                "<br/>" + "pop.: " + d.popData2019 +
                "<br/>" + "cases: " + d.cases +
                "<br/>" + "deaths: " + d.deaths +
                "<br/>" + "r-value: " + d.rValue)
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY - 28) + "px");
        })
        .on("mouseout", function() {
            tooltipDiv.transition()
                .duration(100)
                .style("opacity", 0);
        });

    // Slider change event handler. It updates the scatter plot.
    slider.on('onchange', val => {
        // Filter data by current date selected on the slider.
        let currentDate = formTime(val)
        newData = filterDataByDate(data, currentDate)

        // Re-scale axes.
        rescaleAxes(svg, newData, dataUniqueDatesFormatted[0])

        // Establish new marker positions.
        let circle = svg.selectAll("circle").data(newData);

        // Animate marker movement to new position.
        circle.transition()
            .duration(animationDuration)
            .attr("r", function(d) { return popRange(d.popData2019); })
            .attr("cx", function(d) { return xRange(d.cases); })
            .attr("cy", function(d) { return yRange(d.deaths); })
            .style("stroke-width", "2px")
            .style("stroke", function(d) { return borderColourPicker(d.rValueNominal)})
            .style("fill", function(d) { return continentColourEncoder(d.continentExp); })
            .style("opacity", opacity);

        // Add the tooltip to each marker.
        circle.on("mouseover", function(d) {
            tooltipDiv.transition()
                .duration(100)
                .style("opacity", .9);
            tooltipDiv.html(d.countriesAndTerritories +
                "<br/>" + "pop.: " + d.popData2019 +
                "<br/>" + "cases: " + d.cases +
                "<br/>" + "deaths: " + d.deaths +
                "<br/>" + "r-value: " + d.rValue)
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY - 28) + "px");
        })
            .on("mouseout", function(d) {
                tooltipDiv.transition()
                    .duration(100)
                    .style("opacity", 0);
            });

        // Remove previous selected date markers.
        circle.exit()
            .transition(animationDuration)
            .attr("r", 0)
            .remove();
    });
});