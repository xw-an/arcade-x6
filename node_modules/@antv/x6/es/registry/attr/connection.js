const isEdgeView = (val, { view }) => {
    return view.cell.isEdge();
};
export const connection = {
    qualify: isEdgeView,
    set(val, args) {
        var _a, _b, _c, _d;
        const view = args.view;
        const reverse = (val.reverse || false);
        const stubs = (val.stubs || 0);
        let d;
        if (Number.isFinite(stubs) && stubs !== 0) {
            if (!reverse) {
                let offset;
                if (stubs < 0) {
                    const len = view.getConnectionLength() || 0;
                    offset = (len + stubs) / 2;
                }
                else {
                    offset = stubs;
                }
                const path = view.getConnection();
                if (path) {
                    const sourceParts = path.divideAtLength(offset);
                    const targetParts = path.divideAtLength(-offset);
                    if (sourceParts && targetParts) {
                        d = `${sourceParts[0].serialize()} ${targetParts[1].serialize()}`;
                    }
                }
            }
            else {
                let offset;
                let length;
                const len = view.getConnectionLength() || 0;
                if (stubs < 0) {
                    offset = (len + stubs) / 2;
                    length = -stubs;
                }
                else {
                    offset = stubs;
                    length = len - stubs * 2;
                }
                const path = view.getConnection();
                d = (_d = (_c = (_b = (_a = path === null || path === void 0 ? void 0 : path.divideAtLength(offset)) === null || _a === void 0 ? void 0 : _a[1]) === null || _b === void 0 ? void 0 : _b.divideAtLength(length)) === null || _c === void 0 ? void 0 : _c[0]) === null || _d === void 0 ? void 0 : _d.serialize();
            }
        }
        return { d: d || view.getConnectionPathData() };
    },
};
export const atConnectionLengthKeepGradient = {
    qualify: isEdgeView,
    set: atConnectionWrapper('getTangentAtLength', { rotate: true }),
};
export const atConnectionLengthIgnoreGradient = {
    qualify: isEdgeView,
    set: atConnectionWrapper('getTangentAtLength', { rotate: false }),
};
export const atConnectionRatioKeepGradient = {
    qualify: isEdgeView,
    set: atConnectionWrapper('getTangentAtRatio', { rotate: true }),
};
export const atConnectionRatioIgnoreGradient = {
    qualify: isEdgeView,
    set: atConnectionWrapper('getTangentAtRatio', { rotate: false }),
};
// aliases
// -------
export const atConnectionLength = atConnectionLengthKeepGradient;
export const atConnectionRatio = atConnectionRatioKeepGradient;
// utils
// -----
function atConnectionWrapper(method, options) {
    const zeroVector = { x: 1, y: 0 };
    return (value, args) => {
        let p;
        let angle;
        const view = args.view;
        const tangent = view[method](Number(value));
        if (tangent) {
            angle = options.rotate ? tangent.vector().vectorAngle(zeroVector) : 0;
            p = tangent.start;
        }
        else {
            p = view.path.start;
            angle = 0;
        }
        if (angle === 0) {
            return { transform: `translate(${p.x},${p.y}')` };
        }
        return {
            transform: `translate(${p.x},${p.y}') rotate(${angle})`,
        };
    };
}
//# sourceMappingURL=connection.js.map