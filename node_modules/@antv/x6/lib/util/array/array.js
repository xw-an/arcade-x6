"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.max = exports.difference = exports.groupBy = exports.sortBy = exports.sortedIndexBy = exports.sortedIndex = exports.union = exports.uniq = exports.isArrayLike = exports.isArray = void 0;
var lodash_es_1 = require("lodash-es");
Object.defineProperty(exports, "isArray", { enumerable: true, get: function () { return lodash_es_1.isArray; } });
Object.defineProperty(exports, "isArrayLike", { enumerable: true, get: function () { return lodash_es_1.isArrayLike; } });
Object.defineProperty(exports, "uniq", { enumerable: true, get: function () { return lodash_es_1.uniq; } });
Object.defineProperty(exports, "union", { enumerable: true, get: function () { return lodash_es_1.union; } });
Object.defineProperty(exports, "sortedIndex", { enumerable: true, get: function () { return lodash_es_1.sortedIndex; } });
Object.defineProperty(exports, "sortedIndexBy", { enumerable: true, get: function () { return lodash_es_1.sortedIndexBy; } });
Object.defineProperty(exports, "sortBy", { enumerable: true, get: function () { return lodash_es_1.sortBy; } });
Object.defineProperty(exports, "groupBy", { enumerable: true, get: function () { return lodash_es_1.groupBy; } });
Object.defineProperty(exports, "difference", { enumerable: true, get: function () { return lodash_es_1.difference; } });
Object.defineProperty(exports, "max", { enumerable: true, get: function () { return lodash_es_1.max; } });
__exportStar(require("./diff"), exports);
//# sourceMappingURL=array.js.map