var parser = require('../lib/parser'),
    TokenStream = require('../lib/tokenStream'),
    BinaryOp = require('../lib/tree/BinaryOp'),
    UnaryOp = require('../lib/tree/UnaryOp'),
    Definition = require('../lib/tree/Definition'),
    FunctionDefinition = require('../lib/tree/FunctionDefinition'),
    FunctionCall = require('../lib/tree/FunctionCall'),
    expect = require('chai').expect;

describe('Parser', function () {
    describe('.balanceOperation()', function () {
        var balanceOperation = parser.balanceOperation;

        it('should left-associate operators of equal precedence', function () {
            var actual = balanceOperation('-', BinaryOp('+', 'a', 'b'), 'c');
            expect(actual).to.be.instanceOf(BinaryOp);
            expect(actual.operator).to.equal('-');
            expect(actual.leftOperand).to.be.instanceOf(BinaryOp);
            expect(actual.leftOperand.operator).to.equal('+');
            expect(actual.leftOperand.leftOperand).to.equal('a');
            expect(actual.leftOperand.rightOperand).to.equal('b');
            expect(actual.rightOperand).to.equal('c');
        });
        it("should left-associate operators of lower precedence than the left-operand's operator", function () {
            var actual = balanceOperation('-', BinaryOp('*', 'a', 'b'), 'c');
            expect(actual).to.be.instanceOf(BinaryOp);
            expect(actual.operator).to.equal('-');
            expect(actual.leftOperand).to.be.instanceOf(BinaryOp);
            expect(actual.leftOperand.operator).to.equal('*');
            expect(actual.leftOperand.leftOperand).to.equal('a');
            expect(actual.leftOperand.rightOperand).to.equal('b');
            expect(actual.rightOperand).to.equal('c');
        });
        it("should right-associate operators of higher precedence than the left-operand's operator", function () {
            var actual = balanceOperation('*', BinaryOp('+', 'x', 'y'), 'z');
            expect(actual).to.be.instanceOf(BinaryOp);
            expect(actual.operator).to.equal('+');
            expect(actual.leftOperand).to.equal('x');
            expect(actual.rightOperand).to.be.instanceOf(BinaryOp);
            expect(actual.rightOperand.operator).to.equal('*');
            expect(actual.rightOperand.leftOperand).to.equal('y');
            expect(actual.rightOperand.rightOperand).to.equal('z');
        });
        it("should right-associate operators of higher precedence than the left-operand's operator", function () {
            var actual = balanceOperation('^', BinaryOp('/', 1, 2), 3);
            expect(actual).to.be.instanceOf(BinaryOp);
            expect(actual.operator).to.equal('/');
            expect(actual.leftOperand).to.equal(1);
            expect(actual.rightOperand).to.be.instanceOf(BinaryOp);
            expect(actual.rightOperand.operator).to.equal('^');
            expect(actual.rightOperand.leftOperand).to.equal(2);
            expect(actual.rightOperand.rightOperand).to.equal(3);
        });
    });
    describe('.parse()', function () {
        var parse = parser.parse;

        it('should parse definitions', function () {
            var actual = parse('x = 3');
            expect(actual).to.be.instanceOf(Definition);
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
            expect(actual).to.be.instanceOf(BinaryOp);
            expect(actual.operator).to.equal('*');
            expect(actual.leftOperand).to.equal(3);
            expect(actual.rightOperand).to.equal('x');
        });
        it('should implicitly multiply variables beside numbers', function () {
            var actual = parse('x3');
            expect(actual).to.be.instanceOf(BinaryOp);
            expect(actual.operator).to.equal('*');
            expect(actual.leftOperand).to.equal('x');
            expect(actual.rightOperand).to.equal(3);
        });
        it('should parse unary operators', function () {
            var actual = parse('-x');
            expect(actual).to.be.instanceOf(UnaryOp);
            expect(actual.operator).to.equal('-');
            expect(actual.operand).to.equal('x');
        });
        it('should parse binary operators', function () {
            var actual = parse('x~13');
            expect(actual).to.be.instanceOf(BinaryOp);
            expect(actual.operator).to.equal('~');
            expect(actual.leftOperand).to.equal('x');
            expect(actual.rightOperand).to.equal(13);
        });
        it('should in-line parenthetical expressions', function () {
            var actual = parse('( x + 3 )');
            expect(actual).to.be.instanceOf(BinaryOp);
            expect(actual.operator).to.equal('+');
            expect(actual.leftOperand).to.equal('x');
            expect(actual.rightOperand).to.equal(3);
        });
        it('should maintain operator precedence', function () {
            var actual = parse('x + 3 * y');
            expect(actual).to.be.instanceOf(BinaryOp);
            expect(actual.operator).to.equal('+');
            expect(actual.leftOperand).to.equal('x');
            expect(actual.rightOperand).to.be.instanceOf(BinaryOp);
            expect(actual.rightOperand.operator).to.equal('*');
            expect(actual.rightOperand.leftOperand).to.equal(3);
            expect(actual.rightOperand.rightOperand).to.equal('y');
        });
        it('should prioritize parenthetical expressions over other operators', function () {
            var actual = parse('(x + 3) * y');
            expect(actual).to.be.instanceOf(BinaryOp);
            expect(actual.operator).to.equal('*');
            expect(actual.rightOperand).to.equal('y');
            expect(actual.leftOperand).to.be.instanceOf(BinaryOp);
            expect(actual.leftOperand.operator).to.equal('+');
            expect(actual.leftOperand.leftOperand).to.equal('x');
            expect(actual.leftOperand.rightOperand).to.equal(3);
        });
        it('should parse function calls with no args', function () {
            var actual = parse('foo()')
            expect(actual).to.be.instanceOf(FunctionCall);
            expect(actual.name).to.equal('foo');
            expect(actual.parameters).to.deep.equal([]);
        });
        it('should parse function calls with literal and variable args', function () {
            var actual = parse('foo(3, x, 4)')
            expect(actual).to.be.instanceOf(FunctionCall);
            expect(actual.name).to.equal('foo');
            expect(actual.parameters).to.deep.equal([ 3, 'x', 4]);
        });
        it('should parse function calls with expression args', function () {
            var actual = parse('foo(3 * x, 2 - y)');
            expect(actual).to.be.instanceof(FunctionCall);
            expect(actual.name).to.equal('foo');
            expect(actual.parameters.length).to.equal(2);
            var first = actual.parameters[0],
                second = actual.parameters[1];
            expect(first).to.be.instanceOf(BinaryOp);
            expect(second).to.be.instanceOf(BinaryOp);
            expect(first.operator).to.equal('*');
            expect(first.leftOperand).to.equal(3);
            expect(first.rightOperand).to.equal('x');
            expect(second.operator).to.equal('-');
            expect(second.leftOperand).to.equal(2);
            expect(second.rightOperand).to.equal('y');
        });
        it('should parse function calls with function call args', function () {
            var foo = parse('foo(bar(batz(3)))'),
                bar,
                batz;
            expect(foo).to.be.instanceof(FunctionCall);
            expect(foo.name).to.equal('foo');
            expect(foo.parameters.length).to.equal(1);
            bar = foo.parameters[0];
            expect(bar).to.be.instanceof(FunctionCall);
            expect(bar.name).to.equal('bar');
            expect(bar.parameters.length).to.equal(1);
            batz = bar.parameters[0];
            expect(batz).to.be.instanceof(FunctionCall);
            expect(batz.name).to.equal('batz');
            expect(batz.parameters).to.deep.equal([3]);
        });
        it('should parse crazy function-call nesting', function () {
            var foo = parse('foo(bar(batz(3), quux(5)), wombat(7))'),
                bar,
                batz,
                quux,
                wombat;
            expect(foo).to.be.instanceof(FunctionCall);
            expect(foo.name).to.equal('foo');
            expect(foo.parameters.length).to.equal(2);

            bar = foo.parameters[0];
            expect(bar).to.be.instanceof(FunctionCall);
            expect(bar.name).to.equal('bar');
            expect(bar.parameters.length).to.equal(2);

            batz = bar.parameters[0];
            expect(batz).to.be.instanceof(FunctionCall);
            expect(batz.name).to.equal('batz');
            expect(batz.parameters).to.deep.equal([3]);

            quux = bar.parameters[1];
            expect(quux).to.be.instanceof(FunctionCall);
            expect(quux.name).to.equal('quux');
            expect(quux.parameters).to.deep.equal([5]);

            wombat = foo.parameters[1];
            expect(wombat).to.be.instanceof(FunctionCall);
            expect(wombat.name).to.equal('wombat');
            expect(wombat.parameters).to.deep.equal([7]);
        });

        it('should parse function definitions with no parameters', function () {
            var actual = parse('f() = 3');
            expect(actual).to.be.instanceOf(FunctionDefinition);
            expect(actual.name).to.equal('f');
            expect(actual.parameterNames).to.deep.equal([]);
        });
        it('should parse function definitions with multiple parameters', function () {
            var actual = parse('f(z, y, x) = 3');
            expect(actual).to.be.instanceOf(FunctionDefinition);
            expect(actual.name).to.equal('f');
            expect(actual.parameterNames).to.deep.equal(['z', 'y', 'x']);
        });
    });
});