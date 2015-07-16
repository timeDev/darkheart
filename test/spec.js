var dhsc = require('../src/script/dhsc'),
    should = require('should');

describe("DHSC", function() {
    it("returns the atom itself if it's the only input", function() {
        dhsc.exec("10")
            .should.equal(10);
    });

    it("correctly adds two numbers", function() {
        dhsc.exec("(+ 2 5)")
            .should.equal(7);
    });

    it("returns an unevaluated value when using 'quote'", function() {
        dhsc.exec("(quote (+ 1 2))")
            .should.eql(['+', 1, 2]);
    });
});
