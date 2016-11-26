/**
 * @file network.js
 * @fileOverview Factory module for the Network class.
 * @author Andreas Olofsson (andreas@erisindustries.com)
 * @module network
 */
'use strict';

var util = require('./util');
var nUtil = require('util');
var rpc = require('./rpc/rpc');

/**
 * Create a new instance of the Network class.
 *
 * @param {module:rpc/client~Client} client - The client object.
 * @returns {Network} - A new instance of the Network class.
 */
exports.createInstance = function(client){
    return new Network(client);
};

/**
 * Network has methods that deals with the peer-to-peer network.
 *
 * @param {module:rpc/client~Client} client - The client object.
 * @augments module:util~ComponentBase
 * @constructor
 */
function Network(client){
    util.ComponentBase.call(this, client);
}

nUtil.inherits(Network, util.ComponentBase);

/**
 * Get the network info.
 *
 * @param {module:rpc/rpc~methodCallback} callback - The callback function.
 */
Network.prototype.getInfo = function(callback){
    this._client.send(rpc.methodName("getNetworkInfo"), null, callback);
};

/**
 * Get the client version
 *
 * @param {module:rpc/rpc~methodCallback} callback - The callback function.
 */
Network.prototype.getClientVersion = function(callback){
    this._client.send(rpc.methodName("getClientVersion"), null, callback);
};

/**
 * Get the moniker
 *
 * @param {module:rpc/rpc~methodCallback} callback - The callback function.
 */
Network.prototype.getMoniker = function(callback){
    this._client.send(rpc.methodName("getMoniker"), null, callback);
};

/**
 * Check if the node is listening for new peers.
 *
 * @param {module:rpc/rpc~methodCallback} callback - The callback function.
 */
Network.prototype.isListening = function(callback){
    this._client.send(rpc.methodName("isListening"), null, callback);
};

/**
 * Get the list of network listeners.
 *
 * @param {module:rpc/rpc~methodCallback} callback - The callback function.
 */
Network.prototype.getListeners = function(callback){
    this._client.send(rpc.methodName("getListeners"), null, callback);
};

/**
 * Get a list of all connected peers.
 *
 * @param {module:rpc/rpc~methodCallback} callback - The callback function.
 */
Network.prototype.getPeers = function(callback){
    this._client.send(rpc.methodName("getPeers"), null, callback);
};

/**
 * Get a single peer based on their address.
 * @param {string} address - The IP address of the peer. // TODO
 * @param {module:rpc/rpc~methodCallback} callback - The callback function.
 */
Network.prototype.getPeer = function(address, callback){
    this._client.send(rpc.methodName("getPeer"), rpc.peerParam(address), callback);
};
