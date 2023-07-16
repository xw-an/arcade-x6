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
exports.TextBlock = void 0;
var util_1 = require("../../util");
var registry_1 = require("../../registry");
var base_1 = require("../base");
exports.TextBlock = base_1.Base.define({
    shape: 'text-block',
    markup: [
        {
            tagName: 'rect',
            selector: 'body',
        },
        util_1.Platform.SUPPORT_FOREIGNOBJECT
            ? {
                tagName: 'foreignObject',
                selector: 'foreignObject',
                children: [
                    {
                        tagName: 'div',
                        ns: util_1.Dom.ns.xhtml,
                        selector: 'label',
                        style: {
                            width: '100%',
                            height: '100%',
                            position: 'static',
                            backgroundColor: 'transparent',
                            textAlign: 'center',
                            margin: 0,
                            padding: '0px 5px',
                            boxSizing: 'border-box',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        },
                    },
                ],
            }
            : {
                tagName: 'text',
                selector: 'label',
                attrs: {
                    textAnchor: 'middle',
                },
            },
    ],
    attrs: {
        body: __assign(__assign({}, base_1.Base.bodyAttr), { refWidth: '100%', refHeight: '100%' }),
        foreignObject: {
            refWidth: '100%',
            refHeight: '100%',
        },
        label: {
            style: {
                fontSize: 14,
            },
        },
    },
    propHooks: function (metadata) {
        var text = metadata.text, others = __rest(metadata, ["text"]);
        if (text) {
            util_1.ObjectExt.setByPath(others, 'attrs/label/text', text);
        }
        return others;
    },
    attrHooks: {
        text: {
            set: function (text, _a) {
                var cell = _a.cell, view = _a.view, refBBox = _a.refBBox, elem = _a.elem, attrs = _a.attrs;
                if (elem instanceof HTMLElement) {
                    elem.textContent = text;
                }
                else {
                    // No foreign object
                    var style = attrs.style || {};
                    var wrapValue = { text: text, width: -5, height: '100%' };
                    var wrapAttrs = __assign({ textVerticalAnchor: 'middle' }, style);
                    var textWrap = registry_1.Attr.presets.textWrap;
                    util_1.FunctionExt.call(textWrap.set, this, wrapValue, {
                        cell: cell,
                        view: view,
                        elem: elem,
                        refBBox: refBBox,
                        attrs: wrapAttrs,
                    });
                    return { fill: style.color || null };
                }
            },
            position: function (text, _a) {
                var refBBox = _a.refBBox, elem = _a.elem;
                if (elem instanceof SVGElement) {
                    return refBBox.getCenter();
                }
            },
        },
    },
});
//# sourceMappingURL=text-block.js.map