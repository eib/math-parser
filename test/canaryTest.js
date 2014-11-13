var expect = require('chai').expect;

describe('test runner', function () {
    it('should have test assertions', function () {
        expect(true).to.equal(true);
    });
    it('should have async assertions', function (done) {
        expect(true).to.equal(true);
        done();
    });
});