async function choropleth() {
    let svg = d3.select("#children_map2").select("svg");
    let width = "1200";
    let height = "600";

    let projection = d3.geoMercator()
        //.translate([width / 2, height / 2])
        //.scale([700])
        .center([-0.2,51.55])
        .scale(45000);

    let path = d3.geoPath()
        .projection(projection);

    // Define a quantized scale to sort data values into buckets of color
    let color =d3.scaleLinear()
        .domain([0, 10])
        .range(['red', 'blue']);
    /*d3.scaleQuantize()
    .range(["#edf8fb",
        "#b2e2e2",
        "#66c2a4",
        "#2ca25f",
        "#006d2c"
    ]);*/


    // Load in GeoJSON data
    let json = await d3.json("../scripts/london.json");


    // Load in the agriculture data;
    let stateData = await d3.csv("../scripts/children_male.csv");

    // Set input domain for color scale based on the min and max
    color.domain([-0.26,0.26]);
    /*color.domain([
        d3.min(stateData, function (d) {
            return d.value;
        }),
        d3.max(stateData, function (d) {
            return d.value;
        })
    ]);
console.log(d3.min(stateData,function (d) {
    return d.value;}));
    console.log(d3.max(stateData,function (d) {
        return d.value;}));*/
    // Convert the data array to an object, so that it's easy to look up
    // data values by state names
    let dataLookup = {};
    stateData.forEach(function (stateRow) {
        // d3.csv will read the values as strings; we need to convert them to floats
        dataLookup[stateRow.state] = parseFloat(stateRow.value);
    });

    // Now we add the data values to the geometry for every state

    json.features.forEach(function (feature) {
        feature.properties.value = dataLookup[feature.properties.name];
    });

    // Bind data and create one path per GeoJSON feature
    d3.select("#children_map2").select("svg").select("#mapLayer").selectAll("path")
        .data(json.features)
        .join("path")
        // here we use the familiar d attribute again to define the path
        .attr("d", path)
        .style("fill", function (d) {
            return color(d.properties.value)})
        .on("mouseover",function(d,i){
            d3.select(this)
                .style("fill","lightyellow");
        })
        .on("mouseout",function(d,i){
            d3.select(this)
                .transition()
                .duration(500)
                .style("fill",function (d) {
                    return color(d.properties.value)})})
};


choropleth();
