"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rounded = void 0;
var geometry_1 = require("../../geometry");
var rounded = function (sourcePoint, targetPoint, routePoints, options) {
    if (options === void 0) { options = {}; }
    var path = new geometry_1.Path();
    path.appendSegment(geometry_1.Path.createSegment('M', sourcePoint));
    var f13 = 1 / 3;
    var f23 = 2 / 3;
    var radius = options.radius || 10;
    var prevDistance;
    var nextDistance;
    for (var i = 0, ii = routePoints.length; i < ii; i += 1) {
        var curr = geometry_1.Point.create(routePoints[i]);
        var prev = routePoints[i - 1] || sourcePoint;
        var next = routePoints[i + 1] || targetPoint;
        prevDistance = nextDistance || curr.distance(prev) / 2;
        nextDistance = curr.distance(next) / 2;
        var startMove = -Math.min(radius, prevDistance);
        var endMove = -Math.min(radius, nextDistance);
        var roundedStart = curr.clone().move(prev, startMove).round();
        var roundedEnd = curr.clone().move(next, endMove).round();
        var control1 = new geometry_1.Point(f13 * roundedStart.x + f23 * curr.x, f23 * curr.y + f13 * roundedStart.y);
        var control2 = new geometry_1.Point(f13 * roundedEnd.x + f23 * curr.x, f23 * curr.y + f13 * roundedEnd.y);
        path.appendSegment(geometry_1.Path.createSegment('L', roundedStart));
        path.appendSegment(geometry_1.Path.createSegment('C', control1, control2, roundedEnd));
    }
    path.appendSegment(geometry_1.Path.createSegment('L', targetPoint));
    return options.raw ? path : path.serialize();
};
exports.rounded = rounded;
//# sourceMappingURL=rounded.js.map