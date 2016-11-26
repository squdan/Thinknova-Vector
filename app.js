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

/* Send the contract */
var developerAddress = "91706241CA883AED9D1AD8FEB772BC275EB85A0F";

contractFactory.new.apply(contractFactory, [
 {from: developerAddress, data:compiledContract.contracts.Ticket.bytecode}, (err, contractInstance)=> {
  console.log(contractInstance.address);
 }]);


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
    var adressClient = "7D618EB254AD609814CC231F4EF65438EF666926";
    var developerAddress = "91706241CA883AED9D1AD8FEB772BC275EB85A0F";
    var identifier = request.body.ticketID;
    var price = request.body.price;

    contractFactory.new.apply(contractFactory, [{from: developerAddress, data:compiledContract.contracts.Ticket.bytecode}, (err, contractInstance)=> {
      if (err) {
        console.log(err);
      } else {
        contractInstance.acceptTicket(identifier, price, (error, isValid) => {
           if (error) {
             response.render( 'client', {state: "Error!!"} ) ;
           } else {
            response.render( 'client', {state: "Ticket aceptado!!"} ) ;
          }
        })
      }
    }]);
    //response.render( 'client', {state: "Ticket aceptado!!"} ) ;
});

app.post('/companyTicket', function(request, response){
  var addressCompany = "340872446F6BEF795A568F9A64D6DE70548C3853";
  var adressClient = "7D618EB254AD609814CC231F4EF65438EF666926";
  var developerAddress = "91706241CA883AED9D1AD8FEB772BC275EB85A0F";

  var date = request.body.validity;
  var ticketType = request.body.type;
  var maxPrice = request.body.amount;

  contractFactory.new.apply(contractFactory, [{from: developerAddress, data:compiledContract.contracts.Ticket.bytecode}, (err, contractInstance)=> {
    if (err) {
      console.log(err);
    } else {
      contractInstance.allowTicket(date, ticketType, developerAddress, maxPrice, (error,identifier)=> {
         if (error) {
           response.render( 'company', {state: "Error!!"} ) ;
         }
        else {
          response.render( 'company', {state: "Ticket con identificador " + identifier} ) ;
        }
      })
    }
  }]);
  //response.render( 'company', {state: "Ticket aceptado!!"} ) ;
});

app.post('/providerTicket', function(request, response){
  var adressProvider = "3D41F8CA67F89D26263E9C3282A026622D0F192A";
  var addressCompany = "340872446F6BEF795A568F9A64D6DE70548C3853";
  var adressClient = "7D618EB254AD609814CC231F4EF65438EF666926";
  var developerAddress = "91706241CA883AED9D1AD8FEB772BC275EB85A0F";

  var date = request.body.fecha;
  var identifier = request.body.ticketID;
  var ticketType = request.body.type;
  var price = request.body.price;

  contractFactory.new.apply(contractFactory, [{from: developerAddress, data:compiledContract.contracts.Ticket.bytecode}, (err, contractInstance)=> {
    if (err) {
      console.log(err);
    } else {
      contractInstance.generateTicket(date, identifier, 0, price, (error,isValid)=> {
         if (error) {
           response.render( 'provider', {state: "Error!!"} ) ;
         }
        else if (isValid == 1) {
          response.render( 'provider', {state: "Ticket emitido!!"} ) ;
        } else {
          response.render( 'provider', {state: "Ticket sin permisos!!"} ) ;
        }
      })
    }
  }]);
  //response.render( 'provider', {state: "Ticket aceptado!!"} ) ;
});
