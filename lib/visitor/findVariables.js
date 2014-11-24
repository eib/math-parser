var Operation = require('../tree/Operation');

function findVariables(value, tempResults) {
    if (!tempResults) {
        tempResults = [];
    }
    if (typeof value === 'string') {
        tempResults.push(value);
    } else if (value instanceof Operation) {
        findOperationVariables(value, tempResults);
    } else {
        //number, etc?
    }
    return tempResults;
}

function findOperationVariables(operation, tempResults) {
    operation.getOperands().forEach(function (operand) {
        findVariables(operand, tempResults);
    });
}

module.exports = function (value) {
    var variables = findVariables(value),
        unique = variables.filter(function (value, index, array) {
            return array.indexOf(value) === index;
        });
    unique.sort();
    return unique;
};