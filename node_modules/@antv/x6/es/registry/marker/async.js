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
export const async = (_a) => {
    var { width, height, offset, open, flip } = _a, attrs = __rest(_a, ["width", "height", "offset", "open", "flip"]);
    let h = height || 6;
    const w = width || 10;
    const opened = open === true;
    const fliped = flip === true;
    const result = Object.assign(Object.assign({}, attrs), { tagName: 'path' });
    if (fliped) {
        h = -h;
    }
    const path = new Path();
    path.moveTo(0, h).lineTo(w, 0);
    if (!opened) {
        path.lineTo(w, h);
        path.close();
    }
    else {
        result.fill = 'none';
    }
    result.d = normalize(path.serialize(), {
        x: offset || -w / 2,
        y: h / 2,
    });
    return result;
};
//# sourceMappingURL=async.js.map