"use strict";
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
exports.createShape = exports.getImageUrlHook = exports.getName = exports.getMarkup = void 0;
var util_1 = require("../../util");
var base_1 = require("../base");
function getMarkup(tagName, noText) {
    if (noText === void 0) { noText = false; }
    return "<g class=\"rotatable\"><g class=\"scalable\"><" + tagName + "/></g>" + (noText ? '' : '<text/>') + "</g>";
}
exports.getMarkup = getMarkup;
function getName(name) {
    return "basic." + name;
}
exports.getName = getName;
function getImageUrlHook(attrName) {
    if (attrName === void 0) { attrName = 'xlink:href'; }
    var hook = function (metadata) {
        var imageUrl = metadata.imageUrl, imageWidth = metadata.imageWidth, imageHeight = metadata.imageHeight, others = __rest(metadata, ["imageUrl", "imageWidth", "imageHeight"]);
        if (imageUrl != null || imageWidth != null || imageHeight != null) {
            var apply = function () {
                if (others.attrs) {
                    var image = others.attrs.image;
                    if (imageUrl != null) {
                        image[attrName] = imageUrl;
                    }
                    if (imageWidth != null) {
                        image.width = imageWidth;
                    }
                    if (imageHeight != null) {
                        image.height = imageHeight;
                    }
                    others.attrs.image = image;
                }
            };
            if (others.attrs) {
                if (others.attrs.image == null) {
                    others.attrs.image = {};
                }
                apply();
            }
            else {
                others.attrs = {
                    image: {},
                };
                apply();
            }
        }
        return others;
    };
    return hook;
}
exports.getImageUrlHook = getImageUrlHook;
function createShape(shape, config, options) {
    var _a;
    if (options === void 0) { options = {}; }
    var name = getName(shape);
    var defaults = {
        constructorName: name,
        attrs: (_a = {
                '.': {
                    fill: '#ffffff',
                    stroke: 'none',
                }
            },
            _a[shape] = {
                fill: '#ffffff',
                stroke: '#000000',
            },
            _a),
    };
    if (!options.ignoreMarkup) {
        defaults.markup = getMarkup(shape, options.noText === true);
    }
    var base = options.parent || base_1.Base;
    return base.define(util_1.ObjectExt.merge(defaults, config, { shape: name }));
}
exports.createShape = createShape;
//# sourceMappingURL=util.js.map