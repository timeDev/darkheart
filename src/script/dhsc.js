var _ = require('lodash');

function makeProcedure(params, body, env) {
    return _.restParam(function(args) {
        return evaluate(body, new Env(params, args, env));
    });
}

function Env(params, args, outer) {
    _.assign(this, _.zipObject(params, args));
    this._outer = outer || null;
}

Env.prototype._find = function(name) {
    return name in this ? this : this._outer;
};

function tokenize(input) {
    // Replace '(' with ' ( ' and ')' with ' ) '
    return input.replace(/\(/g, ' ( ')
        .replace(/\)/g, ' ) ')
        .split(" ")
        .reverse()
        .filter(function(v) {
            return v !== "";
        });
}

function readFromTokens(tokens) {
    if (tokens.length < 1) {
        throw new Error("unexpected EOF");
    }
    var t = tokens.pop();
    if (t == '(') {
        var L = [];
        while (tokens[tokens.length - 1] != ')') {
            L.push(readFromTokens(tokens));
        }
        tokens.pop();
        return L;
    } else if (t == ')') {
        throw new Error("unexpected )");
    } else {
        return atom(t);
    }
}

function atom(token) {
    if (/^[+-]?[0-9]+(\.[0-9]+)?$/.test(token)) {
        return parseFloat(token);
    }
    // Else return symbol
    return token;
}

function evaluate(what, env) {
    env = env || require('./stdenv')();
    var expr, varname;
    if (typeof what == 'string') {
        // Symbol
        return env[what];
    } else if (!_.isArray(what)) {
        // Literal
        return what;
    } else if (what[0] == "quote") {
        return what[1];
    } else if (what[0] == "if") {
        //              test            then       else
        expr = evaluate(what[1], env) ? what[2] :  what[3];
        return evaluate(expr, env);
    } else if (what[0] == "define") {
        //  var                 expr
        env[what[1]] = evaluate(what[2], env);
    } else if (what[0] == "set!") {
        //        var      var                 expr
        env._find(what[1])[what[1]] = evaluate(what[2], env);
    } else if (what[0] == "lambda") {
        //                   params   body
        return makeProcedure(what[1], what[2], env);
    } else {
        var proc = evaluate(what[0], env),
            args = _(what)
            .rest()
            .map(function(a) {
                return evaluate(a, env);
            })
            .value();
        return proc.apply(this, args);
    }
}

module.exports = {
    tokenize: tokenize,
    readFromTokens: readFromTokens,
    evaluate: evaluate,
    exec: function(input, env) {
        return evaluate(readFromTokens(tokenize(input)), env);
    }
};
