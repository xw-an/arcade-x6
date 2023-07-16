"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toDeferredBoolean = exports.toAsyncBoolean = exports.isAsync = exports.isAsyncLike = void 0;
function isAsyncLike(obj) {
    return typeof obj === 'object' && obj.then && typeof obj.then === 'function';
}
exports.isAsyncLike = isAsyncLike;
function isAsync(obj) {
    return obj != null && (obj instanceof Promise || isAsyncLike(obj));
}
exports.isAsync = isAsync;
function toAsyncBoolean() {
    var inputs = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        inputs[_i] = arguments[_i];
    }
    var results = [];
    inputs.forEach(function (arg) {
        if (Array.isArray(arg)) {
            results.push.apply(results, arg);
        }
        else {
            results.push(arg);
        }
    });
    var hasAsync = results.some(function (res) { return isAsync(res); });
    if (hasAsync) {
        var deferres = results.map(function (res) {
            return isAsync(res) ? res : Promise.resolve(res !== false);
        });
        return Promise.all(deferres).then(function (arr) {
            return arr.reduce(function (memo, item) { return item !== false && memo; }, true);
        });
    }
    return results.every(function (res) { return res !== false; });
}
exports.toAsyncBoolean = toAsyncBoolean;
function toDeferredBoolean() {
    var inputs = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        inputs[_i] = arguments[_i];
    }
    var ret = toAsyncBoolean(inputs);
    return typeof ret === 'boolean' ? Promise.resolve(ret) : ret;
}
exports.toDeferredBoolean = toDeferredBoolean;
//# sourceMappingURL=async.js.map