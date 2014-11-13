var parseExpression = require('./index').parseExpression,
    readline = require('readline'),
    interface = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

interface.on('line', function (expression) {
    if (expression.length === 0) {
        process.exit(0);
    } else {
        var value = parseExpression(expression);
        console.log('Result: ' + value);
        interface.prompt();
    }
});

console.log('Enter expressions, or a blank line to quit:');
interface.setPrompt('> ');
interface.prompt();