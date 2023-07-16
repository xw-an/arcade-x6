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
exports.smooth = void 0;
var geometry_1 = require("../../geometry");
var smooth = function (sourcePoint, targetPoint, routePoints, options) {
    if (options === void 0) { options = {}; }
    var path;
    var direction = options.direction;
    if (routePoints && routePoints.length !== 0) {
        var points = __spreadArray(__spreadArray([sourcePoint], routePoints, true), [targetPoint], false);
        var curves = geometry_1.Curve.throughPoints(points);
        path = new geometry_1.Path(curves);
    }
    else {
        // If we have no route, use a default cubic bezier curve, cubic bezier
        // requires two control points, the control points have `x` midway
        // between source and target. This produces an S-like curve.
        path = new geometry_1.Path();
        path.appendSegment(geometry_1.Path.createSegment('M', sourcePoint));
        if (!direction) {
            direction =
                Math.abs(sourcePoint.x - targetPoint.x) >=
                    Math.abs(sourcePoint.y - targetPoint.y)
                    ? 'H'
                    : 'V';
        }
        if (direction === 'H') {
            var controlPointX = (sourcePoint.x + targetPoint.x) / 2;
            path.appendSegment(geometry_1.Path.createSegment('C', controlPointX, sourcePoint.y, controlPointX, targetPoint.y, targetPoint.x, targetPoint.y));
        }
        else {
            var controlPointY = (sourcePoint.y + targetPoint.y) / 2;
            path.appendSegment(geometry_1.Path.createSegment('C', sourcePoint.x, controlPointY, targetPoint.x, controlPointY, targetPoint.x, targetPoint.y));
        }
    }
    return options.raw ? path : path.serialize();
};
exports.smooth = smooth;
//# sourceMappingURL=smooth.js.map