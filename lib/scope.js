var Operation = require('./tree/Operation'),
    Definition = require('./tree/Definition'),
    defaultBinaryOps = require('./ops/defaultBinaryOps'),
    defaultUnaryOps = require('./ops/defaultUnaryOps');

function Scope(variableDefs) {
    if (!(this instanceof Scope)) {
        return new Scope(variableDefs);
    }
    this.variables = variableDefs || {};
    this.unaryOps = defaultUnaryOps;
    this.binaryOps = defaultBinaryOps;
}

Scope.prototype.define = function (name, value) {
    //TODO: function support necessary?
    this.variables[name] = value;
};

Scope.prototype.resolve = function (node) {
    if (typeof node === 'number') {
        return this.resolveLiteral(node);
    } else if (typeof node === 'string') {
        return this.resolveVariable(node);
    } else if (node instanceof Definition) {
        return this.resolveDefinition(node);
    } else if (node instanceof Operation) {
        return this.resolveOperation(node);
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
    this.define(def.name, def.value);
    return this.resolve(def.value);
};

Scope.prototype.resolveOperation = function (operation) {
    return operation.evaluate(this);
};

module.exports = Scope;