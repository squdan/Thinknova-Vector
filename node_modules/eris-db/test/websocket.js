/* This file is for testing RPC methods.
 */
var WebSocketClient = require('../lib/rpc/websocket');
var util = require('../lib/util');
var assert = require('assert');

var testData = require('./testdata/testdata_mock.json');
var template = require('./mock/test_template');

var handlers = template.getHandlers(testData);
var port = 12456;
var MockWebsocketServer = require('./mock/mock_ws_server');
var server = new MockWebsocketServer(port, handlers);
var URL = "ws://localhost:" + port;

describe("websocket", function () {

    describe("tests with mock rpc server over websocket", function(){

        it("should connect to ws server and then close.", function (done) {
            var wsClient = new WebSocketClient(URL);
            wsClient.start(function(error){
                assert.ifError(error, "Failed to connect to server.");
                wsClient.setCloseCallback(function(){
                    console.log("Close callback.");
                    assert.equal(wsClient._ws.readyState, 3, "not properly closed. Readystate: " + wsClient._ws.readyState);
                    done();
                });
                wsClient.shutDown(function(){
                    console.log("Shut down.");
                })
            });
        });

        it("should connect to ws server and then reconnect.", function (done) {
            var wsClient = new WebSocketClient(URL);
            wsClient.start(function(error){
                assert.ifError(error, "Failed to connect to server.");
                wsClient.setCloseCallback(function(){
                    console.log("Close callback.");
                    assert.equal(wsClient._ws.readyState, 3, "not properly closed. Readystate: " + wsClient._ws.readyState);
                });
                wsClient.reconnect(function(){
                    console.log("Reconnected.");
                    assert.equal(wsClient._ws.readyState, 1, "not properly opened. Readystate: " + wsClient._ws.readyState);
                    done();
                })
            });
        });

    });
});

// Expected is the expected data. done is the mocha done-function.
function check(expected, done) {
    return function (error, data) {
        if (error) {
            console.log(error);
        }
        asrt.ifError(error, "Failed to call rpc method.");
        asrt.deepEqual(data, expected);
        done();
    };
}