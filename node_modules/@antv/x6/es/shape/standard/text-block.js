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
import { Platform, Dom, FunctionExt, ObjectExt } from '../../util';
import { Attr } from '../../registry';
import { Base } from '../base';
export const TextBlock = Base.define({
    shape: 'text-block',
    markup: [
        {
            tagName: 'rect',
            selector: 'body',
        },
        Platform.SUPPORT_FOREIGNOBJECT
            ? {
                tagName: 'foreignObject',
                selector: 'foreignObject',
                children: [
                    {
                        tagName: 'div',
                        ns: Dom.ns.xhtml,
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
        body: Object.assign(Object.assign({}, Base.bodyAttr), { refWidth: '100%', refHeight: '100%' }),
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
    propHooks(metadata) {
        const { text } = metadata, others = __rest(metadata, ["text"]);
        if (text) {
            ObjectExt.setByPath(others, 'attrs/label/text', text);
        }
        return others;
    },
    attrHooks: {
        text: {
            set(text, { cell, view, refBBox, elem, attrs }) {
                if (elem instanceof HTMLElement) {
                    elem.textContent = text;
                }
                else {
                    // No foreign object
                    const style = attrs.style || {};
                    const wrapValue = { text, width: -5, height: '100%' };
                    const wrapAttrs = Object.assign({ textVerticalAnchor: 'middle' }, style);
                    const textWrap = Attr.presets.textWrap;
                    FunctionExt.call(textWrap.set, this, wrapValue, {
                        cell,
                        view,
                        elem,
                        refBBox,
                        attrs: wrapAttrs,
                    });
                    return { fill: style.color || null };
                }
            },
            position(text, { refBBox, elem }) {
                if (elem instanceof SVGElement) {
                    return refBBox.getCenter();
                }
            },
        },
    },
});
//# sourceMappingURL=text-block.js.map