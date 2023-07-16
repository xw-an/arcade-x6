"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
exports.Base = void 0;
var node_1 = require("../model/node");
var util_1 = require("../util");
var Base = /** @class */ (function (_super) {
    __extends(Base, _super);
    function Base() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(Base.prototype, "label", {
        get: function () {
            return this.getLabel();
        },
        set: function (val) {
            this.setLabel(val);
        },
        enumerable: false,
        configurable: true
    });
    Base.prototype.getLabel = function () {
        return this.getAttrByPath('text/text');
    };
    Base.prototype.setLabel = function (label, options) {
        if (label == null) {
            this.removeLabel();
        }
        else {
            this.setAttrByPath('text/text', label, options);
        }
        return this;
    };
    Base.prototype.removeLabel = function () {
        this.removeAttrByPath('text/text');
        return this;
    };
    return Base;
}(node_1.Node));
exports.Base = Base;
(function (Base) {
    Base.bodyAttr = {
        fill: '#ffffff',
        stroke: '#333333',
        strokeWidth: 2,
    };
    Base.labelAttr = {
        fontSize: 14,
        fill: '#000000',
        refX: 0.5,
        refY: 0.5,
        textAnchor: 'middle',
        textVerticalAnchor: 'middle',
        fontFamily: 'Arial, helvetica, sans-serif',
    };
    Base.config({
        attrs: { text: __assign({}, Base.labelAttr) },
        propHooks: function (metadata) {
            var label = metadata.label, others = __rest(metadata, ["label"]);
            if (label) {
                util_1.ObjectExt.setByPath(others, 'attrs/text/text', label);
            }
            return others;
        },
        visible: true,
    });
})(Base = exports.Base || (exports.Base = {}));
exports.Base = Base;
//# sourceMappingURL=base.js.map