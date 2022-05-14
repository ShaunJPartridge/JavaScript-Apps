const cheerio = require('cheerio');
const request = require('request');

request({
    method: 'GET',
    url: 'https://www.nfl.com/news/nfl-power-rankings-which-teams-improved-most-after-2022-nfl-draft'
}, (err, res, body) => {

    if (err) return console.error(err);

    let $ = cheerio.load(body);

    let nflo = $('.nfl-o-ranked-item__title');

    console.log(nflo.text());
});