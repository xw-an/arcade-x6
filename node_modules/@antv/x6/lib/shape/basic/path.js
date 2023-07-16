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
var util_2 = require("./util");
exports.Path = (0, util_2.createShape)('path', {
    width: 60,
    height: 60,
    attrs: {
        text: {
            ref: 'path',
            refY: null,
            refDy: 16,
        },
    },
    propHooks: function (metadata) {
        var d = metadata.d, others = __rest(metadata, ["d"]);
        if (d != null) {
            util_1.ObjectExt.setByPath(others, 'attrs/path/d', d);
        }
        return others;
    },
});
//# sourceMappingURL=path.js.map