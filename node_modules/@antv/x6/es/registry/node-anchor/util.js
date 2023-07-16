import { NumberExt } from '../../util';
import { Point } from '../../geometry';
// eslint-disable-next-line
export function resolve(fn) {
    return function (view, magnet, ref, options) {
        if (ref instanceof Element) {
            const refView = this.graph.renderer.findViewByElem(ref);
            let refPoint;
            if (refView) {
                if (refView.isEdgeElement(ref)) {
                    const distance = options.fixedAt != null ? options.fixedAt : '50%';
                    refPoint = getPointAtEdge(refView, distance);
                }
                else {
                    refPoint = refView.getBBoxOfElement(ref).getCenter();
                }
            }
            else {
                refPoint = new Point();
            }
            return fn.call(this, view, magnet, refPoint, options);
        }
        return fn.apply(this, arguments); // eslint-disable-line
    };
}
export function getPointAtEdge(edgeView, value) {
    const isPercentage = NumberExt.isPercentage(value);
    const num = typeof value === 'string' ? parseFloat(value) : value;
    if (isPercentage) {
        return edgeView.getPointAtRatio(num / 100);
    }
    return edgeView.getPointAtLength(num);
}
//# sourceMappingURL=util.js.map