'use strict';

/**
 * @file mock_ws_server.js
 * @fileOverview Module wrapper for MockServer.
 * @author Andreas Olofsson (andreas@erisindustries.com)
 * @module test/server
 */

/**
 *
 * @constructor
 */
module.exports = MockWebsocketServer;

/**
 * Start a websocket server.
 *
 * @param {number} [port=1337] - The port
 * @param {Object.<string, Function>} handlers
 * @constructor
 */
function MockWebsocketServer(port, handlers) {

    /**
     * This is where method handlers are stored.
     *
     * @type {Object.<string, handlerFunction>}
     * @private
     */
    if(handlers) {
        this._handlers = handlers;
    }

    (function (mockServer) {

        var WebSocketServer = require('ws').Server;

        var wss = new WebSocketServer({port: port || 1337});

        wss.on('connection', function connection(ws) {
            console.log("New connection.");
            ws.on('message', function incoming(message) {

                var resp = {
                    jsonrpc: "2.0",
                    id: "",
                    result: null,
                    error: null
                };

                var req, errMsg;

                try {
                    req = JSON.parse(message);
                } catch (error) {
                    errMsg = "Failed to parse message: " + error;
                    console.error(errMsg);
                    resp.error = {
                        code : -32700,
                        message : errMsg
                    };
                    ws.send(JSON.stringify(resp));
                    return;
                }

                resp.id = req.id;
                if (!isRequest(req)) {
                    errMsg = "Message is not a proper json-rpc 2.0 request: " + message;
                    console.error(errMsg);
                    resp.error = {
                        code : -32600,
                        message : errMsg
                    };
                    ws.send(JSON.stringify(resp));
                    return;
                }
                if(!mockServer._handlers.hasOwnProperty(req.method)){
                    errMsg = "Method not found: " + req.method;
                    console.error(errMsg);
                    resp.error = {
                        code : -32601,
                        message : errMsg
                    };
                    ws.send(JSON.stringify(resp));
                    return;
                }
                var method = mockServer._handlers[req.method];

                resp.result = method(req.params);

                ws.send(JSON.stringify(resp));

            });
        });

    })(this);

    console.log("Ws server is running.");

    /**
     * Check that an object is a valid Request.
     * @param {*} req - The object.
     * @returns {boolean}
     */
    function isRequest(req) {
        return req instanceof Object && typeof(req.jsonrpc) === "string" && req.jsonrpc === "2.0" &&
            typeof(req.method) === "string" && typeof(req.id) === "string";
    }

}