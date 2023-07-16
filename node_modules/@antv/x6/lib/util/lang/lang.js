"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isNumeric = exports.isWindow = exports.isFunction = exports.isArrayLike = exports.isArray = exports.isObject = exports.isBoolean = exports.isNumber = exports.isString = exports.isUndefined = exports.isNil = exports.isNull = void 0;
var lodash_es_1 = require("lodash-es");
Object.defineProperty(exports, "isNull", { enumerable: true, get: function () { return lodash_es_1.isNull; } });
Object.defineProperty(exports, "isNil", { enumerable: true, get: function () { return lodash_es_1.isNil; } });
Object.defineProperty(exports, "isUndefined", { enumerable: true, get: function () { return lodash_es_1.isUndefined; } });
Object.defineProperty(exports, "isString", { enumerable: true, get: function () { return lodash_es_1.isString; } });
Object.defineProperty(exports, "isNumber", { enumerable: true, get: function () { return lodash_es_1.isNumber; } });
Object.defineProperty(exports, "isBoolean", { enumerable: true, get: function () { return lodash_es_1.isBoolean; } });
Object.defineProperty(exports, "isObject", { enumerable: true, get: function () { return lodash_es_1.isObject; } });
Object.defineProperty(exports, "isArray", { enumerable: true, get: function () { return lodash_es_1.isArray; } });
Object.defineProperty(exports, "isArrayLike", { enumerable: true, get: function () { return lodash_es_1.isArrayLike; } });
Object.defineProperty(exports, "isFunction", { enumerable: true, get: function () { return lodash_es_1.isFunction; } });
var isWindow = function (value) {
    return value && value === value.window;
};
exports.isWindow = isWindow;
var isNumeric = function (value) {
    return !Array.isArray(value) && value - parseFloat(value) + 1 >= 0;
};
exports.isNumeric = isNumeric;
//# sourceMappingURL=lang.js.map