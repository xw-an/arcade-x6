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
exports.PortLabelLayout = void 0;
var registry_1 = require("../registry");
var layouts = __importStar(require("./main"));
var PortLabelLayout;
(function (PortLabelLayout) {
    PortLabelLayout.presets = layouts;
    PortLabelLayout.registry = registry_1.Registry.create({
        type: 'port label layout',
    });
    PortLabelLayout.registry.register(PortLabelLayout.presets, true);
})(PortLabelLayout = exports.PortLabelLayout || (exports.PortLabelLayout = {}));
//# sourceMappingURL=index.js.map