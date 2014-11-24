function kindOf(char) {
    if (/\s/.test(char)) {
        return 'whitespace';
    } else if (/[.0-9]/g.test(char)) {
        return 'numeric';
    } else if (/[a-zA-Z]/g.test(char)) {
        return 'alpha';
    } else if (char === '(') {
        return 'leftParen';
    } else if (char === ')') {
        return 'rightParen';
    } else if (char === ',') {
        return 'comma';
    } else {
        return 'operator';
    }
}

function tokenize(input) {
    var tokens = [],
        currentWord = [],
        char,
        kind,
        lastKind,
        ii;
    for (ii = 0; ii < input.length; ii++) {
        char = input[ii];
        kind = kindOf(char);
        if (kind !== lastKind) {
            if (currentWord.length > 0) {
                tokens.push(currentWord.join(''));
                currentWord = [];
            }
        }
        switch (kind) {
            case 'whitespace':
                break;
            case 'numeric':
                currentWord.push(char);
                break;
            case 'alpha':
                currentWord.push(char);
                break;
            case 'operator':
            case 'equal':
                currentWord.push(char);
                break;
            default:
                tokens.push(char);
                break;
        }
        lastKind = kind;
    }
    if (currentWord.length > 0) {
        tokens.push(currentWord.join(''));
    }
    return tokens;
}

module.exports = {
    tokenize: tokenize,
    kindOf: kindOf,
};