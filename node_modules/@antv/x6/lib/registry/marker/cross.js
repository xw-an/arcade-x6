"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
exports.cross = void 0;
var geometry_1 = require("../../geometry");
var util_1 = require("./util");
var cross = function (_a) {
    var size = _a.size, width = _a.width, height = _a.height, offset = _a.offset, attrs = __rest(_a, ["size", "width", "height", "offset"]);
    var s = size || 10;
    var w = width || s;
    var h = height || s;
    var path = new geometry_1.Path();
    path.moveTo(0, 0).lineTo(w, h).moveTo(0, h).lineTo(w, 0);
    return __assign(__assign({}, attrs), { tagName: 'path', fill: 'none', d: (0, util_1.normalize)(path.serialize(), offset || -w / 2) });
};
exports.cross = cross;
//# sourceMappingURL=cross.js.map