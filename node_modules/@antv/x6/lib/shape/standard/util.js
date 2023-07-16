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
exports.createShape = exports.getMarkup = void 0;
var util_1 = require("../../util");
var base_1 = require("../base");
function getMarkup(tagName, selector) {
    if (selector === void 0) { selector = 'body'; }
    return [
        {
            tagName: tagName,
            selector: selector,
        },
        {
            tagName: 'text',
            selector: 'label',
        },
    ];
}
exports.getMarkup = getMarkup;
function createShape(shape, config, options) {
    var _a;
    if (options === void 0) { options = {}; }
    var defaults = {
        constructorName: shape,
        markup: getMarkup(shape, options.selector),
        attrs: (_a = {},
            _a[shape] = __assign({}, base_1.Base.bodyAttr),
            _a),
    };
    var base = options.parent || base_1.Base;
    return base.define(util_1.ObjectExt.merge(defaults, config, { shape: shape }));
}
exports.createShape = createShape;
//# sourceMappingURL=util.js.map