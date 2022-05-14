const cheerio = require('cheerio');
const request = require('request');


request({
    method: 'GET',
    url: 'https://www.nfl.com/news/nfl-power-rankings-which-teams-improved-most-after-2022-nfl-draft'
}, (err, res, body) => {

    if (err) return console.error(err);

    let $ = cheerio.load(body);

    // Get all 32 teams' names, ranks, and logo
    let nflTitles = $('.nfl-o-ranked-item__title');
    let nflRanks = $('.nfl-o-ranked-item__label--second');

    

    let ranks = nflRanks.text();
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

    // Use regex to get seperate team names. Next add a comma to string between
    // team names. Then split comma delimited string to get an array of team names;
    let teams = nflTitles.text().replace(/([a-z])([A-Z])/g,'$1,$2').split(',');
    
});
