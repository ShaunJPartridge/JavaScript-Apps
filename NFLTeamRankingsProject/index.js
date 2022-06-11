import * as cheerio from 'cheerio';
import request from 'request';
import fs from 'fs';
import * as d3 from 'd3';
import { JSDOM } from 'jsdom';
import {getRanks, buildTeams} from './teams.js';
import { sort } from 'd3';

// Url of website being scrapped
let url = 'https://www.nfl.com/news/nfl-power-rankings-which-teams-improved-most-after-2022-nfl-draft';

// Array for team objects
var Teams;

// Arrays for teams' names, ranks, & logos
var teamRanks;
var teamNames;
var teamLogos = new Set();

// Array of NFL colors represented in hexadecimal
var teamColors = ['#97233F','#A71930','#241773','#00338D','#0085CA','#0B162A','#FB4F14'
,'#311D00','#869397','#FB4F14','#0076B6','#203731','#A71930','#002C5F','#006778'
,'#E31837','#A5ACAF','#0080C6','#003594','#008E97','#4F2683','#B0B7BC','#D3BC8D'
,'#0B2265','#125740','#004C54','#FFB612','#AA0000','#69BE28','#D50A0A','#4B92DB','#5A1414'] 

// create a JSDOM object with skeleton code to render html server-side
let html = fs.readFileSync('./index.html');
const myDom = new JSDOM(html);

// Variables for d3
const svgWidth = 1100;
const svgHeight = 800;
const margins = {left:20, top:20, right:20, bottom:80}; 
const height = svgHeight - margins.bottom - margins.top;
const width = svgWidth - margins.left - margins.right;
const padding = 40;

let xScale, yScale, colors, xLabels;
let svg;
let body;

// Path of file where the chart will be written and saved
const outputLocation = 'output.svg';

// Method: createScales()
async function createScales(){

    // Create labels to display team names on x-axis
    xLabels = d3.scaleBand().domain(teamNames)
    .range([margins.left+15,svgWidth-margins.right])
    .padding(0.4);
    
    // Create scale for x-axis
    xScale = d3.scaleBand().domain(d3.range(0,32))
    .range([margins.left+15,svgWidth-margins.right])
    .padding(0.4);

    // Create scale for y-axis
    yScale = d3.scaleLinear().domain([0,32])
    .range([svgHeight-margins.bottom,margins.top]);

}

// Method: drawData()
async function drawData(){

    // create bar chart
    var myBars = svg.selectAll('g')
    .data(Teams)
    .enter()
    .append('g');

    // Append bars to chart
    myBars.append('rect')
    .attr('fill',(el,i) => teamColors[i])
    .attr('x',(el,i) => xScale(i))
    .attr('y',(el) => yScale(el.rank))
    .attr('width',25)
    .attr('height',(el) => ((svgHeight-margins.bottom) - (yScale(el.rank))))
    .style({
        'display':'block',
        'margin-left':'auto',
        'margin-right':'auto'
    });
    
    // Add images to the top of bars
    myBars.append('image')
    .attr('href',(el) => el.logo)
    .attr('x',(el,i) => xScale(i)-14)
    .attr('y',(el) => yScale(el.rank)-25)
    .attr('width',50)
    .attr('height',50)
    .style({
        'display':'block',
        'margin-left':'auto',
        'margin-right':'auto'
    })

    //console.log(body.select('.canvas').html());
    //fs.writeFileSync(outputLocation, body.select('.canvas').html());
    
    // Call drawAxes() to draw the chart's axes
    drawAxes();
}

// Method: drawAxes()
async function drawAxes(){

    // Variables for x & y axis.
    var x_ax = d3.axisBottom().scale(xLabels);
    var y_ax = d3.axisLeft().scale(yScale);

    // Create title for chart
    svg.append('text')
    .attr('x',(svgWidth-margins.left-margins.right)/2)
    .attr('y',20)
    .attr('font-size',20)
    .text('2022 Post Draft NFL Team Rankings')

    // Create y-axis label
    svg.append('text')
    .attr('transform','translate(20,370)rotate(-90)')
    .attr('font-size',20)
    .text('Ranks')

    // Create x-axis label
    svg.append('text')
    .attr('transform','translate(500' + ', ' + (svgHeight-10) + ')')
    .attr('font-size',20)
    .text('Teams')

    // Create svg g element for x-axis
    svg.append('g')
    .attr('class','x_axis')
    .attr('transform','translate(0' + ', ' + (svgHeight-margins.bottom) + ')')
    .call(x_ax)
    .selectAll('path, line, text')
    .style('color','black')

    // Select team names and rotate them on x-axis
    svg.select('.x_axis')
    .selectAll('text')
    .attr("transform", "translate(-30,15)rotate(-35)")
    
    // Create svg g element for y-axis
    svg.append('g')
    .attr('class','y_axis')
    .attr('transform','translate(' + (margins.left+15) +', ' + 0 + ')')
    .call(y_ax)
    .selectAll('path, line, text')
    .style('color','black');

    // Write final svg to file
    fs.writeFileSync(outputLocation, body.select('.canvas').html());
}

// Method: drawCanvas()
async function drawCanvas(){
    
    // Get the body of the DOM object's window
    body = d3.select(myDom.window.document).select('body');
    
    // Append the canvas for the chart to the svg
    svg = body.append('div').attr('class','canvas')
    .append('svg')
    .attr('width',svgWidth)
    .attr('height',svgHeight)
    .style('background-color','white');

    console.log(body.select('.canvas').html());
    // Call createScales() to create the bar charts scales
    createScales();
    
    // Call drawData() to draw the bar chart
    drawData();

};

// Method: scrapeData()
async function scrapeData(){
    // Request data from site
    request.get(url,(err, res, body) => {

        if (err) return console.error(err);

        // Load the body of the response
        let $ = cheerio.load(body);

        // Get all 32 teams' names, ranks, and logo using class selectors
        let nflTitles = $('.nfl-o-ranked-item__title');
        let nflRanks = $('.nfl-o-ranked-item__label--second');
        let nflLogos = $('.nfl-o-ranked-item__figure picture source');//$('.nfl-o-ranked-item__figure');
        
        // For loop using selector to get the 'src' value of the source element
        // of each team from webpage being scrapped
        for (let i = 0;i < nflLogos.length;i++){
            teamLogos.add($(nflLogos[i]).attr('data-srcset').split(',')[0]);
        }

        teamLogos = Array.from(teamLogos).map((el) => el.slice(0,el.length-3));
        console.log(teamLogos)
    
        // Pass in team ranks string to getRanks to parse it for each teams' rank
        teamRanks = getRanks(nflRanks.text());

        // Use regex to get seperate team names. Next add a comma to string between
        // team names. Then split comma delimited string to get an array of team names;
        teamNames = nflTitles.text().replace(/([a-z])([A-Z])/g,'$1,$2').split(',');

        // Pass in team names, their ranks, and logos to buildTeams to create
        // an array of team objects
        Teams = buildTeams(teamNames,teamRanks,teamLogos);

        // Sort objects by name, so graph will look interesting
        Teams.sort((a,b) => (a.team > b.team) ? 1: -1);

        // Get team names, their corresponding rank, and logo; used for creating scales
        teamNames = Teams.map((el) => el.team);
        teamRanks = Teams.map((el) => el.rank);
        //teamLogos = Teams.map((el) => el.logo);

        // Build svg canvas
        drawCanvas();
    
    })
}

// Scrape data from NFL webpage for team ranks. 
// Entry point of app.
scrapeData();
