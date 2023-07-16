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
import { ObjectExt } from '../../util';
import { Base } from '../base';
export const Path = Base.define({
    shape: 'path',
    markup: [
        {
            tagName: 'rect',
            selector: 'bg',
        },
        {
            tagName: 'path',
            selector: 'body',
        },
        {
            tagName: 'text',
            selector: 'label',
        },
    ],
    attrs: {
        bg: {
            refWidth: '100%',
            refHeight: '100%',
            fill: 'none',
            stroke: 'none',
            pointerEvents: 'all',
        },
        body: {
            fill: 'none',
            stroke: '#000',
            strokeWidth: 2,
        },
    },
    propHooks(metadata) {
        const { path } = metadata, others = __rest(metadata, ["path"]);
        if (path) {
            ObjectExt.setByPath(others, 'attrs/body/refD', path);
        }
        return others;
    },
});
//# sourceMappingURL=path.js.map