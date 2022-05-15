const cheerio = require('cheerio');
const request = require('request');

// variables for building the svg canvas
let width = 800;
let height = 500;
let padding = 40;
let svg = d3.select('svg');


request({
    method: 'GET',
    url: 'https://www.nfl.com/news/nfl-power-rankings-which-teams-improved-most-after-2022-nfl-draft'
}, (err, res, body) => {

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
    let teams = nflTitles.text().replace(/([a-z])([A-Z])/g,'$1,$2').split(',');

    // Pass in team names, along with their ranks to buildTeams to create
    // an array of team objects
    teams = buildTeams(teams,ranks);

    // Build svg canvas
    
    
});

// Method: getRanks
const getRanks = (ranks) => {
    let tmp = '';
    // For loop to get all 32 teams' ranks 
    for(let i = 0;i < ranks.length;){
        // Builds a comma delimited string rep. digits 1-9 
        if(i <= 8){
            tmp += ranks[i] + ',';
            i++;
        }
        // Builds a comma delimites string rep. numbers 10-32
        else{
            tmp += ranks[i] + ranks[i+1] + ',';
            i+=2;
        }
    }

    // Remove trailing comma from string and turn string into an array,
    // filled with integers 1-32.
    ranks = tmp.replace(/,$/,'').split(',');

    return ranks;
}

// Method: buildTeams
const buildTeams = (names,ranks) => {
    return names.map((el,ind) => {
        //console.log({team:el, rank:ranks[ind]});
        return {team:el, rank:Number(ranks[ind])};
    })
};

// Method: drawCanvas
const drawCanvas = () => {
    svg.attr('width',width);
    svg.attr('height',height);
}
