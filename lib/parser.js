var tokenizer = require('./tokenizer'),
    TokenStream = require('../lib/tokenStream'),
    UnaryOp = require('./tree/UnaryOp'),
    BinaryOp = require('./tree/binaryOp'),
    operatorPrecedence = require('./ops/operatorPrecedence');

function parseFunction(input) {
    var stream = input instanceof TokenStream ? input : new TokenStream(input),
        expression = parseExpression(stream),
        token,
        kind;
    while (!stream.isEnded()) {
        expression = parseBinaryExpression(stream, expression);
    }
    return expression;
}

function parseBinaryExpression(stream, leftOperand) {
    var operator,
        rightOperand,
        token = stream.next(),
        kind = tokenizer.kindOf(token);

    if (kind === 'numeric') {
        operator = '*'; //implicit multiplication
        rightOperand = parseNumberLiteral(token);
    } else if (kind === 'alpha') { //TODO: handle functions
        operator = '*'; //implicit multiplication
        rightOperand = parseVariable(token);
    } else if (kind === 'operator') {
        operator = token;
        rightOperand = parseExpression(stream);
    } else {
        throw new Error('Unsupported kind: ' + kind);
    }
    if (leftOperand instanceof BinaryOp && !leftOperand.isParenthetical) {
        return balanceOperation(operator, leftOperand, rightOperand);
    } else {
        return BinaryOp(operator, leftOperand, rightOperand);
    }
}

function hasHigherPrecedence(operator1, operator2) {
    return operatorPrecedence(operator1) > operatorPrecedence(operator2);
}

function balanceOperation(operator, leftOperand, rightOperand) {
    //expecting leftOperand to be a BinaryOp
    if (hasHigherPrecedence(operator, leftOperand.operator)) {
        return BinaryOp(leftOperand.operator, leftOperand.leftOperand, BinaryOp(operator, leftOperand.rightOperand, rightOperand));
    } else {
        return BinaryOp(operator, leftOperand, rightOperand);
    }
}

function parseExpression(stream) {
    var token = stream.next(),
        kind = tokenizer.kindOf(token);
    switch (kind) {
    case 'numeric':
        return parseNumberLiteral(token);
    case 'alpha':
        //TODO: handle function calls
        return token;
    case 'operator':
        return UnaryOp(token, parseExpression(stream));
    case 'leftParen':
        var nestedExpression = parseExpression(stream);
        while (tokenizer.kindOf(stream.peek()) !== 'rightParen') {
            nestedExpression = parseBinaryExpression(stream, nestedExpression);
        }
        var rightParen = stream.next();
        nestedExpression.isParenthetical = true;
        return nestedExpression;
    default:
        throw new Error('Unsupported kind: ' + kind);
    }
}

function parseNumberLiteral(token) {
    return Number(token);
}

function parseVariable(token) {
    return token;
};

module.exports = {
    parse: parseFunction,
    balanceOperation: balanceOperation,
};