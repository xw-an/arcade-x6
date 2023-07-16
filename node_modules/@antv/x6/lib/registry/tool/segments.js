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
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
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
exports.Segments = void 0;
var util_1 = require("../../util");
var geometry_1 = require("../../geometry");
var view_1 = require("../../view/view");
var tool_1 = require("../../view/tool");
var Util = __importStar(require("./util"));
var Segments = /** @class */ (function (_super) {
    __extends(Segments, _super);
    function Segments() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.handles = [];
        return _this;
    }
    Object.defineProperty(Segments.prototype, "vertices", {
        get: function () {
            return this.cellView.cell.getVertices();
        },
        enumerable: false,
        configurable: true
    });
    Segments.prototype.update = function () {
        this.render();
        return this;
    };
    Segments.prototype.onRender = function () {
        util_1.Dom.addClass(this.container, this.prefixClassName('edge-tool-segments'));
        this.resetHandles();
        var edgeView = this.cellView;
        var vertices = __spreadArray([], this.vertices, true);
        vertices.unshift(edgeView.sourcePoint);
        vertices.push(edgeView.targetPoint);
        for (var i = 0, l = vertices.length; i < l - 1; i += 1) {
            var vertex = vertices[i];
            var nextVertex = vertices[i + 1];
            var handle = this.renderHandle(vertex, nextVertex, i);
            this.stamp(handle.container);
            this.handles.push(handle);
        }
        return this;
    };
    Segments.prototype.renderHandle = function (vertex, nextVertex, index) {
        var _this = this;
        var handle = this.options.createHandle({
            index: index,
            graph: this.graph,
            guard: function (evt) { return _this.guard(evt); },
            attrs: this.options.attrs || {},
        });
        if (this.options.processHandle) {
            this.options.processHandle(handle);
        }
        this.graph.hook.onToolItemCreated({
            name: 'segments',
            cell: this.cell,
            view: this.cellView,
            tool: handle,
        });
        this.updateHandle(handle, vertex, nextVertex);
        this.container.appendChild(handle.container);
        this.startHandleListening(handle);
        return handle;
    };
    Segments.prototype.startHandleListening = function (handle) {
        handle.on('change', this.onHandleChange, this);
        handle.on('changing', this.onHandleChanging, this);
        handle.on('changed', this.onHandleChanged, this);
    };
    Segments.prototype.stopHandleListening = function (handle) {
        handle.off('change', this.onHandleChange, this);
        handle.off('changing', this.onHandleChanging, this);
        handle.off('changed', this.onHandleChanged, this);
    };
    Segments.prototype.resetHandles = function () {
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
    Segments.prototype.shiftHandleIndexes = function (delta) {
        var handles = this.handles;
        for (var i = 0, n = handles.length; i < n; i += 1) {
            handles[i].options.index += delta;
        }
    };
    Segments.prototype.resetAnchor = function (type, anchor) {
        var edge = this.cellView.cell;
        var options = {
            ui: true,
            toolId: this.cid,
        };
        if (anchor) {
            edge.prop([type, 'anchor'], anchor, options);
        }
        else {
            edge.removeProp([type, 'anchor'], options);
        }
    };
    Segments.prototype.snapHandle = function (handle, position, data) {
        var axis = handle.options.axis;
        var index = handle.options.index;
        var edgeView = this.cellView;
        var edge = edgeView.cell;
        var vertices = edge.getVertices();
        var prev = vertices[index - 2] || data.sourceAnchor;
        var next = vertices[index + 1] || data.targetAnchor;
        var snapRadius = this.options.snapRadius;
        if (Math.abs(position[axis] - prev[axis]) < snapRadius) {
            position[axis] = prev[axis];
        }
        else if (Math.abs(position[axis] - next[axis]) < snapRadius) {
            position[axis] = next[axis];
        }
        return position;
    };
    Segments.prototype.onHandleChanging = function (_a) {
        var handle = _a.handle, e = _a.e;
        var graph = this.graph;
        var options = this.options;
        var edgeView = this.cellView;
        var anchorFn = options.anchor;
        var axis = handle.options.axis;
        var index = handle.options.index - 1;
        var data = this.getEventData(e);
        var evt = this.normalizeEvent(e);
        var coords = graph.snapToGrid(evt.clientX, evt.clientY);
        var position = this.snapHandle(handle, coords.clone(), data);
        var vertices = util_1.ObjectExt.cloneDeep(this.vertices);
        var vertex = vertices[index];
        var nextVertex = vertices[index + 1];
        // First Segment
        var sourceView = edgeView.sourceView;
        var sourceBBox = edgeView.sourceBBox;
        var changeSourceAnchor = false;
        var deleteSourceAnchor = false;
        if (!vertex) {
            vertex = edgeView.sourceAnchor.toJSON();
            vertex[axis] = position[axis];
            if (sourceBBox.containsPoint(vertex)) {
                changeSourceAnchor = true;
            }
            else {
                vertices.unshift(vertex);
                this.shiftHandleIndexes(1);
                deleteSourceAnchor = true;
            }
        }
        else if (index === 0) {
            if (sourceBBox.containsPoint(vertex)) {
                vertices.shift();
                this.shiftHandleIndexes(-1);
                changeSourceAnchor = true;
            }
            else {
                vertex[axis] = position[axis];
                deleteSourceAnchor = true;
            }
        }
        else {
            vertex[axis] = position[axis];
        }
        if (typeof anchorFn === 'function' && sourceView) {
            if (changeSourceAnchor) {
                var sourceAnchorPosition = data.sourceAnchor.clone();
                sourceAnchorPosition[axis] = position[axis];
                var sourceAnchor = util_1.FunctionExt.call(anchorFn, edgeView, sourceAnchorPosition, sourceView, edgeView.sourceMagnet || sourceView.container, 'source', edgeView, this);
                this.resetAnchor('source', sourceAnchor);
            }
            if (deleteSourceAnchor) {
                this.resetAnchor('source', data.sourceAnchorDef);
            }
        }
        // Last segment
        var targetView = edgeView.targetView;
        var targetBBox = edgeView.targetBBox;
        var changeTargetAnchor = false;
        var deleteTargetAnchor = false;
        if (!nextVertex) {
            nextVertex = edgeView.targetAnchor.toJSON();
            nextVertex[axis] = position[axis];
            if (targetBBox.containsPoint(nextVertex)) {
                changeTargetAnchor = true;
            }
            else {
                vertices.push(nextVertex);
                deleteTargetAnchor = true;
            }
        }
        else if (index === vertices.length - 2) {
            if (targetBBox.containsPoint(nextVertex)) {
                vertices.pop();
                changeTargetAnchor = true;
            }
            else {
                nextVertex[axis] = position[axis];
                deleteTargetAnchor = true;
            }
        }
        else {
            nextVertex[axis] = position[axis];
        }
        if (typeof anchorFn === 'function' && targetView) {
            if (changeTargetAnchor) {
                var targetAnchorPosition = data.targetAnchor.clone();
                targetAnchorPosition[axis] = position[axis];
                var targetAnchor = util_1.FunctionExt.call(anchorFn, edgeView, targetAnchorPosition, targetView, edgeView.targetMagnet || targetView.container, 'target', edgeView, this);
                this.resetAnchor('target', targetAnchor);
            }
            if (deleteTargetAnchor) {
                this.resetAnchor('target', data.targetAnchorDef);
            }
        }
        if (!geometry_1.Point.equalPoints(vertices, this.vertices)) {
            this.cellView.cell.setVertices(vertices, { ui: true, toolId: this.cid });
        }
        this.updateHandle(handle, vertex, nextVertex, 0);
        if (!options.stopPropagation) {
            edgeView.notifyMouseMove(evt, coords.x, coords.y);
        }
    };
    Segments.prototype.onHandleChange = function (_a) {
        var handle = _a.handle, e = _a.e;
        var options = this.options;
        var handles = this.handles;
        var edgeView = this.cellView;
        var index = handle.options.index;
        if (!Array.isArray(handles)) {
            return;
        }
        for (var i = 0, n = handles.length; i < n; i += 1) {
            if (i !== index) {
                handles[i].hide();
            }
        }
        this.focus();
        this.setEventData(e, {
            sourceAnchor: edgeView.sourceAnchor.clone(),
            targetAnchor: edgeView.targetAnchor.clone(),
            sourceAnchorDef: util_1.ObjectExt.cloneDeep(this.cell.prop(['source', 'anchor'])),
            targetAnchorDef: util_1.ObjectExt.cloneDeep(this.cell.prop(['target', 'anchor'])),
        });
        this.cell.startBatch('move-segment', { ui: true, toolId: this.cid });
        if (!options.stopPropagation) {
            var normalizedEvent = this.normalizeEvent(e);
            var coords = this.graph.snapToGrid(normalizedEvent.clientX, normalizedEvent.clientY);
            edgeView.notifyMouseDown(normalizedEvent, coords.x, coords.y);
        }
    };
    Segments.prototype.onHandleChanged = function (_a) {
        var e = _a.e;
        var options = this.options;
        var edgeView = this.cellView;
        if (options.removeRedundancies) {
            edgeView.removeRedundantLinearVertices({ ui: true, toolId: this.cid });
        }
        var normalizedEvent = this.normalizeEvent(e);
        var coords = this.graph.snapToGrid(normalizedEvent.clientX, normalizedEvent.clientY);
        this.render();
        this.blur();
        this.cell.stopBatch('move-segment', { ui: true, toolId: this.cid });
        if (!options.stopPropagation) {
            edgeView.notifyMouseUp(normalizedEvent, coords.x, coords.y);
        }
        edgeView.checkMouseleave(normalizedEvent);
        options.onChanged && options.onChanged({ edge: edgeView.cell, edgeView: edgeView });
    };
    Segments.prototype.updateHandle = function (handle, vertex, nextVertex, offset) {
        if (offset === void 0) { offset = 0; }
        var precision = this.options.precision || 0;
        var vertical = Math.abs(vertex.x - nextVertex.x) < precision;
        var horizontal = Math.abs(vertex.y - nextVertex.y) < precision;
        if (vertical || horizontal) {
            var segmentLine = new geometry_1.Line(vertex, nextVertex);
            var length_1 = segmentLine.length();
            if (length_1 < this.options.threshold) {
                handle.hide();
            }
            else {
                var position = segmentLine.getCenter();
                var axis = vertical ? 'x' : 'y';
                position[axis] += offset || 0;
                var angle = segmentLine.vector().vectorAngle(new geometry_1.Point(1, 0));
                handle.updatePosition(position.x, position.y, angle, this.cellView);
                handle.show();
                handle.options.axis = axis;
            }
        }
        else {
            handle.hide();
        }
    };
    Segments.prototype.onRemove = function () {
        this.resetHandles();
    };
    return Segments;
}(tool_1.ToolsView.ToolItem));
exports.Segments = Segments;
(function (Segments) {
    var Handle = /** @class */ (function (_super) {
        __extends(Handle, _super);
        function Handle(options) {
            var _this = _super.call(this) || this;
            _this.options = options;
            _this.render();
            _this.delegateEvents({
                mousedown: 'onMouseDown',
                touchstart: 'onMouseDown',
            });
            return _this;
        }
        Handle.prototype.render = function () {
            this.container = view_1.View.createElement('rect', true);
            var attrs = this.options.attrs;
            if (typeof attrs === 'function') {
                var defaults = Segments.getDefaults();
                this.setAttrs(__assign(__assign({}, defaults.attrs), attrs(this)));
            }
            else {
                this.setAttrs(attrs);
            }
            this.addClass(this.prefixClassName('edge-tool-segment'));
        };
        Handle.prototype.updatePosition = function (x, y, angle, view) {
            var p = view.getClosestPoint(new geometry_1.Point(x, y)) || new geometry_1.Point(x, y);
            var matrix = util_1.Dom.createSVGMatrix().translate(p.x, p.y);
            if (!p.equals({ x: x, y: y })) {
                var line = new geometry_1.Line(x, y, p.x, p.y);
                var deg = line.vector().vectorAngle(new geometry_1.Point(1, 0));
                if (deg !== 0) {
                    deg += 90;
                }
                matrix = matrix.rotate(deg);
            }
            else {
                matrix = matrix.rotate(angle);
            }
            this.setAttrs({
                transform: util_1.Dom.matrixToTransformString(matrix),
                cursor: angle % 180 === 0 ? 'row-resize' : 'col-resize',
            });
        };
        Handle.prototype.onMouseDown = function (evt) {
            if (this.options.guard(evt)) {
                return;
            }
            this.trigger('change', { e: evt, handle: this });
            evt.stopPropagation();
            evt.preventDefault();
            this.options.graph.view.undelegateEvents();
            this.delegateDocumentEvents({
                mousemove: 'onMouseMove',
                touchmove: 'onMouseMove',
                mouseup: 'onMouseUp',
                touchend: 'onMouseUp',
                touchcancel: 'onMouseUp',
            }, evt.data);
        };
        Handle.prototype.onMouseMove = function (evt) {
            this.emit('changing', { e: evt, handle: this });
        };
        Handle.prototype.onMouseUp = function (evt) {
            this.emit('changed', { e: evt, handle: this });
            this.undelegateDocumentEvents();
            this.options.graph.view.delegateEvents();
        };
        Handle.prototype.show = function () {
            this.container.style.display = '';
        };
        Handle.prototype.hide = function () {
            this.container.style.display = 'none';
        };
        return Handle;
    }(view_1.View));
    Segments.Handle = Handle;
})(Segments = exports.Segments || (exports.Segments = {}));
exports.Segments = Segments;
(function (Segments) {
    Segments.config({
        name: 'segments',
        precision: 0.5,
        threshold: 40,
        snapRadius: 10,
        stopPropagation: true,
        removeRedundancies: true,
        attrs: {
            width: 20,
            height: 8,
            x: -10,
            y: -4,
            rx: 4,
            ry: 4,
            fill: '#333',
            stroke: '#fff',
            'stroke-width': 2,
        },
        createHandle: function (options) { return new Segments.Handle(options); },
        anchor: Util.getAnchor,
    });
})(Segments = exports.Segments || (exports.Segments = {}));
exports.Segments = Segments;
//# sourceMappingURL=segments.js.map