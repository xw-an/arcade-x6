import { Line } from '../../geometry';
import { resolve, getPointAtEdge } from '../node-anchor/util';
import { getClosestPoint } from './closest';
import { FunctionExt } from '../../util';
const orthogonal = function (view, magnet, refPoint, options) {
    const OFFSET = 1e6;
    const path = view.getConnection();
    const segmentSubdivisions = view.getConnectionSubdivisions();
    const vLine = new Line(refPoint.clone().translate(0, OFFSET), refPoint.clone().translate(0, -OFFSET));
    const hLine = new Line(refPoint.clone().translate(OFFSET, 0), refPoint.clone().translate(-OFFSET, 0));
    const vIntersections = vLine.intersect(path, {
        segmentSubdivisions,
    });
    const hIntersections = hLine.intersect(path, {
        segmentSubdivisions,
    });
    const intersections = [];
    if (vIntersections) {
        intersections.push(...vIntersections);
    }
    if (hIntersections) {
        intersections.push(...hIntersections);
    }
    if (intersections.length > 0) {
        return refPoint.closest(intersections);
    }
    if (options.fallbackAt != null) {
        return getPointAtEdge(view, options.fallbackAt);
    }
    return FunctionExt.call(getClosestPoint, this, view, magnet, refPoint, options);
};
export const orth = resolve(orthogonal);
//# sourceMappingURL=orth.js.map