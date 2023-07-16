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
exports.eval = exports.uniqueId = exports.template = exports.truncate = exports.padStart = exports.padEnd = exports.pad = exports.repeat = exports.split = exports.endsWith = exports.startsWith = exports.unescape = exports.escape = exports.toString = exports.isString = void 0;
var lodash_es_1 = require("lodash-es");
Object.defineProperty(exports, "isString", { enumerable: true, get: function () { return lodash_es_1.isString; } });
Object.defineProperty(exports, "toString", { enumerable: true, get: function () { return lodash_es_1.toString; } });
Object.defineProperty(exports, "escape", { enumerable: true, get: function () { return lodash_es_1.escape; } });
Object.defineProperty(exports, "unescape", { enumerable: true, get: function () { return lodash_es_1.unescape; } });
Object.defineProperty(exports, "startsWith", { enumerable: true, get: function () { return lodash_es_1.startsWith; } });
Object.defineProperty(exports, "endsWith", { enumerable: true, get: function () { return lodash_es_1.endsWith; } });
Object.defineProperty(exports, "split", { enumerable: true, get: function () { return lodash_es_1.split; } });
Object.defineProperty(exports, "repeat", { enumerable: true, get: function () { return lodash_es_1.repeat; } });
Object.defineProperty(exports, "pad", { enumerable: true, get: function () { return lodash_es_1.pad; } });
Object.defineProperty(exports, "padEnd", { enumerable: true, get: function () { return lodash_es_1.padEnd; } });
Object.defineProperty(exports, "padStart", { enumerable: true, get: function () { return lodash_es_1.padStart; } });
Object.defineProperty(exports, "truncate", { enumerable: true, get: function () { return lodash_es_1.truncate; } });
Object.defineProperty(exports, "template", { enumerable: true, get: function () { return lodash_es_1.template; } });
Object.defineProperty(exports, "uniqueId", { enumerable: true, get: function () { return lodash_es_1.uniqueId; } });
var eval_1 = require("./eval");
Object.defineProperty(exports, "eval", { enumerable: true, get: function () { return eval_1.exec; } });
__exportStar(require("./format"), exports);
__exportStar(require("./hashcode"), exports);
__exportStar(require("./uuid"), exports);
__exportStar(require("./html"), exports);
__exportStar(require("./suggestion"), exports);
//# sourceMappingURL=string.js.map