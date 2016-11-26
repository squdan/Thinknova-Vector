var util = require('../../../lib/util');
var asrt;
var edbModule;

if (typeof(window) === "undefined") {
    asrt = require('assert');
    edbModule = require("../../../index");
} else {
    asrt = assert;
    edbModule = edbFactory;
}

var test_data = require('./../../testdata/testdata.json');

var requestData = {
    priv_validator: test_data.chain_data.priv_validator,
    genesis: test_data.chain_data.genesis,
    max_duration: 40
};

var edb;

var privKey = test_data.chain_data.priv_validator.priv_key[1];
var compiled = "60606040525b33600060006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908302179055505b60d38061003f6000396000f30060606040523615603a576000357c010000000000000000000000000000000000000000000000000000000090048063a5f3c23b14609757603a565b606b5b6000600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1690506068565b90565b604051808273ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b60ac60048035906020018035906020015060c2565b6040518082815260200191505060405180910390f35b6000818301905060cd565b9291505056";
var input = "";
var address;

var serverServerURL = "http://localhost:1337/server";

describe('send', function () {

    // Not ideal, we just deploy the contract and go.
    before(function (done) {
        util.getNewErisServer(serverServerURL, requestData, function (error, port) {
            edb = edbModule.createInstance("http://localhost:" + port + '/rpc');
            done();
        });
    });

    it("should send funds from one account to another", function (done) {
        this.timeout(5000);
        edb.events().subAccountOutput("C94DC0AA09348AEBAF026D8A77C8C2AB544DE038", function(error, data){
            asrt.ifError(error);
            edb.accounts().getAccount("C94DC0AA09348AEBAF026D8A77C8C2AB544DE038", function(error, data){
                asrt.ifError(error);
                console.log(data);
                asrt.equal(data.balance, 1000000, "Balances do not match.");
                done();
            });
        });
        edb.txs().send(privKey, "C94DC0AA09348AEBAF026D8A77C8C2AB544DE038", 1000000, null, function (error, data) {
            asrt.ifError(error);
            console.log(data);
        });
    });

    it("should send funds from one account to another", function (done) {
        this.timeout(5000);
        edb.txs().sendAndHold(privKey, "C94DC0AA09348AEBAF026D8A77C8C2AB544DE038", 1000000, null, function (error, data) {
            asrt.ifError(error);
            asrt.ifError(error);
            edb.accounts().getAccount("C94DC0AA09348AEBAF026D8A77C8C2AB544DE038", function(error, data){
                asrt.ifError(error);
                asrt.equal(data.balance, 2000000, "Balances do not match.");
                done();
            });
        });
    });


});