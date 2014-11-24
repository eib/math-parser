var parser = require('../lib/parser'),
    Scope = require('../lib/scope'),
    UnaryOp = require('../lib/tree/UnaryOp'),
    BinaryOp = require('../lib/tree/BinaryOp'),
    Definition = require('../lib/tree/Definition'),
    FunctionDefinition = require('../lib/tree/FunctionDefinition'),
    FunctionCall = require('../lib/tree/FunctionCall'),
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
        it('should store Definitions by name and value', function () {
            var scope = new Scope();
            scope.define(new Definition('x', 5));
            expect(scope.resolve('x')).to.equal(5);
        });
        it('should store FunctionDefinitions by name and function implementation', function () {
            var scope = new Scope(),
                def = FunctionDefinition('g', ['x', 'y'], function (x, y) { return x - y; }),
                impl;
            scope.define(def);
            impl = scope.resolve('g');
            expect(typeof impl).to.equal('function');
            expect(impl(101, 50)).to.equal(51);
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
        it('should resolve definitions to themselves', function () {
            var scope = new Scope(),
                def = new Definition('x', 3),
                actual = scope.resolve(def);
            expect(actual).to.equal(def);
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
        it('should evaluate known function calls with no args', function () {
            var scope = new Scope(),
                def = FunctionDefinition('g', [], function () { return 2; }),
                call = FunctionCall('g'),
                actual;
            scope.define(def);
            actual = scope.resolve(call);
            expect(actual).to.equal(2);
        });
        it('should evaluate known function calls with resolvable args', function () {
            var scope = new Scope(),
                def = FunctionDefinition('g', ['x', 'y'], function (x, y) { return x * 2 + 3 * y; }),
                call = FunctionCall('g', [1, 4]),
                actual;
            scope.define(def);
            actual = scope.resolve(call);
            expect(actual).to.equal(14);
        });
        it('should leave unknown function calls symbolic', function () {
            var scope = new Scope(),
                call = FunctionCall('g', []),
                actual;
            actual = scope.resolve(call);
            expect(actual).to.be.instanceOf(FunctionCall);
            expect(actual.name).to.equal('g');
            expect(actual.parameters).to.deep.equal([]);
        });
        it('should resolve args for unresolvable function calls', function () {
            var scope = new Scope(),
                call = FunctionCall('goo', [ BinaryOp('+', 3, 'x'), UnaryOp('-', 5), BinaryOp('*', 2, 3) ]),
                actual;
            scope.define('x', 2);
            actual = scope.resolve(call);
            expect(actual).to.be.instanceOf(FunctionCall);
            expect(actual.name).to.equal('goo');
            expect(actual.parameters).to.deep.equal([5, -5, 6]);
        });
        it('should resolve function aliases', function () {
            var scope = new Scope(),
                funcDef = FunctionDefinition('f', ['x'], function (x) { return -x; }), //f(x) = -x
                alias1Def = FunctionDefinition.fromExpression('g', FunctionCall('f', ['y']), ['y']), //g(y) = f(y)
                alias2Def = FunctionDefinition.fromExpression('h', FunctionCall('g', ['z']), ['z']), //h(z) = g(z)
                call = FunctionCall('h', [5]), //h(5) ... should be -5
                actual;
            scope.define(funcDef);
            scope.define(alias1Def);
            scope.define(alias2Def);
            actual = scope.resolve(call);
            expect(actual).to.equal(-5);
        });
    });

    describe('.isLiteral()', function () {
        it('should return true for numbers', function () {
            var scope = new Scope();
            expect(scope.isLiteral(3)).to.equal(true);
        });
        it('should return false for strings', function () {
            var scope = new Scope();
            expect(scope.isLiteral('a')).to.equal(false);
        });
    });
});