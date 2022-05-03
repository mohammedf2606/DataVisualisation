// Legend formatting globals.
const xBase = 10
const yBase = -90
const sectionWidth = 100
const markerTextSpacing = 15
const regularMarkerSize = 10
const markerHorizontalSpacing = 5
const textOffset = 10
const legendTextFontSize = 12

// Colour continent legend.
function addContinentColourLegend(svg, continents) {
    let x = xBase
    // Marker.
    svg.selectAll("#GraphDiv")
        .data(continents)
        .enter()
        .append("rect")
        .attr("x", x)
        .attr("y", function(d,i){ return i * (regularMarkerSize + markerHorizontalSpacing) + yBase})
        .attr("width", regularMarkerSize)
        .attr("height", regularMarkerSize)
        .style("fill", function(d) { return continentColourEncoder(d)})
        .style("opacity", opacity);

    // Text.
    svg.selectAll("#GraphDiv")
        .data(continents)
        .enter()
        .append("text")
        .attr("x", x + markerTextSpacing)
        .attr("y", function(d,i){ return i * (regularMarkerSize + markerHorizontalSpacing) + textOffset + yBase})
        .style("fill", "black")
        .text(function (d) {return d})
        .attr("text-anchor", "left")
        .style("alignment-baseline", "middle")
        .style("font-size", legendTextFontSize+"px");
}
// Border colour r value legend.
function addRValueBorderLegend(svg){
    let x = xBase + sectionWidth
    // Marker.
    svg.selectAll("#GraphDiv")
        .data(["+", "-"])
        .enter()
        .append("rect")
        .attr("x", x)
        .attr("y", function(d,i){ return i * (regularMarkerSize + markerHorizontalSpacing) + yBase})
        .attr("width", 10)
        .attr("height", 10)
        .style("stroke-width", "2px")
        .style("stroke", function(d) { return borderColourPicker(d)})
        .style("fill", "white")
        .style("opacity", opacity);

    // Text.
    svg.selectAll("#GraphDiv")
        .data(["+ve r-value", "-ve r-value"])
        .enter()
        .append("text")
        .attr("x", x + markerTextSpacing)
        .attr("y", function(d,i){ return i * (regularMarkerSize + markerHorizontalSpacing) + textOffset + yBase})
        .style("fill", "black")
        .text(function (d) {return d})
        .attr("text-anchor", "left")
        .style("alignment-baseline", "middle")
        .style("font-size", legendTextFontSize+"px");
}

// Marker size population size legend.
function addPopulationSizeLegend(svg){
    let x = xBase + (sectionWidth * 2)
    // Text
    svg.selectAll("#GraphDiv")
        .data(["1"])
        .enter()
        .append("text")
        .attr("x", x)
        .attr("y", textOffset + yBase)
        .style("fill", "black")
        .text("Population size")
        .attr("text-anchor", "left")
        .style("alignment-baseline", "middle")
        .style("font-size", legendTextFontSize+"px");

    // Squares.
    svg.selectAll("#GraphDiv")
        .data(["1", "2", "3"])
        .enter()
        .append("rect")
        .attr("x", function(d, i){ return x + ((regularMarkerSize*2) * i) + ((regularMarkerSize) * i)})
        .attr("y", (regularMarkerSize + markerHorizontalSpacing) + yBase)
        .attr("width", function(d){ return (6 * d)})
        .attr("height", function(d){ return (6 * d)})
        .style("fill", "gray");
}
