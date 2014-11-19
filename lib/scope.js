var Operation = require('./tree/Operation'),
    Definition = require('./tree/Definition'),
    defaultBinaryOps = require('./ops/defaultBinaryOps'),
    defaultUnaryOps = require('./ops/defaultUnaryOps');

function Scope(variables) {
    if (!(this instanceof Scope)) {
        return new Scope(variables);
    }
    this.variables = variables || {};
    this.unaryOps = defaultUnaryOps;
    this.binaryOps = defaultBinaryOps;
}

Scope.prototype.addDefinition = function (def) {
    var name = def.name,
        value = def.value;
    this.variables[name] = value;
};

Scope.prototype.resolve = function (node) {
    if (typeof node === 'number') {
        return node;
    } else if (typeof node === 'string') {
        if (this.variables[node]) {
            return this.resolve(this.variables[node]);
        } else {
            return node;
        }
    } else if (node instanceof Definition) {
        this.addDefinition(node);
        return this.resolve(node.value);
    } else if (node instanceof Operation) {
        return node.evaluate(this);
    }
    throw new Error('Unsupported type: ' + node);
};

module.exports = Scope;