/* This file is for testing RPC methods using a mock client.
 */
var asrt;

if (typeof(window) === "undefined") {
    asrt = require('assert');
} else {
    asrt = assert;
}

var testData = require('./testdata/testdata_mock.json');
var template = require('./mock/test_template');
var MockClient = require('./mock/mock_client');
var erisdbFactory = require('../index');

var handlers = template.getHandlers(testData);
var client = new MockClient(handlers);
var edb = erisdbFactory.createInstanceFromClient(client, null);
var tests = template.getTests(edb, testData);

describe('eris-db', function () {

    describe("tests with mock rpc client", function () {
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

// Expected is the expected data. done is the mocha done-function, modifiers are
// used to overwrite fields in the return-data that should not be included in the
// tests (like certain timestamps for example).
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