var rpc = require('../../lib/rpc/rpc');

/**
 * Get a list of tests. Each test is an array ["testname", testFunction, input ... ]. The testname must match the name
 * in the testdata, and the function is the actual eris-db method that will be called. Input is the parameters and will
 * be passed in as arguments to the function.
 *
 * @param edb - eris-db instance.
 * @param testData - the testdata.
 * @returns {[][]} The tests.
 */
exports.getTests = function(edb, testData) {

    var tests = [];

    // Accounts
    var accounts = edb.accounts();
    tests.push(["GenPrivAccount", accounts.genPrivAccount.bind(accounts), null]);
    tests.push(["GetAccounts", accounts.getAccounts.bind(accounts), testData.GetAccounts.input.filters]);
    tests.push(["GetAccount", accounts.getAccount.bind(accounts), testData.GetAccount.input.address]);
    tests.push(["GetStorage", accounts.getStorage.bind(accounts), testData.GetStorage.input.address]);
    var storageAt = testData.GetStorageAt.input;
    tests.push(["GetStorageAt", accounts.getStorageAt.bind(accounts), storageAt.address, storageAt.key]);

    // Blockchain
    var bc = edb.blockchain();
    tests.push(["GetBlockchainInfo", bc.getInfo.bind(bc)]);
    tests.push(["GetChainId", bc.getChainId.bind(bc)]);
    tests.push(["GetGenesisHash", bc.getGenesisHash.bind(bc)]);
    tests.push(["GetLatestBlock", bc.getLatestBlock.bind(bc)]);
    tests.push(["GetLatestBlockHeight", bc.getLatestBlockHeight.bind(bc)]);
    tests.push(["GetBlocks", bc.getBlocks.bind(bc)]);
    tests.push(["GetBlock", bc.getBlock.bind(bc), testData.GetBlock.input.height]);

    // Consensus
    var cs = edb.consensus();
    tests.push(["GetConsensusState", cs.getState.bind(cs)]);
    tests.push(["GetValidators", cs.getValidators.bind(cs)]);

    // Events
    var events = edb.events();
    tests.push(["EventSubscribe", events.subscribe.bind(events), testData.EventSubscribe.input.event_id]);
    tests.push(["EventUnsubscribe", events.unsubscribe.bind(events), testData.EventUnsubscribe.input.sub_id]);
    tests.push(["EventPoll", events.poll.bind(events), testData.EventPoll.input.sub_id]);

    // Network
    var net = edb.network();
    tests.push(["GetNetworkInfo", net.getInfo.bind(net)]);
    tests.push(["GetClientVersion", net.getClientVersion.bind(net)]);
    tests.push(["GetMoniker", net.getMoniker.bind(net)]);
    tests.push(["IsListening", net.isListening.bind(net)]);
    tests.push(["GetListeners", net.getListeners.bind(net)]);
    tests.push(["GetPeers", net.getPeers.bind(net)]);
    tests.push(["GetPeer", net.getPeer.bind(net), testData.GetPeer.input.address]);

    // Transactions
    var txs = edb.txs();

    var callData = testData.Call.input;
    tests.push(["Call", txs.call.bind(txs), callData.address, callData.data]);
    var callCodeData = testData.CallCode.input;
    tests.push(["CallCode", txs.callCode.bind(txs), callCodeData.code, callData.data]);
    var txData = testData.TransactCreate.input;
    tests.push(["TransactCreate", txs.transact.bind(txs), txData.priv_key, txData.address, txData.data, txData.gas_limit, txData.fee, null]);
    txData = testData.Transact.input;
    tests.push(["Transact", txs.transact.bind(txs), txData.priv_key, txData.address, txData.data, txData.gas_limit, txData.fee, null]);
    var txDataNameReg = testData.TransactNameReg.input;
    tests.push(["TransactNameReg", txs.transactNameReg.bind(txs), txDataNameReg.priv_key, txDataNameReg.name, txDataNameReg.data,
        txDataNameReg.amount, txDataNameReg.fee, null]);
    tests.push(["GetUnconfirmedTxs", txs.getUnconfirmedTxs.bind(txs)]);

    // NameReg
    var nr = edb.namereg();
    tests.push(["GetNameRegEntries", nr.getEntries.bind(nr)]);
    tests.push(["GetNameRegEntry", nr.getEntry.bind(nr), testData.GetNameRegEntry.input.name]);

    // TODO test locally signed data before that is added to stack.

    return tests;
};

