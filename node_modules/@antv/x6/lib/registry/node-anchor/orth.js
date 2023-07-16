"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.orth = void 0;
var geometry_1 = require("../../geometry");
var util_1 = require("./util");
var orthogonal = function (view, magnet, refPoint, options) {
    var angle = view.cell.getAngle();
    var bbox = view.getBBoxOfElement(magnet);
    var result = bbox.getCenter();
    var topLeft = bbox.getTopLeft();
    var bottomRight = bbox.getBottomRight();
    var padding = options.padding;
    if (!Number.isFinite(padding)) {
        padding = 0;
    }
    if (topLeft.y + padding <= refPoint.y &&
        refPoint.y <= bottomRight.y - padding) {
        var dy = refPoint.y - result.y;
        result.x +=
            angle === 0 || angle === 180
                ? 0
                : (dy * 1) / Math.tan(geometry_1.Angle.toRad(angle));
        result.y += dy;
    }
    else if (topLeft.x + padding <= refPoint.x &&
        refPoint.x <= bottomRight.x - padding) {
        var dx = refPoint.x - result.x;
        result.y +=
            angle === 90 || angle === 270 ? 0 : dx * Math.tan(geometry_1.Angle.toRad(angle));
        result.x += dx;
    }
    return result;
};
/**
 * Tries to place the anchor of the edge inside the view bbox so that the
 * edge is made orthogonal. The anchor is placed along two line segments
 * inside the view bbox (between the centers of the top and bottom side and
 * between the centers of the left and right sides). If it is not possible
 * to place the anchor so that the edge would be orthogonal, the anchor is
 * placed at the center of the view bbox instead.
 */
exports.orth = (0, util_1.resolve)(orthogonal);
//# sourceMappingURL=orth.js.map