"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Attr = void 0;
var util_1 = require("../../util");
var registry_1 = require("../registry");
var raw_1 = require("./raw");
var attrs = __importStar(require("./main"));
var Attr;
(function (Attr) {
    function isValidDefinition(def, val, options) {
        if (def != null) {
            if (typeof def === 'string') {
                return true;
            }
            if (typeof def.qualify !== 'function' ||
                util_1.FunctionExt.call(def.qualify, this, val, options)) {
                return true;
            }
        }
        return false;
    }
    Attr.isValidDefinition = isValidDefinition;
})(Attr = exports.Attr || (exports.Attr = {}));
(function (Attr) {
    Attr.presets = __assign(__assign({}, raw_1.raw), attrs);
    Attr.registry = registry_1.Registry.create({
        type: 'attribute definition',
    });
    Attr.registry.register(Attr.presets, true);
})(Attr = exports.Attr || (exports.Attr = {}));
//# sourceMappingURL=index.js.map