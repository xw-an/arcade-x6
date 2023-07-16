import { NumberExt } from '../../util';
import { Rectangle } from '../../geometry';
export function getPointBBox(p) {
    return new Rectangle(p.x, p.y, 0, 0);
}
export function getPaddingBox(options = {}) {
    const sides = NumberExt.normalizeSides(options.padding || 20);
    return {
        x: -sides.left,
        y: -sides.top,
        width: sides.left + sides.right,
        height: sides.top + sides.bottom,
    };
}
export function getSourceBBox(view, options = {}) {
    return view.sourceBBox.clone().moveAndExpand(getPaddingBox(options));
}
export function getTargetBBox(view, options = {}) {
    return view.targetBBox.clone().moveAndExpand(getPaddingBox(options));
}
export function getSourceAnchor(view, options = {}) {
    if (view.sourceAnchor) {
        return view.sourceAnchor;
    }
    const bbox = getSourceBBox(view, options);
    return bbox.getCenter();
}
export function getTargetAnchor(view, options = {}) {
    if (view.targetAnchor) {
        return view.targetAnchor;
    }
    const bbox = getTargetBBox(view, options);
    return bbox.getCenter();
}
//# sourceMappingURL=util.js.map