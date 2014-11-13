var tokenizer = require('../lib/tokenizer'),
    expect = require('chai').expect;

describe('tokenizer', function () {
    describe('.tokenize()', function () {
        it('should split tokens on whitespace', function () {
            expect(tokenizer.tokenize('a b')).to.deep.equal(['a', 'b']);
        });
        it('should split numbers from variables', function () {
            expect(tokenizer.tokenize('2y')).to.deep.equal(['2', 'y']);
        });
        it('should split variables from numbers', function () {
            expect(tokenizer.tokenize('y2')).to.deep.equal(['y', '2']);
        });
        it('should group consecutive alpha chars into a single word', function () {
            expect(tokenizer.tokenize('abc')).to.deep.equal(['abc']);
        });
        it('should group consecutive digits into a single number', function () {
            expect(tokenizer.tokenize('123')).to.deep.equal(['123']);
        });
        it('should tokenize symbols individually', function () {
            expect(tokenizer.tokenize('+-/*^()')).to.deep.equal(['+', '-', '/', '*', '^', '(', ')']);
        });
        it('should split symbols from alpha characters', function () {
            expect(tokenizer.tokenize('z+b')).to.deep.equal(['z', '+', 'b']);
        });
        it('should split symbols from numeric characters', function () {
            expect(tokenizer.tokenize('4/2')).to.deep.equal(['4', '/', '2']);
        });
    });

    describe('.kindOf()', function () {
        it('should recognize whitespace', function () {
            expect(tokenizer.kindOf(' ')).to.equal('whitespace');
        });
        it('should recognize numeric chars', function () {
            expect(tokenizer.kindOf('0')).to.equal('numeric');
            expect(tokenizer.kindOf('1')).to.equal('numeric');
            expect(tokenizer.kindOf('2')).to.equal('numeric');
            expect(tokenizer.kindOf('3')).to.equal('numeric');
            expect(tokenizer.kindOf('4')).to.equal('numeric');
            expect(tokenizer.kindOf('5')).to.equal('numeric');
            expect(tokenizer.kindOf('6')).to.equal('numeric');
            expect(tokenizer.kindOf('7')).to.equal('numeric');
            expect(tokenizer.kindOf('8')).to.equal('numeric');
            expect(tokenizer.kindOf('9')).to.equal('numeric');
            expect(tokenizer.kindOf('.')).to.equal('numeric');
        });
        it('should recognize alpha chars', function () {
            expect(tokenizer.kindOf('a')).to.equal('alpha');
            expect(tokenizer.kindOf('b')).to.equal('alpha');
            expect(tokenizer.kindOf('c')).to.equal('alpha');
            expect(tokenizer.kindOf('A')).to.equal('alpha');
            expect(tokenizer.kindOf('B')).to.equal('alpha');
            expect(tokenizer.kindOf('C')).to.equal('alpha');
        });
    });
});