'use strict';

var
  assert = require('assert'),
  createDb = require('../createDb'),
  fs = require('fs'),
  Solidity = require('solc');
var util = require('../../../lib/util');
var assert;
var edbModule;

if (typeof(window) === "undefined") {
    edbModule = require("../../../index");
} else {
    edbModule = edbFactory;
}

var compiled;
var input = "";
var address;

describe('HttpCreateAndSolidityEvent', function () {

    it("should subscribe to a solidity event", function (done) {
        this.timeout(30 * 1000);

        compiled = Solidity.compile(fs.readFileSync(__dirname + '/testevent.sol', 'utf8'))
          .contracts.testevent.bytecode;

        createDb().spread(function (hostname, port, validator) {
          var
            privateKey;

          var edb = edbModule.createInstance("http://" + hostname + ":" + port
            + "/rpc");

          privateKey = validator.priv_key[1];

          edb.txs().transactAndHold(privateKey, "", compiled, 1000000, 0, null, function (error, data) {
              var
                expected;

              assert.ifError(error);
              address = data.call_data.callee;

              expected = {
                address: '000000000000000000000000' + address, // returns its own address, padded to 32 bytes
                topics: ['88C4F556FDC50387EC6B6FC4E8250FECC56FF50E873DF06DADEEB84C0287CA90',
                  'FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF',
                  '6861686100000000000000000000000000000000000000000000000000000000'],
                data: '0000000000000000000000000000000000000000000000000000000000000001',
                height: 2
              };

              edb.events().subLogEvent(address, function (error, event) {
                  // assert.deepEqual(event, expected, "Event data does not match expected.");
                  assert.equal(error.message, "This functionality is believed to be broken in Eris DB.  See https://github.com/eris-ltd/eris-db/issues/96.");
                  done();
              });

              edb.txs().call("", address, input, function (error, data) {
                  assert.ifError(error);
              });
            }
          );
        });
    });

});
