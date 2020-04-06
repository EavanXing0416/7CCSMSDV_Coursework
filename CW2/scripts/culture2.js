//画布大小
var width = 900, height = 400;

// 在body里添加一个SVG画布
var svg = d3.select("#test")
    .append("svg")
    .attr("width",width)
    .attr("height",height+100);

// 画布周边的空白
var padding = {left: 30, right: 30, top: 20, bottom: 20};

// 定义一个数组
var dataset = [2,5,6,8,8,8,9,9,11,12,12,13,16,17,27,30,33];
// x轴的比例尺
var areaname = ["Caribbean","White and Black Caribbean","Chinese","Other Mixed",
    "White and Asia","White and Black African", "Other Black","African","Irish",
    "Other White","White Britsh","India","Any other ethnic group", "Other Asian","Arab","Pakistani", "Bangladeshi"];
var xScale = d3.scale.ordinal()
    .domain(d3.range(dataset.length))
    .rangeRoundBands([0, width-padding.left - padding.right]);
/*
var xScale = d3.scalePoint()
    .domain(areaname)
    .range([0, width-padding.left - padding.right]);
var xScalePoint = d3.scalePoint()
    .domain(areaname)
    .range([0, width-padding.left - padding.right]);
*/
// y轴的比例尺
var yScale = d3.scale.linear()
    .domain([0, 45])
    .range([height - padding.top - padding.bottom, 0]);

// 定义x轴
var xAxis = d3.svg.axis()
    .scale(xScale)
    .orient("bottom")
    .tickValues([]);

// 定义y轴
var yAxis = d3.svg.axis()
    .scale(yScale)
    .orient("left");

// 矩形之间的空白
var rectPadding = 4;
// 添加矩形元素

var rects = svg.selectAll(".MyRect")
    .data(dataset)
    .enter()
    .append("rect")
    .attr("class","MyRect")   //把类里的 fill 属性清空
    .attr("transform","translate(" + padding.left + "," + padding.top + ")")
    .attr("x", function(d,i){
        return xScale(i) + rectPadding/2;
    } )
    .attr("y",function(d){
        return yScale(d);
    })
    .attr("width", xScale.rangeBand() - rectPadding )
    .attr("height", function(d){
        return height - padding.top - padding.bottom - yScale(d);
    })
    .attr("fill","steelblue")//填充颜色不要写在CSS里
    .on("mouseover",function(d,i){
        d3.select(this)
            .attr("fill","yellow")
    })
    .on("mouseout",function(d,i){
        d3.select(this)
            .transition()
            .duration(500)
            .attr("fill","steelblue");
    });

// 添加文字元素
var texts = svg.selectAll(".MyText")
    .data(dataset)
    .enter()
    .append("text")
    .attr("class","MyText")
    .attr("transform","translate(" + padding.left + "," + padding.top + ")")
    .attr("x", function(d, i){
        return xScale(i) + rectPadding/2;
    })
    .attr("y", function(d){
        return (yScale(d)-20);
    })
    .attr("dx", function(){
        return (xScale.rangeBand() - rectPadding)/2;
    })
    .attr("dy", function(d){
        return 20;
    })
    .text(function(d){
        return d;
    })

var texts2 = svg.selectAll(".MyText2")
    .data(areaname)
    .enter()
    .append("text")
    .attr("class","MyText2")
    .attr("transform","translate(" + padding.left + "," + padding.top + ")")
    .attr("x", function(d, i){
        return xScale(i)-15;
    })
    .attr("y", function(d,i){
        if(i%2==0){return(360)}
        else{return(370)}
        ;
    })
    .attr("dx", function(){
        return (xScale.rangeBand() - rectPadding)/2;
    })
    .attr("dy", function(d){
        return 20;
    })
    .attr("font-size",7)
    .text(function(d){
        return d;
    })


// 添加x轴
svg.append("g")
    .attr("class","axis")
    .attr("transform","translate("+ padding.left + "," +(height-padding.bottom)+")")
    .call(xAxis);

// 添加y轴
svg.append("g")
    .attr("class","axis")
    .attr("transform","translate("+ padding.left + "," + padding.top + ")")
    .call(yAxis)
svg .append("text")
    .text("Difference(%)")
    .attr("transform","rotate(-90)")
    .attr("dy","3.5em")
    .attr("text-anchor","end")
    .call(yAxis);
