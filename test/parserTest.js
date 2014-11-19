var parser = require('../lib/parser'),
    TokenStream = require('../lib/tokenStream'),
    Operation = require('../lib/tree/Operation'),
    BinaryOp = require('../lib/tree/BinaryOp'),
    UnaryOp = require('../lib/tree/UnaryOp'),
    Definition = require('../lib/tree/Definition'),
    expect = require('chai').expect;

describe('Parser', function () {
    describe('.balanceOperation()', function () {
        var balanceOperation = parser.balanceOperation;

        it('should left-associate operators of equal precedence', function () {
            var actual = balanceOperation('-', BinaryOp('+', 'a', 'b'), 'c');
            expect(actual).to.be.instanceof(BinaryOp);
            expect(actual.operator).to.equal('-');
            expect(actual.leftOperand).to.be.instanceof(BinaryOp);
            expect(actual.leftOperand.operator).to.equal('+');
            expect(actual.leftOperand.leftOperand).to.equal('a');
            expect(actual.leftOperand.rightOperand).to.equal('b');
            expect(actual.rightOperand).to.equal('c');
        });
        it("should left-associate operators of lower precedence than the left-operand's operator", function () {
            var actual = balanceOperation('-', BinaryOp('*', 'a', 'b'), 'c');
            expect(actual).to.be.instanceof(BinaryOp)
            expect(actual.operator).to.equal('-');
            expect(actual.leftOperand).to.be.instanceof(BinaryOp);
            expect(actual.leftOperand.operator).to.equal('*');
            expect(actual.leftOperand.leftOperand).to.equal('a');
            expect(actual.leftOperand.rightOperand).to.equal('b');
            expect(actual.rightOperand).to.equal('c');
        });
        it("should right-associate operators of higher precedence than the left-operand's operator", function () {
            var actual = balanceOperation('*', BinaryOp('+', 'x', 'y'), 'z');
            expect(actual).to.be.instanceof(BinaryOp)
            expect(actual.operator).to.equal('+');
            expect(actual.leftOperand).to.equal('x');
            expect(actual.rightOperand).to.be.instanceof(BinaryOp);
            expect(actual.rightOperand.operator).to.equal('*');
            expect(actual.rightOperand.leftOperand).to.equal('y');
            expect(actual.rightOperand.rightOperand).to.equal('z');
        });
        it("should right-associate operators of higher precedence than the left-operand's operator", function () {
            var actual = balanceOperation('^', BinaryOp('/', 1, 2), 3);
            expect(actual).to.be.instanceof(BinaryOp)
            expect(actual.operator).to.equal('/');
            expect(actual.leftOperand).to.equal(1);
            expect(actual.rightOperand).to.be.instanceof(BinaryOp);
            expect(actual.rightOperand.operator).to.equal('^');
            expect(actual.rightOperand.leftOperand).to.equal(2);
            expect(actual.rightOperand.rightOperand).to.equal(3);
        });
    });
    describe('.parse()', function () {
        var parse = parser.parse;

        it('should parse definitions', function () {
            var actual = parse('x = 3');
            expect(actual).to.be.instanceof(Definition);
            expect(actual.name).to.equal('x');
            expect(actual.value).to.equal(3);
        });

        it('should convert number literals into Numbers', function () {
            var actual = parse('52');
            expect(actual).to.equal(52);
        });
        it('should leave variables as strings', function () {
            var actual = parse('x');
            expect(actual).to.equal('x');
        });
        it('should implicitly multiply numbers beside variables', function () {
            var actual = parse('3x');
            expect(actual).to.be.instanceof(BinaryOp);
            expect(actual.operator).to.equal('*');
            expect(actual.leftOperand).to.equal(3);
            expect(actual.rightOperand).to.equal('x');
        });
        it('should implicitly multiply variables beside numbers', function () {
            var actual = parse('x3');
            expect(actual).to.be.instanceof(BinaryOp);
            expect(actual.operator).to.equal('*');
            expect(actual.leftOperand).to.equal('x');
            expect(actual.rightOperand).to.equal(3);
        });
        it('should parse unary operators', function () {
            var actual = parse('-x');
            expect(actual).to.be.instanceof(UnaryOp);
            expect(actual.operator).to.equal('-');
            expect(actual.operand).to.equal('x');
        });
        it('should parse binary operators', function () {
            var actual = parse('x~13');
            expect(actual).to.be.instanceof(BinaryOp);
            expect(actual.operator).to.equal('~');
            expect(actual.leftOperand).to.equal('x');
            expect(actual.rightOperand).to.equal(13);
        });
        it('should in-line parenthetical expressions', function () {
            var actual = parse('( x + 3 )');
            expect(actual).to.be.instanceof(BinaryOp);
            expect(actual.operator).to.equal('+');
            expect(actual.leftOperand).to.equal('x');
            expect(actual.rightOperand).to.equal(3);
        });
        it('should maintain operator precedence', function () {
            var actual = parse('x + 3 * y');
            expect(actual).to.be.instanceof(BinaryOp);
            expect(actual.operator).to.equal('+');
            expect(actual.leftOperand).to.equal('x');
            expect(actual.rightOperand).to.be.instanceof(BinaryOp);
            expect(actual.rightOperand.operator).to.equal('*');
            expect(actual.rightOperand.leftOperand).to.equal(3);
            expect(actual.rightOperand.rightOperand).to.equal('y');
        });
        it('should prioritize parenthetical expressions over other operators', function () {
            var actual = parse('(x + 3) * y');
            expect(actual).to.be.instanceof(BinaryOp);
            expect(actual.operator).to.equal('*');
            expect(actual.rightOperand).to.equal('y');
            expect(actual.leftOperand).to.be.instanceof(BinaryOp);
            expect(actual.leftOperand.operator).to.equal('+');
            expect(actual.leftOperand.leftOperand).to.equal('x');
            expect(actual.leftOperand.rightOperand).to.equal(3);
        });
    });
});