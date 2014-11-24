var defaultPrecedences = require('./defaultOperatorPrecedences');

module.exports = function (operator, precedences) {
    precedences = precedences || defaultPrecedences;
    return precedences[operator] || 0;
};