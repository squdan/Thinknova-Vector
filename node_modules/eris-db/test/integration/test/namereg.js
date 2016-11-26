'use strict';

var
  createDb = require('../createDb');

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

var edb;

var privKey;
var input = "";
var address;

describe('TestNameReg', function () {

    before(function (done) {
        this.timeout(30 * 1000);

        createDb().spread(function (hostname, port, validator) {
            edb = edbModule.createInstance("http://" + hostname + ":" + port
              + "/rpc");

            privKey = validator.priv_key[1];
            done();
        });
    });

    it("should register an entry in the namereg", function (done) {
        this.timeout(6000);

        var input = test_data.SetEntry.input;
        var name = input.name;
        var data = input.data;
        var numBlocks = input.numBlocks;

        var output = test_data.SetEntry.output;
        edb.namereg().setEntry(privKey, name, data, numBlocks, function (error, data) {
            asrt.ifError(error);

            edb.namereg().getEntry(name, function (error, entry) {
                asrt.deepEqual(entry, data, "output does not match expected");
                done();
            });
        });
    });

});
