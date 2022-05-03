// Date formatter for YYYY-mm-dd.
const formTime = d3.timeFormat("%Y-%m-%d");

// Encodes nominal r-value onto colour.
function borderColourPicker(r) {
    let rNom = ["++", "+"]
    if (rNom.includes(r)) {
        return "black"
    } else {
        return "Gainsboro"
    }
}

// Encodes continent onto hue.
function continentColourEncoder(c) {
    switch (c) {
        case "Africa":
            return "#2CA02CFF"
        case "America":
            return "#D62728FF"
        case "Asia":
            return "#FF7F0EFF"
        case "Europe":
            return "#1F77B4FF"
        case "Oceania":
            return "#9467BDFF"
        default:
            return "#0a0000"
    }
}

// Rescale the x and y axis based on the range of the currently plotted data.
function rescaleAxes(svg, newData, restartScaleDate){
    // Redefine x and y domains.
    let cases = newData.map(function (d) {return parseInt(d.cases)})
    let deaths = newData.map(function (d) {return parseInt(d.deaths)})

    // Use this scaling method to avoid axes downscaling.
    if (d3.max(cases) > maxXSeen){
        maxXSeen = d3.max(cases)
    }
    if (d3.max(deaths) > maxYSeen){
        maxYSeen = d3.max(deaths)
    }
    if (newData[0].dateRep === formTime(restartScaleDate)){
        maxXSeen = 1
        maxYSeen = 1
    }
    xRange.domain([d3.min(cases), d3.max([d3.max(cases), maxXSeen])])
    yRange.domain([d3.min(deaths), d3.max([d3.max(deaths), maxYSeen])])

    // Use this scaling method to apply both axes downscaling and upscaling.
    // xRange.domain([d3.min(cases), d3.max([d3.max(cases), 1])])
    // yRange.domain([d3.min(deaths), d3.max([d3.max(deaths), 1])])

    // Update the axes.
    svg.select(".x.axis")
        .transition()
        .duration(100)
        .call(xAxis);

    svg.select(".y.axis")
        .transition()
        .duration(100)
        .call(yAxis);
}

// Houses the filtering condition for reports. The default is only by date but the comments below show other possible
// options that yield interesting results.
function filterDataByDate(data, currentDate){
    // return data.filter(function (d) {return d.dateRep === currentDate && d.continentExp === "Asia"})
    // return data.filter(function (d) {return d.dateRep === currentDate && d.continentExp === "Europe"})
    // return data.filter(function (d) {return d.dateRep === currentDate && d.continentExp === "Africa"})
    // return data.filter(function (d) {return d.dateRep === currentDate && d.continentExp === "America"})
    // return data.filter(function (d) {return d.dateRep === currentDate && d.continentExp === "Oceania"})

    return data.filter(function (d) {return d.dateRep === currentDate})
}
