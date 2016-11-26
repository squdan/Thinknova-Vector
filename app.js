/*eslint-env node*/

//------------------------------------------------------------------------------
// node.js starter application for Bluemix
//------------------------------------------------------------------------------

// This application uses express as its web server
// for more info, see: http://expressjs.com
var express = require('express');
var cfenv = require('cfenv');
var bodyParser = require('body-parser');
var blockChain = require('./erisDBApi');

// get the app environment from Cloud Foundry
var appEnv = cfenv.getAppEnv();

// Configure the app web container
var app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(__dirname + '/views'));

// start server on the specified port and binding host
app.listen(appEnv.port);
// print a message when the server starts listening
console.log("server starting on " + appEnv.port);

//blockChain.init();

// Home page
app.get('/', function (req, res) {
      //console.log("Init Page, contract: " + blockChain.getContract());
      res.render('index', {compiledContract: blockChain.getContract()});
});
