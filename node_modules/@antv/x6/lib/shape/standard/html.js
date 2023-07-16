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
exports.HTML = void 0;
var registry_1 = require("../../registry");
var view_1 = require("../../view");
var node_1 = require("../../model/node");
var node_2 = require("../../view/node");
var base_1 = require("../base");
var HTML = /** @class */ (function (_super) {
    __extends(HTML, _super);
    function HTML() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(HTML.prototype, "html", {
        get: function () {
            return this.getHTML();
        },
        set: function (val) {
            this.setHTML(val);
        },
        enumerable: false,
        configurable: true
    });
    HTML.prototype.getHTML = function () {
        return this.store.get('html');
    };
    HTML.prototype.setHTML = function (html, options) {
        if (options === void 0) { options = {}; }
        if (html == null) {
            this.removeHTML(options);
        }
        else {
            this.store.set('html', html, options);
        }
        return this;
    };
    HTML.prototype.removeHTML = function (options) {
        if (options === void 0) { options = {}; }
        return this.store.remove('html', options);
    };
    return HTML;
}(base_1.Base));
exports.HTML = HTML;
(function (HTML) {
    var View = /** @class */ (function (_super) {
        __extends(View, _super);
        function View() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        View.prototype.init = function () {
            var _this = this;
            _super.prototype.init.call(this);
            this.cell.on('change:*', function () {
                var shouldUpdate = _this.graph.hook.shouldUpdateHTMLComponent(_this.cell);
                if (shouldUpdate) {
                    _this.renderHTMLComponent();
                }
            });
        };
        View.prototype.confirmUpdate = function (flag) {
            var _this = this;
            var ret = _super.prototype.confirmUpdate.call(this, flag);
            return this.handleAction(ret, View.action, function () {
                return _this.renderHTMLComponent();
            });
        };
        View.prototype.renderHTMLComponent = function () {
            var container = this.selectors.foContent;
            if (container) {
                var $wrap = this.$(container).empty();
                var component = this.graph.hook.getHTMLComponent(this.cell);
                if (component) {
                    if (typeof component === 'string') {
                        $wrap.html(component);
                    }
                    else {
                        $wrap.append(component);
                    }
                }
            }
        };
        return View;
    }(node_2.NodeView));
    HTML.View = View;
    (function (View) {
        View.action = 'html';
        View.config({
            bootstrap: [View.action],
            actions: {
                html: View.action,
            },
        });
        node_2.NodeView.registry.register('html-view', View);
    })(View = HTML.View || (HTML.View = {}));
})(HTML = exports.HTML || (exports.HTML = {}));
exports.HTML = HTML;
(function (HTML) {
    HTML.config({
        view: 'html-view',
        markup: [
            {
                tagName: 'rect',
                selector: 'body',
            },
            __assign({}, view_1.Markup.getForeignObjectMarkup()),
            {
                tagName: 'text',
                selector: 'label',
            },
        ],
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
        },
    });
    node_1.Node.registry.register('html', HTML);
})(HTML = exports.HTML || (exports.HTML = {}));
exports.HTML = HTML;
(function (HTML) {
    HTML.componentRegistry = registry_1.Registry.create({
        type: 'html componnet',
    });
})(HTML = exports.HTML || (exports.HTML = {}));
exports.HTML = HTML;
//# sourceMappingURL=html.js.map