exports.getHandlers = function(testData){

    var handlers = {};

    handlers[rpc.methodName("getAccounts")] = function(param){return testData.GetAccounts.output};
    handlers[rpc.methodName("getAccount")] = function(param){return testData.GetAccount.output};
    handlers[rpc.methodName("getStorage")] = function(param){return testData.GetStorage.output};
    handlers[rpc.methodName("getStorageAt")] = function(param){return testData.GetStorageAt.output};
    handlers[rpc.methodName("genPrivAccount")] = function(param){return testData.GenPrivAccount.output};
    handlers[rpc.methodName("getBlockchainInfo")] = function(param){return testData.GetBlockchainInfo.output};
    handlers[rpc.methodName("getChainId")] = function(param){return testData.GetChainId.output};
    handlers[rpc.methodName("getGenesisHash")] = function(param){return testData.GetGenesisHash.output};
    handlers[rpc.methodName("getLatestBlockHeight")] = function(param){return testData.GetLatestBlockHeight.output};
    handlers[rpc.methodName("getLatestBlock")] = function(param){return testData.GetLatestBlock.output};
    handlers[rpc.methodName("getBlocks")] = function(param){return testData.GetBlocks.output};
    handlers[rpc.methodName("getBlock")] = function(param){return testData.GetBlock.output};
    handlers[rpc.methodName("getConsensusState")] = function(param){return testData.GetConsensusState.output};
    handlers[rpc.methodName("getValidators")] = function(param){return testData.GetValidators.output};
    handlers[rpc.methodName("getNetworkInfo")] = function(param){return testData.GetNetworkInfo.output};
    handlers[rpc.methodName("getClientVersion")] = function(param){return testData.GetClientVersion.output};
    handlers[rpc.methodName("getMoniker")] = function(param){return testData.GetMoniker.output};
    handlers[rpc.methodName("getChainId")] = function(param){return testData.GetChainId.output};
    handlers[rpc.methodName("isListening")] = function(param){return testData.IsListening.output};
    handlers[rpc.methodName("getListeners")] = function(param){return testData.GetListeners.output};
    handlers[rpc.methodName("getPeers")] = function(param){return testData.GetPeers.output};
    handlers[rpc.methodName("getPeer")] = function(param){return testData.GetPeer.output};
    handlers[rpc.methodName("transact")] = function(param){
        if(param.address == "") {
            return testData.TransactCreate.output;
        } else {
            return testData.Transact.output;
        }
    };
    handlers[rpc.methodName("transactNameReg")] = function(param){return testData.TransactNameReg.output};
    handlers[rpc.methodName("getUnconfirmedTxs")] = function(param){return testData.GetUnconfirmedTxs.output};
    handlers[rpc.methodName("call")] = function(param){return testData.Call.output};
    handlers[rpc.methodName("callCode")] = function(param){return testData.CallCode.output};
    handlers[rpc.methodName("eventSubscribe")] = function(param){return testData.EventSubscribe.output};
    handlers[rpc.methodName("eventUnsubscribe")] = function(param){return testData.EventUnsubscribe.output};
    handlers[rpc.methodName("eventPoll")] = function(param){return testData.EventPoll.output};
    handlers[rpc.methodName("getNameRegEntry")] = function(param){return testData.GetNameRegEntry.output};
    handlers[rpc.methodName("getNameRegEntries")] = function(param){return testData.GetNameRegEntries.output};

    return handlers;
};