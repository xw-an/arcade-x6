import { normalizePoint, toResult } from './util';
export const absolute = (portsPositionArgs, elemBBox) => {
    return portsPositionArgs.map(({ x, y, angle }) => toResult(normalizePoint(elemBBox, { x, y }), angle || 0));
};
//# sourceMappingURL=absolute.js.map