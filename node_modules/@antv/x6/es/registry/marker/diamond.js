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
import { Path } from '../../geometry';
import { normalize } from './util';
export const diamond = (_a) => {
    var { size, width, height, offset } = _a, attrs = __rest(_a, ["size", "width", "height", "offset"]);
    const s = size || 10;
    const w = width || s;
    const h = height || s;
    const path = new Path();
    path
        .moveTo(0, h / 2)
        .lineTo(w / 2, 0)
        .lineTo(w, h / 2)
        .lineTo(w / 2, h)
        .close();
    return Object.assign(Object.assign({}, attrs), { tagName: 'path', d: normalize(path.serialize(), offset == null ? -w / 2 : offset) });
};
//# sourceMappingURL=diamond.js.map