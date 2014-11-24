var Operation = require('./Operation');

function BinaryOp(operator, leftOperand, rightOperand) {
    if (!(this instanceof BinaryOp)) {
        return new BinaryOp(operator, leftOperand, rightOperand);
    }
    this.operator = operator;
    this.leftOperand = leftOperand;
    this.rightOperand = rightOperand;
}

BinaryOp.prototype = new Operation(2);

BinaryOp.prototype.getOperands = function () {
    return [ this.leftOperand, this.rightOperand ];
};

BinaryOp.prototype.evaluate = function (scope) {
    var impl = scope.resolveBinaryOperation(this.operator),
        left = scope.resolve(this.leftOperand),
        right = scope.resolve(this.rightOperand);

    if (typeof impl === 'function' && scope.isLiteral(left) && scope.isLiteral(right)) { //TODO: types
        return impl(left, right);
    } else {
        return new BinaryOp(this.operator, left, right);
    }
};

BinaryOp.prototype.toString = function () {
    var expression = this.leftOperand + " " + this.operator + " " + this.rightOperand;
    if (this.isParenthetical) {
        expression = '(' + expression + ')';
    }
    return expression;
};

module.exports = BinaryOp;