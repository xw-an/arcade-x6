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
exports.ToolsView = void 0;
var util_1 = require("../util");
var tool_1 = require("../registry/tool");
var view_1 = require("./view");
var cell_1 = require("./cell");
var markup_1 = require("./markup");
var ToolsView = /** @class */ (function (_super) {
    __extends(ToolsView, _super);
    function ToolsView(options) {
        if (options === void 0) { options = {}; }
        var _this = _super.call(this) || this;
        _this.svgContainer = _this.createContainer(true, options);
        _this.htmlContainer = _this.createContainer(false, options);
        _this.config(options);
        return _this;
    }
    Object.defineProperty(ToolsView.prototype, "name", {
        get: function () {
            return this.options.name;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ToolsView.prototype, "graph", {
        get: function () {
            return this.cellView.graph;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ToolsView.prototype, "cell", {
        get: function () {
            return this.cellView.cell;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ToolsView.prototype, Symbol.toStringTag, {
        get: function () {
            return ToolsView.toStringTag;
        },
        enumerable: false,
        configurable: true
    });
    ToolsView.prototype.createContainer = function (svg, options) {
        var container = svg
            ? view_1.View.createElement('g', true)
            : view_1.View.createElement('div', false);
        util_1.Dom.addClass(container, this.prefixClassName('cell-tools'));
        if (options.className) {
            util_1.Dom.addClass(container, options.className);
        }
        return container;
    };
    ToolsView.prototype.config = function (options) {
        this.options = __assign(__assign({}, this.options), options);
        if (!cell_1.CellView.isCellView(options.view) || options.view === this.cellView) {
            return this;
        }
        this.cellView = options.view;
        if (this.cell.isEdge()) {
            util_1.Dom.addClass(this.svgContainer, this.prefixClassName('edge-tools'));
            util_1.Dom.addClass(this.htmlContainer, this.prefixClassName('edge-tools'));
        }
        else if (this.cell.isNode()) {
            util_1.Dom.addClass(this.svgContainer, this.prefixClassName('node-tools'));
            util_1.Dom.addClass(this.htmlContainer, this.prefixClassName('node-tools'));
        }
        this.svgContainer.setAttribute('data-cell-id', this.cell.id);
        this.htmlContainer.setAttribute('data-cell-id', this.cell.id);
        if (this.name) {
            this.svgContainer.setAttribute('data-tools-name', this.name);
            this.htmlContainer.setAttribute('data-tools-name', this.name);
        }
        var tools = this.options.items;
        if (!Array.isArray(tools)) {
            return this;
        }
        this.tools = [];
        var normalizedTools = [];
        tools.forEach(function (meta) {
            if (ToolsView.ToolItem.isToolItem(meta)) {
                if (meta.name === 'vertices') {
                    normalizedTools.unshift(meta);
                }
                else {
                    normalizedTools.push(meta);
                }
            }
            else {
                var name_1 = typeof meta === 'object' ? meta.name : meta;
                if (name_1 === 'vertices') {
                    normalizedTools.unshift(meta);
                }
                else {
                    normalizedTools.push(meta);
                }
            }
        });
        for (var i = 0; i < normalizedTools.length; i += 1) {
            var meta = normalizedTools[i];
            var tool = void 0;
            if (ToolsView.ToolItem.isToolItem(meta)) {
                tool = meta;
            }
            else {
                var name_2 = typeof meta === 'object' ? meta.name : meta;
                var args = typeof meta === 'object' ? meta.args || {} : {};
                if (name_2) {
                    if (this.cell.isNode()) {
                        var ctor = tool_1.NodeTool.registry.get(name_2);
                        if (ctor) {
                            tool = new ctor(args); // eslint-disable-line
                        }
                        else {
                            return tool_1.NodeTool.registry.onNotFound(name_2);
                        }
                    }
                    else if (this.cell.isEdge()) {
                        var ctor = tool_1.EdgeTool.registry.get(name_2);
                        if (ctor) {
                            tool = new ctor(args); // eslint-disable-line
                        }
                        else {
                            return tool_1.EdgeTool.registry.onNotFound(name_2);
                        }
                    }
                }
            }
            if (tool) {
                tool.config(this.cellView, this);
                tool.render();
                var container = tool.options.isSVGElement !== false
                    ? this.svgContainer
                    : this.htmlContainer;
                container.appendChild(tool.container);
                this.tools.push(tool);
            }
        }
        return this;
    };
    ToolsView.prototype.update = function (options) {
        if (options === void 0) { options = {}; }
        var tools = this.tools;
        if (tools) {
            tools.forEach(function (tool) {
                if (options.toolId !== tool.cid && tool.isVisible()) {
                    tool.update();
                }
            });
        }
        return this;
    };
    ToolsView.prototype.focus = function (focusedTool) {
        var tools = this.tools;
        if (tools) {
            tools.forEach(function (tool) {
                if (focusedTool === tool) {
                    tool.show();
                }
                else {
                    tool.hide();
                }
            });
        }
        return this;
    };
    ToolsView.prototype.blur = function (blurredTool) {
        var tools = this.tools;
        if (tools) {
            tools.forEach(function (tool) {
                if (tool !== blurredTool && !tool.isVisible()) {
                    tool.show();
                    tool.update();
                }
            });
        }
        return this;
    };
    ToolsView.prototype.hide = function () {
        return this.focus(null);
    };
    ToolsView.prototype.show = function () {
        return this.blur(null);
    };
    ToolsView.prototype.remove = function () {
        var tools = this.tools;
        if (tools) {
            tools.forEach(function (tool) { return tool.remove(); });
            this.tools = null;
        }
        util_1.Dom.remove(this.svgContainer);
        util_1.Dom.remove(this.htmlContainer);
        return _super.prototype.remove.call(this);
    };
    ToolsView.prototype.mount = function () {
        var tools = this.tools;
        var cellView = this.cellView;
        if (cellView && tools) {
            var hasSVG = tools.some(function (tool) { return tool.options.isSVGElement !== false; });
            var hasHTML = tools.some(function (tool) { return tool.options.isSVGElement === false; });
            if (hasSVG) {
                var parent_1 = this.options.local
                    ? cellView.container
                    : cellView.graph.view.decorator;
                parent_1.appendChild(this.svgContainer);
            }
            if (hasHTML) {
                this.graph.container.appendChild(this.htmlContainer);
            }
        }
        return this;
    };
    return ToolsView;
}(view_1.View));
exports.ToolsView = ToolsView;
(function (ToolsView) {
    ToolsView.toStringTag = "X6." + ToolsView.name;
    function isToolsView(instance) {
        if (instance == null) {
            return false;
        }
        if (instance instanceof ToolsView) {
            return true;
        }
        var tag = instance[Symbol.toStringTag];
        var view = instance;
        if ((tag == null || tag === ToolsView.toStringTag) &&
            view.graph != null &&
            view.cell != null &&
            typeof view.config === 'function' &&
            typeof view.update === 'function' &&
            typeof view.focus === 'function' &&
            typeof view.blur === 'function' &&
            typeof view.show === 'function' &&
            typeof view.hide === 'function') {
            return true;
        }
        return false;
    }
    ToolsView.isToolsView = isToolsView;
})(ToolsView = exports.ToolsView || (exports.ToolsView = {}));
exports.ToolsView = ToolsView;
(function (ToolsView) {
    var ToolItem = /** @class */ (function (_super) {
        __extends(ToolItem, _super);
        function ToolItem(options) {
            if (options === void 0) { options = {}; }
            var _this = _super.call(this) || this;
            _this.visible = true;
            _this.options = _this.getOptions(options);
            _this.container = view_1.View.createElement(_this.options.tagName || 'g', _this.options.isSVGElement !== false);
            util_1.Dom.addClass(_this.container, _this.prefixClassName('cell-tool'));
            if (typeof _this.options.className === 'string') {
                util_1.Dom.addClass(_this.container, _this.options.className);
            }
            _this.init();
            return _this;
        }
        ToolItem.getDefaults = function () {
            return this.defaults;
        };
        ToolItem.config = function (options) {
            this.defaults = this.getOptions(options);
        };
        ToolItem.getOptions = function (options) {
            return util_1.ObjectExt.merge(util_1.ObjectExt.cloneDeep(this.getDefaults()), options);
        };
        Object.defineProperty(ToolItem.prototype, "graph", {
            get: function () {
                return this.cellView.graph;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(ToolItem.prototype, "cell", {
            get: function () {
                return this.cellView.cell;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(ToolItem.prototype, "name", {
            get: function () {
                return this.options.name;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(ToolItem.prototype, Symbol.toStringTag, {
            get: function () {
                return ToolItem.toStringTag;
            },
            enumerable: false,
            configurable: true
        });
        ToolItem.prototype.init = function () { };
        ToolItem.prototype.getOptions = function (options) {
            var ctor = this.constructor;
            return ctor.getOptions(options);
        };
        ToolItem.prototype.delegateEvents = function () {
            if (this.options.events) {
                _super.prototype.delegateEvents.call(this, this.options.events);
            }
            return this;
        };
        ToolItem.prototype.config = function (view, toolsView) {
            this.cellView = view;
            this.parent = toolsView;
            this.stamp(this.container);
            if (this.cell.isEdge()) {
                util_1.Dom.addClass(this.container, this.prefixClassName('edge-tool'));
            }
            else if (this.cell.isNode()) {
                util_1.Dom.addClass(this.container, this.prefixClassName('node-tool'));
            }
            if (this.name) {
                this.container.setAttribute('data-tool-name', this.name);
            }
            this.delegateEvents();
            return this;
        };
        ToolItem.prototype.render = function () {
            this.empty();
            var markup = this.options.markup;
            if (markup) {
                var meta = markup_1.Markup.isStringMarkup(markup)
                    ? markup_1.Markup.parseStringMarkup(markup)
                    : markup_1.Markup.parseJSONMarkup(markup);
                this.container.appendChild(meta.fragment);
                this.childNodes = meta.selectors;
            }
            this.onRender();
            return this;
        };
        ToolItem.prototype.onRender = function () { };
        ToolItem.prototype.update = function () {
            return this;
        };
        ToolItem.prototype.stamp = function (elem) {
            if (elem) {
                elem.setAttribute('data-cell-id', this.cellView.cell.id);
            }
        };
        ToolItem.prototype.show = function () {
            this.container.style.display = '';
            this.visible = true;
            return this;
        };
        ToolItem.prototype.hide = function () {
            this.container.style.display = 'none';
            this.visible = false;
            return this;
        };
        ToolItem.prototype.isVisible = function () {
            return !!this.visible;
        };
        ToolItem.prototype.focus = function () {
            var opacity = this.options.focusOpacity;
            if (opacity != null && Number.isFinite(opacity)) {
                this.container.style.opacity = "" + opacity;
            }
            this.parent.focus(this);
            return this;
        };
        ToolItem.prototype.blur = function () {
            this.container.style.opacity = '';
            this.parent.blur(this);
            return this;
        };
        ToolItem.prototype.guard = function (evt) {
            if (this.graph == null || this.cellView == null) {
                return true;
            }
            return this.graph.view.guard(evt, this.cellView);
        };
        // #region static
        ToolItem.defaults = {
            isSVGElement: true,
            tagName: 'g',
        };
        return ToolItem;
    }(view_1.View));
    ToolsView.ToolItem = ToolItem;
    (function (ToolItem) {
        var counter = 0;
        function getClassName(name) {
            if (name) {
                return util_1.StringExt.pascalCase(name);
            }
            counter += 1;
            return "CustomTool" + counter;
        }
        function define(options) {
            var tool = util_1.ObjectExt.createClass(getClassName(options.name), this);
            tool.config(options);
            return tool;
        }
        ToolItem.define = define;
    })(ToolItem = ToolsView.ToolItem || (ToolsView.ToolItem = {}));
    (function (ToolItem) {
        ToolItem.toStringTag = "X6." + ToolItem.name;
        function isToolItem(instance) {
            if (instance == null) {
                return false;
            }
            if (instance instanceof ToolItem) {
                return true;
            }
            var tag = instance[Symbol.toStringTag];
            var view = instance;
            if ((tag == null || tag === ToolItem.toStringTag) &&
                view.graph != null &&
                view.cell != null &&
                typeof view.config === 'function' &&
                typeof view.update === 'function' &&
                typeof view.focus === 'function' &&
                typeof view.blur === 'function' &&
                typeof view.show === 'function' &&
                typeof view.hide === 'function' &&
                typeof view.isVisible === 'function') {
                return true;
            }
            return false;
        }
        ToolItem.isToolItem = isToolItem;
    })(ToolItem = ToolsView.ToolItem || (ToolsView.ToolItem = {}));
})(ToolsView = exports.ToolsView || (exports.ToolsView = {}));
exports.ToolsView = ToolsView;
//# sourceMappingURL=tool.js.map