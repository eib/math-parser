function FunctionCall(name, parameters) {
    if (!(this instanceof FunctionCall)) {
        return new FunctionCall(name, parameters);
    }
    this.name = name;
    this.parameters = parameters || [];
}

FunctionCall.prototype.evaluate = function (scope) {
    var impl = scope.resolveFunction(this.name),
        actuals = this.parameters.map(function (param) {
            return scope.resolve(param);
        }),
        isResolvable = actuals.reduce(function (partialResult, next) {
            return partialResult && scope.isLiteral(next);
        }, true);
    if (typeof impl === 'function' /* && impl.length === actuals.length */ && isResolvable) {
        return impl.apply(scope, actuals);
    } else {
        return new FunctionCall(this.name, actuals);
    }
};

FunctionCall.prototype.toString = function () {
    return this.name + '(' + this.parameters.join(', ') + ')';
};

module.exports = FunctionCall;