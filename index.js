var tokenizer = require('./lib/tokenizer'),
    TokenStream = require('./lib/tokenStream'),
    parser = require('./lib/parser'),
    Scope = require('./lib/scope');

module.exports = {
    parseExpression: function (string, variables) {
        var tokens = tokenizer.tokenize(string),
            stream = new TokenStream(tokens),
            expression = parser.parse(stream),
            scope = new Scope(variables);
        return scope.resolve(expression);
    },
};