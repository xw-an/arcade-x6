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
Object.defineProperty(exports, "__esModule", { value: true });
exports.VueShape = void 0;
var x6_1 = require("@antv/x6");
var VueShape = /** @class */ (function (_super) {
    __extends(VueShape, _super);
    function VueShape() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(VueShape.prototype, "component", {
        get: function () {
            return this.getComponent();
        },
        set: function (val) {
            this.setComponent(val);
        },
        enumerable: false,
        configurable: true
    });
    VueShape.prototype.getComponent = function () {
        return this.store.get('component');
    };
    VueShape.prototype.setComponent = function (component, options) {
        if (options === void 0) { options = {}; }
        if (component == null) {
            this.removeComponent(options);
        }
        else {
            this.store.set('component', component, options);
        }
        return this;
    };
    VueShape.prototype.removeComponent = function (options) {
        if (options === void 0) { options = {}; }
        this.store.remove('component', options);
        return this;
    };
    return VueShape;
}(x6_1.Node));
exports.VueShape = VueShape;
(function (VueShape) {
    function getMarkup(useForeignObject, primer) {
        if (primer === void 0) { primer = 'rect'; }
        var markup = [
            {
                tagName: primer,
                selector: 'body',
            },
        ];
        if (useForeignObject) {
            markup.push(x6_1.Markup.getForeignObjectMarkup());
        }
        else {
            markup.push({
                tagName: 'g',
                selector: 'content',
            });
        }
        markup.push({
            tagName: 'text',
            selector: 'label',
        });
        return markup;
    }
    VueShape.config({
        view: 'vue-shape-view',
        markup: getMarkup(true),
        attrs: {
            body: {
                fill: 'none',
                stroke: 'none',
                refWidth: '100%',
                refHeight: '100%',
            },
            fo: {
                refWidth: '100%',
                refHeight: '100%',
            },
            label: {
                fontSize: 14,
                fill: '#333',
                refX: '50%',
                refY: '50%',
                textAnchor: 'middle',
                textVerticalAnchor: 'middle',
            },
        },
        propHooks: function (metadata) {
            if (metadata.markup == null) {
                var primer = metadata.primer;
                var useForeignObject = metadata.useForeignObject;
                if (primer != null || useForeignObject != null) {
                    metadata.markup = getMarkup(useForeignObject !== false, primer);
                    if (primer) {
                        if (metadata.attrs == null) {
                            metadata.attrs = {};
                        }
                        var attrs = {};
                        if (primer === 'circle') {
                            attrs = {
                                refCx: '50%',
                                refCy: '50%',
                                refR: '50%',
                            };
                        }
                        else if (primer === 'ellipse') {
                            attrs = {
                                refCx: '50%',
                                refCy: '50%',
                                refRx: '50%',
                                refRy: '50%',
                            };
                        }
                        if (primer !== 'rect') {
                            metadata.attrs = x6_1.ObjectExt.merge({}, metadata.attrs, {
                                body: __assign({ refWidth: null, refHeight: null }, attrs),
                            });
                        }
                    }
                }
            }
            return metadata;
        },
    });
    x6_1.Node.registry.register('vue-shape', VueShape, true);
})(VueShape = exports.VueShape || (exports.VueShape = {}));
exports.VueShape = VueShape;
//# sourceMappingURL=node.js.map