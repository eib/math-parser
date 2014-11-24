var Operation = require('./tree/Operation'),
    Definition = require('./tree/Definition'),
    FunctionCall = require('./tree/FunctionCall'),
    defaultBinaryOps = require('./defaults/defaultBinaryOps'),
    defaultUnaryOps = require('./defaults/defaultUnaryOps'),
    defaultVariables = require('./defaults/defaultVariables');

function Scope(variableDefs) {
    if (!(this instanceof Scope)) {
        return new Scope(variableDefs);
    }
    this.variables = variableDefs || {};
    this.unaryOps = defaultUnaryOps;
    this.binaryOps = defaultBinaryOps;
    var self = this;
    defaultVariables.forEach(function (def) {
        self.define(def);
    });
}

Scope.prototype.copy = function () {
    var copy = new Scope(this.variables);
    copy.unaryOps = this.unaryOps;
    copy.binaryOps = this.binaryOps;
    return copy;
};

Scope.prototype.define = function (nameOrDef, value) {
    var def,
        name;
    if (nameOrDef instanceof Definition) {
        def = nameOrDef;
        name = def.name;
        value = def.value;
    } else {
        name = nameOrDef;
    }
    this.variables[name] = value;
};

Scope.prototype.resolve = function (node) {
    if (this.isLiteral(node)) {
        return this.resolveLiteral(node);
    } else if (this.isVariableReference(node)) {
        return this.resolveVariable(node);
    } else if (this.isFunctionReference(node)) {
        return node;
    } else if (node instanceof Definition) {
        this.define(node);
        return this.resolveDefinition(node);
    } else if (node instanceof Operation) {
        return this.resolveOperation(node);
    } else if (node instanceof FunctionCall) {
        return this.resolveFunctionCall(node);
    }
    throw new Error('Unsupported type: ' + node);
};

Scope.prototype.resolveLiteral = function (number) {
    return number;
};

Scope.prototype.resolveVariable = function (name) {
    if (typeof this.variables[name] === 'undefined') {
        return name;
    } else {
        return this.resolve(this.variables[name]);
    }
};

Scope.prototype.resolveDefinition = function (def) {
    return def;
};

Scope.prototype.resolveOperation = function (operation) {
    return operation.evaluate(this);
};

Scope.prototype.resolveBinaryOperation = function (opName) {
    return this.binaryOps[opName];
};

Scope.prototype.resolveFunction = function (funcName) {
    return this.variables[funcName];
};

Scope.prototype.resolveFunctionCall = function (funcCall) {
    return funcCall.evaluate(this);
};

Scope.prototype.isLiteral = function (value) {
    return typeof value === 'number' ||
        typeof value === 'boolean';
};

Scope.prototype.isVariableReference = function (value) {
    return typeof value === 'string';
};

Scope.prototype.isFunctionReference = function (value) {
    return typeof value === 'function';
};

module.exports = Scope;