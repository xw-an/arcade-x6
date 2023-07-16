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
Object.defineProperty(exports, "__esModule", { value: true });
exports.manhattan = void 0;
var util_1 = require("../../../util");
var router_1 = require("./router");
var options_1 = require("./options");
var manhattan = function (vertices, options, edgeView) {
    return util_1.FunctionExt.call(router_1.router, this, vertices, __assign(__assign({}, options_1.defaults), options), edgeView);
};
exports.manhattan = manhattan;
//# sourceMappingURL=index.js.map