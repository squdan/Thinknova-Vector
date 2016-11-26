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

var test_data = require('./testdata/testdata_mock.json');
var template = require('./mock/test_template');

var handlers = template.getHandlers(test_data);
var port = 13378;

var http = require('http');

var server = http.createServer(function (request, response) {
    var message = '';

    request.on('data', function (chunk) {
        message += chunk.toString();
    });

    request.on('end', function () {
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
                code: -32700,
                message: errMsg
            };
            response.writeHead(200, {'Content-Type': 'application/json'});
            response.end(JSON.stringify(resp));
            return;
        }

        resp.id = req.id;
        if (!isRequest(req)) {
            errMsg = "Message is not a proper json-rpc 2.0 request: " + message;
            console.error(errMsg);
            resp.error = {
                code: -32600,
                message: errMsg
            };
        } else if (!handlers.hasOwnProperty(req.method)) {
            errMsg = "Method not found: " + req.method;
            console.error(errMsg);
            resp.error = {
                code: -32601,
                message: errMsg
            };
        } else {
            var method = handlers[req.method];
            resp.result = method(req.params);
        }
        response.writeHead(200, {'Content-Type': 'application/json'});
        response.end(JSON.stringify(resp));
    });

    function isRequest(req) {
        // Check params is null or array?
        return req instanceof Object && typeof(req.jsonrpc) === "string" && req.jsonrpc === "2.0" &&
            typeof(req.method) === "string" && typeof(req.id) === "string";
    }

});

var edb;
var tests;

describe("eris-db", function () {

    describe("tests with mock rpc server over http", function(){
        server.listen(port, function () {});
        edb = edbModule.createInstance("http://127.0.0.1:" + port.toString());
        edb.start(function () {});
        tests = template.getTests(edb, test_data);
        tests.forEach(function (test) {
            it("should call " + test[0] + " successfully.", function (done) {
                var f = test[1];
                var expected = test_data[test[0]].output;
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