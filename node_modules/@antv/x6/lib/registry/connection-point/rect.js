"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rect = void 0;
var bbox_1 = require("./bbox");
var util_1 = require("./util");
var util_2 = require("../../util");
/**
 * Places the connection point at the intersection between the
 * link path end segment and the element's unrotated bbox.
 */
var rect = function (line, view, magnet, options, type) {
    var cell = view.cell;
    var angle = cell.isNode() ? cell.getAngle() : 0;
    if (angle === 0) {
        return util_2.FunctionExt.call(bbox_1.bbox, this, line, view, magnet, options, type);
    }
    var bboxRaw = view.getUnrotatedBBoxOfElement(magnet);
    if (options.stroked) {
        bboxRaw.inflate((0, util_1.getStrokeWidth)(magnet) / 2);
    }
    var center = bboxRaw.getCenter();
    var lineRaw = line.clone().rotate(angle, center);
    var intersections = lineRaw.setLength(1e6).intersect(bboxRaw);
    var p = intersections && intersections.length
        ? lineRaw.start.closest(intersections).rotate(-angle, center)
        : line.end;
    return (0, util_1.offset)(p, line.start, options.offset);
};
exports.rect = rect;
//# sourceMappingURL=rect.js.map