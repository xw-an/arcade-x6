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
exports.Marker = void 0;
var registry_1 = require("../registry");
var markers = __importStar(require("./main"));
var util_1 = require("./util");
var Marker;
(function (Marker) {
    Marker.presets = markers;
    Marker.registry = registry_1.Registry.create({
        type: 'marker',
    });
    Marker.registry.register(Marker.presets, true);
})(Marker = exports.Marker || (exports.Marker = {}));
(function (Marker) {
    Marker.normalize = util_1.normalize;
})(Marker = exports.Marker || (exports.Marker = {}));
//# sourceMappingURL=index.js.map