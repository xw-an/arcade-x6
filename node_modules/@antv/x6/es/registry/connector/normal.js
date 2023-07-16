import { Polyline, Path } from '../../geometry';
export const normal = function (sourcePoint, targetPoint, routePoints, options = {}) {
    const points = [sourcePoint, ...routePoints, targetPoint];
    const polyline = new Polyline(points);
    const path = new Path(polyline);
    return options.raw ? path : path.serialize();
};
//# sourceMappingURL=normal.js.map