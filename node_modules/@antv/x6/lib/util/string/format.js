"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.titleCase = exports.sentenceCase = exports.pathCase = exports.dotCase = exports.constantCase = exports.pascalCase = exports.kebabCase = exports.camelCase = exports.upperFirst = exports.lowerFirst = void 0;
var lodash_es_1 = require("lodash-es");
var lodash_es_2 = require("lodash-es");
// kebabCase,
// startCase,
// snakeCase,
// lowerCase,
// upperCase,
// capitalize,
Object.defineProperty(exports, "lowerFirst", { enumerable: true, get: function () { return lodash_es_2.lowerFirst; } });
Object.defineProperty(exports, "upperFirst", { enumerable: true, get: function () { return lodash_es_2.upperFirst; } });
Object.defineProperty(exports, "camelCase", { enumerable: true, get: function () { return lodash_es_2.camelCase; } });
// @see: https://medium.com/@robertsavian/javascript-case-converters-using-lodash-4f2f964091cc
var cacheStringFunction = function (fn) {
    var cache = Object.create(null);
    return (function (str) {
        var hit = cache[str];
        return hit || (cache[str] = fn(str));
    });
};
exports.kebabCase = cacheStringFunction(function (s) {
    return s.replace(/\B([A-Z])/g, '-$1').toLowerCase();
});
exports.pascalCase = cacheStringFunction(function (s) {
    return (0, lodash_es_1.startCase)((0, lodash_es_1.camelCase)(s)).replace(/ /g, '');
});
exports.constantCase = cacheStringFunction(function (s) {
    return (0, lodash_es_1.upperCase)(s).replace(/ /g, '_');
});
exports.dotCase = cacheStringFunction(function (s) {
    return (0, lodash_es_1.lowerCase)(s).replace(/ /g, '.');
});
exports.pathCase = cacheStringFunction(function (s) {
    return (0, lodash_es_1.lowerCase)(s).replace(/ /g, '/');
});
exports.sentenceCase = cacheStringFunction(function (s) {
    return (0, lodash_es_1.upperFirst)((0, lodash_es_1.lowerCase)(s));
});
exports.titleCase = cacheStringFunction(function (s) {
    return (0, lodash_es_1.startCase)((0, lodash_es_1.camelCase)(s));
});
//# sourceMappingURL=format.js.map