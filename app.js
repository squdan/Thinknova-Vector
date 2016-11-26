/*eslint-env node*/

var contractFile = require('./contract');

const erisDbFactory = require('eris-db');
const erisContracts = require('eris-contracts');
const solc = require('solc');
const accounts = require("./accounts.js").accounts;
const nodes = require("./ips.js").ips;

var erisdb; /* ErisDB Factory */
var erisdbURL; /* ErisDB RPC URL */
var pipe; /* Pipe for creating contracts */
var contractManager;/* Contract Manager for creating contracts*/
var account = accounts[0].address;
var greeterSource = contractFile.getContract();

/*Initialize ERISDB*/
erisdb = erisDbFactory.createInstance(nodes[0]);
erisdb.start(function(error){
    if(!error){
        console.log("Ready to go");
    }
});

pipe = new erisContracts.pipes.DevPipe(erisdb, accounts); /* Create a new pipe*/
contractManager = erisContracts.newContractManager(pipe); /*Create a new contract object using the pipe */

/*Get account list*/
erisdb.accounts().getAccounts((err, res) => { console.log(res.accounts.map(item => {
  return ({
    ADDR: item.address,
    BALANCE: item.balance
  })
})) });

/* Compile the Greeter Contract*/
var compiledContract = solc.compile(greeterSource);
var contractFactory = contractManager.newContractFactory(JSON.parse(compiledContract.contracts.Ticket.interface)); //parameter is abi
console.log("Contract Factory:" + contractFactory)

// Load the appropriate modules for the app
var cfenv = require("cfenv");
var express = require("express");
var bodyParser = require('body-parser');

// Defensiveness against errors parsing request bodies...
process.on('uncaughtException', function (err) {
    console.log('#### Caught exception: ' + err);
});
process.on("exit", function(code) {
    console.log("#### Exiting with code: " + code);
});

// Checking Bluemix setup
var appEnv = cfenv.getAppEnv();

// Configure the app web container
var app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(__dirname + '/public'));

// Finishing configuration of the app web container
app.listen(appEnv.port);
console.log("#### Server listening on port " + appEnv.port);

// Home page
app.get('/', function (req, res) {
      res.render('index', {compiledContract: greeterSource});
});

app.get('/company', function (req, res) {
   res.render( 'company', {state: ""} ) ;
});

app.get('/client', function (req, res) {
  res.render( 'client', {state: ""} ) ;
});

app.get('/provider', function (req, res) {
   res.render( 'provider', {state: ""} ) ;
});

/**bodyParser.json(options)
 * Parses the text as JSON and exposes the resulting object on req.body.
 */
app.use(bodyParser.json());

app.post('/clientTicket', function(request, response){
    var adressClient = 0x7D618EB254AD609814CC231F4EF65438EF666926;
    var identifier = request.body.ticketID;
    var price = request.body.price;

    contractFactory.new.apply(contractFactory, [{from: adressClient, data:compiledContract.contracts.Ticket.bytecode}, (err, contractInstance)=> {
      contractInstance.acceptTicket(identifier, price, (error, isValid) => {
         if (error) {
           response.render( 'client', {state: "Error!!"} ) ;
         }
        else if ( isValid == 1 ) {
          response.render( 'client', {state: "Ticket aceptado!!"} ) ;
        } else {
          response.render( 'client', {state: "Ticket no aceptado!!"} ) ;
        }
      })
    }]);
    //response.render( 'client', {state: "Ticket aceptado!!"} ) ;
});

app.post('/companyTicket', function(request, response){
  response.render( 'company', {state: "Ticket aceptado!!"} ) ;
});

app.post('/providerTicket', function(request, response){
  response.render( 'provider', {state: "Ticket aceptado!!"} ) ;
});
