var tokenizer = require('./tokenizer'),
    UnaryOp = require('./tree/unaryOp'),
    BinaryOp = require('./tree/binaryOp');

function parseFunction(stream) {
    var expression = parseExpression(stream),
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
    return BinaryOp(operator, leftOperand, rightOperand);
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
        return nestedExpression; //TODO: doesn't maintain operator precedence
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

module.exports = { parse: parseFunction };