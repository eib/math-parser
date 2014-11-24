var FunctionDefinition = require('../lib/tree/FunctionDefinition'),
    FunctionCall = require('../lib/tree/FunctionCall'),
    Scope = require('../lib/scope'),
    BinaryOp = require('../lib/tree/BinaryOp'),
    expect = require('chai').expect;

describe('FunctionDefinition', function () {
    describe('.fromExpression()', function () {
        describe('when no parameters are specified', function () {
            it('should be empty when there are no variables', function () {
                var def = FunctionDefinition.fromExpression('foo', 42);
                expect(def.parameterNames).to.deep.equal([]);
            });
            it('should be a sorted array of variable names coming from the expression', function () {
                var def = FunctionDefinition.fromExpression('foo', BinaryOp('+', BinaryOp('*', 'x', 'v'), BinaryOp('-', 'z', 'y')));
                expect(def.parameterNames).to.deep.equal(['v', 'x', 'y', 'z']);
            });
            it('should be a unique array of variable names coming from the expression', function () {
                var def = FunctionDefinition.fromExpression('foo', BinaryOp('*', 'x', 'x'));
                expect(def.parameterNames).to.deep.equal(['x']);
            });
        });
        describe('when parameters are specified', function () {
            it('should preserve parameter names', function () {
                var def = FunctionDefinition.fromExpression('foo', 42, ['x', 'y', 'z']);
                expect(def.parameterNames).to.deep.equal(['x', 'y', 'z']);
            });
            it('should respect empty parameter names', function () {
                var def = FunctionDefinition.fromExpression('foo', 42, []);
                expect(def.parameterNames).to.deep.equal([]);
            });
        });

        it('should evaluate numeric literals', function () {
            var scope = new Scope(),
                def = FunctionDefinition.fromExpression('foo', 42),
                call = FunctionCall('foo'),
                actual;
            scope.define(def);
            actual = call.evaluate(scope);
            expect(actual).to.equal(42);
        });
        it('should evaluate Operations', function () {
            var scope = new Scope(),
                def = FunctionDefinition.fromExpression('foo', BinaryOp('+', 3, 'x')),
                call = FunctionCall('foo', [5]),
                actual;
            scope.define(def);
            actual = call.evaluate(scope);
            expect(actual).to.equal(8);
        });
        it('should display the expression in toString()', function () {
            var def = FunctionDefinition.fromExpression('f', BinaryOp('+', 'x', 3)),
                actual = def.toString();
            expect(actual).to.equal('f(x) = x + 3');
        });
    });
});