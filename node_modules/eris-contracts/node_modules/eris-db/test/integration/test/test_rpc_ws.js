/* This file is for testing RPC methods.
 */

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

var serverServerURL = "http://localhost:1337/server";

var testData = require('./../../testdata/testdata.json');

var requestData = {
    priv_validator: testData.chain_data.priv_validator,
    genesis: testData.chain_data.genesis,
    max_duration: 10
};

var edb;

describe('ErisDbWebSocket', function () {

    before(function (done) {
        this.timeout(4000);
        
        util.getNewErisServer(serverServerURL, requestData, function(err, port){
            if(err){
                throw err;
            }
            edb = edbModule.createInstance("ws://localhost:" + port + '/socketrpc', true);
            edb.start(function(err){
                if (err){
                    throw err;
                }
                console.time("ws");
                done();
            });

        })
    });

    after(function(){
        console.timeEnd("ws");
    });

    describe('.consensus', function () {

        describe('#getState', function () {
            it("should get the consensus state", function (done) {
                var exp = testData.GetConsensusState.output;
                edb.consensus().getState(check(exp, done, [modifyConsensusStartTime]));
            });
        });

        describe('#getValidators', function () {
            it("should get the validators", function (done) {
                var exp = testData.GetValidators.output;
                edb.consensus().getValidators(check(exp, done));
            });
        });

    });

    describe('.network', function () {

        describe('#getInfo', function () {
            var exp = testData.GetNetworkInfo.output;
            it("should get the network info", function (done) {
                edb.network().getInfo(check(exp, done));
            });
        });

        describe('#getClientVersion', function () {
            var exp = testData.GetClientVersion.output;
            it("should get the network info", function (done) {
                edb.network().getClientVersion(check(exp, done));
            });
        });

        describe('#getMoniker', function () {
            var exp = testData.GetMoniker.output;
            it("should get the moniker", function (done) {
                edb.network().getMoniker(check(exp, done));
            });
        });

        describe('#isListening', function () {
            it("should get the listening value", function (done) {
                var exp = testData.IsListening.output;
                edb.network().isListening(check(exp, done));
            });
        });

        describe('#getListeners', function () {
            it("should get the listeners", function (done) {
                var exp = testData.GetListeners.output;
                edb.network().getListeners(check(exp, done));
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

        describe('#transact contract create', function () {
            this.timeout(4000);
            it("should send a contract create tx to an address", function (done) {
                var tx_create = testData.TransactCreate.input;
                var exp = testData.TransactCreate.output;
                edb.txs().transactAndHold(tx_create.priv_key, tx_create.address, tx_create.data,
                    tx_create.gas_limit, tx_create.fee, null, check(exp, done));
            });
        });

        describe('#transact', function () {
            this.timeout(4000);
            it("should transact with the account at the given address", function (done) {
                var tx = testData.Transact.input;
                var exp = testData.Transact.output;
                edb.txs().transactAndHold(tx.priv_key, tx.address, tx.data, tx.gas_limit, tx.fee,
                    null, check(exp, done));
            });
        });

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
                var exp = testData.GetAccounts.output;
                edb.accounts().getAccounts(check(exp, done));
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
                var exp = testData.GetBlockchainInfo.output;
                edb.blockchain().getInfo(check(exp, done, [modifyBlockInfo]));
            });
        });

        describe('#getChainId', function () {
            it("should get the chain id", function (done) {
                var exp = testData.GetChainId.output;
                edb.blockchain().getChainId(check(exp, done));
            });
        });

        describe('#getGenesisHash', function () {
            var exp = testData.GetGenesisHash.output;
            it("should get the genesis hash", function (done) {
                edb.blockchain().getGenesisHash(check(exp, done));
            });
        });

        describe('#getLatestBlockHeight', function () {
            it("should get the latest block height", function (done) {
                var exp = testData.GetLatestBlockHeight.output;
                edb.blockchain().getLatestBlockHeight(check(exp, done));
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
        asrt.ifError(error, "Failed to call rpc method.");
        asrt.deepEqual(data, expected);
        done();
    };
}

function modifyConsensusStartTime(cs){
    cs["start_time"] = "";
}

function modifyPrivateAccount(pa){
    pa.address = "";
    pa.pub_key[1] = "";
    pa.priv_key[1] = "";
}

function modifyBlockInfo(bi){
    bi.latest_block = null;
}