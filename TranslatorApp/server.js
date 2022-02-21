//Load HTTP module
//const http = require("http");
//const hostname = '127.0.0.1';
//const port = 3000;

// Setting the environment variable with Google API credentials
//const credPath = process.argv[2];
//process.env.GOOGLE_APPLICATION_CREDENTIALS = credPath;

//const {Translate} = require('@google-cloud/translate').v2;
//const translate = new Translate();
//const text = ["这是一个非常好的API", "to jest bardzo dobre API"];

//async function detectLanguage() {// pass in text from textbox on UI
  //  let [detections] = await translate.detect(text);
    //detections = Array.isArray(detections) ? detections : [detections];
    //console.log("Detections:");
    //detections.forEach((detection) => {
      //  console.log(detection);
    //});
//}

//detectLanguage();

const express = require('express');
//const path = require('path');
const nunjucks = require('nunjucks');
const {TranslationService} = require('@google-cloud/translate'); 

const app = express();
app.use(express.urlencoded({extended:true}));
// Uncomment code below if using css files 
//app.use(express.static(path.resolve(__dirname,'styles')));

// Configuring nunjucks
nunjucks.configure(path.resolve(__dirname,'templates'),{
  express:app,
  autoescape:true,
  noCache:false,
  watch:true
});

const Translator = new TranslationService();

const PORT = process.env.PORT || 8080;
let folder;

Translator.getProjectId().then(res => {
  folder = `projects/${res}`;
});

async function getText(req,rep){
  if(req.method === 'POST'){
    
  }
}

//app.get('/',(req,res)=>{
  //res.render('index.html',{
    //title:'From What to What?'
  //});
//});
app.get('/',(req,res) => {
  title = "From What to What?";
  res.sendFile(path.join(__dirname),'templates/index.html')
})


app.listen(port,()=>{
  console.log(`Server running on port ${port}`);
});

function translate() {
  translatedTxt = document.getElementById('srcTxt').textContent;
  console.log(translatedTxt)
}

