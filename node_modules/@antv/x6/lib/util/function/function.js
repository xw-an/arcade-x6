"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cacher = exports.call = exports.apply = exports.defer = exports.debounce = exports.noop = exports.once = exports.isFunction = void 0;
var lodash_es_1 = require("lodash-es");
Object.defineProperty(exports, "isFunction", { enumerable: true, get: function () { return lodash_es_1.isFunction; } });
Object.defineProperty(exports, "once", { enumerable: true, get: function () { return lodash_es_1.once; } });
Object.defineProperty(exports, "noop", { enumerable: true, get: function () { return lodash_es_1.noop; } });
Object.defineProperty(exports, "debounce", { enumerable: true, get: function () { return lodash_es_1.debounce; } });
Object.defineProperty(exports, "defer", { enumerable: true, get: function () { return lodash_es_1.defer; } });
function apply(fn, ctx, args) {
    if (args) {
        switch (args.length) {
            case 0:
                return fn.call(ctx);
            case 1:
                return fn.call(ctx, args[0]);
            case 2:
                return fn.call(ctx, args[0], args[1]);
            case 3:
                return fn.call(ctx, args[0], args[1], args[2]);
            case 4:
                return fn.call(ctx, args[0], args[1], args[2], args[3]);
            case 5:
                return fn.call(ctx, args[0], args[1], args[2], args[3], args[4]);
            case 6:
                return fn.call(ctx, args[0], args[1], args[2], args[3], args[4], args[5]);
            default:
                return fn.apply(ctx, args);
        }
    }
    return fn.call(ctx);
}
exports.apply = apply;
function call(fn, ctx) {
    var args = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        args[_i - 2] = arguments[_i];
    }
    return apply(fn, ctx, args);
}
exports.call = call;
function repush(array, item) {
    for (var i = 0, ii = array.length; i < ii; i += 1) {
        if (array[i] === item) {
            return array.push(array.splice(i, 1)[0]);
        }
    }
}
function cacher(fn, ctx, postProcessor) {
    var keys = [];
    var cache = {};
    var f = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var hasCache = false;
        var key = args.join('\u2400');
        if (key in cache) {
            hasCache = true;
            repush(keys, key);
        }
        else {
            if (keys.length >= 1000) {
                delete cache[keys.shift()];
            }
            keys.push(key);
            cache[key] = apply(fn, ctx || null, args);
        }
        return postProcessor ? postProcessor(cache[key], hasCache) : cache[key];
    };
    return f;
}
exports.cacher = cacher;
//# sourceMappingURL=function.js.map