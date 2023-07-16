import { NumberExt } from '../../util';
export const center = createBBoxAnchor('center');
export const top = createBBoxAnchor('topCenter');
export const bottom = createBBoxAnchor('bottomCenter');
export const left = createBBoxAnchor('leftMiddle');
export const right = createBBoxAnchor('rightMiddle');
export const topLeft = createBBoxAnchor('topLeft');
export const topRight = createBBoxAnchor('topRight');
export const bottomLeft = createBBoxAnchor('bottomLeft');
export const bottomRight = createBBoxAnchor('bottomRight');
function createBBoxAnchor(method) {
    return function (view, magnet, ref, options = {}) {
        const bbox = options.rotate
            ? view.getUnrotatedBBoxOfElement(magnet)
            : view.getBBoxOfElement(magnet);
        const result = bbox[method];
        result.x += NumberExt.normalizePercentage(options.dx, bbox.width);
        result.y += NumberExt.normalizePercentage(options.dy, bbox.height);
        const cell = view.cell;
        return options.rotate
            ? result.rotate(-cell.getAngle(), cell.getBBox().getCenter())
            : result;
    };
}
//# sourceMappingURL=bbox.js.map