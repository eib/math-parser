var TokenStream = require('../lib/tokenStream'),
    expect = require('chai').expect;

describe('TokenStream', function () {
    describe('.isEnded()', function () {
        it('should return true when there are more tokens', function () {
            var t = new TokenStream(['a']);
            expect(t.isEnded()).to.equal(false);
        });
        it('should return false when there are no more tokens', function () {
            var t = new TokenStream(['a']);
            t.next();
            expect(t.isEnded()).to.equal(true);
        });
    });
    describe('.peek()', function () {
        it('should start with the first token', function () {
            var t = new TokenStream(['a']);
            expect(t.peek()).to.equal('a');
        });
        it('should return EOF when there are no more tokens', function () {
            var t = new TokenStream(['a']);
            t.next();
            expect(t.peek()).to.equal(TokenStream.EOF);
        });
        it('should not advance to the next token', function () {
            var t = new TokenStream(['a']);
            t.peek();
            expect(t.peek()).to.equal('a');
        });
        it('should return the next token', function () {
            var t = new TokenStream(['a', 'b', 'c']);
            t.next();
            expect(t.peek()).to.equal('b');
            t.next();
            expect(t.peek()).to.equal('c');
        });
    });
    describe('.next()', function () {
        it('should throw an error when there are no more tokens', function () {
            var t = new TokenStream(['a']);
            t.next(); //at EOF
        });
        it('should return the next token', function () {
            var t = new TokenStream(['a']);
            expect(t.next()).to.equal('a');
        });
        it('should advance the current token', function () {
            var t = new TokenStream(['a', 'b']);
            t.next();
            expect(t.next()).to.equal('b');
        });
    });
});