function Operation(arity) {
    this.arity = arity;
}

Operation.prototype.getOperands = function () {
    throw new Error('Not implemented');
};

Operation.prototype.evaluate = function (scope) {
    throw new Error('Not implemented');
};

module.exports = Operation;