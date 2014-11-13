var Operation = require('./operation');

function BinaryOp(operator, leftOperand, rightOperand) {
    if (!(this instanceof BinaryOp)) {
        return new BinaryOp(operator, leftOperand, rightOperand);
    }
    this.operator = operator;
    this.leftOperand = leftOperand;
    this.rightOperand = rightOperand;
}

BinaryOp.prototype = new Operation(2);

BinaryOp.prototype.evaluate = function (scope) {
    var impl = scope.binaryOps[this.operator],
        left = scope.resolve(this.leftOperand),
        right = scope.resolve(this.rightOperand);

    if (typeof impl === 'function' && typeof left === 'number' && typeof right === 'number') {
        return impl(left, right);
    } else {
        return new BinaryOp(this.operator, left, right);
    }
};

BinaryOp.prototype.toString = function () {
    return "(" + this.leftOperand + " " + this.operator + " " + this.rightOperand + ")";
};

module.exports = BinaryOp;