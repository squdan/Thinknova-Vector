/**
 * @file mock_client.js
 * @fileOverview Module wrapper for MockClient.
 * @author Andreas Olofsson (andreas@erisindustries.com)
 * @module test/client
 */

var Client = require('../../lib/rpc/client');
var template = require('./test_template');
var testData = require('../testdata/testdata_mock.json');
var nUtil = require('util');

/**
 *
 * @constructor
 */
module.exports = MockClient;
/**
 * Create a mock client.
 * @augments module:rpc/client~Client
 * @constructor
 */
function MockClient(handlers){
    Client.call(this, "mock");
    if(!handlers){
        handlers = template.getHandlers(testData);
    }
    this._handlers = handlers;
}

nUtil.inherits(MockClient, Client);

/**
 * TODO
 *
 * Send a message. This method will get its data from a test data object.
 *
 * @param {string} method - The method name.
 * @param {?Object} params - The parameters object.
 * @param {module:rpc/rpc~methodCallback} callback - The callback function.
 * @override
 */
MockClient.prototype.send = function(method, params, callback){
    if(!this._handlers.hasOwnProperty(method)){
        callback(new Error("Method does not exist."));
        return;
    }
    var handler = this._handlers[method];
    callback(null, handler(params));
};