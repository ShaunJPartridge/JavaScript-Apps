const fs = require('fs');
const got = require('got');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

const vgmUrl= 'https://www.vgmusic.com/music/console/nintendo/nes';

got(vgmUrl).then(response => {
  const dom = new JSDOM(response.body);
    dom.window.document.querySelectorAll('a').forEach(link => {
    console.log(link.href);
  });
}).catch(err => {
  console.log(err);
});