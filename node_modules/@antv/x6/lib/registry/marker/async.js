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
exports.async = void 0;
var geometry_1 = require("../../geometry");
var util_1 = require("./util");
var async = function (_a) {
    var width = _a.width, height = _a.height, offset = _a.offset, open = _a.open, flip = _a.flip, attrs = __rest(_a, ["width", "height", "offset", "open", "flip"]);
    var h = height || 6;
    var w = width || 10;
    var opened = open === true;
    var fliped = flip === true;
    var result = __assign(__assign({}, attrs), { tagName: 'path' });
    if (fliped) {
        h = -h;
    }
    var path = new geometry_1.Path();
    path.moveTo(0, h).lineTo(w, 0);
    if (!opened) {
        path.lineTo(w, h);
        path.close();
    }
    else {
        result.fill = 'none';
    }
    result.d = (0, util_1.normalize)(path.serialize(), {
        x: offset || -w / 2,
        y: h / 2,
    });
    return result;
};
exports.async = async;
//# sourceMappingURL=async.js.map