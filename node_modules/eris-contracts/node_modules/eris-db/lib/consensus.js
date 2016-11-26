/**
 * @file consensus.js
 * @fileOverview Factory module for the Consensus class.
 * @author Andreas Olofsson (andreas@erisindustries.com)
 * @module consensus
 */
'use strict';

var util = require('./util');
var nUtil = require('util');
var rpc = require('./rpc/rpc');

/**
 * Create a new instance of the Consensus class.
 *
 * @param {module:rpc/client~Client} client - The client object.
 * @returns {Consensus} - A new instance of the Consensus class.
 */
exports.createInstance = function(client){
    return new Consensus(client);
};

/**
 * The Consensus class has methods that relates to consensus mechanisms, such as
 * getting a list of all validators, and querying the consensus state.
 *
 * @param {module:rpc/client~Client} client - The client object.
 * @augments module:util~ComponentBase
 * @constructor
 */
function Consensus(client){
    util.ComponentBase.call(this, client);
}

nUtil.inherits(Consensus, util.ComponentBase);

/**
 * Get a list of all validators.
 *
 * @param {module:rpc/rpc~methodCallback} callback - The callback function.
 */
Consensus.prototype.getValidators = function(callback){
    this._client.send(rpc.methodName("getValidators"), null, callback);
};

/**
 * Get the consensus state.
 *
 * @param {module:rpc/rpc~methodCallback} callback - The callback function.
 */
Consensus.prototype.getState = function(callback){
    this._client.send(rpc.methodName("getConsensusState"), null, callback);
};