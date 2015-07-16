var _ = require('lodash');

function rest(fn) {
    return function() {
        var args = [];
        for (var i = 0; i < arguments.length; i++) {
            args[i] = arguments[i];
        }
        fn.call(this, args);
    };
}

function equal(a, b) {
    return a == b;
}

module.exports = function() {
    return _.assign({
        '+': function(a, b) {
            return a + b;
        },
        '-': function(a, b) {
            return a - b;
        },
        '*': function(a, b) {
            return a * b;
        },
        '/': function(a, b) {
            return a / b;
        },
        '>': function(a, b) {
            return a > b;
        },
        '<': function(a, b) {
            return a < b;
        },
        '>=': function(a, b) {
            return a >= b;
        },
        '<=': function(a, b) {
            return a <= b;
        },
        '=': equal,
        'equal?': equal,
        'is?': function(a, b) {
            return a === b;
        },
        append: function() {
            return Array.prototype.concat.apply([], arguments);
        },
        apply: function(fn, args) {
            return fn.apply(this, args);
        },
        begin: function() {
            return arguments[arguments.length - 1];
        },
        car: function(l) {
            return l[0];
        },
        cdr: function(l) {
            return l.slice(1);
        },
        cons: function(a, b) {
            return [a].concat(b);
        },
        length: function(l) {
            return l.length;
        },
        list: rest(function(args) {
            return args;
        }),
        'list?': function(l) {
            return _.isArray(l);
        },
        'map': _.restParam(function(fn, lists) {
            // Optimize for only one list
            if (lists.length === 1) {
                return _.map(lists[0], _.ary(fn, 1));
            }
            // If more than one: zip the lists (expensive), map with fn.apply
            return _.map(_.zip(lists), _.bind(fn.apply, fn, this));
        }),
        not: function(a) {
            return !a;
        },
        'null?': function(a) {
            return a == [];
        },
        'number?': function(a) {
            return typeof a == "number";
        },
        'procedure?': function(a) {
            return typeof a == "function";
        },
        'symbol?': function(a) {
            return typeof a == "string";
        },
        '_find': function(name) {
            return name in this ? this : null;
        }
    }, _.pick(Math, _.intersection(_.functions(Math), _.keys(Math))));
};
