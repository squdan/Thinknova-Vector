/**
 * @file client.js
 * @fileOverview Defines the Client class.
 * @author Andreas Olofsson (andreas@erisindustries.com)
 * @module rpc/client
 */

/**
 *
 * @constructor
 */
module.exports = Client;

/**
 * <tt>Client</tt> is the base class for all clients used by the library.
 * @constructor
 */
function Client(URL) {
    if(!URL){
        throw new Error("No URL provided.");
    }
    this._URL = URL;
    this._isRunning = false;
    this._currentId = 1;
}

/**
 * @param {netStartCallback} callback - Called when everything is set up.
 */
Client.prototype.start = function(callback){
    this._isRunning = true;
    callback();
};

/**
 *
 * @param {netShutdownCallback} callback - Called when everything has been shut down.
 */
Client.prototype.shutDown = function(callback){
    this._isRunning = false;
    callback();
};

/**
 * Is the system running?
 *
 * @returns {boolean}
 */
Client.prototype.isRunning = function(){
    return this._isRunning;
};

/**
 *
 * @param {string} method - The method name.
 * @param {?Object} params - The parameters object.
 * @param {module:rpc/rpc~methodCallback} [callback] - The callback function. Classes extending the core client
 * does not have to use callbacks, but many subclasses do. They should not inherit these docs!
 */
Client.prototype.send = function(method, params, callback){};

/**
 * Get the next id.
 *
 * @returns {string} id - The id as a string.
 *
 * @private
 */
Client.prototype._nextId = function () {
    return (this._currentId++).toString();
};

/**
 * The network startup callback.
 *
 * @callback netStartCallback
 * @param {error} error - Error.
 */

/**
 * The network shutdown callback.
 *
 * @callback netShutdownCallback
 * @param {error} error - Error.
 */