let url = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json";
var XMLHttpRequest = require('xhr2');
let req = new XMLHttpRequest();

let data
let values

let xScale
let yScale
let xAxisScale
let yAxisScale

let width = 800
let height = 600
let padding = 40

let svg = d3.select('svg')

let drawCanvas = () => {
    svg.attr('width',width)
    svg.attr('height',height)
}

let genScales = () => {

}

let genBars = () => {

}

let genAxes = () => {

}

req.open("GET",url,true);
req.send();
req.onload = function(){
    console.log(req.responseText)
    //const json = JSON.parse(req.responseText);
    //let html = "";
    // Add your code below this line
    //json.forEach((val) => {
      //  const keys = Object.keys(val);
        //html += "<div class='bar'>";
        //keys.forEach((key) => {
        //    html += "<strong>" + key + "</strong>: " + val[key] + "<br>";
        //});
        //html += "</div><br>";
    //});

        // Add your code above this line
    //document.getElementsByClassName('message')[0].innerHTML = html;
};