var Definition = require('../tree/Definition'),
    FunctionDefinition = require('../tree/FunctionDefinition');

module.exports = [
    //Constants
    Definition('PI', Math.PI),
    Definition('EULER', Math.E),

    FunctionDefinition('random', [], Math.random),

    FunctionDefinition('sin', ['x'], Math.sin),
    FunctionDefinition('cos', ['x'], Math.cos),
    FunctionDefinition('tan', ['x'], Math.tan),
    FunctionDefinition('acos', ['x'], Math.acos),
    FunctionDefinition('asin', ['x'], Math.asin),
    FunctionDefinition('atan', ['x'], Math.atan),
    FunctionDefinition('atan2', ['x', 'y'], Math.atan2),

    FunctionDefinition('abs', ['x'], Math.abs),
    FunctionDefinition('ceil', ['x'], Math.ceil),
    FunctionDefinition('floor', ['x'], Math.floor),
    FunctionDefinition('round', ['x'], Math.round),
    FunctionDefinition('max', ['x', 'y'], Math.max),
    FunctionDefinition('min', ['x', 'y'], Math.min),

    FunctionDefinition('log', ['x'], Math.log),
    FunctionDefinition('power', ['x'], Math.pow),
    FunctionDefinition('sqrt', ['x'], Math.sqrt),
//    FunctionDefinition('exp', ['x'], Math.exp), //what is this?
];
