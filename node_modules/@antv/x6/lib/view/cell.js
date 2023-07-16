"use strict";
/* eslint-disable @typescript-eslint/no-unused-vars */
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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CellView = void 0;
var geometry_1 = require("../geometry");
var util_1 = require("../util");
var registry_1 = require("../registry/registry");
var connection_strategy_1 = require("../registry/connection-strategy");
var view_1 = require("./view");
var cache_1 = require("./cache");
var markup_1 = require("./markup");
var tool_1 = require("./tool");
var attr_1 = require("./attr");
var flag_1 = require("./flag");
var CellView = /** @class */ (function (_super) {
    __extends(CellView, _super);
    function CellView(cell, options) {
        if (options === void 0) { options = {}; }
        var _this = _super.call(this) || this;
        _this.cell = cell;
        _this.options = _this.ensureOptions(options);
        _this.graph = _this.options.graph;
        _this.attr = new attr_1.AttrManager(_this);
        _this.flag = new flag_1.FlagManager(_this, _this.options.actions, _this.options.bootstrap);
        _this.cache = new cache_1.Cache(_this);
        _this.setContainer(_this.ensureContainer());
        _this.setup();
        _this.$(_this.container).data('view', _this);
        _this.init();
        return _this;
    }
    CellView.getDefaults = function () {
        return this.defaults;
    };
    CellView.config = function (options) {
        this.defaults = this.getOptions(options);
    };
    CellView.getOptions = function (options) {
        var mergeActions = function (arr1, arr2) {
            if (arr2 != null) {
                return util_1.ArrayExt.uniq(__spreadArray(__spreadArray([], (Array.isArray(arr1) ? arr1 : [arr1]), true), (Array.isArray(arr2) ? arr2 : [arr2]), true));
            }
            return Array.isArray(arr1) ? __spreadArray([], arr1, true) : [arr1];
        };
        var ret = util_1.ObjectExt.cloneDeep(this.getDefaults());
        var bootstrap = options.bootstrap, actions = options.actions, events = options.events, documentEvents = options.documentEvents, others = __rest(options, ["bootstrap", "actions", "events", "documentEvents"]);
        if (bootstrap) {
            ret.bootstrap = mergeActions(ret.bootstrap, bootstrap);
        }
        if (actions) {
            Object.keys(actions).forEach(function (key) {
                var val = actions[key];
                var raw = ret.actions[key];
                if (val && raw) {
                    ret.actions[key] = mergeActions(raw, val);
                }
                else if (val) {
                    ret.actions[key] = mergeActions(val);
                }
            });
        }
        if (events) {
            ret.events = __assign(__assign({}, ret.events), events);
        }
        if (options.documentEvents) {
            ret.documentEvents = __assign(__assign({}, ret.documentEvents), documentEvents);
        }
        return util_1.ObjectExt.merge(ret, others);
    };
    Object.defineProperty(CellView.prototype, Symbol.toStringTag, {
        get: function () {
            return CellView.toStringTag;
        },
        enumerable: false,
        configurable: true
    });
    CellView.prototype.init = function () { };
    CellView.prototype.onRemove = function () {
        this.removeTools();
    };
    Object.defineProperty(CellView.prototype, "priority", {
        get: function () {
            return this.options.priority;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CellView.prototype, "rootSelector", {
        get: function () {
            return this.options.rootSelector;
        },
        enumerable: false,
        configurable: true
    });
    CellView.prototype.getConstructor = function () {
        return this.constructor;
    };
    CellView.prototype.ensureOptions = function (options) {
        return this.getConstructor().getOptions(options);
    };
    CellView.prototype.getContainerTagName = function () {
        return this.options.isSvgElement ? 'g' : 'div';
    };
    CellView.prototype.getContainerStyle = function () { };
    CellView.prototype.getContainerAttrs = function () {
        return {
            'data-cell-id': this.cell.id,
            'data-shape': this.cell.shape,
        };
    };
    CellView.prototype.getContainerClassName = function () {
        return this.prefixClassName('cell');
    };
    CellView.prototype.ensureContainer = function () {
        return view_1.View.createElement(this.getContainerTagName(), this.options.isSvgElement);
    };
    CellView.prototype.setContainer = function (container) {
        if (this.container !== container) {
            this.undelegateEvents();
            this.container = container;
            if (this.options.events != null) {
                this.delegateEvents(this.options.events);
            }
            var attrs = this.getContainerAttrs();
            if (attrs != null) {
                this.setAttrs(attrs, container);
            }
            var style = this.getContainerStyle();
            if (style != null) {
                this.setStyle(style, container);
            }
            var className = this.getContainerClassName();
            if (className != null) {
                this.addClass(className, container);
            }
        }
        return this;
    };
    CellView.prototype.isNodeView = function () {
        return false;
    };
    CellView.prototype.isEdgeView = function () {
        return false;
    };
    CellView.prototype.render = function () {
        return this;
    };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    CellView.prototype.confirmUpdate = function (flag, options) {
        if (options === void 0) { options = {}; }
        return 0;
    };
    CellView.prototype.getBootstrapFlag = function () {
        return this.flag.getBootstrapFlag();
    };
    CellView.prototype.getFlag = function (actions) {
        return this.flag.getFlag(actions);
    };
    CellView.prototype.hasAction = function (flag, actions) {
        return this.flag.hasAction(flag, actions);
    };
    CellView.prototype.removeAction = function (flag, actions) {
        return this.flag.removeAction(flag, actions);
    };
    CellView.prototype.handleAction = function (flag, action, handle, additionalRemovedActions) {
        if (this.hasAction(flag, action)) {
            handle();
            var removedFlags = [action];
            if (additionalRemovedActions) {
                if (typeof additionalRemovedActions === 'string') {
                    removedFlags.push(additionalRemovedActions);
                }
                else {
                    removedFlags.push.apply(removedFlags, additionalRemovedActions);
                }
            }
            return this.removeAction(flag, removedFlags);
        }
        return flag;
    };
    CellView.prototype.setup = function () {
        var _this = this;
        this.cell.on('changed', function (_a) {
            var options = _a.options;
            return _this.onAttrsChange(options);
        });
    };
    CellView.prototype.onAttrsChange = function (options) {
        var flag = this.flag.getChangedFlag();
        if (options.updated || !flag) {
            return;
        }
        if (options.dirty && this.hasAction(flag, 'update')) {
            flag |= this.getFlag('render'); // eslint-disable-line no-bitwise
        }
        // tool changes should be sync render
        if (options.toolId) {
            options.async = false;
        }
        if (this.graph != null) {
            this.graph.renderer.requestViewUpdate(this, flag, this.priority, options);
        }
    };
    CellView.prototype.parseJSONMarkup = function (markup, rootElem) {
        var result = markup_1.Markup.parseJSONMarkup(markup);
        var selectors = result.selectors;
        var rootSelector = this.rootSelector;
        if (rootElem && rootSelector) {
            if (selectors[rootSelector]) {
                throw new Error('Invalid root selector');
            }
            selectors[rootSelector] = rootElem;
        }
        return result;
    };
    CellView.prototype.can = function (feature) {
        var interacting = this.graph.options.interacting;
        if (typeof interacting === 'function') {
            interacting = util_1.FunctionExt.call(interacting, this.graph, this);
        }
        if (typeof interacting === 'object') {
            var val = interacting[feature];
            if (typeof val === 'function') {
                val = util_1.FunctionExt.call(val, this.graph, this);
            }
            return val !== false;
        }
        if (typeof interacting === 'boolean') {
            return interacting;
        }
        return false;
    };
    CellView.prototype.cleanCache = function () {
        this.cache.clean();
        return this;
    };
    CellView.prototype.getCache = function (elem) {
        return this.cache.get(elem);
    };
    CellView.prototype.getDataOfElement = function (elem) {
        return this.cache.getData(elem);
    };
    CellView.prototype.getMatrixOfElement = function (elem) {
        return this.cache.getMatrix(elem);
    };
    CellView.prototype.getShapeOfElement = function (elem) {
        return this.cache.getShape(elem);
    };
    CellView.prototype.getScaleOfElement = function (node, scalableNode) {
        var sx;
        var sy;
        if (scalableNode && scalableNode.contains(node)) {
            var scale = util_1.Dom.scale(scalableNode);
            sx = 1 / scale.sx;
            sy = 1 / scale.sy;
        }
        else {
            sx = 1;
            sy = 1;
        }
        return { sx: sx, sy: sy };
    };
    CellView.prototype.getBoundingRectOfElement = function (elem) {
        return this.cache.getBoundingRect(elem);
    };
    CellView.prototype.getBBoxOfElement = function (elem) {
        var rect = this.getBoundingRectOfElement(elem);
        var matrix = this.getMatrixOfElement(elem);
        var rm = this.getRootRotatedMatrix();
        var tm = this.getRootTranslatedMatrix();
        return util_1.Dom.transformRectangle(rect, tm.multiply(rm).multiply(matrix));
    };
    CellView.prototype.getUnrotatedBBoxOfElement = function (elem) {
        var rect = this.getBoundingRectOfElement(elem);
        var matrix = this.getMatrixOfElement(elem);
        var tm = this.getRootTranslatedMatrix();
        return util_1.Dom.transformRectangle(rect, tm.multiply(matrix));
    };
    CellView.prototype.getBBox = function (options) {
        if (options === void 0) { options = {}; }
        var bbox;
        if (options.useCellGeometry) {
            var cell = this.cell;
            var angle = cell.isNode() ? cell.getAngle() : 0;
            bbox = cell.getBBox().bbox(angle);
        }
        else {
            bbox = this.getBBoxOfElement(this.container);
        }
        return this.graph.localToGraph(bbox);
    };
    CellView.prototype.getRootTranslatedMatrix = function () {
        var cell = this.cell;
        var pos = cell.isNode() ? cell.getPosition() : { x: 0, y: 0 };
        return util_1.Dom.createSVGMatrix().translate(pos.x, pos.y);
    };
    CellView.prototype.getRootRotatedMatrix = function () {
        var matrix = util_1.Dom.createSVGMatrix();
        var cell = this.cell;
        var angle = cell.isNode() ? cell.getAngle() : 0;
        if (angle) {
            var bbox = cell.getBBox();
            var cx = bbox.width / 2;
            var cy = bbox.height / 2;
            matrix = matrix.translate(cx, cy).rotate(angle).translate(-cx, -cy);
        }
        return matrix;
    };
    CellView.prototype.findMagnet = function (elem) {
        if (elem === void 0) { elem = this.container; }
        // If the overall cell has set `magnet === false`, then returns
        // `undefined` to announce there is no magnet found for this cell.
        // This is especially useful to set on cells that have 'ports'.
        // In this case, only the ports have set `magnet === true` and the
        // overall element has `magnet === false`.
        return this.findByAttr('magnet', elem);
    };
    CellView.prototype.updateAttrs = function (rootNode, attrs, options) {
        if (options === void 0) { options = {}; }
        if (options.rootBBox == null) {
            options.rootBBox = new geometry_1.Rectangle();
        }
        if (options.selectors == null) {
            options.selectors = this.selectors;
        }
        this.attr.update(rootNode, attrs, options);
    };
    CellView.prototype.isEdgeElement = function (magnet) {
        return this.cell.isEdge() && (magnet == null || magnet === this.container);
    };
    // #region highlight
    CellView.prototype.prepareHighlight = function (elem, options) {
        if (options === void 0) { options = {}; }
        var magnet = (elem && this.$(elem)[0]) || this.container;
        options.partial = magnet === this.container;
        return magnet;
    };
    CellView.prototype.highlight = function (elem, options) {
        if (options === void 0) { options = {}; }
        var magnet = this.prepareHighlight(elem, options);
        this.notify('cell:highlight', {
            magnet: magnet,
            options: options,
            view: this,
            cell: this.cell,
        });
        if (this.isEdgeView()) {
            this.notify('edge:highlight', {
                magnet: magnet,
                options: options,
                view: this,
                edge: this.cell,
                cell: this.cell,
            });
        }
        else if (this.isNodeView()) {
            this.notify('node:highlight', {
                magnet: magnet,
                options: options,
                view: this,
                node: this.cell,
                cell: this.cell,
            });
        }
        return this;
    };
    CellView.prototype.unhighlight = function (elem, options) {
        if (options === void 0) { options = {}; }
        var magnet = this.prepareHighlight(elem, options);
        this.notify('cell:unhighlight', {
            magnet: magnet,
            options: options,
            view: this,
            cell: this.cell,
        });
        if (this.isNodeView()) {
            this.notify('node:unhighlight', {
                magnet: magnet,
                options: options,
                view: this,
                node: this.cell,
                cell: this.cell,
            });
        }
        else if (this.isEdgeView()) {
            this.notify('edge:unhighlight', {
                magnet: magnet,
                options: options,
                view: this,
                edge: this.cell,
                cell: this.cell,
            });
        }
        return this;
    };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    CellView.prototype.notifyUnhighlight = function (magnet, options) { };
    // #endregion
    CellView.prototype.getEdgeTerminal = function (magnet, x, y, edge, type) {
        var cell = this.cell;
        var portId = this.findAttr('port', magnet);
        var selector = magnet.getAttribute('data-selector');
        var terminal = { cell: cell.id };
        if (selector != null) {
            terminal.magnet = selector;
        }
        if (portId != null) {
            terminal.port = portId;
            if (cell.isNode()) {
                if (!cell.hasPort(portId) && selector == null) {
                    // port created via the `port` attribute (not API)
                    terminal.selector = this.getSelector(magnet);
                }
            }
        }
        else if (selector == null && this.container !== magnet) {
            terminal.selector = this.getSelector(magnet);
        }
        return this.customizeEdgeTerminal(terminal, magnet, x, y, edge, type);
    };
    CellView.prototype.customizeEdgeTerminal = function (terminal, magnet, x, y, edge, type) {
        var raw = edge.getStrategy() || this.graph.options.connecting.strategy;
        if (raw) {
            var name_1 = typeof raw === 'string' ? raw : raw.name;
            var args = typeof raw === 'string' ? {} : raw.args || {};
            var registry = connection_strategy_1.ConnectionStrategy.registry;
            if (name_1) {
                var fn = registry.get(name_1);
                if (fn == null) {
                    return registry.onNotFound(name_1);
                }
                var result = util_1.FunctionExt.call(fn, this.graph, terminal, this, magnet, new geometry_1.Point(x, y), edge, type, args);
                if (result) {
                    return result;
                }
            }
        }
        return terminal;
    };
    CellView.prototype.getMagnetFromEdgeTerminal = function (terminal) {
        var cell = this.cell;
        var root = this.container;
        var portId = terminal.port;
        var selector = terminal.magnet;
        var magnet;
        if (portId != null && cell.isNode() && cell.hasPort(portId)) {
            magnet = this.findPortElem(portId, selector) || root;
        }
        else {
            if (!selector) {
                selector = terminal.selector;
            }
            if (!selector && portId != null) {
                selector = "[port=\"" + portId + "\"]";
            }
            magnet = this.findOne(selector, root, this.selectors);
        }
        return magnet;
    };
    // #region animate
    CellView.prototype.animate = function (elem, options) {
        var target = typeof elem === 'string' ? this.findOne(elem) : elem;
        if (target == null) {
            throw new Error('Invalid animation element.');
        }
        var parent = target.parentNode;
        var revert = function () {
            if (!parent) {
                util_1.Dom.remove(target);
            }
        };
        var vTarget = util_1.Vector.create(target);
        if (!parent) {
            vTarget.appendTo(this.graph.view.stage);
        }
        var onComplete = options.complete;
        options.complete = function (e) {
            revert();
            if (onComplete) {
                onComplete(e);
            }
        };
        return vTarget.animate(options);
    };
    CellView.prototype.animateTransform = function (elem, options) {
        var target = typeof elem === 'string' ? this.findOne(elem) : elem;
        if (target == null) {
            throw new Error('Invalid animation element.');
        }
        var parent = target.parentNode;
        var revert = function () {
            if (!parent) {
                util_1.Dom.remove(target);
            }
        };
        var vTarget = util_1.Vector.create(target);
        if (!parent) {
            vTarget.appendTo(this.graph.view.stage);
        }
        var onComplete = options.complete;
        options.complete = function (e) {
            revert();
            if (onComplete) {
                onComplete(e);
            }
        };
        return vTarget.animateTransform(options);
    };
    CellView.prototype.hasTools = function (name) {
        var tools = this.tools;
        if (tools == null) {
            return false;
        }
        if (name == null) {
            return true;
        }
        return tools.name === name;
    };
    CellView.prototype.addTools = function (config) {
        if (!this.can('toolsAddable')) {
            return this;
        }
        this.removeTools();
        if (config) {
            var tools = tool_1.ToolsView.isToolsView(config)
                ? config
                : new tool_1.ToolsView(config);
            this.tools = tools;
            this.graph.on('tools:hide', this.hideTools, this);
            this.graph.on('tools:show', this.showTools, this);
            this.graph.on('tools:remove', this.removeTools, this);
            tools.config({ view: this });
            tools.mount();
        }
        return this;
    };
    CellView.prototype.updateTools = function (options) {
        if (options === void 0) { options = {}; }
        if (this.tools) {
            this.tools.update(options);
        }
        return this;
    };
    CellView.prototype.removeTools = function () {
        if (this.tools) {
            this.tools.remove();
            this.graph.off('tools:hide', this.hideTools, this);
            this.graph.off('tools:show', this.showTools, this);
            this.graph.off('tools:remove', this.removeTools, this);
            this.tools = null;
        }
        return this;
    };
    CellView.prototype.hideTools = function () {
        if (this.tools) {
            this.tools.hide();
        }
        return this;
    };
    CellView.prototype.showTools = function () {
        if (this.tools) {
            this.tools.show();
        }
        return this;
    };
    CellView.prototype.renderTools = function () {
        var tools = this.cell.getTools();
        this.addTools(tools);
        return this;
    };
    CellView.prototype.notify = function (name, args) {
        this.trigger(name, args);
        this.graph.trigger(name, args);
        return this;
    };
    CellView.prototype.getEventArgs = function (e, x, y) {
        var view = this; // eslint-disable-line @typescript-eslint/no-this-alias
        var cell = view.cell;
        if (x == null || y == null) {
            return { e: e, view: view, cell: cell };
        }
        return { e: e, x: x, y: y, view: view, cell: cell };
    };
    CellView.prototype.onClick = function (e, x, y) {
        this.notify('cell:click', this.getEventArgs(e, x, y));
    };
    CellView.prototype.onDblClick = function (e, x, y) {
        this.notify('cell:dblclick', this.getEventArgs(e, x, y));
    };
    CellView.prototype.onContextMenu = function (e, x, y) {
        this.notify('cell:contextmenu', this.getEventArgs(e, x, y));
    };
    CellView.prototype.onMouseDown = function (e, x, y) {
        if (this.cell.model) {
            this.cachedModelForMouseEvent = this.cell.model;
            this.cachedModelForMouseEvent.startBatch('mouse');
        }
        this.notify('cell:mousedown', this.getEventArgs(e, x, y));
    };
    CellView.prototype.onMouseUp = function (e, x, y) {
        this.notify('cell:mouseup', this.getEventArgs(e, x, y));
        if (this.cachedModelForMouseEvent) {
            this.cachedModelForMouseEvent.stopBatch('mouse', { cell: this.cell });
            this.cachedModelForMouseEvent = null;
        }
    };
    CellView.prototype.onMouseMove = function (e, x, y) {
        this.notify('cell:mousemove', this.getEventArgs(e, x, y));
    };
    CellView.prototype.onMouseOver = function (e) {
        this.notify('cell:mouseover', this.getEventArgs(e));
    };
    CellView.prototype.onMouseOut = function (e) {
        this.notify('cell:mouseout', this.getEventArgs(e));
    };
    CellView.prototype.onMouseEnter = function (e) {
        this.notify('cell:mouseenter', this.getEventArgs(e));
    };
    CellView.prototype.onMouseLeave = function (e) {
        this.notify('cell:mouseleave', this.getEventArgs(e));
    };
    CellView.prototype.onMouseWheel = function (e, x, y, delta) {
        this.notify('cell:mousewheel', __assign({ delta: delta }, this.getEventArgs(e, x, y)));
    };
    CellView.prototype.onCustomEvent = function (e, name, x, y) {
        this.notify('cell:customevent', __assign({ name: name }, this.getEventArgs(e, x, y)));
        this.notify(name, __assign({}, this.getEventArgs(e, x, y)));
    };
    CellView.prototype.onMagnetMouseDown = function (e, magnet, x, y) { };
    CellView.prototype.onMagnetDblClick = function (e, magnet, x, y) { };
    CellView.prototype.onMagnetContextMenu = function (e, magnet, x, y) { };
    CellView.prototype.onLabelMouseDown = function (e, x, y) { };
    CellView.prototype.checkMouseleave = function (e) {
        var graph = this.graph;
        if (graph.renderer.isAsync()) {
            // Do the updates of the current view synchronously now
            graph.renderer.dumpView(this);
        }
        var target = this.getEventTarget(e, { fromPoint: true });
        var view = graph.renderer.findViewByElem(target);
        if (view === this) {
            return;
        }
        // Leaving the current view
        this.onMouseLeave(e);
        if (!view) {
            return;
        }
        // Entering another view
        view.onMouseEnter(e);
    };
    CellView.defaults = {
        isSvgElement: true,
        rootSelector: 'root',
        priority: 0,
        bootstrap: [],
        actions: {},
    };
    return CellView;
}(view_1.View));
exports.CellView = CellView;
(function (CellView) {
    CellView.Flag = flag_1.FlagManager;
    CellView.Attr = attr_1.AttrManager;
})(CellView = exports.CellView || (exports.CellView = {}));
exports.CellView = CellView;
(function (CellView) {
    CellView.toStringTag = "X6." + CellView.name;
    function isCellView(instance) {
        if (instance == null) {
            return false;
        }
        if (instance instanceof CellView) {
            return true;
        }
        var tag = instance[Symbol.toStringTag];
        var view = instance;
        if ((tag == null || tag === CellView.toStringTag) &&
            typeof view.isNodeView === 'function' &&
            typeof view.isEdgeView === 'function' &&
            typeof view.confirmUpdate === 'function') {
            return true;
        }
        return false;
    }
    CellView.isCellView = isCellView;
})(CellView = exports.CellView || (exports.CellView = {}));
exports.CellView = CellView;
// decorators
// ----
(function (CellView) {
    function priority(value) {
        return function (ctor) {
            ctor.config({ priority: value });
        };
    }
    CellView.priority = priority;
    function bootstrap(actions) {
        return function (ctor) {
            ctor.config({ bootstrap: actions });
        };
    }
    CellView.bootstrap = bootstrap;
})(CellView = exports.CellView || (exports.CellView = {}));
exports.CellView = CellView;
(function (CellView) {
    CellView.registry = registry_1.Registry.create({
        type: 'view',
    });
})(CellView = exports.CellView || (exports.CellView = {}));
exports.CellView = CellView;
//# sourceMappingURL=cell.js.map