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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GraphView = void 0;
var jquery_1 = __importDefault(require("jquery"));
var util_1 = require("../util");
var model_1 = require("../model");
var global_1 = require("../global");
var view_1 = require("../view");
var GraphView = /** @class */ (function (_super) {
    __extends(GraphView, _super);
    function GraphView(graph) {
        var _this = _super.call(this) || this;
        _this.graph = graph;
        var _a = view_1.Markup.parseJSONMarkup(GraphView.markup), selectors = _a.selectors, fragment = _a.fragment;
        _this.background = selectors.background;
        _this.grid = selectors.grid;
        _this.svg = selectors.svg;
        _this.defs = selectors.defs;
        _this.viewport = selectors.viewport;
        _this.primer = selectors.primer;
        _this.stage = selectors.stage;
        _this.decorator = selectors.decorator;
        _this.overlay = selectors.overlay;
        _this.container = _this.options.container;
        _this.restore = GraphView.snapshoot(_this.container);
        _this.$(_this.container)
            .addClass(_this.prefixClassName('graph'))
            .append(fragment);
        _this.delegateEvents();
        return _this;
    }
    Object.defineProperty(GraphView.prototype, "model", {
        get: function () {
            return this.graph.model;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(GraphView.prototype, "options", {
        get: function () {
            return this.graph.options;
        },
        enumerable: false,
        configurable: true
    });
    GraphView.prototype.delegateEvents = function () {
        var ctor = this.constructor;
        _super.prototype.delegateEvents.call(this, ctor.events);
        return this;
    };
    /**
     * Guard the specified event. If the event is not interesting, it
     * returns `true`, otherwise returns `false`.
     */
    GraphView.prototype.guard = function (e, view) {
        // handled as `contextmenu` type
        if (e.type === 'mousedown' && e.button === 2) {
            return true;
        }
        if (this.options.guard && this.options.guard(e, view)) {
            return true;
        }
        if (e.data && e.data.guarded !== undefined) {
            return e.data.guarded;
        }
        if (view && view.cell && model_1.Cell.isCell(view.cell)) {
            return false;
        }
        if (this.svg === e.target ||
            this.container === e.target ||
            jquery_1.default.contains(this.svg, e.target)) {
            return false;
        }
        return true;
    };
    GraphView.prototype.findView = function (elem) {
        return this.graph.renderer.findViewByElem(elem);
    };
    GraphView.prototype.onDblClick = function (evt) {
        if (this.options.preventDefaultDblClick) {
            evt.preventDefault();
        }
        var e = this.normalizeEvent(evt);
        var view = this.findView(e.target);
        if (this.guard(e, view)) {
            return;
        }
        var localPoint = this.graph.snapToGrid(e.clientX, e.clientY);
        if (view) {
            view.onDblClick(e, localPoint.x, localPoint.y);
        }
        else {
            this.graph.trigger('blank:dblclick', {
                e: e,
                x: localPoint.x,
                y: localPoint.y,
            });
        }
    };
    GraphView.prototype.onClick = function (evt) {
        if (this.getMouseMovedCount(evt) <= this.options.clickThreshold) {
            var e = this.normalizeEvent(evt);
            var view = this.findView(e.target);
            if (this.guard(e, view)) {
                return;
            }
            var localPoint = this.graph.snapToGrid(e.clientX, e.clientY);
            if (view) {
                view.onClick(e, localPoint.x, localPoint.y);
            }
            else {
                this.graph.trigger('blank:click', {
                    e: e,
                    x: localPoint.x,
                    y: localPoint.y,
                });
            }
        }
    };
    GraphView.prototype.isPreventDefaultContextMenu = function (evt, view) {
        var preventDefaultContextMenu = this.options.preventDefaultContextMenu;
        if (typeof preventDefaultContextMenu === 'function') {
            preventDefaultContextMenu = util_1.FunctionExt.call(preventDefaultContextMenu, this.graph, { view: view });
        }
        return preventDefaultContextMenu;
    };
    GraphView.prototype.onContextMenu = function (evt) {
        var e = this.normalizeEvent(evt);
        var view = this.findView(e.target);
        if (this.isPreventDefaultContextMenu(e, view)) {
            evt.preventDefault();
        }
        if (this.guard(e, view)) {
            return;
        }
        var localPoint = this.graph.snapToGrid(e.clientX, e.clientY);
        if (view) {
            view.onContextMenu(e, localPoint.x, localPoint.y);
        }
        else {
            this.graph.trigger('blank:contextmenu', {
                e: e,
                x: localPoint.x,
                y: localPoint.y,
            });
        }
    };
    GraphView.prototype.delegateDragEvents = function (e, view) {
        if (e.data == null) {
            e.data = {};
        }
        this.setEventData(e, {
            currentView: view || null,
            mouseMovedCount: 0,
            startPosition: {
                x: e.clientX,
                y: e.clientY,
            },
        });
        var ctor = this.constructor;
        this.delegateDocumentEvents(ctor.documentEvents, e.data);
        this.undelegateEvents();
    };
    GraphView.prototype.getMouseMovedCount = function (e) {
        var data = this.getEventData(e);
        return data.mouseMovedCount || 0;
    };
    GraphView.prototype.onMouseDown = function (evt) {
        var e = this.normalizeEvent(evt);
        var view = this.findView(e.target);
        if (this.guard(e, view)) {
            return;
        }
        if (this.options.preventDefaultMouseDown) {
            e.preventDefault();
        }
        var localPoint = this.graph.snapToGrid(e.clientX, e.clientY);
        if (view) {
            view.onMouseDown(e, localPoint.x, localPoint.y);
        }
        else {
            if (this.options.preventDefaultBlankAction &&
                ['touchstart'].includes(e.type)) {
                e.preventDefault();
            }
            this.graph.trigger('blank:mousedown', {
                e: e,
                x: localPoint.x,
                y: localPoint.y,
            });
        }
        this.delegateDragEvents(e, view);
    };
    GraphView.prototype.onMouseMove = function (evt) {
        var data = this.getEventData(evt);
        var startPosition = data.startPosition;
        if (startPosition &&
            startPosition.x === evt.clientX &&
            startPosition.y === evt.clientY) {
            return;
        }
        if (data.mouseMovedCount == null) {
            data.mouseMovedCount = 0;
        }
        data.mouseMovedCount += 1;
        var mouseMovedCount = data.mouseMovedCount;
        if (mouseMovedCount <= this.options.moveThreshold) {
            return;
        }
        var e = this.normalizeEvent(evt);
        var localPoint = this.graph.snapToGrid(e.clientX, e.clientY);
        var view = data.currentView;
        if (view) {
            view.onMouseMove(e, localPoint.x, localPoint.y);
        }
        else {
            this.graph.trigger('blank:mousemove', {
                e: e,
                x: localPoint.x,
                y: localPoint.y,
            });
        }
        this.setEventData(e, data);
    };
    GraphView.prototype.onMouseUp = function (e) {
        this.undelegateDocumentEvents();
        var normalized = this.normalizeEvent(e);
        var localPoint = this.graph.snapToGrid(normalized.clientX, normalized.clientY);
        var data = this.getEventData(e);
        var view = data.currentView;
        if (view) {
            view.onMouseUp(normalized, localPoint.x, localPoint.y);
        }
        else {
            this.graph.trigger('blank:mouseup', {
                e: normalized,
                x: localPoint.x,
                y: localPoint.y,
            });
        }
        if (!e.isPropagationStopped()) {
            this.onClick(jquery_1.default.Event(e, {
                type: 'click',
                data: e.data,
            }));
        }
        e.stopImmediatePropagation();
        this.delegateEvents();
    };
    GraphView.prototype.onMouseOver = function (evt) {
        var e = this.normalizeEvent(evt);
        var view = this.findView(e.target);
        if (this.guard(e, view)) {
            return;
        }
        if (view) {
            view.onMouseOver(e);
        }
        else {
            // prevent border of paper from triggering this
            if (this.container === e.target) {
                return;
            }
            this.graph.trigger('blank:mouseover', { e: e });
        }
    };
    GraphView.prototype.onMouseOut = function (evt) {
        var e = this.normalizeEvent(evt);
        var view = this.findView(e.target);
        if (this.guard(e, view)) {
            return;
        }
        if (view) {
            view.onMouseOut(e);
        }
        else {
            if (this.container === e.target) {
                return;
            }
            this.graph.trigger('blank:mouseout', { e: e });
        }
    };
    GraphView.prototype.onMouseEnter = function (evt) {
        var e = this.normalizeEvent(evt);
        var view = this.findView(e.target);
        if (this.guard(e, view)) {
            return;
        }
        var relatedView = this.graph.renderer.findViewByElem(e.relatedTarget);
        if (view) {
            if (relatedView === view) {
                // mouse moved from tool to view
                return;
            }
            view.onMouseEnter(e);
        }
        else {
            if (relatedView) {
                return;
            }
            this.graph.trigger('graph:mouseenter', { e: e });
        }
    };
    GraphView.prototype.onMouseLeave = function (evt) {
        var e = this.normalizeEvent(evt);
        var view = this.findView(e.target);
        if (this.guard(e, view)) {
            return;
        }
        var relatedView = this.graph.renderer.findViewByElem(e.relatedTarget);
        if (view) {
            if (relatedView === view) {
                // mouse moved from view to tool
                return;
            }
            view.onMouseLeave(e);
        }
        else {
            if (relatedView) {
                return;
            }
            this.graph.trigger('graph:mouseleave', { e: e });
        }
    };
    GraphView.prototype.onMouseWheel = function (evt) {
        var e = this.normalizeEvent(evt);
        var view = this.findView(e.target);
        if (this.guard(e, view)) {
            return;
        }
        var originalEvent = e.originalEvent;
        var localPoint = this.graph.snapToGrid(originalEvent.clientX, originalEvent.clientY);
        var delta = Math.max(-1, Math.min(1, originalEvent.wheelDelta || -originalEvent.detail));
        if (view) {
            view.onMouseWheel(e, localPoint.x, localPoint.y, delta);
        }
        else {
            this.graph.trigger('blank:mousewheel', {
                e: e,
                delta: delta,
                x: localPoint.x,
                y: localPoint.y,
            });
        }
    };
    GraphView.prototype.onCustomEvent = function (evt) {
        var elem = evt.currentTarget;
        var event = elem.getAttribute('event') || elem.getAttribute('data-event');
        if (event) {
            var view = this.findView(elem);
            if (view) {
                var e = this.normalizeEvent(evt);
                if (this.guard(e, view)) {
                    return;
                }
                var localPoint = this.graph.snapToGrid(e.clientX, e.clientY);
                view.onCustomEvent(e, event, localPoint.x, localPoint.y);
            }
        }
    };
    GraphView.prototype.handleMagnetEvent = function (evt, handler) {
        var magnetElem = evt.currentTarget;
        var magnetValue = magnetElem.getAttribute('magnet');
        if (magnetValue && magnetValue.toLowerCase() !== 'false') {
            var view = this.findView(magnetElem);
            if (view) {
                var e = this.normalizeEvent(evt);
                if (this.guard(e, view)) {
                    return;
                }
                var localPoint = this.graph.snapToGrid(e.clientX, e.clientY);
                util_1.FunctionExt.call(handler, this.graph, view, e, magnetElem, localPoint.x, localPoint.y);
            }
        }
    };
    GraphView.prototype.onMagnetMouseDown = function (e) {
        this.handleMagnetEvent(e, function (view, e, magnet, x, y) {
            view.onMagnetMouseDown(e, magnet, x, y);
        });
    };
    GraphView.prototype.onMagnetDblClick = function (e) {
        this.handleMagnetEvent(e, function (view, e, magnet, x, y) {
            view.onMagnetDblClick(e, magnet, x, y);
        });
    };
    GraphView.prototype.onMagnetContextMenu = function (evt) {
        var e = this.normalizeEvent(evt);
        var view = this.findView(e.target);
        if (this.isPreventDefaultContextMenu(e, view)) {
            e.preventDefault();
        }
        this.handleMagnetEvent(e, function (view, e, magnet, x, y) {
            view.onMagnetContextMenu(e, magnet, x, y);
        });
    };
    GraphView.prototype.onLabelMouseDown = function (evt) {
        var labelNode = evt.currentTarget;
        var view = this.findView(labelNode);
        if (view) {
            var e = this.normalizeEvent(evt);
            if (this.guard(e, view)) {
                return;
            }
            var localPoint = this.graph.snapToGrid(e.clientX, e.clientY);
            view.onLabelMouseDown(e, localPoint.x, localPoint.y);
        }
    };
    GraphView.prototype.onImageDragStart = function () {
        // This is the only way to prevent image dragging in Firefox that works.
        // Setting -moz-user-select: none, draggable="false" attribute or
        // user-drag: none didn't help.
        return false;
    };
    GraphView.prototype.dispose = function () {
        this.undelegateEvents();
        this.undelegateDocumentEvents();
        this.restore();
        this.restore = function () { };
    };
    __decorate([
        view_1.View.dispose()
    ], GraphView.prototype, "dispose", null);
    return GraphView;
}(view_1.View));
exports.GraphView = GraphView;
(function (GraphView) {
    var prefixCls = global_1.Config.prefixCls + "-graph";
    GraphView.markup = [
        {
            ns: util_1.Dom.ns.xhtml,
            tagName: 'div',
            selector: 'background',
            className: prefixCls + "-background",
        },
        {
            ns: util_1.Dom.ns.xhtml,
            tagName: 'div',
            selector: 'grid',
            className: prefixCls + "-grid",
        },
        {
            ns: util_1.Dom.ns.svg,
            tagName: 'svg',
            selector: 'svg',
            className: prefixCls + "-svg",
            attrs: {
                width: '100%',
                height: '100%',
                'xmlns:xlink': util_1.Dom.ns.xlink,
            },
            children: [
                {
                    tagName: 'defs',
                    selector: 'defs',
                },
                {
                    tagName: 'g',
                    selector: 'viewport',
                    className: prefixCls + "-svg-viewport",
                    children: [
                        {
                            tagName: 'g',
                            selector: 'primer',
                            className: prefixCls + "-svg-primer",
                        },
                        {
                            tagName: 'g',
                            selector: 'stage',
                            className: prefixCls + "-svg-stage",
                        },
                        {
                            tagName: 'g',
                            selector: 'decorator',
                            className: prefixCls + "-svg-decorator",
                        },
                        {
                            tagName: 'g',
                            selector: 'overlay',
                            className: prefixCls + "-svg-overlay",
                        },
                    ],
                },
            ],
        },
    ];
    function snapshoot(elem) {
        var cloned = elem.cloneNode();
        elem.childNodes.forEach(function (child) { return cloned.appendChild(child); });
        return function () {
            // remove all children
            util_1.Dom.empty(elem);
            // remove all attributes
            while (elem.attributes.length > 0) {
                elem.removeAttribute(elem.attributes[0].name);
            }
            // restore attributes
            for (var i = 0, l = cloned.attributes.length; i < l; i += 1) {
                var attr = cloned.attributes[i];
                elem.setAttribute(attr.name, attr.value);
            }
            // restore children
            cloned.childNodes.forEach(function (child) { return elem.appendChild(child); });
        };
    }
    GraphView.snapshoot = snapshoot;
})(GraphView = exports.GraphView || (exports.GraphView = {}));
exports.GraphView = GraphView;
(function (GraphView) {
    var _a;
    var prefixCls = global_1.Config.prefixCls;
    GraphView.events = (_a = {
            dblclick: 'onDblClick',
            contextmenu: 'onContextMenu',
            touchstart: 'onMouseDown',
            mousedown: 'onMouseDown',
            mouseover: 'onMouseOver',
            mouseout: 'onMouseOut',
            mouseenter: 'onMouseEnter',
            mouseleave: 'onMouseLeave',
            mousewheel: 'onMouseWheel',
            DOMMouseScroll: 'onMouseWheel'
        },
        _a["mouseenter  ." + prefixCls + "-cell"] = 'onMouseEnter',
        _a["mouseleave  ." + prefixCls + "-cell"] = 'onMouseLeave',
        _a["mouseenter  ." + prefixCls + "-cell-tools"] = 'onMouseEnter',
        _a["mouseleave  ." + prefixCls + "-cell-tools"] = 'onMouseLeave',
        _a["mousedown   ." + prefixCls + "-cell [event]"] = 'onCustomEvent',
        _a["touchstart  ." + prefixCls + "-cell [event]"] = 'onCustomEvent',
        _a["mousedown   ." + prefixCls + "-cell [data-event]"] = 'onCustomEvent',
        _a["touchstart  ." + prefixCls + "-cell [data-event]"] = 'onCustomEvent',
        _a["dblclick    ." + prefixCls + "-cell [magnet]"] = 'onMagnetDblClick',
        _a["contextmenu ." + prefixCls + "-cell [magnet]"] = 'onMagnetContextMenu',
        _a["mousedown   ." + prefixCls + "-cell [magnet]"] = 'onMagnetMouseDown',
        _a["touchstart  ." + prefixCls + "-cell [magnet]"] = 'onMagnetMouseDown',
        _a["dblclick    ." + prefixCls + "-cell [data-magnet]"] = 'onMagnetDblClick',
        _a["contextmenu ." + prefixCls + "-cell [data-magnet]"] = 'onMagnetContextMenu',
        _a["mousedown   ." + prefixCls + "-cell [data-magnet]"] = 'onMagnetMouseDown',
        _a["touchstart  ." + prefixCls + "-cell [data-magnet]"] = 'onMagnetMouseDown',
        _a["dragstart   ." + prefixCls + "-cell image"] = 'onImageDragStart',
        _a["mousedown   ." + prefixCls + "-edge ." + prefixCls + "-edge-label"] = 'onLabelMouseDown',
        _a["touchstart  ." + prefixCls + "-edge ." + prefixCls + "-edge-label"] = 'onLabelMouseDown',
        _a);
    GraphView.documentEvents = {
        mousemove: 'onMouseMove',
        touchmove: 'onMouseMove',
        mouseup: 'onMouseUp',
        touchend: 'onMouseUp',
        touchcancel: 'onMouseUp',
    };
})(GraphView = exports.GraphView || (exports.GraphView = {}));
exports.GraphView = GraphView;
//# sourceMappingURL=view.js.map