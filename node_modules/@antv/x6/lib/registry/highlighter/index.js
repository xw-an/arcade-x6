"use strict";
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
exports.Highlighter = void 0;
var registry_1 = require("../registry");
var highlighters = __importStar(require("./main"));
var Highlighter;
(function (Highlighter) {
    function check(name, highlighter) {
        if (typeof highlighter.highlight !== 'function') {
            throw new Error("Highlighter '" + name + "' is missing required `highlight()` method");
        }
        if (typeof highlighter.unhighlight !== 'function') {
            throw new Error("Highlighter '" + name + "' is missing required `unhighlight()` method");
        }
    }
    Highlighter.check = check;
})(Highlighter = exports.Highlighter || (exports.Highlighter = {}));
(function (Highlighter) {
    Highlighter.presets = highlighters;
    Highlighter.registry = registry_1.Registry.create({
        type: 'highlighter',
    });
    Highlighter.registry.register(Highlighter.presets, true);
})(Highlighter = exports.Highlighter || (exports.Highlighter = {}));
//# sourceMappingURL=index.js.map