"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.closest = exports.getClosestPoint = void 0;
var geometry_1 = require("../../geometry");
var util_1 = require("../node-anchor/util");
var getClosestPoint = function (view, magnet, refPoint, options) {
    var closestPoint = view.getClosestPoint(refPoint);
    return closestPoint != null ? closestPoint : new geometry_1.Point();
};
exports.getClosestPoint = getClosestPoint;
exports.closest = (0, util_1.resolve)(exports.getClosestPoint);
//# sourceMappingURL=closest.js.map