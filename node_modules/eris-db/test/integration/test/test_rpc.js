/* This file is for testing RPC methods.
 */
// TODO break all the standard tests out into one file, then use them in all mock tests + these ones.

'use strict';

var
  createDb = require('../createDb');

var util = require('../../../lib/util');
var assert = require('assert');
var edbModule = require("../../../index"),
    _ = require('lodash');

var testData = require('./../../testdata/testdata.json');

var edb;

function hasKeys(object, keys) {
    return keys.every(_.curry(_.has)(object));
}

function assertHasKeys(keys, done) {
    return function (error, response) {
        assert.ifError(error);
        assert(hasKeys(response, keys));
        done();
    };
}

describe('ErisDbHttp', function () {
  var
    privateKey;

    before(function (done) {
      this.timeout(30 * 1000);

      createDb().spread(function (hostname, port, validator) {
          edb = edbModule.createInstance("http://" + hostname + ":" + port
            + "/rpc");
            
          privateKey = validator.priv_key[1];
          console.time("http");
          done();
      });
    });

    after(function(){
        console.timeEnd("http");
    });

    describe('.consensus', function () {

        describe('#getState', function () {
            it("should get the consensus state", function (done) {
                edb.consensus().getState(assertHasKeys(['height', 'round',
                    'step', 'start_time', 'commit_time', 'validators',
                    'proposal'], done));
            });
        });

        describe('#getValidators', function () {
            it("should get the validators", function (done) {
                edb.consensus().getValidators(assertHasKeys(['block_height',
                    'bonded_validators', 'unbonding_validators'], done));
            });
        });

    });

    describe('.network', function () {

        describe('#getInfo', function () {
            it("should get the network info", function (done) {
                edb.network().getInfo(assertHasKeys(['client_version',
                    'moniker', 'listening', 'listeners', 'peers'], done));
            });
        });

        describe('#getClientVersion', function () {
          it("should get the network info", function (done) {
              edb.network().getClientVersion(assertHasKeys(['client_version'],
                done));
          });
        });

        describe('#getMoniker', function () {
            it("should get the moniker", function (done) {
                edb.network().getMoniker(assertHasKeys(['moniker'], done));
            });
        });

        describe('#isListening', function () {
            it("should get the listening value", function (done) {
                edb.network().isListening(function (error, response) {
                    assert.ifError(error);
                    assert(response.listening);
                    done();
                });
            });
        });

        describe('#getListeners', function () {
            it("should get the listeners", function (done) {
                edb.network().getListeners(function (error, response) {
                    assert.ifError(error);
                    assert(response.listeners.length > 0);
                    done();
                });
            });
        });

        describe('#getPeers', function () {
            it("should get the peers", function (done) {
                var exp = testData.GetPeers.output;
                edb.network().getPeers(check(exp, done));
            });
        });

    });

    describe('.txs', function () {

        describe('#getUnconfirmedTxs', function () {
            it("should get the unconfirmed txs", function (done) {
                var exp = testData.GetUnconfirmedTxs.output;
                edb.txs().getUnconfirmedTxs(check(exp, done));
            });
        });

        describe('#callCode', function () {
            it("should callCode with the given code and data", function (done) {
                var call_code = testData.CallCode.input;
                var exp = testData.CallCode.output;
                edb.txs().callCode(call_code.code, call_code.data, check(exp, done));
            });

        });

    });

    describe('.accounts', function () {

        describe('#genPrivAccount', function () {
            it("should get a new private account", function (done) {
                // Just make sure the basic data are there and are of the correct type...
                var exp = testData.GenPrivAccount.output;
                edb.accounts().genPrivAccount(null, check(exp, done, [modifyPrivateAccount]));
            });
        });

        describe('#getAccounts', function () {
            it("should get all accounts", function (done) {
                edb.accounts().getAccounts(function (error, response) {
                    assert.ifError(error);
                    assert.equal(response.accounts.length, 2);
                    done();
                });
            });
        });

        describe('#getAccount', function () {
            it("should get the account", function (done) {
                var addr = testData.GetAccount.input.address;
                var exp = testData.GetAccount.output;
                edb.accounts().getAccount(addr, check(exp, done));
            });
        });

        describe('#getStorage', function () {
            it("should get the storage", function (done) {
                var addr = testData.GetStorage.input.address;
                var exp = testData.GetStorage.output;
                edb.accounts().getStorage(addr, check(exp, done));
            });
        });

        describe('#getStorageAt', function () {
            it("should get the storage at the given key", function (done) {
                var addr = testData.GetStorageAt.input.address;
                var sa = testData.GetStorageAt.input.key;
                var exp = testData.GetStorageAt.output;
                edb.accounts().getStorageAt(addr, sa, check(exp, done));
            });
        });

    });

    describe('.blockchain', function () {

        describe('#getInfo', function () {
            it("should get the blockchain info", function (done) {
              edb.blockchain().getInfo(function (error, info) {
                assert.deepEqual(info.chain_id, "blockchain");
                done();
              });
            });
        });

        describe('#getChainId', function () {
            it("should get the chain id", function (done) {
                edb.blockchain().getChainId(function (error, response) {
                    assert.ifError(error);
                    assert.equal(response.chain_id, "blockchain");
                    done();
                });
            });
        });

        describe('#getGenesisHash', function () {
            it("should get the genesis hash", function (done) {

                edb.blockchain().getGenesisHash(assertHasKeys(['hash'], done));
            });
        });

        describe('#getLatestBlockHeight', function () {
            it("should get the latest block height", function (done) {
              edb.blockchain().getLatestBlockHeight(assertHasKeys(['height'],
                done));
            });
        });
    });

});

// Expected is the expected data. done is the mocha done-function, modifiers are
// used to overwrite fields in the return-data that should not be included in the
// tests (like certain timestamps for example).
function check(expected, done, fieldModifiers) {
    return function (error, data) {
        if (error) {
            console.log(error);
        }
        if(fieldModifiers && fieldModifiers.length > 0){
            for (var i = 0; i < fieldModifiers.length; i++) {
                fieldModifiers[i](data);
            }
        }
        try {
          assert.ifError(error, "Failed to call rpc method.");
          assert.deepEqual(data, expected);
          done();
        }
        catch (exception) {
          done(exception);
        }
    };
}

function modifyPrivateAccount(pa){
    pa.address = "";
    pa.pub_key[1] = "";
    pa.priv_key[1] = "";
}
