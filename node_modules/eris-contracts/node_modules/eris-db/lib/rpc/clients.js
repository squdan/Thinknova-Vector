/**
 * @file clients.js
 * @fileOverview Exposes a number of clients + the base client class for extensions.
 * @author Andreas Olofsson (andreas@erisindustries.com)
 * @module rpc/clients
 */

var Client = require('./client');
var TWCClient = require('./twc_client');
var HTTPClient = require('./http');
var WebSocketClient = require('./websocket');

exports.Client = Client;
exports.TWCClient = TWCClient;
exports.HTTPClient = HTTPClient;
exports.WebSocketClient = WebSocketClient;