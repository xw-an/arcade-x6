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
exports.displayEmpty = exports.eol = exports.annotations = exports.textPath = exports.textVerticalAnchor = exports.lineHeight = exports.textWrap = exports.text = void 0;
var util_1 = require("../../util");
exports.text = {
    qualify: function (text, _a) {
        var attrs = _a.attrs;
        return attrs.textWrap == null || !util_1.ObjectExt.isPlainObject(attrs.textWrap);
    },
    set: function (text, _a) {
        var view = _a.view, elem = _a.elem, attrs = _a.attrs;
        var cacheName = 'x6-text';
        var $elem = view.$(elem);
        var cache = $elem.data(cacheName);
        var json = function (str) {
            try {
                return JSON.parse(str);
            }
            catch (error) {
                return str;
            }
        };
        var options = {
            x: attrs.x,
            eol: attrs.eol,
            annotations: json(attrs.annotations),
            textPath: json(attrs['text-path'] || attrs.textPath),
            textVerticalAnchor: (attrs['text-vertical-anchor'] ||
                attrs.textVerticalAnchor),
            displayEmpty: (attrs['display-empty'] || attrs.displayEmpty) === 'true',
            lineHeight: (attrs['line-height'] || attrs.lineHeight),
        };
        var fontSize = (attrs['font-size'] || attrs.fontSize);
        var textHash = JSON.stringify([text, options]);
        if (fontSize) {
            elem.setAttribute('font-size', fontSize);
        }
        // Updates the text only if there was a change in the string
        // or any of its attributes.
        if (cache == null || cache !== textHash) {
            // Text Along Path Selector
            var textPath_1 = options.textPath;
            if (textPath_1 != null && typeof textPath_1 === 'object') {
                var selector = textPath_1.selector;
                if (typeof selector === 'string') {
                    var pathNode = view.find(selector)[0];
                    if (pathNode instanceof SVGPathElement) {
                        util_1.Dom.ensureId(pathNode);
                        options.textPath = __assign({ 'xlink:href': "#" + pathNode.id }, textPath_1);
                    }
                }
            }
            util_1.Dom.text(elem, "" + text, options);
            $elem.data(cacheName, textHash);
        }
    },
};
exports.textWrap = {
    qualify: util_1.ObjectExt.isPlainObject,
    set: function (val, _a) {
        var view = _a.view, elem = _a.elem, attrs = _a.attrs, refBBox = _a.refBBox;
        var info = val;
        // option `width`
        var width = info.width || 0;
        if (util_1.NumberExt.isPercentage(width)) {
            refBBox.width *= parseFloat(width) / 100;
        }
        else if (width <= 0) {
            refBBox.width += width;
        }
        else {
            refBBox.width = width;
        }
        // option `height`
        var height = info.height || 0;
        if (util_1.NumberExt.isPercentage(height)) {
            refBBox.height *= parseFloat(height) / 100;
        }
        else if (height <= 0) {
            refBBox.height += height;
        }
        else {
            refBBox.height = height;
        }
        // option `text`
        var wrappedText;
        var txt = info.text;
        if (txt == null) {
            txt = attrs.text;
        }
        if (txt != null) {
            wrappedText = util_1.Dom.breakText("" + txt, refBBox, {
                'font-weight': attrs['font-weight'] || attrs.fontWeight,
                'font-size': attrs['font-size'] || attrs.fontSize,
                'font-family': attrs['font-family'] || attrs.fontFamily,
                lineHeight: attrs.lineHeight,
            }, {
                svgDocument: view.graph.view.svg,
                ellipsis: info.ellipsis,
                hyphen: info.hyphen,
                breakWord: info.breakWord,
            });
        }
        else {
            wrappedText = '';
        }
        util_1.FunctionExt.call(exports.text.set, this, wrappedText, {
            view: view,
            elem: elem,
            attrs: attrs,
            refBBox: refBBox,
            cell: view.cell,
        });
    },
};
var isTextInUse = function (val, _a) {
    var attrs = _a.attrs;
    return attrs.text !== undefined;
};
exports.lineHeight = {
    qualify: isTextInUse,
};
exports.textVerticalAnchor = {
    qualify: isTextInUse,
};
exports.textPath = {
    qualify: isTextInUse,
};
exports.annotations = {
    qualify: isTextInUse,
};
exports.eol = {
    qualify: isTextInUse,
};
exports.displayEmpty = {
    qualify: isTextInUse,
};
//# sourceMappingURL=text.js.map