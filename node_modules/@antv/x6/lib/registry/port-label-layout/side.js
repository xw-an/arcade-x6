"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bottom = exports.top = exports.right = exports.left = exports.manual = void 0;
var util_1 = require("./util");
var manual = function (portPosition, elemBBox, args) { return (0, util_1.toResult)({ position: elemBBox.getTopLeft() }, args); };
exports.manual = manual;
var left = function (portPosition, elemBBox, args) {
    return (0, util_1.toResult)({
        position: { x: -15, y: 0 },
        attrs: { '.': { y: '.3em', 'text-anchor': 'end' } },
    }, args);
};
exports.left = left;
var right = function (portPosition, elemBBox, args) {
    return (0, util_1.toResult)({
        position: { x: 15, y: 0 },
        attrs: { '.': { y: '.3em', 'text-anchor': 'start' } },
    }, args);
};
exports.right = right;
var top = function (portPosition, elemBBox, args) {
    return (0, util_1.toResult)({
        position: { x: 0, y: -15 },
        attrs: { '.': { 'text-anchor': 'middle' } },
    }, args);
};
exports.top = top;
var bottom = function (portPosition, elemBBox, args) {
    return (0, util_1.toResult)({
        position: { x: 0, y: 15 },
        attrs: { '.': { y: '.6em', 'text-anchor': 'middle' } },
    }, args);
};
exports.bottom = bottom;
//# sourceMappingURL=side.js.map