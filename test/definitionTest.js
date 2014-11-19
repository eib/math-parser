var Definition = require('../lib/tree/Definition'),
    expect = require('chai').expect;

describe('Definition', function () {
    describe('constructor', function () {
        it('should assign name property', function () {
            var definition = Definition('x', 0);
            expect(definition.name).to.equal('x');
        });
        it('should assign value property', function () {
            var definition = Definition('x', 54321);
            expect(definition.value).to.equal(54321);
        });
    });
});