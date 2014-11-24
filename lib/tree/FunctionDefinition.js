var Definition = require('./Definition'),
    findVariables = require('../visitor/findVariables');

/**
 * @param name {String} The name of the Function
 * @param parameterNames {Array} Names of the parameters variables (array of Strings)
 * @param impl {Function} The function implementation (will be called with a Scope as this-arg)
 * @returns {FunctionDefinition}
 * @constructor
 */
function FunctionDefinition(name, parameterNames, impl) {
    if (!(this instanceof FunctionDefinition)) {
        return new FunctionDefinition(name, parameterNames, impl);
    }
    this.name = name; //overrides Definition.name
    this.value = impl; //overrides Definition.value
    this.parameterNames = parameterNames;
    this.impl = impl;

    this.length = parameterNames.length;
    this.implString = '[native code]';
}

FunctionDefinition.prototype = new Definition();

/**
 * Creates a FunctionDefinition from some (parsed) expression Object:
 *   - number
 *   - string (variable name)
 *   - Operation
 *   - FunctionCall
 *
 * Note: Parameter names will be pulled form the expression tree (and sorted alphabetically), if necessary.
 *   For example, this expression:
 *      z^3 + 5x - y^2
 *   ... would create a function definition equivalent to this:
 *      f(x, y, z) = z^3 + 5x - y^2
 *
 * @param name The name of the Function
 * @param expression A function representation
 * @param parameters An array of parameter names (optional)
 * @returns {FunctionDefinition}
 */
FunctionDefinition.fromExpression = function (name, expression, parameters) {
    var params = parameters || findVariables(expression),
        impl = function (varargs) {
            var localScope = this.copy(), //impl's are called with the scope as this-arg
                ii;
            for (ii = 0; ii < params.length; ii++) {
                localScope.define(params[ii], arguments[ii]);
            }
            return localScope.resolve(expression);
        },
        def = new FunctionDefinition(name, params, impl);
    def.implString = expression.toString();
    return def;
};

FunctionDefinition.prototype.toString = function () {
    return this.name + '(' + this.parameterNames.join(', ') + ') = ' + this.implString;
};

module.exports = FunctionDefinition;