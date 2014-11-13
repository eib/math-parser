var parser = require('../lib/parser'),
    TokenStream = require('../lib/tokenStream'),
    Operation = require('../lib/tree/operation'),
    BinaryOp = require('../lib/tree/binaryOp'),
    UnaryOp = require('../lib/tree/unaryOp'),
    expect = require('chai').expect;

function parse(tokens) {
    var stream = new TokenStream(tokens);
    return parser.parse(stream);
}

describe('Parser', function () {
    describe('parseFunction', function () {
        it('should convert number literals into Numbers', function () {
            var actual = parse(['52']);
            expect(actual).to.equal(52);
        });
        it('should leave variables as strings', function () {
            var actual = parse(['x']);
            expect(actual).to.equal('x');
        });
        it('should implicitly multiply numbers beside variables', function () {
            var actual = parse(['3', 'x']);
            expect(actual).to.be.instanceof(BinaryOp);
            expect(actual.operator).to.equal('*');
            expect(actual.leftOperand).to.equal(3);
            expect(actual.rightOperand).to.equal('x');
        });
        it('should implicitly multiply variables beside numbers', function () {
            var actual = parse(['x', '3']);
            expect(actual).to.be.instanceof(BinaryOp);
            expect(actual.operator).to.equal('*');
            expect(actual.leftOperand).to.equal('x');
            expect(actual.rightOperand).to.equal(3);
        });
        it('should parse unary operators', function () {
            var actual = parse(['-', 'x']);
            expect(actual).to.be.instanceof(UnaryOp);
            expect(actual.operator).to.equal('-');
            expect(actual.operand).to.equal('x');
        });
        it('should parse binary operators', function () {
            var actual = parse(['x', '~', '13']);
            expect(actual).to.be.instanceof(BinaryOp);
            expect(actual.operator).to.equal('~');
            expect(actual.leftOperand).to.equal('x');
            expect(actual.rightOperand).to.equal(13);
        });
        it('should in-line parenthetical expressions', function () {
            var actual = parse(['(', 'x', '+', '3', ')']);
            expect(actual).to.be.instanceof(BinaryOp);
            expect(actual.operator).to.equal('+');
            expect(actual.leftOperand).to.equal('x');
            expect(actual.rightOperand).to.equal(3);
        });
        it('should maintain operator precedence', function () {
            var actual = parse('x + 3 * y'.split(' '));
//            console.log('Actual: ' + actual);
            expect(actual).to.be.instanceof(BinaryOp);
            expect(actual.operator).to.equal('+');
            expect(actual.leftOperand).to.equal('x');
            expect(actual.rightOperand).to.be.instanceof(BinaryOp);
            expect(actual.rightOperand.operator).to.equal('*');
            expect(actual.rightOperand.leftOperand).to.equal('3');
            expect(actual.rightOperand.rightOperand).to.equal('y');
        });
    });
});