//Load HTTP module
const http = require("http");
const hostname = '127.0.0.1';
const port = 3000;

// Setting the environment variable with Google API credentials
const credPath = process.argv[2];
process.env.GOOGLE_APPLICATION_CREDENTIALS = credPath;

const {Translate} = require('@google-cloud/translate').v2;

const translate = new Translate();

const text = ["这是一个非常好的API", "to jest bardzo dobre API"];

async function detectLanguage() {// pass in text from textbox on UI
    let [detections] = await translate.detect(text);
    detections = Array.isArray(detections) ? detections : [detections];
    console.log("Detections:");
    detections.forEach((detection) => {
        console.log(detection);
    });
}

detectLanguage();

//Create HTTP server and listen on port 3000 for requests
const server = http.createServer((req, res) => {

  //Set the response HTTP header with HTTP status and Content type
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello World, this is From What to What\n');
});

//listen for request on port 3000, and as a callback function have the port listened on logged
server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
