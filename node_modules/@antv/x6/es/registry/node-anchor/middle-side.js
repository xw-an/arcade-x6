import { resolve } from './util';
const middleSide = function (view, magnet, refPoint, options) {
    let bbox;
    let angle = 0;
    let center;
    const node = view.cell;
    if (options.rotate) {
        bbox = view.getUnrotatedBBoxOfElement(magnet);
        center = node.getBBox().getCenter();
        angle = node.getAngle();
    }
    else {
        bbox = view.getBBoxOfElement(magnet);
    }
    const padding = options.padding;
    if (padding != null && Number.isFinite(padding)) {
        bbox.inflate(padding);
    }
    if (options.rotate) {
        refPoint.rotate(angle, center);
    }
    const side = bbox.getNearestSideToPoint(refPoint);
    let result;
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
    const direction = options.direction;
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
export const midSide = resolve(middleSide);
//# sourceMappingURL=middle-side.js.map