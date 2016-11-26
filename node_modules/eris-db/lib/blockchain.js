/**
 * @file blockchain.js
 * @fileOverview Factory module for the BlockChain class.
 * @author Andreas Olofsson (andreas@erisindustries.com)
 * @module blockchain
 */
'use strict';

var util = require('./util');
var rpc = require('./rpc/rpc');
var nUtil = require('util');
/**
 * Create a new instance of the BlockChain class.
 *
 * @param {module:rpc/client~Client} client - The client object.
 * @returns {BlockChain} - A new instance of the Blockchain class.
 */
exports.createInstance = function (client) {
    return new BlockChain(client);
};

/**
 * BlockChain has methods for querying the blockchain, getting individual blocks etc.
 *
 * @param {module:rpc/client~Client} client - The client object.
 * @augments module:util~ComponentBase
 * @constructor
 */
function BlockChain(client) {
    util.ComponentBase.call(this, client);
}

nUtil.inherits(BlockChain, util.ComponentBase);

/**
 * Get blockchain info.
 *
 * @param {module:rpc/rpc~methodCallback} callback - The callback function.
 */
BlockChain.prototype.getInfo = function (callback) {
    this._client.send(rpc.methodName("getBlockchainInfo"), null, callback);
};

/**
 * Get the chain id.
 *
 * @param {module:rpc/rpc~methodCallback} callback - The callback function.
 */
BlockChain.prototype.getChainId = function (callback) {
    this._client.send(rpc.methodName("getChainId"), null, callback);
};

/**
 * Get the genesis hash.
 *
 * @param {module:rpc/rpc~methodCallback} callback - The callback function.
 */
BlockChain.prototype.getGenesisHash = function (callback) {
    this._client.send(rpc.methodName("getGenesisHash"), null, callback);
};

/**
 * Get the latest block height.
 *
 * @param {module:rpc/rpc~methodCallback} callback - The callback function.
 */
BlockChain.prototype.getLatestBlockHeight = function (callback) {
    this._client.send(rpc.methodName("getLatestBlockHeight"), null, callback);
};

/**
 * Get the latest block.
 *
 * @param {module:rpc/rpc~methodCallback} callback - The callback function.
 */
BlockChain.prototype.getLatestBlock = function (callback) {
    this._client.send(rpc.methodName("getLatestBlock"), null, callback);
};

/**
 * Get the blocks from 'minHeight' to 'maxHeight'.
 *
 * TODO out of bounds checks?
 *
 * @param {module:util~FieldFilter|module:util~FieldFilter[]} [filter] - Filter the search.
 * @param {module:rpc/rpc~methodCallback} callback - The callback function.
 */
BlockChain.prototype.getBlocks = function (filter, callback) {
    var f, c;
    if(typeof(filter) === "function"){
        f = [];
        c = filter;
    } else if (!filter && typeof(callback) == "function") {
        f = [];
        c = callback;
    } else {
        if(!(filter instanceof Array)){
            f = [filter];
        } else {
            f = filter;
        }
        c = callback;
    }
    this._client.send(rpc.methodName("getBlocks"), rpc.blocksParam(f), c);
};

/**
 * Get the block with the given block-number, or 'height'.
 *
 * @param {number} height - The block height.
 * @param {module:rpc/rpc~methodCallback} callback - The callback function.
 */
BlockChain.prototype.getBlock = function (height, callback) {
    this._client.send(rpc.methodName("getBlock"), rpc.heightParam(height), callback);
};