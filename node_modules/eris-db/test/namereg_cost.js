var nameregModule = require('../lib/namereg');
var namereg = new nameregModule.createInstance();

var asrt;

if (typeof(window) === "undefined") {
    asrt = require('assert');
} else {
    asrt = assert;
}

describe('Namereg.calculateCost', function () {

    it("should calculate the correct cost", function () {
        var expected = 360;
        var cost = namereg.calculateCost(10, "haha");
        asrt.equal(cost, expected, "cost calculation failed.");
    });

});