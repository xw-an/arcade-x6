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
exports.Edge = void 0;
var util_1 = require("../util");
var geometry_1 = require("../geometry");
var registry_1 = require("../registry");
var markup_1 = require("../view/markup");
var registry_2 = require("./registry");
var cell_1 = require("./cell");
var Edge = /** @class */ (function (_super) {
    __extends(Edge, _super);
    function Edge(metadata) {
        if (metadata === void 0) { metadata = {}; }
        return _super.call(this, metadata) || this;
    }
    Object.defineProperty(Edge.prototype, Symbol.toStringTag, {
        get: function () {
            return Edge.toStringTag;
        },
        enumerable: false,
        configurable: true
    });
    Edge.prototype.preprocess = function (metadata, ignoreIdCheck) {
        var source = metadata.source, sourceCell = metadata.sourceCell, sourcePort = metadata.sourcePort, sourcePoint = metadata.sourcePoint, target = metadata.target, targetCell = metadata.targetCell, targetPort = metadata.targetPort, targetPoint = metadata.targetPoint, others = __rest(metadata, ["source", "sourceCell", "sourcePort", "sourcePoint", "target", "targetCell", "targetPort", "targetPoint"]);
        var data = others;
        var isValidId = function (val) {
            return typeof val === 'string' || typeof val === 'number';
        };
        if (source != null) {
            if (cell_1.Cell.isCell(source)) {
                data.source = { cell: source.id };
            }
            else if (isValidId(source)) {
                data.source = { cell: source };
            }
            else if (geometry_1.Point.isPoint(source)) {
                data.source = source.toJSON();
            }
            else if (Array.isArray(source)) {
                data.source = { x: source[0], y: source[1] };
            }
            else {
                var cell = source.cell;
                if (cell_1.Cell.isCell(cell)) {
                    data.source = __assign(__assign({}, source), { cell: cell.id });
                }
                else {
                    data.source = source;
                }
            }
        }
        if (sourceCell != null || sourcePort != null) {
            var terminal = data.source;
            if (sourceCell != null) {
                var id = isValidId(sourceCell) ? sourceCell : sourceCell.id;
                if (terminal) {
                    terminal.cell = id;
                }
                else {
                    terminal = data.source = { cell: id };
                }
            }
            if (sourcePort != null && terminal) {
                terminal.port = sourcePort;
            }
        }
        else if (sourcePoint != null) {
            data.source = geometry_1.Point.create(sourcePoint).toJSON();
        }
        if (target != null) {
            if (cell_1.Cell.isCell(target)) {
                data.target = { cell: target.id };
            }
            else if (isValidId(target)) {
                data.target = { cell: target };
            }
            else if (geometry_1.Point.isPoint(target)) {
                data.target = target.toJSON();
            }
            else if (Array.isArray(target)) {
                data.target = { x: target[0], y: target[1] };
            }
            else {
                var cell = target.cell;
                if (cell_1.Cell.isCell(cell)) {
                    data.target = __assign(__assign({}, target), { cell: cell.id });
                }
                else {
                    data.target = target;
                }
            }
        }
        if (targetCell != null || targetPort != null) {
            var terminal = data.target;
            if (targetCell != null) {
                var id = isValidId(targetCell) ? targetCell : targetCell.id;
                if (terminal) {
                    terminal.cell = id;
                }
                else {
                    terminal = data.target = { cell: id };
                }
            }
            if (targetPort != null && terminal) {
                terminal.port = targetPort;
            }
        }
        else if (targetPoint != null) {
            data.target = geometry_1.Point.create(targetPoint).toJSON();
        }
        return _super.prototype.preprocess.call(this, data, ignoreIdCheck);
    };
    Edge.prototype.setup = function () {
        var _this = this;
        _super.prototype.setup.call(this);
        this.on('change:labels', function (args) { return _this.onLabelsChanged(args); });
        this.on('change:vertices', function (args) { return _this.onVertexsChanged(args); });
    };
    Edge.prototype.isEdge = function () {
        return true;
    };
    // #region terminal
    Edge.prototype.disconnect = function (options) {
        if (options === void 0) { options = {}; }
        this.store.set({
            source: { x: 0, y: 0 },
            target: { x: 0, y: 0 },
        }, options);
        return this;
    };
    Object.defineProperty(Edge.prototype, "source", {
        get: function () {
            return this.getSource();
        },
        set: function (data) {
            this.setSource(data);
        },
        enumerable: false,
        configurable: true
    });
    Edge.prototype.getSource = function () {
        return this.getTerminal('source');
    };
    Edge.prototype.getSourceCellId = function () {
        return this.source.cell;
    };
    Edge.prototype.getSourcePortId = function () {
        return this.source.port;
    };
    Edge.prototype.setSource = function (source, args, options) {
        if (options === void 0) { options = {}; }
        return this.setTerminal('source', source, args, options);
    };
    Object.defineProperty(Edge.prototype, "target", {
        get: function () {
            return this.getTarget();
        },
        set: function (data) {
            this.setTarget(data);
        },
        enumerable: false,
        configurable: true
    });
    Edge.prototype.getTarget = function () {
        return this.getTerminal('target');
    };
    Edge.prototype.getTargetCellId = function () {
        return this.target.cell;
    };
    Edge.prototype.getTargetPortId = function () {
        return this.target.port;
    };
    Edge.prototype.setTarget = function (target, args, options) {
        if (options === void 0) { options = {}; }
        return this.setTerminal('target', target, args, options);
    };
    Edge.prototype.getTerminal = function (type) {
        return __assign({}, this.store.get(type));
    };
    Edge.prototype.setTerminal = function (type, terminal, args, options) {
        if (options === void 0) { options = {}; }
        // `terminal` is a cell
        if (cell_1.Cell.isCell(terminal)) {
            this.store.set(type, util_1.ObjectExt.merge({}, args, { cell: terminal.id }), options);
            return this;
        }
        // `terminal` is a point-like object
        var p = terminal;
        if (geometry_1.Point.isPoint(terminal) || (p.x != null && p.y != null)) {
            this.store.set(type, util_1.ObjectExt.merge({}, args, { x: p.x, y: p.y }), options);
            return this;
        }
        // `terminal` is an object
        this.store.set(type, util_1.ObjectExt.cloneDeep(terminal), options);
        return this;
    };
    Edge.prototype.getSourcePoint = function () {
        return this.getTerminalPoint('source');
    };
    Edge.prototype.getTargetPoint = function () {
        return this.getTerminalPoint('target');
    };
    Edge.prototype.getTerminalPoint = function (type) {
        var terminal = this[type];
        if (geometry_1.Point.isPointLike(terminal)) {
            return geometry_1.Point.create(terminal);
        }
        var cell = this.getTerminalCell(type);
        if (cell) {
            return cell.getConnectionPoint(this, type);
        }
        return new geometry_1.Point();
    };
    Edge.prototype.getSourceCell = function () {
        return this.getTerminalCell('source');
    };
    Edge.prototype.getTargetCell = function () {
        return this.getTerminalCell('target');
    };
    Edge.prototype.getTerminalCell = function (type) {
        if (this.model) {
            var cellId = type === 'source' ? this.getSourceCellId() : this.getTargetCellId();
            if (cellId) {
                return this.model.getCell(cellId);
            }
        }
        return null;
    };
    Edge.prototype.getSourceNode = function () {
        return this.getTerminalNode('source');
    };
    Edge.prototype.getTargetNode = function () {
        return this.getTerminalNode('target');
    };
    Edge.prototype.getTerminalNode = function (type) {
        var cell = this; // eslint-disable-line
        var visited = {};
        while (cell && cell.isEdge()) {
            if (visited[cell.id]) {
                return null;
            }
            visited[cell.id] = true;
            cell = cell.getTerminalCell(type);
        }
        return cell && cell.isNode() ? cell : null;
    };
    Object.defineProperty(Edge.prototype, "router", {
        // #endregion
        // #region router
        get: function () {
            return this.getRouter();
        },
        set: function (data) {
            if (data == null) {
                this.removeRouter();
            }
            else {
                this.setRouter(data);
            }
        },
        enumerable: false,
        configurable: true
    });
    Edge.prototype.getRouter = function () {
        return this.store.get('router');
    };
    Edge.prototype.setRouter = function (name, args, options) {
        if (typeof name === 'object') {
            this.store.set('router', name, args);
        }
        else {
            this.store.set('router', { name: name, args: args }, options);
        }
        return this;
    };
    Edge.prototype.removeRouter = function (options) {
        if (options === void 0) { options = {}; }
        this.store.remove('router', options);
        return this;
    };
    Object.defineProperty(Edge.prototype, "connector", {
        // #endregion
        // #region connector
        get: function () {
            return this.getConnector();
        },
        set: function (data) {
            if (data == null) {
                this.removeConnector();
            }
            else {
                this.setConnector(data);
            }
        },
        enumerable: false,
        configurable: true
    });
    Edge.prototype.getConnector = function () {
        return this.store.get('connector');
    };
    Edge.prototype.setConnector = function (name, args, options) {
        if (typeof name === 'object') {
            this.store.set('connector', name, args);
        }
        else {
            this.store.set('connector', { name: name, args: args }, options);
        }
        return this;
    };
    Edge.prototype.removeConnector = function (options) {
        if (options === void 0) { options = {}; }
        return this.store.remove('connector', options);
    };
    Object.defineProperty(Edge.prototype, "strategy", {
        // #endregion
        // #region strategy
        get: function () {
            return this.getStrategy();
        },
        set: function (data) {
            if (data == null) {
                this.removeStrategy();
            }
            else {
                this.setStrategy(data);
            }
        },
        enumerable: false,
        configurable: true
    });
    Edge.prototype.getStrategy = function () {
        return this.store.get('strategy');
    };
    Edge.prototype.setStrategy = function (name, args, options) {
        if (typeof name === 'object') {
            this.store.set('strategy', name, args);
        }
        else {
            this.store.set('strategy', { name: name, args: args }, options);
        }
        return this;
    };
    Edge.prototype.removeStrategy = function (options) {
        if (options === void 0) { options = {}; }
        return this.store.remove('strategy', options);
    };
    // #endregion
    // #region labels
    Edge.prototype.getDefaultLabel = function () {
        var ctor = this.constructor;
        var defaults = this.store.get('defaultLabel') || ctor.defaultLabel || {};
        return util_1.ObjectExt.cloneDeep(defaults);
    };
    Object.defineProperty(Edge.prototype, "labels", {
        get: function () {
            return this.getLabels();
        },
        set: function (labels) {
            this.setLabels(labels);
        },
        enumerable: false,
        configurable: true
    });
    Edge.prototype.getLabels = function () {
        var _this = this;
        return __spreadArray([], this.store.get('labels', []), true).map(function (item) {
            return _this.parseLabel(item);
        });
    };
    Edge.prototype.setLabels = function (labels, options) {
        if (options === void 0) { options = {}; }
        this.store.set('labels', Array.isArray(labels) ? labels : [labels], options);
        return this;
    };
    Edge.prototype.insertLabel = function (label, index, options) {
        if (options === void 0) { options = {}; }
        var labels = this.getLabels();
        var len = labels.length;
        var idx = index != null && Number.isFinite(index) ? index : len;
        if (idx < 0) {
            idx = len + idx + 1;
        }
        labels.splice(idx, 0, this.parseLabel(label));
        return this.setLabels(labels, options);
    };
    Edge.prototype.appendLabel = function (label, options) {
        if (options === void 0) { options = {}; }
        return this.insertLabel(label, -1, options);
    };
    Edge.prototype.getLabelAt = function (index) {
        var labels = this.getLabels();
        if (index != null && Number.isFinite(index)) {
            return this.parseLabel(labels[index]);
        }
        return null;
    };
    Edge.prototype.setLabelAt = function (index, label, options) {
        if (options === void 0) { options = {}; }
        if (index != null && Number.isFinite(index)) {
            var labels = this.getLabels();
            labels[index] = this.parseLabel(label);
            this.setLabels(labels, options);
        }
        return this;
    };
    Edge.prototype.removeLabelAt = function (index, options) {
        if (options === void 0) { options = {}; }
        var labels = this.getLabels();
        var idx = index != null && Number.isFinite(index) ? index : -1;
        var removed = labels.splice(idx, 1);
        this.setLabels(labels, options);
        return removed.length ? removed[0] : null;
    };
    Edge.prototype.parseLabel = function (label) {
        if (typeof label === 'string') {
            var ctor = this.constructor;
            return ctor.parseStringLabel(label);
        }
        return label;
    };
    Edge.prototype.onLabelsChanged = function (_a) {
        var previous = _a.previous, current = _a.current;
        var added = previous && current
            ? current.filter(function (label1) {
                if (!previous.find(function (label2) {
                    return label1 === label2 || util_1.ObjectExt.isEqual(label1, label2);
                })) {
                    return label1;
                }
                return null;
            })
            : current
                ? __spreadArray([], current, true) : [];
        var removed = previous && current
            ? previous.filter(function (label1) {
                if (!current.find(function (label2) {
                    return label1 === label2 || util_1.ObjectExt.isEqual(label1, label2);
                })) {
                    return label1;
                }
                return null;
            })
            : previous
                ? __spreadArray([], previous, true) : [];
        if (added.length > 0) {
            this.notify('labels:added', { added: added, cell: this, edge: this });
        }
        if (removed.length > 0) {
            this.notify('labels:removed', { removed: removed, cell: this, edge: this });
        }
    };
    Object.defineProperty(Edge.prototype, "vertexMarkup", {
        // #endregion
        // #region vertices
        get: function () {
            return this.getVertexMarkup();
        },
        set: function (markup) {
            this.setVertexMarkup(markup);
        },
        enumerable: false,
        configurable: true
    });
    Edge.prototype.getDefaultVertexMarkup = function () {
        return this.store.get('defaultVertexMarkup') || markup_1.Markup.getEdgeVertexMarkup();
    };
    Edge.prototype.getVertexMarkup = function () {
        return this.store.get('vertexMarkup') || this.getDefaultVertexMarkup();
    };
    Edge.prototype.setVertexMarkup = function (markup, options) {
        if (options === void 0) { options = {}; }
        this.store.set('vertexMarkup', markup_1.Markup.clone(markup), options);
        return this;
    };
    Object.defineProperty(Edge.prototype, "vertices", {
        get: function () {
            return this.getVertices();
        },
        set: function (vertices) {
            this.setVertices(vertices);
        },
        enumerable: false,
        configurable: true
    });
    Edge.prototype.getVertices = function () {
        return __spreadArray([], this.store.get('vertices', []), true);
    };
    Edge.prototype.setVertices = function (vertices, options) {
        if (options === void 0) { options = {}; }
        var points = Array.isArray(vertices) ? vertices : [vertices];
        this.store.set('vertices', points.map(function (p) { return geometry_1.Point.toJSON(p); }), options);
        return this;
    };
    Edge.prototype.insertVertex = function (vertice, index, options) {
        if (options === void 0) { options = {}; }
        var vertices = this.getVertices();
        var len = vertices.length;
        var idx = index != null && Number.isFinite(index) ? index : len;
        if (idx < 0) {
            idx = len + idx + 1;
        }
        vertices.splice(idx, 0, geometry_1.Point.toJSON(vertice));
        return this.setVertices(vertices, options);
    };
    Edge.prototype.appendVertex = function (vertex, options) {
        if (options === void 0) { options = {}; }
        return this.insertVertex(vertex, -1, options);
    };
    Edge.prototype.getVertexAt = function (index) {
        if (index != null && Number.isFinite(index)) {
            var vertices = this.getVertices();
            return vertices[index];
        }
        return null;
    };
    Edge.prototype.setVertexAt = function (index, vertice, options) {
        if (options === void 0) { options = {}; }
        if (index != null && Number.isFinite(index)) {
            var vertices = this.getVertices();
            vertices[index] = vertice;
            this.setVertices(vertices, options);
        }
        return this;
    };
    Edge.prototype.removeVertexAt = function (index, options) {
        if (options === void 0) { options = {}; }
        var vertices = this.getVertices();
        var idx = index != null && Number.isFinite(index) ? index : -1;
        vertices.splice(idx, 1);
        return this.setVertices(vertices, options);
    };
    Edge.prototype.onVertexsChanged = function (_a) {
        var previous = _a.previous, current = _a.current;
        var added = previous && current
            ? current.filter(function (p1) {
                if (!previous.find(function (p2) { return geometry_1.Point.equals(p1, p2); })) {
                    return p1;
                }
                return null;
            })
            : current
                ? __spreadArray([], current, true) : [];
        var removed = previous && current
            ? previous.filter(function (p1) {
                if (!current.find(function (p2) { return geometry_1.Point.equals(p1, p2); })) {
                    return p1;
                }
                return null;
            })
            : previous
                ? __spreadArray([], previous, true) : [];
        if (added.length > 0) {
            this.notify('vertexs:added', { added: added, cell: this, edge: this });
        }
        if (removed.length > 0) {
            this.notify('vertexs:removed', { removed: removed, cell: this, edge: this });
        }
    };
    // #endregion
    // #region markup
    Edge.prototype.getDefaultMarkup = function () {
        return this.store.get('defaultMarkup') || markup_1.Markup.getEdgeMarkup();
    };
    Edge.prototype.getMarkup = function () {
        return _super.prototype.getMarkup.call(this) || this.getDefaultMarkup();
    };
    Object.defineProperty(Edge.prototype, "toolMarkup", {
        // #endregion
        // #region toolMarkup
        get: function () {
            return this.getToolMarkup();
        },
        set: function (markup) {
            this.setToolMarkup(markup);
        },
        enumerable: false,
        configurable: true
    });
    Edge.prototype.getDefaultToolMarkup = function () {
        return this.store.get('defaultToolMarkup') || markup_1.Markup.getEdgeToolMarkup();
    };
    Edge.prototype.getToolMarkup = function () {
        return this.store.get('toolMarkup') || this.getDefaultToolMarkup();
    };
    Edge.prototype.setToolMarkup = function (markup, options) {
        if (options === void 0) { options = {}; }
        this.store.set('toolMarkup', markup, options);
        return this;
    };
    Object.defineProperty(Edge.prototype, "doubleToolMarkup", {
        get: function () {
            return this.getDoubleToolMarkup();
        },
        set: function (markup) {
            this.setDoubleToolMarkup(markup);
        },
        enumerable: false,
        configurable: true
    });
    Edge.prototype.getDefaultDoubleToolMarkup = function () {
        return this.store.get('defaultDoubleToolMarkup');
    };
    Edge.prototype.getDoubleToolMarkup = function () {
        return (this.store.get('doubleToolMarkup') || this.getDefaultDoubleToolMarkup());
    };
    Edge.prototype.setDoubleToolMarkup = function (markup, options) {
        if (options === void 0) { options = {}; }
        this.store.set('doubleToolMarkup', markup, options);
        return this;
    };
    Object.defineProperty(Edge.prototype, "arrowheadMarkup", {
        // #endregion
        // #region arrowheadMarkup
        get: function () {
            return this.getArrowheadMarkup();
        },
        set: function (markup) {
            this.setArrowheadMarkup(markup);
        },
        enumerable: false,
        configurable: true
    });
    Edge.prototype.getDefaultArrowheadMarkup = function () {
        return (this.store.get('defaultArrowheadMarkup') ||
            markup_1.Markup.getEdgeArrowheadMarkup());
    };
    Edge.prototype.getArrowheadMarkup = function () {
        return this.store.get('arrowheadMarkup') || this.getDefaultArrowheadMarkup();
    };
    Edge.prototype.setArrowheadMarkup = function (markup, options) {
        if (options === void 0) { options = {}; }
        this.store.set('arrowheadMarkup', markup, options);
        return this;
    };
    // #endregion
    // #region transform
    /**
     * Translate the edge vertices (and source and target if they are points)
     * by `tx` pixels in the x-axis and `ty` pixels in the y-axis.
     */
    Edge.prototype.translate = function (tx, ty, options) {
        if (options === void 0) { options = {}; }
        options.translateBy = options.translateBy || this.id;
        options.tx = tx;
        options.ty = ty;
        return this.applyToPoints(function (p) { return ({
            x: (p.x || 0) + tx,
            y: (p.y || 0) + ty,
        }); }, options);
    };
    /**
     * Scales the edge's points (vertices) relative to the given origin.
     */
    Edge.prototype.scale = function (sx, sy, origin, options) {
        if (options === void 0) { options = {}; }
        return this.applyToPoints(function (p) {
            return geometry_1.Point.create(p).scale(sx, sy, origin).toJSON();
        }, options);
    };
    Edge.prototype.applyToPoints = function (worker, options) {
        if (options === void 0) { options = {}; }
        var attrs = {};
        var source = this.getSource();
        var target = this.getTarget();
        if (geometry_1.Point.isPointLike(source)) {
            attrs.source = worker(source);
        }
        if (geometry_1.Point.isPointLike(target)) {
            attrs.target = worker(target);
        }
        var vertices = this.getVertices();
        if (vertices.length > 0) {
            attrs.vertices = vertices.map(worker);
        }
        this.store.set(attrs, options);
        return this;
    };
    // #endregion
    // #region common
    Edge.prototype.getBBox = function () {
        return this.getPolyline().bbox();
    };
    Edge.prototype.getConnectionPoint = function () {
        return this.getPolyline().pointAt(0.5);
    };
    Edge.prototype.getPolyline = function () {
        var points = __spreadArray(__spreadArray([
            this.getSourcePoint()
        ], this.getVertices().map(function (vertice) { return geometry_1.Point.create(vertice); }), true), [
            this.getTargetPoint(),
        ], false);
        return new geometry_1.Polyline(points);
    };
    Edge.prototype.updateParent = function (options) {
        var newParent = null;
        var source = this.getSourceCell();
        var target = this.getTargetCell();
        var prevParent = this.getParent();
        if (source && target) {
            if (source === target || source.isDescendantOf(target)) {
                newParent = target;
            }
            else if (target.isDescendantOf(source)) {
                newParent = source;
            }
            else {
                newParent = cell_1.Cell.getCommonAncestor(source, target);
            }
        }
        // Unembeds the edge if source and target has no common
        // ancestor or common ancestor changed
        if (prevParent && (!newParent || newParent.id !== prevParent.id)) {
            prevParent.unembed(this, options);
        }
        if (newParent) {
            newParent.embed(this, options);
        }
        return newParent;
    };
    Edge.prototype.hasLoop = function (options) {
        if (options === void 0) { options = {}; }
        var source = this.getSource();
        var target = this.getTarget();
        var sourceId = source.cell;
        var targetId = target.cell;
        if (!sourceId || !targetId) {
            return false;
        }
        var loop = sourceId === targetId;
        // Note that there in the deep mode a edge can have a loop,
        // even if it connects only a parent and its embed.
        // A loop "target equals source" is valid in both shallow and deep mode.
        // eslint-disable-next-line
        if (!loop && options.deep && this._model) {
            var sourceCell = this.getSourceCell();
            var targetCell = this.getTargetCell();
            if (sourceCell && targetCell) {
                loop =
                    sourceCell.isAncestorOf(targetCell, options) ||
                        targetCell.isAncestorOf(sourceCell, options);
            }
        }
        return loop;
    };
    Edge.prototype.getFragmentAncestor = function () {
        var cells = [this, this.getSourceNode(), this.getTargetNode()].filter(function (item) { return item != null; });
        return this.getCommonAncestor.apply(this, cells);
    };
    Edge.prototype.isFragmentDescendantOf = function (cell) {
        var ancestor = this.getFragmentAncestor();
        return (!!ancestor && (ancestor.id === cell.id || ancestor.isDescendantOf(cell)));
    };
    Edge.defaults = {};
    return Edge;
}(cell_1.Cell));
exports.Edge = Edge;
(function (Edge) {
    function equalTerminals(a, b) {
        var a1 = a;
        var b1 = b;
        if (a1.cell === b1.cell) {
            return a1.port === b1.port || (a1.port == null && b1.port == null);
        }
        return false;
    }
    Edge.equalTerminals = equalTerminals;
})(Edge = exports.Edge || (exports.Edge = {}));
exports.Edge = Edge;
(function (Edge) {
    Edge.defaultLabel = {
        markup: [
            {
                tagName: 'rect',
                selector: 'body',
            },
            {
                tagName: 'text',
                selector: 'label',
            },
        ],
        attrs: {
            text: {
                fill: '#000',
                fontSize: 14,
                textAnchor: 'middle',
                textVerticalAnchor: 'middle',
                pointerEvents: 'none',
            },
            rect: {
                ref: 'label',
                fill: '#fff',
                rx: 3,
                ry: 3,
                refWidth: 1,
                refHeight: 1,
                refX: 0,
                refY: 0,
            },
        },
        position: {
            distance: 0.5,
        },
    };
    function parseStringLabel(text) {
        return {
            attrs: { label: { text: text } },
        };
    }
    Edge.parseStringLabel = parseStringLabel;
})(Edge = exports.Edge || (exports.Edge = {}));
exports.Edge = Edge;
(function (Edge) {
    Edge.toStringTag = "X6." + Edge.name;
    function isEdge(instance) {
        if (instance == null) {
            return false;
        }
        if (instance instanceof Edge) {
            return true;
        }
        var tag = instance[Symbol.toStringTag];
        var edge = instance;
        if ((tag == null || tag === Edge.toStringTag) &&
            typeof edge.isNode === 'function' &&
            typeof edge.isEdge === 'function' &&
            typeof edge.prop === 'function' &&
            typeof edge.attr === 'function' &&
            typeof edge.disconnect === 'function' &&
            typeof edge.getSource === 'function' &&
            typeof edge.getTarget === 'function') {
            return true;
        }
        return false;
    }
    Edge.isEdge = isEdge;
})(Edge = exports.Edge || (exports.Edge = {}));
exports.Edge = Edge;
(function (Edge) {
    Edge.registry = registry_1.Registry.create({
        type: 'edge',
        process: function (shape, options) {
            if (registry_2.ShareRegistry.exist(shape, false)) {
                throw new Error("Edge with name '" + shape + "' was registered by anthor Node");
            }
            if (typeof options === 'function') {
                options.config({ shape: shape });
                return options;
            }
            var parent = Edge;
            // default inherit from 'dege'
            var _a = options.inherit, inherit = _a === void 0 ? 'edge' : _a, others = __rest(options, ["inherit"]);
            if (typeof inherit === 'string') {
                var base = this.get(inherit || 'edge');
                if (base == null && inherit) {
                    this.onNotFound(inherit, 'inherited');
                }
                else {
                    parent = base;
                }
            }
            else {
                parent = inherit;
            }
            if (others.constructorName == null) {
                others.constructorName = shape;
            }
            var ctor = parent.define.call(parent, others);
            ctor.config({ shape: shape });
            return ctor;
        },
    });
    registry_2.ShareRegistry.setEdgeRegistry(Edge.registry);
})(Edge = exports.Edge || (exports.Edge = {}));
exports.Edge = Edge;
(function (Edge) {
    var counter = 0;
    function getClassName(name) {
        if (name) {
            return util_1.StringExt.pascalCase(name);
        }
        counter += 1;
        return "CustomEdge" + counter;
    }
    function define(config) {
        var constructorName = config.constructorName, overwrite = config.overwrite, others = __rest(config, ["constructorName", "overwrite"]);
        var ctor = util_1.ObjectExt.createClass(getClassName(constructorName || others.shape), this);
        ctor.config(others);
        if (others.shape) {
            Edge.registry.register(others.shape, ctor, overwrite);
        }
        return ctor;
    }
    Edge.define = define;
    function create(options) {
        var shape = options.shape || 'edge';
        var Ctor = Edge.registry.get(shape);
        if (Ctor) {
            return new Ctor(options);
        }
        return Edge.registry.onNotFound(shape);
    }
    Edge.create = create;
})(Edge = exports.Edge || (exports.Edge = {}));
exports.Edge = Edge;
(function (Edge) {
    var shape = 'basic.edge';
    Edge.config({
        shape: shape,
        propHooks: function (metadata) {
            var label = metadata.label, vertices = metadata.vertices, others = __rest(metadata, ["label", "vertices"]);
            if (label) {
                if (others.labels == null) {
                    others.labels = [];
                }
                var formated = typeof label === 'string' ? Edge.parseStringLabel(label) : label;
                others.labels.push(formated);
            }
            if (vertices) {
                if (Array.isArray(vertices)) {
                    others.vertices = vertices.map(function (item) { return geometry_1.Point.create(item).toJSON(); });
                }
            }
            return others;
        },
    });
    Edge.registry.register(shape, Edge);
})(Edge = exports.Edge || (exports.Edge = {}));
exports.Edge = Edge;
//# sourceMappingURL=edge.js.map