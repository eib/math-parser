var Operation = require('./tree/Operation'),
    defaultBinaryOps = require('./ops/defaultBinaryOps'),
    defaultUnaryOps = require('./ops/defaultUnaryOps');

function Scope(variables) {
    if (!(this instanceof Scope)) {
        return new Scope(variables);
    }
    this.variables = variables || {};
    this.unaryOps = defaultUnaryOps;
    this.binaryOps = defaultBinaryOps;
    this.functions = {};
}

Scope.prototype.resolve = function (node) {
    if (typeof node === 'number') {
        return node;
    } else if (typeof node === 'string') {
        if (this.variables[node]) {
            return this.variables[node];
        } else {
            return node;
        }
    } else if (node instanceof Operation) {
        return node.evaluate(this);
    }
    throw new Error('Unsupported type: ' + node);
};

module.exports = Scope;