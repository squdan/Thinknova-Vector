'use strict';

var
  assert = require('assert'),
  createDb = require('../createDb'),
  erisContracts = require('../../../'),
  Solidity = require('solc');

it("gets a string from Solidity properly", function (done) {
  var
    contract, compiled;

  this.timeout(30 * 1000);

  contract = 'contract x { \
    function getString() constant returns (string) { \
      return "hello"; \
    } \
    \
    function setAndGetString(string s) constant returns (string) { \
      return s; \
    } \
  }';

  compiled = Solidity.compile(contract, 1).contracts.x; // 1 activates the optimiser

  createDb().spread(function (hostname, port, validator) {
    var
      dbUrl, accountData, contractManager, abi, bytecode, contractFactory;

    dbUrl = "http://" + hostname + ":" + port + "/rpc";

    accountData = {
      address: validator.address,
      pubKey: validator.pub_key,
      privKey: validator.priv_key
    };

    contractManager = erisContracts.newContractManagerDev(dbUrl, accountData);
    abi = JSON.parse(compiled.interface);
    bytecode = compiled.bytecode;
    contractFactory = contractManager.newContractFactory(abi);

    contractFactory.new({data: bytecode}, function (error, contract) {
      assert.ifError(error);

      contract.getString(function (error, string) {
        assert.ifError(error);
        assert.equal(string, "hello");

        contract.setAndGetString("hello", function (error, string) {
          assert.ifError(error);
          assert.equal(string, "hello");
          done();
        });
      });
    });
  });
});
