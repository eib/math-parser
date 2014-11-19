var UnaryOp = require('../lib/tree/UnaryOp'),
    Scope = require('../lib/scope'),
    expect = require('chai').expect;

describe('UnaryOp', function () {
    describe('.evaluate()', function () {
        describe('when the operator is in-context', function () {
            var negative = function (value) {
                    return -value;
                };
            it('should evaluate number literals', function () {
                var op = UnaryOp('-', 5),
                    scope = new Scope();
                scope.unaryOps['-'] = negative;
                expect(op.evaluate(scope)).to.equal(-5);
            });
            it('should evaluate in-context variables', function () {
                var op = UnaryOp('-', 3),
                    scope = new Scope({ 'x': 3 });
                scope.unaryOps['-'] = negative;
                expect(op.evaluate(scope)).to.equal(-3);
            });
            it('should evaluate its operand', function () {
                var op = UnaryOp('-', UnaryOp('-', 3)),
                    scope = new Scope();
                scope.unaryOps['-'] = negative;
                expect(op.evaluate(scope)).to.equal(3);
            });
        });
        describe('when the operator is out-of-context', function () {
            it('should evaluate its operand', function () {
                var op = UnaryOp('~', 'x'),
                    scope = new Scope({ x: 14 }),
                    actual;
                actual = op.evaluate(scope);
                expect(actual).to.be.instanceof(UnaryOp);
                expect(actual.operator).to.equal('~');
                expect(actual.operand).to.equal(14);
            });
        });
    });
});