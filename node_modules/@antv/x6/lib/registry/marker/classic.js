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
exports.classic = exports.block = void 0;
var geometry_1 = require("../../geometry");
var util_1 = require("../../util");
var util_2 = require("./util");
var block = function (_a) {
    var size = _a.size, width = _a.width, height = _a.height, offset = _a.offset, open = _a.open, attrs = __rest(_a, ["size", "width", "height", "offset", "open"]);
    return createClassicMarker({ size: size, width: width, height: height, offset: offset }, open === true, true, undefined, attrs);
};
exports.block = block;
var classic = function (_a) {
    var size = _a.size, width = _a.width, height = _a.height, offset = _a.offset, factor = _a.factor, attrs = __rest(_a, ["size", "width", "height", "offset", "factor"]);
    return createClassicMarker({ size: size, width: width, height: height, offset: offset }, false, false, factor, attrs);
};
exports.classic = classic;
function createClassicMarker(options, open, full, factor, attrs) {
    if (factor === void 0) { factor = 3 / 4; }
    if (attrs === void 0) { attrs = {}; }
    var size = options.size || 10;
    var width = options.width || size;
    var height = options.height || size;
    var path = new geometry_1.Path();
    var localAttrs = {};
    if (open) {
        path
            .moveTo(width, 0)
            .lineTo(0, height / 2)
            .lineTo(width, height);
        localAttrs.fill = 'none';
    }
    else {
        path.moveTo(0, height / 2);
        path.lineTo(width, 0);
        if (!full) {
            var f = util_1.NumberExt.clamp(factor, 0, 1);
            path.lineTo(width * f, height / 2);
        }
        path.lineTo(width, height);
        path.close();
    }
    return __assign(__assign(__assign({}, localAttrs), attrs), { tagName: 'path', d: (0, util_2.normalize)(path.serialize(), {
            x: options.offset != null ? options.offset : -width / 2,
        }) });
}
//# sourceMappingURL=classic.js.map