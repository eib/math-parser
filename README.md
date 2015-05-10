Node module mathematic expression parser and evaluator.

### Features
* Operator-precedence: parentheses, exponents, multiplication/division, addition/subtraction
* Variable assignments: `x = 3`
* Function definitions: `f(x, y) = x * y`

### Built-ins
* Operators:
  * Addition and subtraction: `+  -`
  * Unary-negation: `-`
  * Multiplication and division: `* /`
  * Exponentiation: `^`
  * Boolean AND and OR operators: `&&  ||`
* Constants:
  * PI, E, true, false
* Functions:
  * `abs(x) ceil(x) floor(x) round(x) max(x, y) min(x, y)`
  * `log(x) power(x) sqrt(x)`
  * `sin(x) cos(x) tan(x) acos(x) asin(x) atan(x) atan2(x)`
  * `random()`

### Usage

Using the command-line parser:
```bash
$ node interactiveParser.js
Enter expressions, or a blank line to quit:
> 3 * 4
Result: 12
> x + 5
Result: x + 5
> x = 3
Result: x = 3
> x + 5
Result: 8
> f(x) = x + 15
Result: f(x) = x + 15
> f(2)
Result: 17
> ...
```


Using the node module:
```javascript
var parser = require('math-parser');

var expressions = [
  '3 * 4',
  '15 / 5',
  ...
];

expressions.forEach(function (expr) {
  console.log(expr + '  ==>  ' + parser.parse(expr));
});
```
