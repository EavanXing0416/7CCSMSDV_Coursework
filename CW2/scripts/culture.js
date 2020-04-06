var maxHeight = 400;
var maxWidth = 900;
var barWidth = 40;

var data = [
    {
        culture: 'Caribbean', female: 0.49, male: 0.51,
    },
    {
        culture: 'White and Black Caribbean', female: 0.475, male: 0.525,
    },

    {
        culture: 'Chinese', female: 0.47, male: 0.53,
    },
    {
        culture: 'Other Mixed', female: 0.46, male: 0.54,
    },
    {
        culture: 'White and Asia', female: 0.46, male: 0.54,
    },
    {
        culture: 'White and Black African', female: 0.46, male: 0.54,
    },

    {
        culture: 'Other Black', female: 0.455, male: 0.545,
    },
    {
        culture: 'African', female: 0.455, male: 0.545,
    },
    {
        culture: 'Irish', female: 0.445, male: 0.555,
    },
    {
        culture: 'Other White', female: 0.44, male: 0.56,
    },

    {
        culture: 'White Britsh', female: 0.44, male: 0.56,
    },
    {
        culture: 'India', female: 0.435, male: 0.565,
    },
    {
        culture: 'Any other ethnic group', female: 0.42, male: 0.58,
    },
    {
        culture: 'Other Asian', female: 0.415, male: 0.585,
    },
    {
        culture: 'Arab', female: 0.365, male: 0.635,
    },
    {
        culture: 'Pakistani', female: 0.35, male: 0.65,
    },
    {
        culture: 'Bangladeshi', female: 0.325, male: 0.675,
    },

];

var keys = ['female', 'male'];


var getTimePoint = (d) => {
    var _d = d.data ? d.data : d;
    return `${_d.culture}`;
};

var stack = d3.stack().keys(keys).order(d3.stackOrderNone).offset(d3.stackOffsetNone);
var series = stack(data);
var colorArray = ['#FF4036', '#0074D9'];
var colorArray2 = ['#FF7890','#0096D4'];

function renderVerticalStack() {
    var svg = d3.select('#culture_stack_bar')
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
        .on("mouseover",function(d){
            d3.select(this)
                .attr("fill",function(d) {
                    if (d[0] == 0) {
                        return colorArray2[0]
                    }
                    else {
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
                    }
                    else {
                        return colorArray[1]
                    }
                });
        });

    var axis = d3.axisBottom(xScalePoint);
    svg.append('g')
        .attr('transform', `translate(0, ${maxHeight})`)
        .call(axis)
        .selectAll("text")
        .attr("dy","2.75em")
        .attr('transform','rotate(-15)')
};

renderVerticalStack();

d3.select('#culture_stack_bar')
    .append('div')
    .style('width', maxWidth + 'px')
    .style('display', 'flex')
    .style('justify-content', 'space-around')
    .selectAll('.legend')
    .data(keys)
    .enter()
    .append('div')
    .attr('class', 'legend')
    .text((d) => d)
    .style('color', (d, i) => colorArray[i % colorArray.length])