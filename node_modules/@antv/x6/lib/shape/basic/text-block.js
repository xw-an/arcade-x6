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
exports.TextBlock = void 0;
var util_1 = require("../../util");
var model_1 = require("../../model");
var view_1 = require("../../view");
var util_2 = require("./util");
var contentSelector = '.text-block-content';
var registryName = (0, util_2.getName)('text-block');
var TextBlock = /** @class */ (function (_super) {
    __extends(TextBlock, _super);
    function TextBlock() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(TextBlock.prototype, "content", {
        get: function () {
            return this.getContent();
        },
        set: function (val) {
            this.setContent(val);
        },
        enumerable: false,
        configurable: true
    });
    TextBlock.prototype.getContent = function () {
        return this.store.get('content', '');
    };
    TextBlock.prototype.setContent = function (content, options) {
        if (options === void 0) { options = {}; }
        this.store.set('content', content, options);
    };
    TextBlock.prototype.setup = function () {
        var _this = this;
        _super.prototype.setup.call(this);
        this.store.on('change:*', function (metadata) {
            var key = metadata.key;
            if (key === 'content') {
                _this.updateContent(_this.getContent());
            }
            else if (key === 'size') {
                _this.updateSize(_this.getSize());
            }
        });
        this.updateSize(this.getSize());
        this.updateContent(this.getContent());
    };
    TextBlock.prototype.updateSize = function (size) {
        var _a;
        if (util_1.Platform.SUPPORT_FOREIGNOBJECT) {
            this.setAttrs((_a = {
                    foreignObject: __assign({}, size)
                },
                _a[contentSelector] = {
                    style: __assign({}, size),
                },
                _a));
        }
    };
    TextBlock.prototype.updateContent = function (content) {
        var _a, _b;
        if (util_1.Platform.SUPPORT_FOREIGNOBJECT) {
            this.setAttrs((_a = {},
                _a[contentSelector] = {
                    html: content ? util_1.StringExt.sanitizeHTML(content) : '',
                },
                _a));
        }
        else {
            this.setAttrs((_b = {},
                _b[contentSelector] = {
                    text: content,
                },
                _b));
        }
    };
    return TextBlock;
}(model_1.Node));
exports.TextBlock = TextBlock;
(function (TextBlock) {
    var _a;
    TextBlock.config({
        type: registryName,
        view: registryName,
        markup: [
            '<g class="rotatable">',
            '<g class="scalable"><rect/></g>',
            util_1.Platform.SUPPORT_FOREIGNOBJECT
                ? [
                    "<foreignObject>",
                    "<body xmlns=\"http://www.w3.org/1999/xhtml\">",
                    "<div class=\"" + contentSelector.substr(1) + "\" />",
                    "</body>",
                    "</foreignObject>",
                ].join('')
                : "<text class=\"" + contentSelector.substr(1) + "\"/>",
            '</g>',
        ].join(''),
        attrs: (_a = {
                '.': {
                    fill: '#ffffff',
                    stroke: 'none',
                },
                rect: {
                    fill: '#ffffff',
                    stroke: '#000000',
                    width: 80,
                    height: 100,
                },
                text: {
                    fill: '#000000',
                    fontSize: 14,
                    fontFamily: 'Arial, helvetica, sans-serif',
                },
                body: {
                    style: {
                        background: 'transparent',
                        position: 'static',
                        margin: 0,
                        padding: 0,
                    },
                },
                foreignObject: {
                    style: {
                        overflow: 'hidden',
                    },
                }
            },
            _a[contentSelector] = {
                refX: 0.5,
                refY: 0.5,
                yAlign: 'middle',
                xAlign: 'middle',
                style: {
                    textAlign: 'center',
                    verticalAlign: 'middle',
                    display: 'table-cell',
                    padding: '0 5px',
                    margin: 0,
                },
            },
            _a),
    });
    model_1.Node.registry.register(registryName, TextBlock);
})(TextBlock = exports.TextBlock || (exports.TextBlock = {}));
exports.TextBlock = TextBlock;
(function (TextBlock) {
    var contentAction = 'content';
    var View = /** @class */ (function (_super) {
        __extends(View, _super);
        function View() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        View.prototype.confirmUpdate = function (flag, options) {
            if (options === void 0) { options = {}; }
            var ret = _super.prototype.confirmUpdate.call(this, flag, options);
            if (this.hasAction(ret, contentAction)) {
                this.updateContent();
                ret = this.removeAction(ret, contentAction);
            }
            return ret;
        };
        View.prototype.update = function (partialAttrs) {
            if (util_1.Platform.SUPPORT_FOREIGNOBJECT) {
                _super.prototype.update.call(this, partialAttrs);
            }
            else {
                var node = this.cell;
                var attrs = __assign({}, (partialAttrs || node.getAttrs()));
                delete attrs[contentSelector];
                _super.prototype.update.call(this, attrs);
                if (!partialAttrs || util_1.ObjectExt.has(partialAttrs, contentSelector)) {
                    this.updateContent(partialAttrs);
                }
            }
        };
        View.prototype.updateContent = function (partialAttrs) {
            var _a;
            if (util_1.Platform.SUPPORT_FOREIGNOBJECT) {
                _super.prototype.update.call(this, partialAttrs);
            }
            else {
                var node = this.cell;
                var textAttrs = (partialAttrs || node.getAttrs())[contentSelector];
                // Break the text to fit the node size taking into
                // account the attributes set on the node.
                var text = util_1.Dom.breakText(node.getContent(), node.getSize(), textAttrs, {
                    svgDocument: this.graph.view.svg,
                });
                var attrs = (_a = {},
                    _a[contentSelector] = util_1.ObjectExt.merge({}, textAttrs, { text: text }),
                    _a);
                _super.prototype.update.call(this, attrs);
            }
        };
        return View;
    }(view_1.NodeView));
    TextBlock.View = View;
    (function (View) {
        View.config({
            bootstrap: ['render', contentAction],
            actions: util_1.Platform.SUPPORT_FOREIGNOBJECT
                ? {}
                : {
                    size: contentAction,
                    content: contentAction,
                },
        });
        view_1.NodeView.registry.register(registryName, View);
    })(View = TextBlock.View || (TextBlock.View = {}));
})(TextBlock = exports.TextBlock || (exports.TextBlock = {}));
exports.TextBlock = TextBlock;
//# sourceMappingURL=text-block.js.map