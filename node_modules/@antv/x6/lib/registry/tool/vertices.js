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
exports.Vertices = void 0;
var util_1 = require("../../global/util");
var geometry_1 = require("../../geometry");
var view_1 = require("../../view/view");
var tool_1 = require("../../view/tool");
var Vertices = /** @class */ (function (_super) {
    __extends(Vertices, _super);
    function Vertices() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.handles = [];
        return _this;
    }
    Object.defineProperty(Vertices.prototype, "vertices", {
        get: function () {
            return this.cellView.cell.getVertices();
        },
        enumerable: false,
        configurable: true
    });
    Vertices.prototype.onRender = function () {
        this.addClass(this.prefixClassName('edge-tool-vertices'));
        if (this.options.addable) {
            this.updatePath();
        }
        this.resetHandles();
        this.renderHandles();
        return this;
    };
    Vertices.prototype.update = function () {
        var vertices = this.vertices;
        if (vertices.length === this.handles.length) {
            this.updateHandles();
        }
        else {
            this.resetHandles();
            this.renderHandles();
        }
        if (this.options.addable) {
            this.updatePath();
        }
        return this;
    };
    Vertices.prototype.resetHandles = function () {
        var _this = this;
        var handles = this.handles;
        this.handles = [];
        if (handles) {
            handles.forEach(function (handle) {
                _this.stopHandleListening(handle);
                handle.remove();
            });
        }
    };
    Vertices.prototype.renderHandles = function () {
        var _this = this;
        var vertices = this.vertices;
        for (var i = 0, l = vertices.length; i < l; i += 1) {
            var vertex = vertices[i];
            var createHandle = this.options.createHandle;
            var processHandle = this.options.processHandle;
            var handle = createHandle({
                index: i,
                graph: this.graph,
                guard: function (evt) { return _this.guard(evt); },
                attrs: this.options.attrs || {},
            });
            if (processHandle) {
                processHandle(handle);
            }
            this.graph.hook.onToolItemCreated({
                name: 'vertices',
                cell: this.cell,
                view: this.cellView,
                tool: handle,
            });
            handle.updatePosition(vertex.x, vertex.y);
            this.stamp(handle.container);
            this.container.appendChild(handle.container);
            this.handles.push(handle);
            this.startHandleListening(handle);
        }
    };
    Vertices.prototype.updateHandles = function () {
        var vertices = this.vertices;
        for (var i = 0, l = vertices.length; i < l; i += 1) {
            var vertex = vertices[i];
            var handle = this.handles[i];
            if (handle) {
                handle.updatePosition(vertex.x, vertex.y);
            }
        }
    };
    Vertices.prototype.updatePath = function () {
        var connection = this.childNodes.connection;
        if (connection) {
            connection.setAttribute('d', this.cellView.getConnectionPathData());
        }
    };
    Vertices.prototype.startHandleListening = function (handle) {
        var edgeView = this.cellView;
        if (edgeView.can('vertexMovable')) {
            handle.on('change', this.onHandleChange, this);
            handle.on('changing', this.onHandleChanging, this);
            handle.on('changed', this.onHandleChanged, this);
        }
        if (edgeView.can('vertexDeletable')) {
            handle.on('remove', this.onHandleRemove, this);
        }
    };
    Vertices.prototype.stopHandleListening = function (handle) {
        var edgeView = this.cellView;
        if (edgeView.can('vertexMovable')) {
            handle.off('change', this.onHandleChange, this);
            handle.off('changing', this.onHandleChanging, this);
            handle.off('changed', this.onHandleChanged, this);
        }
        if (edgeView.can('vertexDeletable')) {
            handle.off('remove', this.onHandleRemove, this);
        }
    };
    Vertices.prototype.getNeighborPoints = function (index) {
        var edgeView = this.cellView;
        var vertices = this.vertices;
        var prev = index > 0 ? vertices[index - 1] : edgeView.sourceAnchor;
        var next = index < vertices.length - 1 ? vertices[index + 1] : edgeView.targetAnchor;
        return {
            prev: geometry_1.Point.create(prev),
            next: geometry_1.Point.create(next),
        };
    };
    Vertices.prototype.getMouseEventArgs = function (evt) {
        var e = this.normalizeEvent(evt);
        var _a = this.graph.snapToGrid(e.clientX, e.clientY), x = _a.x, y = _a.y;
        return { e: e, x: x, y: y };
    };
    Vertices.prototype.onHandleChange = function (_a) {
        var e = _a.e;
        this.focus();
        var edgeView = this.cellView;
        edgeView.cell.startBatch('move-vertex', { ui: true, toolId: this.cid });
        if (!this.options.stopPropagation) {
            var _b = this.getMouseEventArgs(e), evt = _b.e, x = _b.x, y = _b.y;
            edgeView.notifyMouseDown(evt, x, y);
        }
    };
    Vertices.prototype.onHandleChanging = function (_a) {
        var handle = _a.handle, e = _a.e;
        var edgeView = this.cellView;
        var index = handle.options.index;
        var _b = this.getMouseEventArgs(e), evt = _b.e, x = _b.x, y = _b.y;
        var vertex = { x: x, y: y };
        this.snapVertex(vertex, index);
        edgeView.cell.setVertexAt(index, vertex, { ui: true, toolId: this.cid });
        handle.updatePosition(vertex.x, vertex.y);
        if (!this.options.stopPropagation) {
            edgeView.notifyMouseMove(evt, x, y);
        }
    };
    Vertices.prototype.onHandleChanged = function (_a) {
        var e = _a.e;
        var options = this.options;
        var edgeView = this.cellView;
        if (options.addable) {
            this.updatePath();
        }
        if (!options.removeRedundancies) {
            return;
        }
        var verticesRemoved = edgeView.removeRedundantLinearVertices({
            ui: true,
            toolId: this.cid,
        });
        if (verticesRemoved) {
            this.render();
        }
        this.blur();
        edgeView.cell.stopBatch('move-vertex', { ui: true, toolId: this.cid });
        if (this.eventData(e).vertexAdded) {
            edgeView.cell.stopBatch('add-vertex', { ui: true, toolId: this.cid });
        }
        var _b = this.getMouseEventArgs(e), evt = _b.e, x = _b.x, y = _b.y;
        if (!this.options.stopPropagation) {
            edgeView.notifyMouseUp(evt, x, y);
        }
        edgeView.checkMouseleave(evt);
        options.onChanged && options.onChanged({ edge: edgeView.cell, edgeView: edgeView });
    };
    Vertices.prototype.snapVertex = function (vertex, index) {
        var snapRadius = this.options.snapRadius || 0;
        if (snapRadius > 0) {
            var neighbors = this.getNeighborPoints(index);
            var prev = neighbors.prev;
            var next = neighbors.next;
            if (Math.abs(vertex.x - prev.x) < snapRadius) {
                vertex.x = prev.x;
            }
            else if (Math.abs(vertex.x - next.x) < snapRadius) {
                vertex.x = next.x;
            }
            if (Math.abs(vertex.y - prev.y) < snapRadius) {
                vertex.y = neighbors.prev.y;
            }
            else if (Math.abs(vertex.y - next.y) < snapRadius) {
                vertex.y = next.y;
            }
        }
    };
    Vertices.prototype.onHandleRemove = function (_a) {
        var handle = _a.handle, e = _a.e;
        if (this.options.removable) {
            var index = handle.options.index;
            var edgeView = this.cellView;
            edgeView.cell.removeVertexAt(index, { ui: true });
            if (this.options.addable) {
                this.updatePath();
            }
            edgeView.checkMouseleave(this.normalizeEvent(e));
        }
    };
    Vertices.prototype.onPathMouseDown = function (evt) {
        var edgeView = this.cellView;
        if (this.guard(evt) ||
            !this.options.addable ||
            !edgeView.can('vertexAddable')) {
            return;
        }
        evt.stopPropagation();
        evt.preventDefault();
        var e = this.normalizeEvent(evt);
        var vertex = this.graph.snapToGrid(e.clientX, e.clientY).toJSON();
        edgeView.cell.startBatch('add-vertex', { ui: true, toolId: this.cid });
        var index = edgeView.getVertexIndex(vertex.x, vertex.y);
        this.snapVertex(vertex, index);
        edgeView.cell.insertVertex(vertex, index, {
            ui: true,
            toolId: this.cid,
        });
        this.render();
        var handle = this.handles[index];
        this.eventData(e, { vertexAdded: true });
        handle.onMouseDown(e);
    };
    Vertices.prototype.onRemove = function () {
        this.resetHandles();
    };
    return Vertices;
}(tool_1.ToolsView.ToolItem));
exports.Vertices = Vertices;
(function (Vertices) {
    var Handle = /** @class */ (function (_super) {
        __extends(Handle, _super);
        function Handle(options) {
            var _this = _super.call(this) || this;
            _this.options = options;
            _this.render();
            _this.delegateEvents({
                mousedown: 'onMouseDown',
                touchstart: 'onMouseDown',
                dblclick: 'onDoubleClick',
            });
            return _this;
        }
        Object.defineProperty(Handle.prototype, "graph", {
            get: function () {
                return this.options.graph;
            },
            enumerable: false,
            configurable: true
        });
        Handle.prototype.render = function () {
            this.container = view_1.View.createElement('circle', true);
            var attrs = this.options.attrs;
            if (typeof attrs === 'function') {
                var defaults = Vertices.getDefaults();
                this.setAttrs(__assign(__assign({}, defaults.attrs), attrs(this)));
            }
            else {
                this.setAttrs(attrs);
            }
            this.addClass(this.prefixClassName('edge-tool-vertex'));
        };
        Handle.prototype.updatePosition = function (x, y) {
            this.setAttrs({ cx: x, cy: y });
        };
        Handle.prototype.onMouseDown = function (evt) {
            if (this.options.guard(evt)) {
                return;
            }
            evt.stopPropagation();
            evt.preventDefault();
            this.graph.view.undelegateEvents();
            this.delegateDocumentEvents({
                mousemove: 'onMouseMove',
                touchmove: 'onMouseMove',
                mouseup: 'onMouseUp',
                touchend: 'onMouseUp',
                touchcancel: 'onMouseUp',
            }, evt.data);
            this.emit('change', { e: evt, handle: this });
        };
        Handle.prototype.onMouseMove = function (evt) {
            this.emit('changing', { e: evt, handle: this });
        };
        Handle.prototype.onMouseUp = function (evt) {
            this.emit('changed', { e: evt, handle: this });
            this.undelegateDocumentEvents();
            this.graph.view.delegateEvents();
        };
        Handle.prototype.onDoubleClick = function (evt) {
            this.emit('remove', { e: evt, handle: this });
        };
        return Handle;
    }(view_1.View));
    Vertices.Handle = Handle;
})(Vertices = exports.Vertices || (exports.Vertices = {}));
exports.Vertices = Vertices;
(function (Vertices) {
    var _a;
    var pathClassName = util_1.Util.prefix('edge-tool-vertex-path');
    Vertices.config({
        name: 'vertices',
        snapRadius: 20,
        addable: true,
        removable: true,
        removeRedundancies: true,
        stopPropagation: true,
        attrs: {
            r: 6,
            fill: '#333',
            stroke: '#fff',
            cursor: 'move',
            'stroke-width': 2,
        },
        createHandle: function (options) { return new Vertices.Handle(options); },
        markup: [
            {
                tagName: 'path',
                selector: 'connection',
                className: pathClassName,
                attrs: {
                    fill: 'none',
                    stroke: 'transparent',
                    'stroke-width': 10,
                    cursor: 'pointer',
                },
            },
        ],
        events: (_a = {},
            _a["mousedown ." + pathClassName] = 'onPathMouseDown',
            _a["touchstart ." + pathClassName] = 'onPathMouseDown',
            _a),
    });
})(Vertices = exports.Vertices || (exports.Vertices = {}));
exports.Vertices = Vertices;
//# sourceMappingURL=vertices.js.map