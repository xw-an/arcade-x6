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
exports.normal = void 0;
var geometry_1 = require("../../geometry");
var normal = function (sourcePoint, targetPoint, routePoints, options) {
    if (options === void 0) { options = {}; }
    var points = __spreadArray(__spreadArray([sourcePoint], routePoints, true), [targetPoint], false);
    var polyline = new geometry_1.Polyline(points);
    var path = new geometry_1.Path(polyline);
    return options.raw ? path : path.serialize();
};
exports.normal = normal;
//# sourceMappingURL=normal.js.map