"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bbox = void 0;
var util_1 = require("./util");
/**
 * Places the connection point at the intersection between the edge
 * path end segment and the target node bbox.
 */
var bbox = function (line, view, magnet, options) {
    var bbox = view.getBBoxOfElement(magnet);
    if (options.stroked) {
        bbox.inflate((0, util_1.getStrokeWidth)(magnet) / 2);
    }
    var intersections = line.intersect(bbox);
    var p = intersections && intersections.length
        ? line.start.closest(intersections)
        : line.end;
    return (0, util_1.offset)(p, line.start, options.offset);
};
exports.bbox = bbox;
//# sourceMappingURL=bbox.js.map