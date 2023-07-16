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
exports.circlePlus = exports.circle = void 0;
var geometry_1 = require("../../geometry");
var util_1 = require("./util");
var circle = function (_a) {
    var r = _a.r, attrs = __rest(_a, ["r"]);
    var radius = r || 5;
    return __assign(__assign({ cx: radius }, attrs), { tagName: 'circle', r: radius });
};
exports.circle = circle;
var circlePlus = function (_a) {
    var r = _a.r, attrs = __rest(_a, ["r"]);
    var radius = r || 5;
    var path = new geometry_1.Path();
    path.moveTo(radius, 0).lineTo(radius, radius * 2);
    path.moveTo(0, radius).lineTo(radius * 2, radius);
    return {
        children: [
            __assign(__assign({}, (0, exports.circle)({ r: radius })), { fill: 'none' }),
            __assign(__assign({}, attrs), { tagName: 'path', d: (0, util_1.normalize)(path.serialize(), -radius) }),
        ],
    };
};
exports.circlePlus = circlePlus;
//# sourceMappingURL=circle.js.map