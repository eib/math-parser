var Scope = require('../lib/scope'),
    UnaryOp = require('../lib/tree/unaryOp'),
    BinaryOp = require('../lib/tree/binaryOp'),
    expect = require('chai').expect;

describe('Scope', function () {
    describe('.resolve()', function () {
        it('should resolve number literals', function () {
            var scope = new Scope();
            expect(scope.resolve(5)).to.equal(5);
        });
        it('should resolve known variables', function () {
            var scope = new Scope();
            scope.variables.x = 42;
            expect(scope.resolve('x')).to.equal(42);
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