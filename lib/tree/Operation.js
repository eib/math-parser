function Operation(arity) {
    this.arity = arity;
}

Operation.prototype.evaluate = function (scope) {
    throw new Error('Not implemented');
};

module.exports = Operation;