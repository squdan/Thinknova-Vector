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
var compiled = "60606040525b33600060006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908302179055505b609480603e6000396000f30060606040523615600d57600d565b60685b6000600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff169050805033600060006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908302179055505b90565b604051808273ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f3";
var input = "";
var address;

var serverServerURL = "http://localhost:1337/server";

describe('HttpCreateAndTx', function () {

    // Not ideal, we just deploy the contract and go.
    before(function (done) {
        util.getNewErisServer(serverServerURL, requestData, function (error, port) {
            edb = edbModule.createInstance("http://localhost:" + port + "/rpc");
            done();
        });
    });

    it("should create a contract then transact to it", function (done) {
        this.timeout(10000);
        edb.txs().transactAndHold(privKey, "", compiled, 100000, 0, null, function (error, data) {
            asrt.ifError(error);
            address = data.call_data.callee;
            edb.txs().transactAndHold(privKey, address, "", 100000, 0, null, function (error, data) {
                asrt.ifError(error);
                asrt.equal(data.return, "00000000000000000000000037236DF251AB70022B1DA351F08A20FB52443E37");
                done();
            });
        });
    });

});