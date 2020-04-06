var maxHeight = 400;
var maxWidth = 900;
var barWidth = 40;

var data = [
    {
        industry: 'Human health and social work activities', female: 0.74, male: 0.26,
    },
    {
        industry: 'Education', female: 0.70, male: 0.30,
    },

    {
        industry: 'Others', female: 0.52, male: 0.48,
    },
    {
        industry: 'Public administration and defence', female: 0.51, male: 0.49,
    },
    {
        industry: 'Administrative and support service activities', female: 0.47, male: 0.53,
    },
    {
        industry: 'Real estate activities', female: 0.47, male: 0.53,
    },

    {
        industry: 'Professional, scientific and technical activities', female: 0.47, male: 0.53,
    },
    {
        industry: 'Wholesale and retail trade', female: 0.46, male: 0.54,
    },
    {
        industry: 'Accommodation and food service activities', female: 0.44, male: 0.56,
    },
    {
        industry: 'Financial and insurance activities', female: 0.39, male: 0.61,
    },

    {
        industry: 'Information and communication', female: 0.34, male: 0.66,
    },
    {
        industry: 'Manufacturing', female: 0.33, male: 0.67,
    },
    {
        industry: 'Agriculture, energy and water', female: 0.23, male: 0.77,
    },
    {
        industry: 'Transport and storage', female: 0.21, male: 0.79,
    },
    {
        industry: 'Construction', female: 0.13, male: 0.87,
    },

];

var keys = ['female', 'male'];


var getTimePoint = (d) => {
    var _d = d.data ? d.data : d;
    return `${_d.industry}`;
};

var stack = d3.stack().keys(keys).order(d3.stackOrderNone).offset(d3.stackOffsetNone);
var series = stack(data);
var colorArray = ['#FF4036', '#0074D9'];
var colorArray2 = ['#FF7890','#0096D4'];

function renderVerticalStack() {
    var svg = d3.select('#industry_stack_bar')
        .append('svg')
        .attr('width', maxWidth+200)
        .attr('height', maxHeight+100);

    var xScale = d3.scalePoint()
        .domain(data.map(getTimePoint))
        .range([0, maxWidth])
        .padding(0.2);

    var xScalePoint = d3.scalePoint()
        .domain(data.map(getTimePoint))
        .range([0, maxWidth])
        .padding(0.2);

    var stackMax = (serie) => d3.max(serie, (d) => d ? d[1] : 0);
    var stackMin = (serie) => d3.min(serie, (d) => d? d[0]: 0);

    var y = d3.scaleLinear()
        .domain([d3.max(series, stackMax), d3.min(series, stackMin)])
        .range([0, maxHeight]);

    var g = svg.selectAll('g')
        .data(series)
        .enter()
        .append('g')
        .attr('fill', (d, i) => colorArray[i % colorArray.length])
        .selectAll('rect')
        .data((d) => d)
        .enter()
        .append('rect')
        .attr('x', (d) => {
            var scaledX = xScale(getTimePoint(d));
            return scaledX - barWidth / 2;
        })
        .attr('y', (d) => y(d[1]))
        .attr('width', barWidth)
        .attr('height', (d) => {
            return y(d[0]) - y(d[1])})
        .text(function(d){
            return d[0]-d[1]})
        .on("mouseover",function(d){
            d3.select(this)
                .attr("fill",function(d) {
                        if (d[0] == 0) {
                            return colorArray2[0]
                        } else {
                            return colorArray2[1]
                        }
                    });
        })
        .on("mouseout",function(d,i){
            d3.select(this)
                .transition()
                .duration(500)
                .attr("fill",function(d, i) {
                    if (d[0] == 0) {
                        return colorArray[0]
                    } else {
                        return colorArray[1]
                    }
                });
        })

    var axis = d3.axisBottom(xScalePoint);
    svg.append('g')
        .attr('transform', `translate(0, ${maxHeight})`)
        .call(axis)
        .selectAll("text")
        .attr("dy","2.75em")
        .attr('transform','rotate(-15)')



};

renderVerticalStack();

var keysName = ['Female Percentage', 'Male Percentage'];
d3.select('#industry_stack_bar')
    .append('div')
    .style('width', '800 px')
    .style('display', 'flex')
    .style('justify-content', 'space-around')
    .selectAll('.legend')
    .data(keysName)
    .enter()
    .append('div')
    .attr('class', 'legend')
    .text((d) => d)
    .style('color', (d, i) => colorArray[i % colorArray.length])