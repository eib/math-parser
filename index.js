var tokenizer = require('./lib/tokenizer'),
    TokenStream = require('./lib/tokenStream'),
    parser = require('./lib/parser'),
    Scope = require('./lib/scope');

module.exports = {
    parse: function (string, scope) {
        var tokens = tokenizer.tokenize(string),
            stream = new TokenStream(tokens),
            expression = parser.parse(stream);
        scope = scope || new Scope();
        return scope.resolve(expression);
    }
};