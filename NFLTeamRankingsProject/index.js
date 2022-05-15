import * as cheerio from 'cheerio';
import request from 'request';
import * as d3 from 'd3';
import { JSDOM } from 'jsdom';
import {getRanks, buildTeams} from './teams.js';

// Url of website being scrapped
let url = 'https://www.nfl.com/news/nfl-power-rankings-which-teams-improved-most-after-2022-nfl-draft';
// Array for team objects
var Teams;

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

let width = 800;
let height = 600;
let body = d3.select(myDom.window.document).select('body');// this is html body
let svg = body.append('div').attr('class','canvas'); // this is part of html body

async function drawData(){
    svg.selectAll("rect")
    .data(Teams)
    .enter()
    .append('rect')
    console.log(body.select('.canvas').html());
}

// Method: drawCanvas()
async function drawCanvas(){
    //svg = body.append('div').attr('class','canvas')
    svg.append('svg')
    .attr('width',width)
    .attr('height',height);
    
    svg
    console.log(body.select('.canvas').html());
    console.log(Teams);
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
        let ranks = getRanks(nflRanks.text());

        // Use regex to get seperate team names. Next add a comma to string between
        // team names. Then split comma delimited string to get an array of team names;
        let teams = nflTitles.text().replace(/([a-z])([A-Z])/g,'$1,$2').split(',');

        // Pass in team names, along with their ranks to buildTeams to create
        // an array of team objects
        Teams = buildTeams(teams,ranks);
        //console.log(teams);

        // Build svg canvas
        drawCanvas();
    
    })
}

scrapeData();
