"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Path = void 0;
var util_1 = require("../../util");
var base_1 = require("../base");
exports.Path = base_1.Base.define({
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
    propHooks: function (metadata) {
        var path = metadata.path, others = __rest(metadata, ["path"]);
        if (path) {
            util_1.ObjectExt.setByPath(others, 'attrs/body/refD', path);
        }
        return others;
    },
});
//# sourceMappingURL=path.js.map