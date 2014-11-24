var FunctionCall = require('../lib/tree/FunctionCall'),
    Scope = require('../lib/scope'),
    expect = require('chai').expect;

describe('FunctionCall', function () {
    describe('.toString()', function () {
        it('should include function name and parentheses when there are no args', function () {
            var funcCall = FunctionCall('foo');
            expect(funcCall.toString()).to.equal('foo()');
        });
        it('should separate parameters with commas', function () {
            var funcCall = FunctionCall('foo', ['x', 2, 3]);
            expect(funcCall.toString()).to.equal('foo(x, 2, 3)');
        });
    });

    describe('.evaluate()', function () {
        it('should return a FunctionCall when none of the parameters are defined, but the function is defined', function () {
            var scope = new Scope(),
                funcCall = FunctionCall('foo', ['a', 'b', 'c']),
                actual;
            scope.define('foo', function (x, y, z) {
                return x * y - z;
            });
            actual = funcCall.evaluate(scope);
            expect(actual).to.be.instanceOf(FunctionCall);
            expect(actual.name).to.equal('foo');
            expect(actual.parameters).to.deep.equal(['a', 'b', 'c']);
        });
        it('should return a FunctionCall when the function is not defined', function () {
            var scope = new Scope(),
                funcCall = FunctionCall('bar', ['a', 'b', 'c']),
                actual;
            scope.define('a', 10);
            scope.define('b', 2);
            scope.define('c', 3);
            actual = funcCall.evaluate(scope);
            expect(actual).to.be.instanceOf(FunctionCall);
            expect(actual.name).to.equal('bar');
            expect(actual.parameters).to.deep.equal([10, 2, 3]);
        });
        it('should evaluate the function when all of the parameters are literals and the function is defined', function () {
            var scope = new Scope(),
                funcCall = FunctionCall('foo', [3, 2, 1]),
                actual;

            scope.define('foo', function (x, y, z) {
                return x * y - z;
            });
            actual = funcCall.evaluate(scope);
            expect(actual).to.equal(5);
        });
        it('should evaluate the function when all of the parameters are resolvable and the function is defined', function () {
            var scope = new Scope(),
                funcCall = FunctionCall('foo', ['a', 'b', 'c']);

            scope.define('foo', function (x, y, z) {
                return x * y - z;
            });
            scope.define('a', 10);
            scope.define('b', 2);
            scope.define('c', 3);
            expect(funcCall.evaluate(scope)).to.equal(17);
        });
        it('should evaluate the function with the scope as this-arg', function () {
            var scope = new Scope(),
                funcCall = FunctionCall('foo', [3]);
            scope.define('foo', function (x) {
                expect(this).to.equal(scope);
                expect(x).to.equal(3);
                return 42;
            });
            expect(funcCall.evaluate(scope)).to.equal(42);
        });
    });
});