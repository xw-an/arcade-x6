"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTargetAnchor = exports.getSourceAnchor = exports.getTargetBBox = exports.getSourceBBox = exports.getPaddingBox = exports.getPointBBox = void 0;
var util_1 = require("../../util");
var geometry_1 = require("../../geometry");
function getPointBBox(p) {
    return new geometry_1.Rectangle(p.x, p.y, 0, 0);
}
exports.getPointBBox = getPointBBox;
function getPaddingBox(options) {
    if (options === void 0) { options = {}; }
    var sides = util_1.NumberExt.normalizeSides(options.padding || 20);
    return {
        x: -sides.left,
        y: -sides.top,
        width: sides.left + sides.right,
        height: sides.top + sides.bottom,
    };
}
exports.getPaddingBox = getPaddingBox;
function getSourceBBox(view, options) {
    if (options === void 0) { options = {}; }
    return view.sourceBBox.clone().moveAndExpand(getPaddingBox(options));
}
exports.getSourceBBox = getSourceBBox;
function getTargetBBox(view, options) {
    if (options === void 0) { options = {}; }
    return view.targetBBox.clone().moveAndExpand(getPaddingBox(options));
}
exports.getTargetBBox = getTargetBBox;
function getSourceAnchor(view, options) {
    if (options === void 0) { options = {}; }
    if (view.sourceAnchor) {
        return view.sourceAnchor;
    }
    var bbox = getSourceBBox(view, options);
    return bbox.getCenter();
}
exports.getSourceAnchor = getSourceAnchor;
function getTargetAnchor(view, options) {
    if (options === void 0) { options = {}; }
    if (view.targetAnchor) {
        return view.targetAnchor;
    }
    var bbox = getTargetBBox(view, options);
    return bbox.getCenter();
}
exports.getTargetAnchor = getTargetAnchor;
//# sourceMappingURL=util.js.map