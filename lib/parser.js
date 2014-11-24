var tokenizer = require('./tokenizer'),
    TokenStream = require('../lib/tokenStream'),
    UnaryOp = require('./tree/UnaryOp'),
    BinaryOp = require('./tree/BinaryOp'),
    Definition = require('./tree/Definition'),
    FunctionCall = require('./tree/FunctionCall'),
    FunctionDefinition = require('./tree/FunctionDefinition'),
    operatorPrecedence = require('./defaults/operatorPrecedence');

function parse(input) {
    var stream = input instanceof TokenStream ? input : new TokenStream(input);
    return parseAssignmentOrExpression(stream);
}

function parseAssignmentOrExpression(stream) {
    var expression = parseExpression(stream);
    if (isAssignmentOperator(stream.peek())) {
        return parseDefinition(stream, expression);
    } else {
        return parseExpressionBody(stream, expression);
    }
}

function parseDefinition(stream, term) {
    var assignmentOperator = stream.next(),
        body = parseExpressionBody(stream, parseExpression(stream));
    if (term instanceof FunctionCall) {
        return FunctionDefinition.fromExpression(term.name, body, term.parameters);
    } else {
        return new Definition(term, body);
    }
}

function parseExpressionBody(stream, expression) {
    while (!stream.isEnded()) {
        expression = parseBinaryExpression(stream, expression);
    }
    return expression;
}

function parseExpression(stream) {
    var token = stream.peek(),
        kind = tokenizer.kindOf(token);
    switch (kind) {
        case 'numeric':
            return parseNumberLiteral(stream);
        case 'alpha':
            return parseVariableOrFunctionCall(stream);
        case 'operator':
            return parseUnaryOperation(stream);
        case 'leftParen':
            return parseParentheticalExpression(stream);
        case 'comma':
            return parseComma(stream);
        default:
            throw new Error('Unsupported kind: ' + kind);
    }
}

function parseBinaryExpression(stream, leftOperand) {
    var operator,
        rightOperand,
        token = stream.peek(),
        kind = tokenizer.kindOf(token);

    switch (kind) {
        case 'numeric':
            operator = '*'; //implicit multiplication
            rightOperand = parseNumberLiteral(stream);
            break;
        case 'alpha':
            operator = '*'; //implicit multiplication
            rightOperand = parseVariable(stream);
            break;
        case 'operator':
            operator = stream.next();
            rightOperand = parseExpression(stream);
            break;
        case 'comma':
            return parseComma(stream);
        default:
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

function parseVariableOrFunctionCall(stream) {
    var name = parseVariable(stream),
        next = stream.peek(),
        nextKind = tokenizer.kindOf(next),
        args;
    if (nextKind === 'leftParen') {
        args = parseFunctionArgs(stream);
        return FunctionCall(name, args);
    } else {
        return name;
    }
}

function parseParentheticalExpression(stream) {
    var leftParen = stream.next(),
        nestedExpression = parseExpression(stream),
        rightParen;
    while (tokenizer.kindOf(stream.peek()) !== 'rightParen') {
        nestedExpression = parseBinaryExpression(stream, nestedExpression);
    }
    rightParen = stream.next();
    nestedExpression.isParenthetical = true;
    return nestedExpression;
}

function parseFunctionArgs(stream) {
    var leftParen = stream.next(),
        args = [],
        rightParen,
        nextToken,
        expression,
        lastExpression;

    for (nextToken = stream.peek(); tokenizer.kindOf(nextToken) !== 'rightParen'; nextToken = stream.peek()) {
        if (tokenizer.kindOf(nextToken) === 'comma') {
            parseComma(stream);
            if (expression) {
                args.push(expression);
                expression = null;
            }
        } else if (expression) {
            expression = parseBinaryExpression(stream, expression);
        } else {
            expression = parseExpression(stream);
        }
    }
    if (expression) {
        args.push(expression);
    }
    rightParen = stream.next();
    return args.filter(function (arg) {
        return !isCommaOperator(arg);
    });
}

function parseUnaryOperation(stream) {
    return UnaryOp(stream.next(), parseExpression(stream));
}

function parseNumberLiteral(stream) {
    return Number(stream.next());
}

function parseVariable(stream) {
    return stream.next();
}

function parseComma(stream) {
    return stream.next();
}

function isAssignmentOperator(token) {
    return token === '=';
}

function isCommaOperator(token) {
    return token === ',';
}

module.exports = {
    parse: parse,
    balanceOperation: balanceOperation,
};