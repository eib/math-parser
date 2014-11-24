module.exports = {
    '+': require('../ops/add'),
    '-': require('../ops/subtract'),
    '*': require('../ops/multiply'),
    '/': require('../ops/divide'),
    '^': require('../ops/power'),

    '&&': require('../ops/and'),
    '||': require('../ops/or'),
};