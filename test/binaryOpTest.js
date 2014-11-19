var BinaryOp = require('../lib/tree/BinaryOp'),
    Scope = require('../lib/scope'),
    expect = require('chai').expect;

describe('BinaryOp', function () {
    describe('.evaluate()', function () {
        describe('when the operator is in-context and both operands resolve to numbers', function () {
            var add = function (x, y) { return x + y; },
                scope = new Scope();

            scope.binaryOps['+'] = add;

            it('should evaluate to a number', function () {
                var op = new BinaryOp('+', 5, 11);
                expect(op.evaluate(scope)).to.equal(16);
            });
        });
        describe('when the operator is out-of-context', function () {
            it('should leave the operator symbolicated', function () {
                var op = new BinaryOp('~', 2, 3),
                    actual = op.evaluate(new Scope());
                expect(actual).to.be.instanceof(BinaryOp);
                expect(actual.operator).to.equal('~');
            });
            it('should resolve the operands', function () {
                var op = new BinaryOp('~', 'x', 'y'),
                    scope = new Scope(),
                    actual;
                scope.variables.x = 5;
                scope.variables.y = 2;
                actual = op.evaluate(scope);
                expect(actual.leftOperand).to.equal(5);
                expect(actual.rightOperand).to.equal(2);
            });
        });
    });
});