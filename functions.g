function    :=
    expression [ expression ]? ==> expression "*" expression

expression  :=
    unaryOperator expression
    expression binaryOperator expression
    parentheticalExpression
    functionExpression
    numberLiteral
    variable

parentheticalExpression :=
    "(" expression ")" ==> expression

unaryOperator   :=
    -
    +

binaryOperator  :=
    +
    -
    ^
    *
    /

variable   :=
    [a-zA-Z]

numberLiteral   :=
    digit [ decimal [ digit ]+ ]
    decimal digit+

digit   :=
    [0-9]

decimal :=
    .

functionExpression  :=
    functionName "(" expression ")"

functionName    :=
    [a-zA-Z]{2,}

functions:
    abs
    pow[er]
    sqrt
    logarithms:
        log /* log-base-10 */
        ln /* natural log */
    trig:
        cos
        sin
        tan
        atan
        asin
        acos
