"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.midSide = void 0;
var util_1 = require("./util");
var middleSide = function (view, magnet, refPoint, options) {
    var bbox;
    var angle = 0;
    var center;
    var node = view.cell;
    if (options.rotate) {
        bbox = view.getUnrotatedBBoxOfElement(magnet);
        center = node.getBBox().getCenter();
        angle = node.getAngle();
    }
    else {
        bbox = view.getBBoxOfElement(magnet);
    }
    var padding = options.padding;
    if (padding != null && Number.isFinite(padding)) {
        bbox.inflate(padding);
    }
    if (options.rotate) {
        refPoint.rotate(angle, center);
    }
    var side = bbox.getNearestSideToPoint(refPoint);
    var result;
    switch (side) {
        case 'left':
            result = bbox.getLeftMiddle();
            break;
        case 'right':
            result = bbox.getRightMiddle();
            break;
        case 'top':
            result = bbox.getTopCenter();
            break;
        case 'bottom':
            result = bbox.getBottomCenter();
            break;
        default:
            break;
    }
    var direction = options.direction;
    if (direction === 'H') {
        if (side === 'top' || side === 'bottom') {
            if (refPoint.x <= bbox.x + bbox.width) {
                result = bbox.getLeftMiddle();
            }
            else {
                result = bbox.getRightMiddle();
            }
        }
    }
    else if (direction === 'V') {
        if (refPoint.y <= bbox.y + bbox.height) {
            result = bbox.getTopCenter();
        }
        else {
            result = bbox.getBottomCenter();
        }
    }
    return options.rotate ? result.rotate(-angle, center) : result;
};
/**
 * Places the anchor of the edge in the middle of the side of view bbox
 * closest to the other endpoint.
 */
exports.midSide = (0, util_1.resolve)(middleSide);
//# sourceMappingURL=middle-side.js.map