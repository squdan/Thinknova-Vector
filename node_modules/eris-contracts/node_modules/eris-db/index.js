/**
 * @file index.js
 * @fileOverview Index file for the eris-db javascript API. This file contains a factory method
 * for creating a new <tt>ErisDB</tt> instance.
 * @author Andreas Olofsson (andreas@erisindustries.com)
 * @module index
 */
'use strict';

var erisdb = require('./lib/erisdb');
var validation = require('./lib/validation');
var WebSocketClient = require('./lib/rpc/websocket');
var HTTPClient = require('./lib/rpc/http');
var clients = require('./lib/rpc/clients');
var url = require('url');


/**
 * ErisDB allows you to do remote calls to a running erisdb-tendermint client.
 *
 * NOTE: optional 'websocket' second param is deprecated.
 *
 * @param {string} URL The RPC endpoint URL.
 * @returns {module:erisdb-ErisDB}
 */
exports.createInstance = function(URL){
    var client;
    if(!URL || typeof(URL) !== "string" || URL === ""){
        URL = 'http://localhost:1337/rpc';
    }
    var parsed = url.parse(URL);
    parsed.protocol = parsed.protocol.slice(0,-1);
    if(parsed.protocol === 'ws' || parsed.protocol === 'wss'){
        client = new WebSocketClient(URL);
    } else if (parsed.protocol === 'http' || parsed.protocol === 'https'){
        client = new HTTPClient(URL);
    } else {
        throw new Error("Protocol not supported: " + parsed.protocol);
    }
    var validator = new validation.SinglePolicyValidator(true);
    return erisdb.createInstance(client, validator);
};

exports.clients = clients;

/**
 * ErisDB allows you to do remote calls to a running erisdb-tendermint client.
 *
 * @param {module:rpc/client~Client} client - A client object.
 * @param {module:validation~CallValidator} [validator] - a validator for determining if unsafe operations can be done.
 * @returns {module:erisdb-ErisDB}
 */
exports.createInstanceFromClient = function(client, validator){
    if(!validator){
        validator = new validation.SinglePolicyValidator(true);
    }
    return erisdb.createInstance(client, validator);
};