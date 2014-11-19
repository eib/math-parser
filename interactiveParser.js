var readline = require('readline'),
    Scope = require('./lib/scope'),
    parseExpression = require('./index').parse,
    scope = new Scope(),
    interface = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

interface.on('line', function (expression) {
    if (expression.length === 0) {
        process.exit(0);
    } else {
        var value = parseExpression(expression, scope);
        console.log('Result: ' + value);
        interface.prompt();
    }
});

console.log('Enter expressions, or a blank line to quit:');
interface.setPrompt('> ');
interface.prompt();