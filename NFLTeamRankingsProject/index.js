import * as cheerio from 'cheerio';
import request from 'request';
import fs from 'fs';
import * as d3 from 'd3';
import { JSDOM } from 'jsdom';
import {getRanks, buildTeams} from './teams.js';

// Url of website being scrapped
let url = 'https://www.nfl.com/news/nfl-power-rankings-which-teams-improved-most-after-2022-nfl-draft';
// Array for team objects
var Teams;
// Arrays for teams' names and ranks
var ranks;
var names;

// create a JSDOM object with skeleton code to render html server-side
const myDom = new JSDOM(`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="./index.css">
    <title>2022 NFL Team Rankings</title>
</head>
<body>
    <div id="title">2022 NFL Team Rankings</div>
</body>
<script src="./index.js" type="module"></script>
</html>`)

// Variables for d3
const width = 800;
const height = 600;
const padding = 40;
const margins = {left:30, top:10, right:10, bottom:10}; 
let xScale, yScale;
let body = d3.select(myDom.window.document).select('body');// this is html body
let svg = body.append('div').attr('class','canvas'); // this is part of html body

const outputLocation = './output.svg';

// Method: createScales()
async function createScales(){
    names.sort();

    xScale = d3.scaleLinear()
    .domain([d3.min(names),d3.max(names)])
    .range([padding, width-padding]);

    yScale = d3.scaleLinear()
    .domain([d3.max(ranks),d3.min(ranks)])
    .range([height-(padding*2),padding]);


    drawData();

}

// Method: drawData()
async function drawData(){
    var bars = svg.selectAll("rect")
    .data(Teams)
    .enter()
    .append('rect');

    bars.attr('x',(el) => {
        return el.name;
    })
    .attr('y',(el) => {
        return el.rank;
    })
    .attr('height',(el) => {
        return yScale(el.rank);
    })
    .attr('width',12);

    //console.log(body.select('.canvas').html());

    drawAxes();
}

// Method: drawAxes()
async function drawAxes(){
    svg.append('g')
    .attr('transform','translate(' + 0 + ', ' + (height-(padding*2)) + ')')
    .call(d3.axisBottom(xScale));

    svg.append('g')
    .attr('transform','translate( ' + padding + ', ' + 0 + ')')
    .call(d3.axisLeft(yScale));
    console.log(body.select('.canvas').html());
    fs.writeFileSync(outputLocation, body.select('.canvas').html());
}

// Method: drawCanvas()
async function drawCanvas(){
    //svg = body.append('div').attr('class','canvas')
    svg.append('svg')
    .attr('width',width)
    .attr('height',height);
    
    console.log(body.select('.canvas').html());
    createScales();
    //console.log(Teams);
};

// Method: scrapeData()
async function scrapeData(){
    // Request data from site
    request.get(url,(err, res, body) => {

        if (err) return console.error(err);

        // Load the body of the response
        let $ = cheerio.load(body);

        // Get all 32 teams' names, ranks, and logo
        let nflTitles = $('.nfl-o-ranked-item__title');
        let nflRanks = $('.nfl-o-ranked-item__label--second');
        //let nflLogos = $('.nfl-o-ranked-item__image');
    
        // Pass in team ranks string to getRanks to parse it for each teams' rank
        ranks = getRanks(nflRanks.text());

        // Use regex to get seperate team names. Next add a comma to string between
        // team names. Then split comma delimited string to get an array of team names;
        names = nflTitles.text().replace(/([a-z])([A-Z])/g,'$1,$2').split(',');

        // Pass in team names, along with their ranks to buildTeams to create
        // an array of team objects
        Teams = buildTeams(names,ranks);
        //console.log(teams);

        // Build svg canvas
        drawCanvas();
    
    })
}

scrapeData();
