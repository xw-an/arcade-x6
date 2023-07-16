"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.oneSide = void 0;
var util_1 = require("../../util");
/**
 * Routes the edge always to/from a certain side
 */
var oneSide = function (vertices, options, edgeView) {
    var side = options.side || 'bottom';
    var padding = util_1.NumberExt.normalizeSides(options.padding || 40);
    var sourceBBox = edgeView.sourceBBox;
    var targetBBox = edgeView.targetBBox;
    var sourcePoint = sourceBBox.getCenter();
    var targetPoint = targetBBox.getCenter();
    var coord;
    var dim;
    var factor;
    switch (side) {
        case 'top':
            factor = -1;
            coord = 'y';
            dim = 'height';
            break;
        case 'left':
            factor = -1;
            coord = 'x';
            dim = 'width';
            break;
        case 'right':
            factor = 1;
            coord = 'x';
            dim = 'width';
            break;
        case 'bottom':
        default:
            factor = 1;
            coord = 'y';
            dim = 'height';
            break;
    }
    // Move the points from the center of the element to outside of it.
    sourcePoint[coord] += factor * (sourceBBox[dim] / 2 + padding[side]);
    targetPoint[coord] += factor * (targetBBox[dim] / 2 + padding[side]);
    // Make edge orthogonal (at least the first and last vertex).
    if (factor * (sourcePoint[coord] - targetPoint[coord]) > 0) {
        targetPoint[coord] = sourcePoint[coord];
    }
    else {
        sourcePoint[coord] = targetPoint[coord];
    }
    return __spreadArray(__spreadArray([sourcePoint.toJSON()], vertices, true), [targetPoint.toJSON()], false);
};
exports.oneSide = oneSide;
//# sourceMappingURL=oneside.js.map