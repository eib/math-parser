var parser = require('../lib/parser'),
    Scope = require('../lib/scope'),
    UnaryOp = require('../lib/tree/UnaryOp'),
    BinaryOp = require('../lib/tree/BinaryOp'),
    Definition = require('../lib/tree/Definition'),
    expect = require('chai').expect;

describe('Scope', function () {
    describe('.define()', function () {
        it('should add the variable to the .variables property', function () {
            var scope = new Scope();
            scope.define('x', 3);
            expect(scope.variables.x).to.equal(3);
        });
        it('should allow the Scope to resolve references to it', function () {
            var scope = new Scope();
            scope.define('x', 5);
            expect(scope.resolve('x')).to.equal(5);
        });
        it('should allow the Scope to resolve nested references to it', function () {
            var scope = new Scope();
            scope.define('x', 5);
            expect(scope.resolve(BinaryOp('+', 'x', 3))).to.equal(8);
        });
    });
    describe('.resolve()', function () {
        it('should resolve false-y variable values', function () {
            var scope = new Scope();
            scope.define('x', 0);
            expect(scope.resolve('x')).to.equal(0);
        });
        it('should add definitions to the scope', function () {
            var scope = new Scope();
            scope.resolve(new Definition('x', 3));
            expect(scope.variables.x).to.equal(3);
        });
        it('should resolve definitions to their values', function () {
            var scope = new Scope(),
                x = scope.resolve(new Definition('x', 3)),
                y = scope.resolve(new Definition('y', 'x'));
            expect(x).to.equal(3);
            expect(y).to.equal(3);
            expect(scope.resolve('y')).to.equal(3);
        });
        it('should resolve variables that already have a definition', function () {
            var scope = new Scope();
            scope.resolve(new Definition('y', BinaryOp('+', BinaryOp('-', 'x', 6), 6)));
            scope.resolve(new Definition('x', 3));
            expect(scope.resolve('y')).to.equal(3);
        });
        it('should allow re-definition of variables', function () {
            var scope = new Scope(),
                actual;
            scope.resolve(new Definition('x', 3));
            scope.resolve(new Definition('y', 'x'));
            scope.resolve(new Definition('x', 5));
            expect(scope.resolve('y')).to.equal(5);
        });
        it('should resolve number literals', function () {
            var scope = new Scope();
            expect(scope.resolve(5)).to.equal(5);
        });
        it('should resolve variables with constant values', function () {
            var scope = new Scope();
            scope.variables.x = 42;
            expect(scope.resolve('x')).to.equal(42);
        });
        it('should resolve variables representing expressions', function () {
            var scope = new Scope();
            scope.variables.x = BinaryOp('*', 2, 3);
            expect(scope.resolve('x')).to.equal(6);
        });
        it('should resolve nested variables', function () {
            var scope = new Scope();
            scope.variables.x = 42;
            scope.variables.y = BinaryOp('+', 'x', 3);
            expect(scope.resolve('y')).to.equal(45);
        });
        it('should leave unknown variables symbolicated', function () {
            var scope = new Scope();
            expect(scope.resolve('x')).to.equal('x');
        });
        it('should evaluate unary operations', function () {
            var scope = new Scope();
            scope.unaryOps['-'] = function (value) {
                return -value;
            };
            expect(scope.resolve(new UnaryOp('-', 5))).to.equal(-5);
        });
        it('should evaluate binary operations', function () {
            var scope = new Scope();
            scope.binaryOps['-'] = function (x, y) {
                return x - y;
            };
            expect(scope.resolve(new BinaryOp('-', 3, 5))).to.equal(-2);
        });
    });
});