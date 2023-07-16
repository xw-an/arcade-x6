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
export const ellipse = (_a) => {
    var { rx, ry } = _a, attrs = __rest(_a, ["rx", "ry"]);
    const radiusX = rx || 5;
    const radiusy = ry || 5;
    return Object.assign(Object.assign({ cx: radiusX }, attrs), { tagName: 'ellipse', rx: radiusX, ry: radiusy });
};
//# sourceMappingURL=ellipse.js.map