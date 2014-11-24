var Operation = require('./Operation');

function UnaryOp(operator, operand) {
    if (!(this instanceof UnaryOp)) {
        return new UnaryOp(operator, operand);
    }
    this.operator = operator;
    this.operand = operand;
}

UnaryOp.prototype = new Operation(1);

UnaryOp.prototype.getOperands = function () {
    return [ this.operand ];
};

UnaryOp.prototype.evaluate = function (scope) {
    var impl = scope.unaryOps[this.operator],
        operand = scope.resolve(this.operand);
    if (typeof impl === 'function' && scope.isLiteral(operand)) { //TODO: types
        return impl(operand);
    } else {
        return new UnaryOp(this.operator, operand);
    }
};

UnaryOp.prototype.toString = function () {
    return this.operator + this.operand;
};

module.exports = UnaryOp;