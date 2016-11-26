/**
 * @file twc_client.js
 * @fileOverview Defines the Client class.
 * @author Andreas Olofsson (andreas@erisindustries.com)
 * @module rpc/twc_client
 */

var nUtil = require('util');
var Client = require('./client');

/**
 *
 * @Constructor
 */
module.exports = TWCClient;

/**
 * <tt>TWCClient</tt> is the base class for clients that allows two-way communication, such
 * as a websocket client.
 * @constructor
 */
function TWCClient(URL) {
    Client.call(this, URL);
    /**
     * Storing requests until their responses comes back.
     *
     * @type TODO
     *
     * @private
     */
    this._reqs = {};

    /**
     * Storing permanent callbacks until manually removed.
     *
     * @type TODO
     *
     * @private
     */
    this._callbacks = {};
}

nUtil.inherits(TWCClient, Client);

/**
 *
 * @param {string} method - The method name.
 * @param {?Object} params - The parameters object.
 * @param {module:rpc/rpc~methodCallback} callback - The callback function.
 */
TWCClient.prototype.send = function(method, params, callback){};

/**
 * Add a new callback manually. This will be used if no request callback
 * has been set up for a given request id. An example would be websocket
 * subscriptions that receive an id string when a subscription is made.
 * All events being returned from the server uses the callback set for that
 * id. It is no risk for collision as those ids are always 64 (hex) characters,
 * and regular ids are string version of numbers that start at 0 and increase
 * by 1 for each request that is made.
 *
 * The callbacks are not automatically removed when used, like for regular
 * requests, but must be removed manually. A good subscriber class should
 * manage this.
 *
 * TODO namespace ids
 *
 * @param {string} reqId - The request id that
 * @param {module:rpc/rpc~methodCallback} callback - The callback function.
 * @return {function} The current function on the reqId, or null
 */
TWCClient.prototype.addCallback = function(reqId, callback){
    var ret = null;
    if(this._callbacks.hasOwnProperty(reqId)) {
        ret = this._callbacks[reqId];
    }
    this._callbacks[reqId] = callback;
    return ret;
};

/**
 * Delete a callback.
 *
 * @param reqId
 * @return {boolean} Whether or not something was deleted.
 */
TWCClient.prototype.removeCallback = function(reqId){
    if(this._callbacks.hasOwnProperty(reqId)) {
        delete this._callbacks[reqId];
        return true;
    }
    return false;
};

/**
 * Function used for reconnecting with the blockchain-server. If there is a connection already
 * active, this function will replace it with a new one.
 *
 * @param {function} callback - function(error) which is called when reconnecting is done.
 */
TWCClient.prototype.reconnect = function(callback){
    callback(new Error("Reconnect is not implemented by this client."));
};