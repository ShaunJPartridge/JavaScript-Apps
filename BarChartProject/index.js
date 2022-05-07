let url = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json";
let req = new XMLHttpRequest();

let data

let xScale
let yScale
let xAxisScale
let yAxisScale

let width = 800
let height = 600
let padding = 40

let svg = d3.select('svg')

// function: drawCanvas
let drawCanvas = () => {
    svg.attr('width',width)
    svg.attr('height',height)
}

// function: genScales
let genScales = () => {
  
    yScale = d3.scaleLinear()
  .domain([0,d3.max(data,(d) => d[1])])
  .range([0, height- (2*padding)]);
  
    xScale = d3.scaleLinear()
  .domain([0, data.length - 1])
  .range([padding, width-padding]);
  
  let dates = data.map((el) => {
    return new Date(el[0])
  });
  
  xAxisScale = d3.scaleTime()
  .domain([d3.min(dates), d3.max(dates)])
  .range([padding,width-padding]);
  
  yAxisScale = d3.scaleLinear()
  .domain([0,d3.max(data,(d) => d[1])])
  .range([height-padding,padding])
  //yAxisScale = d3.axisLeft(yScale);
  
}

// function: drawBars
let drawBars = () => {
  
  let toolTip = d3.select("body")
  .append("div")
  .attr("id","tooltip")
  .style("visibility","hidden")
  .style("width","auto")
  .style("height","auto")
  
  svg.selectAll("rect")
  .data(data)
  .enter()
  .append("rect")
  .attr("class", "bar")
  .attr("fill","blue")
  .attr("width",(width - (2 * padding)) / data.length)
  .attr("data-date",(el) => {return el[0]})
  .attr("data-gdp",(el) => {return el[1]})
  .attr("height",(el) => {return yScale(el[1])})
  .attr("x",(el,index) => {return xScale(index)})
  .attr("y",(el,index) => {return (height-padding) - yScale(el[1])})
  .on("mouseover",(event,item) => {
    toolTip.transition()
    .style("visibility", "visible");
    toolTip.text(item[0] + ", " + item[1]);
    document.querySelector("#tooltip").setAttribute("data-date",item[0]);
    })
  .on("mouseout",(event,item) => {
    toolTip.transition()
    .style("visibility","hidden")
    }) 
  //});
}

// function: drawAxes
let drawAxes = () => {
  
   let xAxis = d3.axisBottom(xAxisScale);
  svg.append('g')
  .call(xAxis)
  .attr('id','x-axis')
  .attr('transform', 'translate(0, ' + (height-padding) + ')');
  
  let yAxis = d3.axisLeft(yAxisScale);
  svg.append('g')
  .call(yAxis)
  .attr('id','y-axis')
  .attr('transform', 'translate(' + padding + ',0)');
}


req.open("GET",url,true);
req.send();
req.onload = function(){
  const json = JSON.parse(req.responseText);
  data = json.data;
  drawCanvas();
  genScales();
  drawBars();
  drawAxes();
};
