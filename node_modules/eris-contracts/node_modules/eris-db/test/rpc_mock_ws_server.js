/* This file is for testing RPC methods.
 */

var util = require('../lib/util');
var asrt;
var edbModule;

if (typeof(window) === "undefined") {
    asrt = require('assert');
    edbModule = require("../index");
} else {
    asrt = assert;
    edbModule = edbFactory;
}

var testData = require('./testdata/testdata_mock.json');
var template = require('./mock/test_template');

var handlers = template.getHandlers(testData);
var port = 12345;
var MockWebsocketServer = require('./mock/mock_ws_server');
var server = new MockWebsocketServer(port, handlers);

var edb;
var tests;

describe("eris-db", function () {

    describe("tests with mock rpc server over websocket", function(){
        edb = edbModule.createInstance("ws://localhost:" + port);
        edb.start(function(){});
        tests = template.getTests(edb, testData);

        tests.forEach(function (test) {
            it("should call " + test[0] + " successfully.", function (done) {
                var f = test[1];
                var expected = testData[test[0]].output;
                if (test.length > 2) {
                    var args = test.slice(2);
                    args.push(check(expected, done));
                    f.apply(this, args);
                } else {
                    f(check(expected, done));
                }
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