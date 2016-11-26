/**
 * @file mock_twc_client.js
 * @fileOverview Module wrapper for MockTwcClient.
 * @author Andreas Olofsson (andreas@erisindustries.com)
 * @module test/twc_client
 */

var TwcClient = require('../../lib/rpc/twc_client');
var template = require('./test_template');
var testData = require('../testdata/testdata_mock.json');
var nUtil = require('util');

/**
 *
 * @constructor
 */
module.exports = MockTwcClient;

/**
 * Create a mock twc "two way communication" client. Need a better word for this...
 *
 * @augments module:rpc/client~Client
 * @constructor
 */
function MockTwcClient(handlers) {
    TwcClient.call(this, "mock");
    if (!handlers) {
        handlers = template.getHandlers(testData);
    }
    this._handlers = handlers;
}

nUtil.inherits(MockTwcClient, TwcClient);

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
MockTwcClient.prototype.send = function (method, params, callback) {
    if (!this._handlers.hasOwnProperty(method)) {
        callback(new Error("Method does not exist."));
        return;
    }

    var handler = this._handlers[method];

    callback(null, handler(params));

};

MockTwcClient.prototype.addCallback = function (reqId, callback) {
    // We need to add this, but make sure it is run after the start callback,
    // so using a short timeout.
    setTimeout(function () {
        var event = testData.EventPoll.output.events[0];
        callback(null, event);
    }, 10);
};

/**
 * Delete a callback.
 *
 * @param reqId
 * @return {boolean} Whether or not something was deleted.
 */
MockTwcClient.prototype.removeCallback = function (reqId) {
};