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
Object.defineProperty(exports, "__esModule", { value: true });
exports.toResult = exports.normalizePoint = void 0;
var util_1 = require("../../util");
var geometry_1 = require("../../geometry");
function normalizePoint(bbox, args) {
    if (args === void 0) { args = {}; }
    return new geometry_1.Point(util_1.NumberExt.normalizePercentage(args.x, bbox.width), util_1.NumberExt.normalizePercentage(args.y, bbox.height));
}
exports.normalizePoint = normalizePoint;
function toResult(point, angle, rawArgs) {
    return __assign({ angle: angle, position: point.toJSON() }, rawArgs);
}
exports.toResult = toResult;
//# sourceMappingURL=util.js.map