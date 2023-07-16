var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import { Line } from '../../geometry';
import { normalizePoint, toResult } from './util';
export const line = (portsPositionArgs, elemBBox, groupPositionArgs) => {
    const start = normalizePoint(elemBBox, groupPositionArgs.start || elemBBox.getOrigin());
    const end = normalizePoint(elemBBox, groupPositionArgs.end || elemBBox.getCorner());
    return lineLayout(portsPositionArgs, start, end, groupPositionArgs);
};
export const left = (portsPositionArgs, elemBBox, groupPositionArgs) => {
    return lineLayout(portsPositionArgs, elemBBox.getTopLeft(), elemBBox.getBottomLeft(), groupPositionArgs);
};
export const right = (portsPositionArgs, elemBBox, groupPositionArgs) => {
    return lineLayout(portsPositionArgs, elemBBox.getTopRight(), elemBBox.getBottomRight(), groupPositionArgs);
};
export const top = (portsPositionArgs, elemBBox, groupPositionArgs) => {
    return lineLayout(portsPositionArgs, elemBBox.getTopLeft(), elemBBox.getTopRight(), groupPositionArgs);
};
export const bottom = (portsPositionArgs, elemBBox, groupPositionArgs) => {
    return lineLayout(portsPositionArgs, elemBBox.getBottomLeft(), elemBBox.getBottomRight(), groupPositionArgs);
};
function lineLayout(portsPositionArgs, p1, p2, groupPositionArgs) {
    const line = new Line(p1, p2);
    const length = portsPositionArgs.length;
    return portsPositionArgs.map((_a, index) => {
        var { strict } = _a, offset = __rest(_a, ["strict"]);
        const ratio = strict || groupPositionArgs.strict
            ? (index + 1) / (length + 1)
            : (index + 0.5) / length;
        const p = line.pointAt(ratio);
        if (offset.dx || offset.dy) {
            p.translate(offset.dx || 0, offset.dy || 0);
        }
        return toResult(p.round(), 0, offset);
    });
}
//# sourceMappingURL=line.js.map