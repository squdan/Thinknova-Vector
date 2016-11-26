'use strict';

var
  assert = require('assert'),
  createDb = require('../createDb'),
  erisDb = require('../../..');

describe("transactions class", function () {
  it("sends coins to an address", function (done) {
    this.timeout(30 * 1000);

    createDb().spread(function (hostname, port, validator) {
      var
        db, address;

      db = erisDb.createInstance("http://" + hostname + ":" + port + "/rpc");
      address = "0000000000000000000000000000000000000001";

      db.txs().sendAndHold(validator.priv_key[1], address, 1, null,
        function (error) {
        assert.ifError(error);

        db.accounts().getAccount(address, function (error, response) {
          assert.ifError(error);
          assert.equal(response.balance, 1);
          done();
        });
      });
    });
  });
});
