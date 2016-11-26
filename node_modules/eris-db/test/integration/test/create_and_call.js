'use strict';

var
  createDb = require('../createDb'),
  fs = require('fs'),
  Solidity = require('solc'),
  util = require('../../../lib/util');

var asrt;
var edbModule;

if (typeof(window) === "undefined") {
  asrt = require('assert');
  edbModule = require("../../../index");
} else {
  asrt = assert;
  edbModule = edbFactory;
}

var compiled;
var input = "";
var address;

describe('HttpCreateAndCall', function () {
  it("should call a contract", function (done) {
    this.timeout(30 * 1000);

    compiled = Solidity.compile(fs.readFileSync(__dirname + '/testtx.sol', 'utf8'))
      .contracts.testtx.bytecode;

    createDb().spread(function (hostname, port, validator) {
      var
        edb, privateKey;

      edb = edbModule.createInstance("http://" + hostname + ":" + port
        + "/rpc");

      privateKey = validator.priv_key[1];

      edb.txs().transactAndHold(privateKey, "", compiled, 1000000, 0, null,
        function (error, data) {
          asrt.ifError(error);
          address = data.call_data.callee;
          edb.txs().call(address, input, function (error, data) {
            asrt.ifError(error);

            asrt.equal(data.return.slice((32 - 20) * 2).toUpperCase(),
              validator.address);

            done();
          });
        });
    });
  });
});
