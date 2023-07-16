"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.orth = void 0;
var geometry_1 = require("../../geometry");
var util_1 = require("../node-anchor/util");
var closest_1 = require("./closest");
var util_2 = require("../../util");
var orthogonal = function (view, magnet, refPoint, options) {
    var OFFSET = 1e6;
    var path = view.getConnection();
    var segmentSubdivisions = view.getConnectionSubdivisions();
    var vLine = new geometry_1.Line(refPoint.clone().translate(0, OFFSET), refPoint.clone().translate(0, -OFFSET));
    var hLine = new geometry_1.Line(refPoint.clone().translate(OFFSET, 0), refPoint.clone().translate(-OFFSET, 0));
    var vIntersections = vLine.intersect(path, {
        segmentSubdivisions: segmentSubdivisions,
    });
    var hIntersections = hLine.intersect(path, {
        segmentSubdivisions: segmentSubdivisions,
    });
    var intersections = [];
    if (vIntersections) {
        intersections.push.apply(intersections, vIntersections);
    }
    if (hIntersections) {
        intersections.push.apply(intersections, hIntersections);
    }
    if (intersections.length > 0) {
        return refPoint.closest(intersections);
    }
    if (options.fallbackAt != null) {
        return (0, util_1.getPointAtEdge)(view, options.fallbackAt);
    }
    return util_2.FunctionExt.call(closest_1.getClosestPoint, this, view, magnet, refPoint, options);
};
exports.orth = (0, util_1.resolve)(orthogonal);
//# sourceMappingURL=orth.js.map