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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FormatManager = void 0;
var jquery_1 = __importDefault(require("jquery"));
var util_1 = require("../util");
var geometry_1 = require("../geometry");
var base_1 = require("./base");
var FormatManager = /** @class */ (function (_super) {
    __extends(FormatManager, _super);
    function FormatManager() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    FormatManager.prototype.toSVG = function (callback, options) {
        var _this = this;
        if (options === void 0) { options = {}; }
        this.graph.trigger('before:export', options);
        var rawSVG = this.view.svg;
        var vSVG = util_1.Vector.create(rawSVG).clone();
        var clonedSVG = vSVG.node;
        var vStage = vSVG.findOne("." + this.view.prefixClassName('graph-svg-stage'));
        var viewBox = options.viewBox || this.graph.graphToLocal(this.graph.getContentBBox());
        var dimension = options.preserveDimensions;
        if (dimension) {
            var size = typeof dimension === 'boolean' ? viewBox : dimension;
            vSVG.attr({
                width: size.width,
                height: size.height,
            });
        }
        vSVG
            .removeAttribute('style')
            .attr('viewBox', [viewBox.x, viewBox.y, viewBox.width, viewBox.height].join(' '));
        vStage.removeAttribute('transform');
        // Stores all the CSS declarations from external stylesheets to the
        // `style` attribute of the SVG document nodes.
        // This is achieved in three steps.
        // -----------------------------------
        // 1. Disabling all the stylesheets in the page and therefore collecting
        //    only default style values. This, together with the step 2, makes it
        //    possible to discard default CSS property values and store only those
        //    that differ.
        //
        // 2. Enabling back all the stylesheets in the page and collecting styles
        //    that differ from the default values.
        //
        // 3. Applying the difference between default values and the ones set by
        //    custom stylesheets onto the `style` attribute of each of the nodes
        //    in SVG.
        if (options.copyStyles !== false) {
            var document_1 = rawSVG.ownerDocument;
            var raws = Array.from(rawSVG.querySelectorAll('*'));
            var clones = Array.from(clonedSVG.querySelectorAll('*'));
            var styleSheetCount = document_1.styleSheets.length;
            var styleSheetsCopy = [];
            for (var k = styleSheetCount - 1; k >= 0; k -= 1) {
                // There is a bug (bugSS) in Chrome 14 and Safari. When you set
                // `stylesheet.disable = true` it will also remove it from
                // `document.styleSheets`. So we need to store all stylesheets before
                // we disable them. Later on we put them back to `document.styleSheets`
                // if needed.
                // See the bug `https://code.google.com/p/chromium/issues/detail?id=88310`.
                styleSheetsCopy[k] = document_1.styleSheets[k];
                document_1.styleSheets[k].disabled = true;
            }
            var defaultComputedStyles_1 = {};
            raws.forEach(function (elem, index) {
                var computedStyle = window.getComputedStyle(elem, null);
                // We're making a deep copy of the `computedStyle` so that it's not affected
                // by that next step when all the stylesheets are re-enabled again.
                var defaultComputedStyle = {};
                Object.keys(computedStyle).forEach(function (property) {
                    defaultComputedStyle[property] =
                        computedStyle.getPropertyValue(property);
                });
                defaultComputedStyles_1[index] = defaultComputedStyle;
            });
            // Copy all stylesheets back
            if (styleSheetCount !== document_1.styleSheets.length) {
                styleSheetsCopy.forEach(function (copy, index) {
                    document_1.styleSheets[index] = copy;
                });
            }
            for (var i = 0; i < styleSheetCount; i += 1) {
                document_1.styleSheets[i].disabled = false;
            }
            var customStyles_1 = {};
            raws.forEach(function (elem, index) {
                var computedStyle = window.getComputedStyle(elem, null);
                var defaultComputedStyle = defaultComputedStyles_1[index];
                var customStyle = {};
                Object.keys(computedStyle).forEach(function (property) {
                    if (!util_1.NumberExt.isNumeric(property) &&
                        computedStyle.getPropertyValue(property) !==
                            defaultComputedStyle[property]) {
                        customStyle[property] = computedStyle.getPropertyValue(property);
                    }
                });
                customStyles_1[index] = customStyle;
            });
            clones.forEach(function (elem, index) {
                (0, jquery_1.default)(elem).css(customStyles_1[index]);
            });
        }
        var stylesheet = options.stylesheet;
        if (typeof stylesheet === 'string') {
            var cDATASection = rawSVG
                .ownerDocument.implementation.createDocument(null, 'xml', null)
                .createCDATASection(stylesheet);
            vSVG.prepend(util_1.Vector.create('style', {
                type: 'text/css',
            }, [cDATASection]));
        }
        var format = function () {
            var beforeSerialize = options.beforeSerialize;
            if (typeof beforeSerialize === 'function') {
                var ret = util_1.FunctionExt.call(beforeSerialize, _this.graph, clonedSVG);
                if (ret instanceof SVGSVGElement) {
                    clonedSVG = ret;
                }
            }
            var dataUri = new XMLSerializer()
                .serializeToString(clonedSVG)
                .replace(/&nbsp;/g, '\u00a0');
            _this.graph.trigger('after:export', options);
            callback(dataUri);
        };
        if (options.serializeImages) {
            var deferrals = vSVG.find('image').map(function (vImage) {
                return new Promise(function (resolve) {
                    var url = vImage.attr('xlink:href') || vImage.attr('href');
                    util_1.DataUri.imageToDataUri(url, function (err, dataUri) {
                        if (!err && dataUri) {
                            vImage.attr('xlink:href', dataUri);
                        }
                        resolve();
                    });
                });
            });
            Promise.all(deferrals).then(format);
        }
        else {
            format();
        }
    };
    FormatManager.prototype.toDataURL = function (callback, options) {
        var viewBox = options.viewBox || this.graph.getContentBBox();
        var padding = util_1.NumberExt.normalizeSides(options.padding);
        if (options.width && options.height) {
            if (padding.left + padding.right >= options.width) {
                padding.left = padding.right = 0;
            }
            if (padding.top + padding.bottom >= options.height) {
                padding.top = padding.bottom = 0;
            }
        }
        var expanding = new geometry_1.Rectangle(-padding.left, -padding.top, padding.left + padding.right, padding.top + padding.bottom);
        if (options.width && options.height) {
            var width = viewBox.width + padding.left + padding.right;
            var height = viewBox.height + padding.top + padding.bottom;
            expanding.scale(width / options.width, height / options.height);
        }
        viewBox = geometry_1.Rectangle.create(viewBox).moveAndExpand(expanding);
        var rawSize = typeof options.width === 'number' && typeof options.height === 'number'
            ? { width: options.width, height: options.height }
            : viewBox;
        var scale = options.ratio ? parseFloat(options.ratio) : 1;
        if (!Number.isFinite(scale) || scale === 0) {
            scale = 1;
        }
        var size = {
            width: Math.max(Math.round(rawSize.width * scale), 1),
            height: Math.max(Math.round(rawSize.height * scale), 1),
        };
        {
            var imgDataCanvas = document.createElement('canvas');
            var context2D = imgDataCanvas.getContext('2d');
            imgDataCanvas.width = size.width;
            imgDataCanvas.height = size.height;
            var x = size.width - 1;
            var y = size.height - 1;
            context2D.fillStyle = 'rgb(1,1,1)';
            context2D.fillRect(x, y, 1, 1);
            var data = context2D.getImageData(x, y, 1, 1).data;
            if (data[0] !== 1 || data[1] !== 1 || data[2] !== 1) {
                throw new Error('size exceeded');
            }
        }
        var img = new Image();
        img.onload = function () {
            var canvas = document.createElement('canvas');
            canvas.width = size.width;
            canvas.height = size.height;
            var context = canvas.getContext('2d');
            context.fillStyle = options.backgroundColor || 'white';
            context.fillRect(0, 0, size.width, size.height);
            try {
                context.drawImage(img, 0, 0, size.width, size.height);
                var dataUri = canvas.toDataURL(options.type, options.quality);
                callback(dataUri);
            }
            catch (error) {
                // pass
            }
        };
        this.toSVG(function (dataUri) {
            img.src = "data:image/svg+xml," + encodeURIComponent(dataUri);
        }, __assign(__assign({}, options), { viewBox: viewBox, serializeImages: true, preserveDimensions: __assign({}, size) }));
    };
    FormatManager.prototype.toPNG = function (callback, options) {
        if (options === void 0) { options = {}; }
        this.toDataURL(callback, __assign(__assign({}, options), { type: 'image/png' }));
    };
    FormatManager.prototype.toJPEG = function (callback, options) {
        if (options === void 0) { options = {}; }
        this.toDataURL(callback, __assign(__assign({}, options), { type: 'image/jpeg' }));
    };
    return FormatManager;
}(base_1.Base));
exports.FormatManager = FormatManager;
//# sourceMappingURL=format.js.map