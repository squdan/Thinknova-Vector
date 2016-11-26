/**
 * @file erisdb.js
 * @fileOverview Factory module for the ErisDB class.
 * @author Andreas Olofsson (andreas@erisindustries.com)
 * @module erisdb
 */

'use strict';

var accountsF = require('./accounts');
var blockChainF = require('./blockchain');
var consensusF = require('./consensus');
var eventsF = require('./events');
var nameregF = require('./namereg');
var networkF = require('./network');
var transactionsF = require('./transactions');
var unsafeF = require('./unsafe');
var validation = require('./validation');

/**
 * Create a new instance of the ErisDB class.
 *
 * @param {module:rpc/client-Client} client - The networking client object.
 * @param {module:validation~Validator} validator - The validator object.
 * @returns {ErisDB} - A new instance of the ErisDB class.
 */
exports.createInstance = function (client, validator) {
    return new ErisDB(client, validator);
};

/**
 * The main class.
 *
 * @param {module:rpc/client-Client} client - The networking client object.
 * @param {module:validation~Validator} validator - The validator object.
 * @constructor
 */
function ErisDB(client, validator) {
    if(typeof(validator) === "undefined" || validator === null){
        validator = new validation.SinglePolicyValidator(true);
    }
    this._client = client;
    var unsafe = unsafeF.createInstance(client, validator);
    var events = eventsF.createInstance(client);

    var accounts = accountsF.createInstance(client, unsafe);
    var blockChain = blockChainF.createInstance(client);
    var consensus = consensusF.createInstance(client);
    var namereg = nameregF.createInstance(client, unsafe, events);
    var network = networkF.createInstance(client);
    var transactions = transactionsF.createInstance(client, unsafe);

    this._unsafe = unsafe;
    this._accounts = accounts;
    this._blockChain = blockChain;
    this._consensus = consensus;
    this._events = events;
    this._namereg = namereg;
    this._network = network;
    this._transactions = transactions;
}

/**
 * Start the ErisDB client. This method calls the <tt>start</tt> method on the client.
 *
 * @param {module:rpc/rpc~methodCallback} callback - The callback function. The data param is the
 * erisdb instance itself.
 */
ErisDB.prototype.start = function (callback) {
    if (!this._client) {
        throw new Error("Networking client object has not been set.");
    }
    var that = this;
    this._client.start(function(error){
        if (error) {
            callback(error);
        } else {
            callback(null, that);
        }

    })
};

/**
 * Shuts down the ErisDB client. This method calls the <tt>shutDown</tt> method on the client.
 *
 * @param {module:rpc/client~netShutdownCallback} callback - This is called when ErisDB has been shut down.
 */
ErisDB.prototype.shutDown = function (callback) {
    if (!this._client) {
        throw new Error("Networking client object has not been set.");
    }
    this._client.shutDown(callback);
};

/**
 * Check if ErisDB is running. This method calls the <tt>isRunning</tt> method of
 * the networking client.
 */
ErisDB.prototype.isRunning = function () {
    this._client.isRunning();
};

/**
 * Get the <tt>Accounts</tt> object.
 *
 * @returns {module:accounts~Accounts}
 */
ErisDB.prototype.accounts = function () {
    return this._accounts;
};

/**
 * Get the <tt>BlockChain</tt> object.
 *
 * @returns {module:blockchain~BlockChain}
 */
ErisDB.prototype.blockchain = function () {
    return this._blockChain;
};


/**
 * Get the <tt>Consensus</tt> object.
 *
 * @returns {module:consensus~Consensus}
 */
ErisDB.prototype.consensus = function () {
    return this._consensus;
};

/**
 * Get the <tt>Events</tt> object.
 *
 * @returns {module:events~Events}
 */
ErisDB.prototype.events = function () {
    return this._events;
};

/**
 * Get the <tt>NameReg</tt> object.
 *
 * @returns {module:namereg~NameReg}
 */
ErisDB.prototype.namereg = function () {
    return this._namereg;
};

/**
 * Get the <tt>Network</tt> object.
 *
 * @returns {module:network~Network}
 */
ErisDB.prototype.network = function () {
    return this._network;
};

/**
 * Get the <tt>Transactions</tt> object.
 *
 * @returns {module:transactions~Transactions}
 */
ErisDB.prototype.txs = function () {
    return this._transactions;
};

/**
 * Set a new validator object.
 *
 * @param {module:validation~Validator} validator - The validator object.
 */
ErisDB.prototype.setValidator = function (validator) {
    return this._unsafe.setValidator(validator);
};