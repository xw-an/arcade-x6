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
exports.EdgeView = void 0;
var geometry_1 = require("../geometry");
var util_1 = require("../util");
var registry_1 = require("../registry");
var edge_1 = require("../model/edge");
var markup_1 = require("./markup");
var cell_1 = require("./cell");
var EdgeView = /** @class */ (function (_super) {
    __extends(EdgeView, _super);
    function EdgeView() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.POINT_ROUNDING = 2;
        _this.markerCache = {};
        return _this;
        // #endregion
        // #endregion
    }
    Object.defineProperty(EdgeView.prototype, Symbol.toStringTag, {
        get: function () {
            return EdgeView.toStringTag;
        },
        enumerable: false,
        configurable: true
    });
    EdgeView.prototype.getContainerClassName = function () {
        return [_super.prototype.getContainerClassName.call(this), this.prefixClassName('edge')].join(' ');
    };
    Object.defineProperty(EdgeView.prototype, "sourceBBox", {
        get: function () {
            var sourceView = this.sourceView;
            if (!sourceView) {
                var sourceDef = this.cell.getSource();
                return new geometry_1.Rectangle(sourceDef.x, sourceDef.y);
            }
            var sourceMagnet = this.sourceMagnet;
            if (sourceView.isEdgeElement(sourceMagnet)) {
                return new geometry_1.Rectangle(this.sourceAnchor.x, this.sourceAnchor.y);
            }
            return sourceView.getBBoxOfElement(sourceMagnet || sourceView.container);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(EdgeView.prototype, "targetBBox", {
        get: function () {
            var targetView = this.targetView;
            if (!targetView) {
                var targetDef = this.cell.getTarget();
                return new geometry_1.Rectangle(targetDef.x, targetDef.y);
            }
            var targetMagnet = this.targetMagnet;
            if (targetView.isEdgeElement(targetMagnet)) {
                return new geometry_1.Rectangle(this.targetAnchor.x, this.targetAnchor.y);
            }
            return targetView.getBBoxOfElement(targetMagnet || targetView.container);
        },
        enumerable: false,
        configurable: true
    });
    EdgeView.prototype.isEdgeView = function () {
        return true;
    };
    EdgeView.prototype.confirmUpdate = function (flag, options) {
        var _this = this;
        if (options === void 0) { options = {}; }
        var ref = flag;
        if (this.hasAction(ref, 'source')) {
            if (!this.updateTerminalProperties('source')) {
                return ref;
            }
            ref = this.removeAction(ref, 'source');
        }
        if (this.hasAction(ref, 'target')) {
            if (!this.updateTerminalProperties('target')) {
                return ref;
            }
            ref = this.removeAction(ref, 'target');
        }
        var graph = this.graph;
        var sourceView = this.sourceView;
        var targetView = this.targetView;
        if (graph &&
            ((sourceView && !graph.renderer.isViewMounted(sourceView)) ||
                (targetView && !graph.renderer.isViewMounted(targetView)))) {
            // Wait for the sourceView and targetView to be rendered.
            return ref;
        }
        if (this.hasAction(ref, 'render')) {
            this.render();
            ref = this.removeAction(ref, [
                'render',
                'update',
                'vertices',
                'labels',
                'tools',
                'widget',
            ]);
            return ref;
        }
        ref = this.handleAction(ref, 'vertices', function () { return _this.renderVertexMarkers(); });
        ref = this.handleAction(ref, 'update', function () { return _this.update(null, options); });
        ref = this.handleAction(ref, 'labels', function () { return _this.onLabelsChange(options); });
        ref = this.handleAction(ref, 'tools', function () {
            _this.renderTools();
            _this.updateToolsPosition();
        });
        ref = this.handleAction(ref, 'widget', function () { return _this.renderExternalTools(); });
        return ref;
    };
    EdgeView.prototype.onLabelsChange = function (options) {
        if (options === void 0) { options = {}; }
        // Note: this optimization works in async=false mode only
        if (this.shouldRerenderLabels(options)) {
            this.renderLabels();
        }
        else {
            this.updateLabels();
        }
        this.updateLabelPositions();
    };
    EdgeView.prototype.shouldRerenderLabels = function (options) {
        if (options === void 0) { options = {}; }
        var previousLabels = this.cell.previous('labels');
        if (previousLabels == null) {
            return true;
        }
        // Here is an optimization for cases when we know, that change does
        // not require re-rendering of all labels.
        if ('propertyPathArray' in options && 'propertyValue' in options) {
            // The label is setting by `prop()` method
            var pathArray = options.propertyPathArray || [];
            var pathLength = pathArray.length;
            if (pathLength > 1) {
                // We are changing a single label here e.g. 'labels/0/position'
                var index = pathArray[1];
                if (previousLabels[index]) {
                    if (pathLength === 2) {
                        // We are changing the entire label. Need to check if the
                        // markup is also being changed.
                        return (typeof options.propertyValue === 'object' &&
                            util_1.ObjectExt.has(options.propertyValue, 'markup'));
                    }
                    // We are changing a label property but not the markup
                    if (pathArray[2] !== 'markup') {
                        return false;
                    }
                }
            }
        }
        return true;
    };
    EdgeView.prototype.render = function () {
        this.empty();
        this.containers = {};
        this.renderMarkup();
        this.renderLabels();
        this.update();
        this.renderExternalTools();
        return this;
    };
    EdgeView.prototype.renderMarkup = function () {
        var markup = this.cell.markup;
        if (markup) {
            if (typeof markup === 'string') {
                return this.renderStringMarkup(markup);
            }
            return this.renderJSONMarkup(markup);
        }
        throw new TypeError('Invalid edge markup.');
    };
    EdgeView.prototype.renderJSONMarkup = function (markup) {
        var ret = this.parseJSONMarkup(markup, this.container);
        this.selectors = ret.selectors;
        this.container.append(ret.fragment);
    };
    EdgeView.prototype.renderStringMarkup = function (markup) {
        var cache = this.containers;
        var children = util_1.Vector.createVectors(markup);
        // Cache children elements for quicker access.
        children.forEach(function (child) {
            var className = child.attr('class');
            if (className) {
                cache[util_1.StringExt.camelCase(className)] =
                    child.node;
            }
        });
        this.renderTools();
        this.renderVertexMarkers();
        this.renderArrowheadMarkers();
        util_1.Dom.append(this.container, children.map(function (child) { return child.node; }));
    };
    EdgeView.prototype.renderLabels = function () {
        var edge = this.cell;
        var labels = edge.getLabels();
        var count = labels.length;
        var container = this.containers.labels;
        this.labelCache = {};
        this.labelSelectors = {};
        if (count <= 0) {
            if (container && container.parentNode) {
                container.parentNode.removeChild(container);
            }
            return this;
        }
        if (container) {
            this.empty(container);
        }
        else {
            container = util_1.Dom.createSvgElement('g');
            this.addClass(this.prefixClassName('edge-labels'), container);
            this.containers.labels = container;
        }
        for (var i = 0, ii = labels.length; i < ii; i += 1) {
            var label = labels[i];
            var normalized = this.normalizeLabelMarkup(this.parseLabelMarkup(label.markup));
            var labelNode = void 0;
            var selectors = void 0;
            if (normalized) {
                labelNode = normalized.node;
                selectors = normalized.selectors;
            }
            else {
                var defaultLabel = edge.getDefaultLabel();
                var normalized_1 = this.normalizeLabelMarkup(this.parseLabelMarkup(defaultLabel.markup));
                labelNode = normalized_1.node;
                selectors = normalized_1.selectors;
            }
            labelNode.setAttribute('data-index', "" + i);
            container.appendChild(labelNode);
            var rootSelector = this.rootSelector;
            if (selectors[rootSelector]) {
                throw new Error('Ambiguous label root selector.');
            }
            selectors[rootSelector] = labelNode;
            this.labelCache[i] = labelNode;
            this.labelSelectors[i] = selectors;
        }
        if (container.parentNode == null) {
            this.container.appendChild(container);
        }
        this.updateLabels();
        this.customizeLabels();
        return this;
    };
    EdgeView.prototype.parseLabelMarkup = function (markup) {
        if (markup) {
            if (typeof markup === 'string') {
                return this.parseLabelStringMarkup(markup);
            }
            return this.parseJSONMarkup(markup);
        }
        return null;
    };
    EdgeView.prototype.parseLabelStringMarkup = function (labelMarkup) {
        var children = util_1.Vector.createVectors(labelMarkup);
        var fragment = document.createDocumentFragment();
        for (var i = 0, n = children.length; i < n; i += 1) {
            var currentChild = children[i].node;
            fragment.appendChild(currentChild);
        }
        return { fragment: fragment, selectors: {} };
    };
    EdgeView.prototype.normalizeLabelMarkup = function (markup) {
        if (markup == null) {
            return;
        }
        var fragment = markup.fragment;
        if (!(fragment instanceof DocumentFragment) || !fragment.hasChildNodes()) {
            throw new Error('Invalid label markup.');
        }
        var vel;
        var childNodes = fragment.childNodes;
        if (childNodes.length > 1 || childNodes[0].nodeName.toUpperCase() !== 'G') {
            // default markup fragment is not wrapped in `<g/>`
            // add a `<g/>` container
            vel = util_1.Vector.create('g').append(fragment);
        }
        else {
            vel = util_1.Vector.create(childNodes[0]);
        }
        vel.addClass(this.prefixClassName('edge-label'));
        return {
            node: vel.node,
            selectors: markup.selectors,
        };
    };
    EdgeView.prototype.updateLabels = function () {
        if (this.containers.labels) {
            var edge = this.cell;
            var labels = edge.labels;
            var canLabelMove = this.can('edgeLabelMovable');
            var defaultLabel = edge.getDefaultLabel();
            for (var i = 0, n = labels.length; i < n; i += 1) {
                var elem = this.labelCache[i];
                var selectors = this.labelSelectors[i];
                elem.setAttribute('cursor', canLabelMove ? 'move' : 'default');
                var label = labels[i];
                var attrs = util_1.ObjectExt.merge({}, defaultLabel.attrs, label.attrs);
                this.updateAttrs(elem, attrs, {
                    selectors: selectors,
                    rootBBox: label.size ? geometry_1.Rectangle.fromSize(label.size) : undefined,
                });
            }
        }
    };
    EdgeView.prototype.mergeLabelAttrs = function (hasCustomMarkup, labelAttrs, defaultLabelAttrs) {
        if (labelAttrs === null) {
            return null;
        }
        if (labelAttrs === undefined) {
            if (defaultLabelAttrs === null) {
                return null;
            }
            if (defaultLabelAttrs === undefined) {
                return undefined;
            }
            if (hasCustomMarkup) {
                return defaultLabelAttrs;
            }
            return util_1.ObjectExt.merge({}, defaultLabelAttrs);
        }
        if (hasCustomMarkup) {
            return util_1.ObjectExt.merge({}, defaultLabelAttrs, labelAttrs);
        }
    };
    EdgeView.prototype.customizeLabels = function () {
        if (this.containers.labels) {
            var edge = this.cell;
            var labels = edge.labels;
            for (var i = 0, n = labels.length; i < n; i += 1) {
                var label = labels[i];
                var container = this.labelCache[i];
                var selectors = this.labelSelectors[i];
                this.graph.hook.onEdgeLabelRendered({
                    edge: edge,
                    label: label,
                    container: container,
                    selectors: selectors,
                });
            }
        }
    };
    EdgeView.prototype.renderTools = function () {
        var container = this.containers.tools;
        if (container == null) {
            return this;
        }
        var markup = this.cell.toolMarkup;
        var $container = this.$(container).empty();
        if (markup_1.Markup.isStringMarkup(markup)) {
            var template = util_1.StringExt.template(markup);
            var tool = util_1.Vector.create(template());
            $container.append(tool.node);
            this.toolCache = tool.node;
            // If `doubleTools` is enabled, we render copy of the tools on the
            // other side of the edge as well but only if the edge is longer
            // than `longLength`.
            if (this.options.doubleTools) {
                var tool2 = void 0;
                var doubleToolMarkup = this.cell.doubleToolMarkup;
                if (markup_1.Markup.isStringMarkup(doubleToolMarkup)) {
                    template = util_1.StringExt.template(doubleToolMarkup);
                    tool2 = util_1.Vector.create(template());
                }
                else {
                    tool2 = tool.clone();
                }
                $container.append(tool2.node);
                this.tool2Cache = tool2.node;
            }
        }
        return this;
    };
    EdgeView.prototype.renderExternalTools = function () {
        var tools = this.cell.getTools();
        this.addTools(tools);
        return this;
    };
    EdgeView.prototype.renderVertexMarkers = function () {
        var container = this.containers.vertices;
        if (container == null) {
            return this;
        }
        var markup = this.cell.vertexMarkup;
        var $container = this.$(container).empty();
        if (markup_1.Markup.isStringMarkup(markup)) {
            var template_1 = util_1.StringExt.template(markup);
            this.cell.getVertices().forEach(function (vertex, index) {
                $container.append(util_1.Vector.create(template_1(__assign({ index: index }, vertex))).node);
            });
        }
        return this;
    };
    EdgeView.prototype.renderArrowheadMarkers = function () {
        var container = this.containers.arrowheads;
        if (container == null) {
            return this;
        }
        var markup = this.cell.arrowheadMarkup;
        var $container = this.$(container).empty();
        if (markup_1.Markup.isStringMarkup(markup)) {
            var template = util_1.StringExt.template(markup);
            var sourceArrowhead = util_1.Vector.create(template({ end: 'source' })).node;
            var targetArrowhead = util_1.Vector.create(template({ end: 'target' })).node;
            this.containers.sourceArrowhead = sourceArrowhead;
            this.containers.targetArrowhead = targetArrowhead;
            $container.append(sourceArrowhead, targetArrowhead);
        }
        return this;
    };
    // #endregion
    // #region updating
    EdgeView.prototype.update = function (partialAttrs, options) {
        if (options === void 0) { options = {}; }
        this.cleanCache();
        this.updateConnection(options);
        var attrs = this.cell.getAttrs();
        if (attrs != null) {
            this.updateAttrs(this.container, attrs, {
                attrs: partialAttrs === attrs ? null : partialAttrs,
                selectors: this.selectors,
            });
        }
        this.updateConnectionPath();
        this.updateLabelPositions();
        this.updateToolsPosition();
        this.updateArrowheadMarkers();
        this.updateTools(options);
        return this;
    };
    EdgeView.prototype.removeRedundantLinearVertices = function (options) {
        if (options === void 0) { options = {}; }
        var edge = this.cell;
        var vertices = edge.getVertices();
        var routePoints = __spreadArray(__spreadArray([this.sourceAnchor], vertices, true), [this.targetAnchor], false);
        var rawCount = routePoints.length;
        // Puts the route points into a polyline and try to simplify.
        var polyline = new geometry_1.Polyline(routePoints);
        polyline.simplify({ threshold: 0.01 });
        var simplifiedPoints = polyline.points.map(function (point) { return point.toJSON(); });
        var simplifiedCount = simplifiedPoints.length;
        // If simplification did not remove any redundant vertices.
        if (rawCount === simplifiedCount) {
            return 0;
        }
        // Sets simplified polyline points as edge vertices.
        // Removes first and last polyline points again (source/target anchors).
        edge.setVertices(simplifiedPoints.slice(1, simplifiedCount - 1), options);
        return rawCount - simplifiedCount;
    };
    EdgeView.prototype.updateConnectionPath = function () {
        var containers = this.containers;
        if (containers.connection) {
            var pathData = this.getConnectionPathData();
            containers.connection.setAttribute('d', pathData);
        }
        if (containers.connectionWrap) {
            var pathData = this.getConnectionPathData();
            containers.connectionWrap.setAttribute('d', pathData);
        }
        if (containers.sourceMarker && containers.targetMarker) {
            this.translateAndAutoOrientArrows(containers.sourceMarker, containers.targetMarker);
        }
    };
    EdgeView.prototype.getTerminalView = function (type) {
        switch (type) {
            case 'source':
                return this.sourceView || null;
            case 'target':
                return this.targetView || null;
            default:
                throw new Error("Unknown terminal type '" + type + "'");
        }
    };
    EdgeView.prototype.getTerminalAnchor = function (type) {
        switch (type) {
            case 'source':
                return geometry_1.Point.create(this.sourceAnchor);
            case 'target':
                return geometry_1.Point.create(this.targetAnchor);
            default:
                throw new Error("Unknown terminal type '" + type + "'");
        }
    };
    EdgeView.prototype.getTerminalConnectionPoint = function (type) {
        switch (type) {
            case 'source':
                return geometry_1.Point.create(this.sourcePoint);
            case 'target':
                return geometry_1.Point.create(this.targetPoint);
            default:
                throw new Error("Unknown terminal type '" + type + "'");
        }
    };
    EdgeView.prototype.getTerminalMagnet = function (type, options) {
        if (options === void 0) { options = {}; }
        switch (type) {
            case 'source': {
                if (options.raw) {
                    return this.sourceMagnet;
                }
                var sourceView = this.sourceView;
                if (!sourceView) {
                    return null;
                }
                return this.sourceMagnet || sourceView.container;
            }
            case 'target': {
                if (options.raw) {
                    return this.targetMagnet;
                }
                var targetView = this.targetView;
                if (!targetView) {
                    return null;
                }
                return this.targetMagnet || targetView.container;
            }
            default: {
                throw new Error("Unknown terminal type '" + type + "'");
            }
        }
    };
    EdgeView.prototype.updateConnection = function (options) {
        if (options === void 0) { options = {}; }
        var edge = this.cell;
        // The edge is being translated by an ancestor that will shift
        // source, target and vertices by an equal distance.
        if (options.translateBy &&
            edge.isFragmentDescendantOf(options.translateBy)) {
            var tx = options.tx || 0;
            var ty = options.ty || 0;
            this.routePoints = new geometry_1.Polyline(this.routePoints).translate(tx, ty).points;
            this.translateConnectionPoints(tx, ty);
            this.path.translate(tx, ty);
        }
        else {
            var vertices = edge.getVertices();
            // 1. Find anchor points
            var anchors = this.findAnchors(vertices);
            this.sourceAnchor = anchors.source;
            this.targetAnchor = anchors.target;
            // 2. Find route points
            this.routePoints = this.findRoutePoints(vertices);
            // 3. Find connection points
            var connectionPoints = this.findConnectionPoints(this.routePoints, this.sourceAnchor, this.targetAnchor);
            this.sourcePoint = connectionPoints.source;
            this.targetPoint = connectionPoints.target;
            // 4. Find Marker Connection Point
            var markerPoints = this.findMarkerPoints(this.routePoints, this.sourcePoint, this.targetPoint);
            // 5. Make path
            this.path = this.findPath(this.routePoints, markerPoints.source || this.sourcePoint, markerPoints.target || this.targetPoint);
        }
        this.cleanCache();
    };
    EdgeView.prototype.findAnchors = function (vertices) {
        var edge = this.cell;
        var source = edge.source;
        var target = edge.target;
        var firstVertex = vertices[0];
        var lastVertex = vertices[vertices.length - 1];
        if (target.priority && !source.priority) {
            // Reversed order
            return this.findAnchorsOrdered('target', lastVertex, 'source', firstVertex);
        }
        // Usual order
        return this.findAnchorsOrdered('source', firstVertex, 'target', lastVertex);
    };
    EdgeView.prototype.findAnchorsOrdered = function (firstType, firstPoint, secondType, secondPoint) {
        var _a;
        var firstAnchor;
        var secondAnchor;
        var edge = this.cell;
        var firstTerminal = edge[firstType];
        var secondTerminal = edge[secondType];
        var firstView = this.getTerminalView(firstType);
        var secondView = this.getTerminalView(secondType);
        var firstMagnet = this.getTerminalMagnet(firstType);
        var secondMagnet = this.getTerminalMagnet(secondType);
        if (firstView) {
            var firstRef = void 0;
            if (firstPoint) {
                firstRef = geometry_1.Point.create(firstPoint);
            }
            else if (secondView) {
                firstRef = secondMagnet;
            }
            else {
                firstRef = geometry_1.Point.create(secondTerminal);
            }
            firstAnchor = this.getAnchor(firstTerminal.anchor, firstView, firstMagnet, firstRef, firstType);
        }
        else {
            firstAnchor = geometry_1.Point.create(firstTerminal);
        }
        if (secondView) {
            var secondRef = geometry_1.Point.create(secondPoint || firstAnchor);
            secondAnchor = this.getAnchor(secondTerminal.anchor, secondView, secondMagnet, secondRef, secondType);
        }
        else {
            secondAnchor = geometry_1.Point.isPointLike(secondTerminal)
                ? geometry_1.Point.create(secondTerminal)
                : new geometry_1.Point();
        }
        return _a = {},
            _a[firstType] = firstAnchor,
            _a[secondType] = secondAnchor,
            _a;
    };
    EdgeView.prototype.getAnchor = function (def, cellView, magnet, ref, terminalType) {
        var isEdge = cellView.isEdgeElement(magnet);
        var connecting = this.graph.options.connecting;
        var config = typeof def === 'string' ? { name: def } : def;
        if (!config) {
            var defaults = isEdge
                ? (terminalType === 'source'
                    ? connecting.sourceEdgeAnchor
                    : connecting.targetEdgeAnchor) || connecting.edgeAnchor
                : (terminalType === 'source'
                    ? connecting.sourceAnchor
                    : connecting.targetAnchor) || connecting.anchor;
            config = typeof defaults === 'string' ? { name: defaults } : defaults;
        }
        if (!config) {
            throw new Error("Anchor should be specified.");
        }
        var anchor;
        var name = config.name;
        if (isEdge) {
            var fn = registry_1.EdgeAnchor.registry.get(name);
            if (typeof fn !== 'function') {
                return registry_1.EdgeAnchor.registry.onNotFound(name);
            }
            anchor = util_1.FunctionExt.call(fn, this, cellView, magnet, ref, config.args || {}, terminalType);
        }
        else {
            var fn = registry_1.NodeAnchor.registry.get(name);
            if (typeof fn !== 'function') {
                return registry_1.NodeAnchor.registry.onNotFound(name);
            }
            anchor = util_1.FunctionExt.call(fn, this, cellView, magnet, ref, config.args || {}, terminalType);
        }
        return anchor ? anchor.round(this.POINT_ROUNDING) : new geometry_1.Point();
    };
    EdgeView.prototype.findRoutePoints = function (vertices) {
        if (vertices === void 0) { vertices = []; }
        var defaultRouter = this.graph.options.connecting.router || registry_1.Router.presets.normal;
        var router = this.cell.getRouter() || defaultRouter;
        var routePoints;
        if (typeof router === 'function') {
            routePoints = util_1.FunctionExt.call(router, this, vertices, {}, this);
        }
        else {
            var name_1 = typeof router === 'string' ? router : router.name;
            var args = typeof router === 'string' ? {} : router.args || {};
            var fn = name_1 ? registry_1.Router.registry.get(name_1) : registry_1.Router.presets.normal;
            if (typeof fn !== 'function') {
                return registry_1.Router.registry.onNotFound(name_1);
            }
            routePoints = util_1.FunctionExt.call(fn, this, vertices, args, this);
        }
        return routePoints == null
            ? vertices.map(function (p) { return geometry_1.Point.create(p); })
            : routePoints.map(function (p) { return geometry_1.Point.create(p); });
    };
    EdgeView.prototype.findConnectionPoints = function (routePoints, sourceAnchor, targetAnchor) {
        var edge = this.cell;
        var connecting = this.graph.options.connecting;
        var sourceTerminal = edge.getSource();
        var targetTerminal = edge.getTarget();
        var sourceView = this.sourceView;
        var targetView = this.targetView;
        var firstRoutePoint = routePoints[0];
        var lastRoutePoint = routePoints[routePoints.length - 1];
        // source
        var sourcePoint;
        if (sourceView && !sourceView.isEdgeElement(this.sourceMagnet)) {
            var sourceMagnet = this.sourceMagnet || sourceView.container;
            var sourcePointRef = firstRoutePoint || targetAnchor;
            var sourceLine = new geometry_1.Line(sourcePointRef, sourceAnchor);
            var connectionPointDef = sourceTerminal.connectionPoint ||
                connecting.sourceConnectionPoint ||
                connecting.connectionPoint;
            sourcePoint = this.getConnectionPoint(connectionPointDef, sourceView, sourceMagnet, sourceLine, 'source');
        }
        else {
            sourcePoint = sourceAnchor;
        }
        // target
        var targetPoint;
        if (targetView && !targetView.isEdgeElement(this.targetMagnet)) {
            var targetMagnet = this.targetMagnet || targetView.container;
            var targetConnectionPointDef = targetTerminal.connectionPoint ||
                connecting.targetConnectionPoint ||
                connecting.connectionPoint;
            var targetPointRef = lastRoutePoint || sourceAnchor;
            var targetLine = new geometry_1.Line(targetPointRef, targetAnchor);
            targetPoint = this.getConnectionPoint(targetConnectionPointDef, targetView, targetMagnet, targetLine, 'target');
        }
        else {
            targetPoint = targetAnchor;
        }
        return {
            source: sourcePoint,
            target: targetPoint,
        };
    };
    EdgeView.prototype.getConnectionPoint = function (def, view, magnet, line, endType) {
        var anchor = line.end;
        if (def == null) {
            return anchor;
        }
        var name = typeof def === 'string' ? def : def.name;
        var args = typeof def === 'string' ? {} : def.args;
        var fn = registry_1.ConnectionPoint.registry.get(name);
        if (typeof fn !== 'function') {
            return registry_1.ConnectionPoint.registry.onNotFound(name);
        }
        var connectionPoint = util_1.FunctionExt.call(fn, this, line, view, magnet, args || {}, endType);
        return connectionPoint ? connectionPoint.round(this.POINT_ROUNDING) : anchor;
    };
    EdgeView.prototype.updateMarkerAttr = function (type) {
        var _a;
        var attrs = this.cell.getAttrs();
        var key = "." + type + "-marker";
        var partial = attrs && attrs[key];
        if (partial) {
            this.updateAttrs(this.container, {}, {
                attrs: (_a = {}, _a[key] = partial, _a),
                selectors: this.selectors,
            });
        }
    };
    EdgeView.prototype.findMarkerPoints = function (routePoints, sourcePoint, targetPoint) {
        var _this = this;
        var getLineWidth = function (type) {
            var attrs = _this.cell.getAttrs();
            var keys = Object.keys(attrs);
            for (var i = 0, l = keys.length; i < l; i += 1) {
                var attr = attrs[keys[i]];
                if (attr[type + "Marker"] || attr[type + "-marker"]) {
                    var strokeWidth = attr.strokeWidth || attr['stroke-width'];
                    if (strokeWidth) {
                        return parseFloat(strokeWidth);
                    }
                    break;
                }
            }
            return null;
        };
        var firstRoutePoint = routePoints[0];
        var lastRoutePoint = routePoints[routePoints.length - 1];
        var sourceMarkerElem = this.containers.sourceMarker;
        var targetMarkerElem = this.containers.targetMarker;
        var cache = this.markerCache;
        var sourceMarkerPoint;
        var targetMarkerPoint;
        // Move the source point by the width of the marker taking into
        // account its scale around x-axis. Note that scale is the only
        // transform that makes sense to be set in `.marker-source`
        // attributes object as all other transforms (translate/rotate)
        // will be replaced by the `translateAndAutoOrient()` function.
        if (sourceMarkerElem) {
            this.updateMarkerAttr('source');
            // support marker connection point registry???
            cache.sourceBBox = cache.sourceBBox || util_1.Dom.getBBox(sourceMarkerElem);
            if (cache.sourceBBox.width > 0) {
                var scale = util_1.Dom.scale(sourceMarkerElem);
                sourceMarkerPoint = sourcePoint
                    .clone()
                    .move(firstRoutePoint || targetPoint, cache.sourceBBox.width * scale.sx * -1);
            }
        }
        else {
            var strokeWidth = getLineWidth('source');
            if (strokeWidth) {
                sourceMarkerPoint = sourcePoint
                    .clone()
                    .move(firstRoutePoint || targetPoint, -strokeWidth);
            }
        }
        if (targetMarkerElem) {
            this.updateMarkerAttr('target');
            cache.targetBBox = cache.targetBBox || util_1.Dom.getBBox(targetMarkerElem);
            if (cache.targetBBox.width > 0) {
                var scale = util_1.Dom.scale(targetMarkerElem);
                targetMarkerPoint = targetPoint
                    .clone()
                    .move(lastRoutePoint || sourcePoint, cache.targetBBox.width * scale.sx * -1);
            }
        }
        else {
            var strokeWidth = getLineWidth('target');
            if (strokeWidth) {
                targetMarkerPoint = targetPoint
                    .clone()
                    .move(lastRoutePoint || sourcePoint, -strokeWidth);
            }
        }
        // If there was no markup for the marker, use the connection point.
        cache.sourcePoint = sourceMarkerPoint || sourcePoint.clone();
        cache.targetPoint = targetMarkerPoint || targetPoint.clone();
        return {
            source: sourceMarkerPoint,
            target: targetMarkerPoint,
        };
    };
    EdgeView.prototype.findPath = function (routePoints, sourcePoint, targetPoint) {
        var def = this.cell.getConnector() || this.graph.options.connecting.connector;
        var name;
        var args;
        var fn;
        if (typeof def === 'string') {
            name = def;
        }
        else {
            name = def.name;
            args = def.args;
        }
        if (name) {
            var method = registry_1.Connector.registry.get(name);
            if (typeof method !== 'function') {
                return registry_1.Connector.registry.onNotFound(name);
            }
            fn = method;
        }
        else {
            fn = registry_1.Connector.presets.normal;
        }
        var path = util_1.FunctionExt.call(fn, this, sourcePoint, targetPoint, routePoints, __assign(__assign({}, args), { raw: true }), this);
        return typeof path === 'string' ? geometry_1.Path.parse(path) : path;
    };
    EdgeView.prototype.translateConnectionPoints = function (tx, ty) {
        var cache = this.markerCache;
        if (cache.sourcePoint) {
            cache.sourcePoint.translate(tx, ty);
        }
        if (cache.targetPoint) {
            cache.targetPoint.translate(tx, ty);
        }
        this.sourcePoint.translate(tx, ty);
        this.targetPoint.translate(tx, ty);
        this.sourceAnchor.translate(tx, ty);
        this.targetAnchor.translate(tx, ty);
    };
    EdgeView.prototype.updateLabelPositions = function () {
        if (this.containers.labels == null) {
            return this;
        }
        var path = this.path;
        if (!path) {
            return this;
        }
        var edge = this.cell;
        var labels = edge.getLabels();
        if (labels.length === 0) {
            return this;
        }
        var defaultLabel = edge.getDefaultLabel();
        var defaultPosition = this.normalizeLabelPosition(defaultLabel.position);
        for (var i = 0, ii = labels.length; i < ii; i += 1) {
            var label = labels[i];
            var labelPosition = this.normalizeLabelPosition(label.position);
            var pos = util_1.ObjectExt.merge({}, defaultPosition, labelPosition);
            var matrix = this.getLabelTransformationMatrix(pos);
            this.labelCache[i].setAttribute('transform', util_1.Dom.matrixToTransformString(matrix));
        }
        return this;
    };
    EdgeView.prototype.updateToolsPosition = function () {
        if (this.containers.tools == null) {
            return this;
        }
        // Move the tools a bit to the target position but don't cover the
        // `sourceArrowhead` marker. Note that the offset is hardcoded here.
        // The offset should be always more than the
        // `this.$('.marker-arrowhead[end="source"]')[0].bbox().width` but looking
        // this up all the time would be slow.
        var scale = '';
        var offset = this.options.toolsOffset;
        var connectionLength = this.getConnectionLength();
        // Firefox returns `connectionLength=NaN` in odd cases (for bezier curves).
        // In that case we won't update tools position at all.
        if (connectionLength != null) {
            // If the edge is too short, make the tools half the
            // size and the offset twice as low.
            if (connectionLength < this.options.shortLength) {
                scale = 'scale(.5)';
                offset /= 2;
            }
            var pos = this.getPointAtLength(offset);
            if (pos != null) {
                util_1.Dom.attr(this.toolCache, 'transform', "translate(" + pos.x + "," + pos.y + ") " + scale);
            }
            if (this.options.doubleTools &&
                connectionLength >= this.options.longLength) {
                var doubleToolsOffset = this.options.doubleToolsOffset || offset;
                pos = this.getPointAtLength(connectionLength - doubleToolsOffset);
                if (pos != null) {
                    util_1.Dom.attr(this.tool2Cache, 'transform', "translate(" + pos.x + "," + pos.y + ") " + scale);
                }
                util_1.Dom.attr(this.tool2Cache, 'visibility', 'visible');
            }
            else if (this.options.doubleTools) {
                util_1.Dom.attr(this.tool2Cache, 'visibility', 'hidden');
            }
        }
        return this;
    };
    EdgeView.prototype.updateArrowheadMarkers = function () {
        var container = this.containers.arrowheads;
        if (container == null) {
            return this;
        }
        if (container.style.display === 'none') {
            return this;
        }
        var sourceArrowhead = this.containers.sourceArrowhead;
        var targetArrowhead = this.containers.targetArrowhead;
        if (sourceArrowhead && targetArrowhead) {
            var len = this.getConnectionLength() || 0;
            var sx = len < this.options.shortLength ? 0.5 : 1;
            util_1.Dom.scale(sourceArrowhead, sx);
            util_1.Dom.scale(targetArrowhead, sx);
            this.translateAndAutoOrientArrows(sourceArrowhead, targetArrowhead);
        }
        return this;
    };
    EdgeView.prototype.updateTerminalProperties = function (type) {
        var edge = this.cell;
        var graph = this.graph;
        var terminal = edge[type];
        var nodeId = terminal && terminal.cell;
        var viewKey = type + "View";
        // terminal is a point
        if (!nodeId) {
            this[viewKey] = null;
            this.updateTerminalMagnet(type);
            return true;
        }
        var terminalCell = graph.getCellById(nodeId);
        if (!terminalCell) {
            throw new Error("Edge's " + type + " node with id \"" + nodeId + "\" not exists");
        }
        var endView = terminalCell.findView(graph);
        if (!endView) {
            return false;
        }
        this[viewKey] = endView;
        this.updateTerminalMagnet(type);
        return true;
    };
    EdgeView.prototype.updateTerminalMagnet = function (type) {
        var propName = type + "Magnet";
        var terminalView = this.getTerminalView(type);
        if (terminalView) {
            var magnet = terminalView.getMagnetFromEdgeTerminal(this.cell[type]);
            if (magnet === terminalView.container) {
                magnet = null;
            }
            this[propName] = magnet;
        }
        else {
            this[propName] = null;
        }
    };
    EdgeView.prototype.translateAndAutoOrientArrows = function (sourceArrow, targetArrow) {
        var route = this.routePoints;
        if (sourceArrow) {
            util_1.Dom.translateAndAutoOrient(sourceArrow, this.sourcePoint, route[0] || this.targetPoint, this.graph.view.stage);
        }
        if (targetArrow) {
            util_1.Dom.translateAndAutoOrient(targetArrow, this.targetPoint, route[route.length - 1] || this.sourcePoint, this.graph.view.stage);
        }
    };
    EdgeView.prototype.getLabelPositionAngle = function (idx) {
        var label = this.cell.getLabelAt(idx);
        if (label && label.position && typeof label.position === 'object') {
            return label.position.angle || 0;
        }
        return 0;
    };
    EdgeView.prototype.getLabelPositionArgs = function (idx) {
        var label = this.cell.getLabelAt(idx);
        if (label && label.position && typeof label.position === 'object') {
            return label.position.options;
        }
    };
    EdgeView.prototype.getDefaultLabelPositionArgs = function () {
        var defaultLabel = this.cell.getDefaultLabel();
        if (defaultLabel &&
            defaultLabel.position &&
            typeof defaultLabel.position === 'object') {
            return defaultLabel.position.options;
        }
    };
    // merge default label position args into label position args
    // keep `undefined` or `null` because `{}` means something else
    EdgeView.prototype.mergeLabelPositionArgs = function (labelPositionArgs, defaultLabelPositionArgs) {
        if (labelPositionArgs === null) {
            return null;
        }
        if (labelPositionArgs === undefined) {
            if (defaultLabelPositionArgs === null) {
                return null;
            }
            return defaultLabelPositionArgs;
        }
        return util_1.ObjectExt.merge({}, defaultLabelPositionArgs, labelPositionArgs);
    };
    EdgeView.prototype.addLabel = function (p1, p2, p3, options) {
        var localX;
        var localY;
        var localAngle = 0;
        var localOptions;
        if (typeof p1 !== 'number') {
            localX = p1.x;
            localY = p1.y;
            if (typeof p2 === 'number') {
                localAngle = p2;
                localOptions = p3;
            }
            else {
                localOptions = p2;
            }
        }
        else {
            localX = p1;
            localY = p2;
            if (typeof p3 === 'number') {
                localAngle = p3;
                localOptions = options;
            }
            else {
                localOptions = p3;
            }
        }
        // merge label position arguments
        var defaultLabelPositionArgs = this.getDefaultLabelPositionArgs();
        var labelPositionArgs = localOptions;
        var positionArgs = this.mergeLabelPositionArgs(labelPositionArgs, defaultLabelPositionArgs);
        // append label to labels array
        var label = {
            position: this.getLabelPosition(localX, localY, localAngle, positionArgs),
        };
        var index = -1;
        this.cell.insertLabel(label, index, localOptions);
        return index;
    };
    EdgeView.prototype.addVertex = function (x, y, options) {
        var isPoint = typeof x !== 'number';
        var localX = isPoint ? x.x : x;
        var localY = isPoint ? x.y : y;
        var localOptions = isPoint ? y : options;
        var vertex = { x: localX, y: localY };
        var index = this.getVertexIndex(localX, localY);
        this.cell.insertVertex(vertex, index, localOptions);
        return index;
    };
    EdgeView.prototype.sendToken = function (token, options, callback) {
        var duration;
        var reversed;
        var selector;
        var rorate;
        var timing = 'linear';
        if (typeof options === 'object') {
            duration = options.duration;
            reversed = options.reversed === true;
            selector = options.selector;
            if (options.rotate === false) {
                rorate = '';
            }
            else if (options.rotate === true) {
                rorate = 'auto';
            }
            else if (options.rotate != null) {
                rorate = "" + options.rotate;
            }
            if (options.timing) {
                timing = options.timing;
            }
        }
        else {
            duration = options;
            reversed = false;
            selector = null;
        }
        duration = duration || 1000;
        var attrs = {
            dur: duration + "ms",
            repeatCount: '1',
            calcMode: timing,
            fill: 'freeze',
        };
        if (rorate) {
            attrs.rotate = rorate;
        }
        if (reversed) {
            attrs.keyPoints = '1;0';
            attrs.keyTimes = '0;1';
        }
        if (typeof options === 'object') {
            var duration_1 = options.duration, reversed_1 = options.reversed, selector_1 = options.selector, rotate = options.rotate, timing_1 = options.timing, others_1 = __rest(options, ["duration", "reversed", "selector", "rotate", "timing"]);
            Object.keys(others_1).forEach(function (key) {
                attrs[key] = others_1[key];
            });
        }
        var path;
        if (typeof selector === 'string') {
            path = this.findOne(selector, this.container, this.selectors);
        }
        else {
            // Select connection path automatically.
            path = this.containers.connection
                ? this.containers.connection
                : this.container.querySelector('path');
        }
        if (!(path instanceof SVGPathElement)) {
            throw new Error('Token animation requires a valid connection path.');
        }
        var target = typeof token === 'string' ? this.findOne(token) : token;
        if (target == null) {
            throw new Error('Token animation requires a valid token element.');
        }
        var parent = target.parentNode;
        var revert = function () {
            if (!parent) {
                util_1.Dom.remove(target);
            }
        };
        var vToken = util_1.Vector.create(target);
        if (!parent) {
            vToken.appendTo(this.graph.view.stage);
        }
        var onComplete = attrs.complete;
        attrs.complete = function (e) {
            revert();
            if (callback) {
                callback();
            }
            if (onComplete) {
                onComplete(e);
            }
        };
        var stop = vToken.animateAlongPath(attrs, path);
        return function () {
            revert();
            stop();
        };
    };
    // #endregion
    EdgeView.prototype.getConnection = function () {
        return this.path != null ? this.path.clone() : null;
    };
    EdgeView.prototype.getConnectionPathData = function () {
        if (this.path == null) {
            return '';
        }
        var cache = this.cache.pathCache;
        if (!util_1.ObjectExt.has(cache, 'data')) {
            cache.data = this.path.serialize();
        }
        return cache.data || '';
    };
    EdgeView.prototype.getConnectionSubdivisions = function () {
        if (this.path == null) {
            return null;
        }
        var cache = this.cache.pathCache;
        if (!util_1.ObjectExt.has(cache, 'segmentSubdivisions')) {
            cache.segmentSubdivisions = this.path.getSegmentSubdivisions();
        }
        return cache.segmentSubdivisions;
    };
    EdgeView.prototype.getConnectionLength = function () {
        if (this.path == null) {
            return 0;
        }
        var cache = this.cache.pathCache;
        if (!util_1.ObjectExt.has(cache, 'length')) {
            cache.length = this.path.length({
                segmentSubdivisions: this.getConnectionSubdivisions(),
            });
        }
        return cache.length;
    };
    EdgeView.prototype.getPointAtLength = function (length) {
        if (this.path == null) {
            return null;
        }
        return this.path.pointAtLength(length, {
            segmentSubdivisions: this.getConnectionSubdivisions(),
        });
    };
    EdgeView.prototype.getPointAtRatio = function (ratio) {
        if (this.path == null) {
            return null;
        }
        if (util_1.NumberExt.isPercentage(ratio)) {
            // eslint-disable-next-line
            ratio = parseFloat(ratio) / 100;
        }
        return this.path.pointAt(ratio, {
            segmentSubdivisions: this.getConnectionSubdivisions(),
        });
    };
    EdgeView.prototype.getTangentAtLength = function (length) {
        if (this.path == null) {
            return null;
        }
        return this.path.tangentAtLength(length, {
            segmentSubdivisions: this.getConnectionSubdivisions(),
        });
    };
    EdgeView.prototype.getTangentAtRatio = function (ratio) {
        if (this.path == null) {
            return null;
        }
        return this.path.tangentAt(ratio, {
            segmentSubdivisions: this.getConnectionSubdivisions(),
        });
    };
    EdgeView.prototype.getClosestPoint = function (point) {
        if (this.path == null) {
            return null;
        }
        return this.path.closestPoint(point, {
            segmentSubdivisions: this.getConnectionSubdivisions(),
        });
    };
    EdgeView.prototype.getClosestPointLength = function (point) {
        if (this.path == null) {
            return null;
        }
        return this.path.closestPointLength(point, {
            segmentSubdivisions: this.getConnectionSubdivisions(),
        });
    };
    EdgeView.prototype.getClosestPointRatio = function (point) {
        if (this.path == null) {
            return null;
        }
        return this.path.closestPointNormalizedLength(point, {
            segmentSubdivisions: this.getConnectionSubdivisions(),
        });
    };
    EdgeView.prototype.getLabelPosition = function (x, y, p3, p4) {
        var pos = { distance: 0 };
        // normalize data from the two possible signatures
        var angle = 0;
        var options;
        if (typeof p3 === 'number') {
            angle = p3;
            options = p4;
        }
        else {
            options = p3;
        }
        if (options != null) {
            pos.options = options;
        }
        // identify distance/offset settings
        var isOffsetAbsolute = options && options.absoluteOffset;
        var isDistanceRelative = !(options && options.absoluteDistance);
        var isDistanceAbsoluteReverse = options && options.absoluteDistance && options.reverseDistance;
        // find closest point t
        var path = this.path;
        var pathOptions = {
            segmentSubdivisions: this.getConnectionSubdivisions(),
        };
        var labelPoint = new geometry_1.Point(x, y);
        var t = path.closestPointT(labelPoint, pathOptions);
        // distance
        var totalLength = this.getConnectionLength() || 0;
        var labelDistance = path.lengthAtT(t, pathOptions);
        if (isDistanceRelative) {
            labelDistance = totalLength > 0 ? labelDistance / totalLength : 0;
        }
        if (isDistanceAbsoluteReverse) {
            // fix for end point (-0 => 1)
            labelDistance = -1 * (totalLength - labelDistance) || 1;
        }
        pos.distance = labelDistance;
        // offset
        // use absolute offset if:
        // - options.absoluteOffset is true,
        // - options.absoluteOffset is not true but there is no tangent
        var tangent;
        if (!isOffsetAbsolute)
            tangent = path.tangentAtT(t);
        var labelOffset;
        if (tangent) {
            labelOffset = tangent.pointOffset(labelPoint);
        }
        else {
            var closestPoint = path.pointAtT(t);
            var labelOffsetDiff = labelPoint.diff(closestPoint);
            labelOffset = { x: labelOffsetDiff.x, y: labelOffsetDiff.y };
        }
        pos.offset = labelOffset;
        pos.angle = angle;
        return pos;
    };
    EdgeView.prototype.normalizeLabelPosition = function (pos) {
        if (typeof pos === 'number') {
            return { distance: pos };
        }
        return pos;
    };
    EdgeView.prototype.getLabelTransformationMatrix = function (labelPosition) {
        var pos = this.normalizeLabelPosition(labelPosition);
        var options = pos.options || {};
        var labelAngle = pos.angle || 0;
        var labelDistance = pos.distance;
        var isDistanceRelative = labelDistance > 0 && labelDistance <= 1;
        var labelOffset = 0;
        var offsetCoord = { x: 0, y: 0 };
        var offset = pos.offset;
        if (offset) {
            if (typeof offset === 'number') {
                labelOffset = offset;
            }
            else {
                if (offset.x != null) {
                    offsetCoord.x = offset.x;
                }
                if (offset.y != null) {
                    offsetCoord.y = offset.y;
                }
            }
        }
        var isOffsetAbsolute = offsetCoord.x !== 0 || offsetCoord.y !== 0 || labelOffset === 0;
        var isKeepGradient = options.keepGradient;
        var isEnsureLegibility = options.ensureLegibility;
        var path = this.path;
        var pathOpt = { segmentSubdivisions: this.getConnectionSubdivisions() };
        var distance = isDistanceRelative
            ? labelDistance * this.getConnectionLength()
            : labelDistance;
        var tangent = path.tangentAtLength(distance, pathOpt);
        var translation;
        var angle = labelAngle;
        if (tangent) {
            if (isOffsetAbsolute) {
                translation = tangent.start;
                translation.translate(offsetCoord);
            }
            else {
                var normal = tangent.clone();
                normal.rotate(-90, tangent.start);
                normal.setLength(labelOffset);
                translation = normal.end;
            }
            if (isKeepGradient) {
                angle = tangent.angle() + labelAngle;
                if (isEnsureLegibility) {
                    angle = geometry_1.Angle.normalize(((angle + 90) % 180) - 90);
                }
            }
        }
        else {
            // fallback - the connection has zero length
            translation = path.start;
            if (isOffsetAbsolute) {
                translation.translate(offsetCoord);
            }
        }
        return util_1.Dom.createSVGMatrix()
            .translate(translation.x, translation.y)
            .rotate(angle);
    };
    EdgeView.prototype.getLabelCoordinates = function (pos) {
        var matrix = this.getLabelTransformationMatrix(pos);
        return new geometry_1.Point(matrix.e, matrix.f);
    };
    EdgeView.prototype.getVertexIndex = function (x, y) {
        var edge = this.cell;
        var vertices = edge.getVertices();
        var vertexLength = this.getClosestPointLength(new geometry_1.Point(x, y));
        var index = 0;
        if (vertexLength != null) {
            for (var ii = vertices.length; index < ii; index += 1) {
                var currentVertex = vertices[index];
                var currentLength = this.getClosestPointLength(currentVertex);
                if (currentLength != null && vertexLength < currentLength) {
                    break;
                }
            }
        }
        return index;
    };
    EdgeView.prototype.getEventArgs = function (e, x, y) {
        var view = this; // eslint-disable-line
        var edge = view.cell;
        var cell = edge;
        if (x == null || y == null) {
            return { e: e, view: view, edge: edge, cell: cell };
        }
        return { e: e, x: x, y: y, view: view, edge: edge, cell: cell };
    };
    EdgeView.prototype.notifyUnhandledMouseDown = function (e, x, y) {
        this.notify('edge:unhandled:mousedown', {
            e: e,
            x: x,
            y: y,
            view: this,
            cell: this.cell,
            edge: this.cell,
        });
    };
    EdgeView.prototype.notifyMouseDown = function (e, x, y) {
        _super.prototype.onMouseDown.call(this, e, x, y);
        this.notify('edge:mousedown', this.getEventArgs(e, x, y));
    };
    EdgeView.prototype.notifyMouseMove = function (e, x, y) {
        _super.prototype.onMouseMove.call(this, e, x, y);
        this.notify('edge:mousemove', this.getEventArgs(e, x, y));
    };
    EdgeView.prototype.notifyMouseUp = function (e, x, y) {
        _super.prototype.onMouseUp.call(this, e, x, y);
        this.notify('edge:mouseup', this.getEventArgs(e, x, y));
    };
    EdgeView.prototype.onClick = function (e, x, y) {
        _super.prototype.onClick.call(this, e, x, y);
        this.notify('edge:click', this.getEventArgs(e, x, y));
    };
    EdgeView.prototype.onDblClick = function (e, x, y) {
        _super.prototype.onDblClick.call(this, e, x, y);
        this.notify('edge:dblclick', this.getEventArgs(e, x, y));
    };
    EdgeView.prototype.onContextMenu = function (e, x, y) {
        _super.prototype.onContextMenu.call(this, e, x, y);
        this.notify('edge:contextmenu', this.getEventArgs(e, x, y));
    };
    EdgeView.prototype.onMouseDown = function (e, x, y) {
        this.notifyMouseDown(e, x, y);
        var className = e.target.getAttribute('class');
        switch (className) {
            case 'vertex': {
                this.startVertexDragging(e, x, y);
                return;
            }
            case 'vertex-remove':
            case 'vertex-remove-area': {
                this.handleVertexRemoving(e, x, y);
                return;
            }
            case 'connection':
            case 'connection-wrap': {
                this.handleVertexAdding(e, x, y);
                return;
            }
            case 'arrowhead': {
                this.startArrowheadDragging(e, x, y);
                return;
            }
            case 'source-marker':
            case 'target-marker': {
                this.notifyUnhandledMouseDown(e, x, y);
                return;
            }
            default:
                break;
        }
        this.startEdgeDragging(e, x, y);
    };
    EdgeView.prototype.onMouseMove = function (e, x, y) {
        var data = this.getEventData(e);
        switch (data.action) {
            case 'drag-vertex': {
                this.dragVertex(e, x, y);
                break;
            }
            case 'drag-label': {
                this.dragLabel(e, x, y);
                break;
            }
            case 'drag-arrowhead': {
                this.dragArrowhead(e, x, y);
                break;
            }
            case 'drag-edge': {
                this.dragEdge(e, x, y);
                break;
            }
            default:
                break;
        }
        this.notifyMouseMove(e, x, y);
        return data;
    };
    EdgeView.prototype.onMouseUp = function (e, x, y) {
        var data = this.getEventData(e);
        switch (data.action) {
            case 'drag-vertex': {
                this.stopVertexDragging(e, x, y);
                break;
            }
            case 'drag-label': {
                this.stopLabelDragging(e, x, y);
                break;
            }
            case 'drag-arrowhead': {
                this.stopArrowheadDragging(e, x, y);
                break;
            }
            case 'drag-edge': {
                this.stopEdgeDragging(e, x, y);
                break;
            }
            default:
                break;
        }
        this.notifyMouseUp(e, x, y);
        this.checkMouseleave(e);
        return data;
    };
    EdgeView.prototype.onMouseOver = function (e) {
        _super.prototype.onMouseOver.call(this, e);
        this.notify('edge:mouseover', this.getEventArgs(e));
    };
    EdgeView.prototype.onMouseOut = function (e) {
        _super.prototype.onMouseOut.call(this, e);
        this.notify('edge:mouseout', this.getEventArgs(e));
    };
    EdgeView.prototype.onMouseEnter = function (e) {
        _super.prototype.onMouseEnter.call(this, e);
        this.notify('edge:mouseenter', this.getEventArgs(e));
    };
    EdgeView.prototype.onMouseLeave = function (e) {
        _super.prototype.onMouseLeave.call(this, e);
        this.notify('edge:mouseleave', this.getEventArgs(e));
    };
    EdgeView.prototype.onMouseWheel = function (e, x, y, delta) {
        _super.prototype.onMouseWheel.call(this, e, x, y, delta);
        this.notify('edge:mousewheel', __assign({ delta: delta }, this.getEventArgs(e, x, y)));
    };
    EdgeView.prototype.onCustomEvent = function (e, name, x, y) {
        // For default edge tool
        var tool = util_1.Dom.findParentByClass(e.target, 'edge-tool', this.container);
        if (tool) {
            e.stopPropagation(); // no further action to be executed
            if (this.can('useEdgeTools')) {
                if (name === 'edge:remove') {
                    this.cell.remove({ ui: true });
                    return;
                }
                this.notify('edge:customevent', __assign({ name: name }, this.getEventArgs(e, x, y)));
            }
            this.notifyMouseDown(e, x, y);
        }
        else {
            this.notify('edge:customevent', __assign({ name: name }, this.getEventArgs(e, x, y)));
            _super.prototype.onCustomEvent.call(this, e, name, x, y);
        }
    };
    EdgeView.prototype.onLabelMouseDown = function (e, x, y) {
        this.notifyMouseDown(e, x, y);
        this.startLabelDragging(e, x, y);
        var stopPropagation = this.getEventData(e).stopPropagation;
        if (stopPropagation) {
            e.stopPropagation();
        }
    };
    // #region drag edge
    EdgeView.prototype.startEdgeDragging = function (e, x, y) {
        if (!this.can('edgeMovable')) {
            this.notifyUnhandledMouseDown(e, x, y);
            return;
        }
        this.setEventData(e, {
            x: x,
            y: y,
            moving: false,
            action: 'drag-edge',
        });
    };
    EdgeView.prototype.dragEdge = function (e, x, y) {
        var data = this.getEventData(e);
        if (!data.moving) {
            data.moving = true;
            this.addClass('edge-moving');
            this.notify('edge:move', {
                e: e,
                x: x,
                y: y,
                view: this,
                cell: this.cell,
                edge: this.cell,
            });
        }
        this.cell.translate(x - data.x, y - data.y, { ui: true });
        this.setEventData(e, { x: x, y: y });
        this.notify('edge:moving', {
            e: e,
            x: x,
            y: y,
            view: this,
            cell: this.cell,
            edge: this.cell,
        });
    };
    EdgeView.prototype.stopEdgeDragging = function (e, x, y) {
        var data = this.getEventData(e);
        if (data.moving) {
            this.removeClass('edge-moving');
            this.notify('edge:moved', {
                e: e,
                x: x,
                y: y,
                view: this,
                cell: this.cell,
                edge: this.cell,
            });
        }
        data.moving = false;
    };
    // #endregion
    // #region drag arrowhead
    EdgeView.prototype.prepareArrowheadDragging = function (type, options) {
        var magnet = this.getTerminalMagnet(type);
        var data = {
            action: 'drag-arrowhead',
            x: options.x,
            y: options.y,
            isNewEdge: options.isNewEdge === true,
            terminalType: type,
            initialMagnet: magnet,
            initialTerminal: util_1.ObjectExt.clone(this.cell[type]),
            fallbackAction: options.fallbackAction || 'revert',
            getValidateConnectionArgs: this.createValidateConnectionArgs(type),
            options: options.options,
        };
        this.beforeArrowheadDragging(data);
        return data;
    };
    EdgeView.prototype.createValidateConnectionArgs = function (type) {
        var args = [];
        args[4] = type;
        args[5] = this;
        var opposite;
        var i = 0;
        var j = 0;
        if (type === 'source') {
            i = 2;
            opposite = 'target';
        }
        else {
            j = 2;
            opposite = 'source';
        }
        var terminal = this.cell[opposite];
        var cellId = terminal.cell;
        if (cellId) {
            var magnet = void 0;
            var view = (args[i] = this.graph.renderer.findViewByCell(cellId));
            if (view) {
                magnet = view.getMagnetFromEdgeTerminal(terminal);
                if (magnet === view.container) {
                    magnet = undefined;
                }
            }
            args[i + 1] = magnet;
        }
        return function (cellView, magnet) {
            args[j] = cellView;
            args[j + 1] = cellView.container === magnet ? undefined : magnet;
            return args;
        };
    };
    EdgeView.prototype.beforeArrowheadDragging = function (data) {
        data.zIndex = this.cell.zIndex;
        this.cell.toFront();
        var style = this.container.style;
        data.pointerEvents = style.pointerEvents;
        style.pointerEvents = 'none';
        if (this.graph.options.connecting.highlight) {
            this.highlightAvailableMagnets(data);
        }
    };
    EdgeView.prototype.afterArrowheadDragging = function (data) {
        if (data.zIndex != null) {
            this.cell.setZIndex(data.zIndex, { ui: true });
            data.zIndex = null;
        }
        var container = this.container;
        container.style.pointerEvents = data.pointerEvents || '';
        if (this.graph.options.connecting.highlight) {
            this.unhighlightAvailableMagnets(data);
        }
    };
    EdgeView.prototype.arrowheadDragging = function (target, x, y, data) {
        var _a;
        data.x = x;
        data.y = y;
        // Checking views right under the pointer
        if (data.currentTarget !== target) {
            // Unhighlight the previous view under pointer if there was one.
            if (data.currentMagnet && data.currentView) {
                data.currentView.unhighlight(data.currentMagnet, {
                    type: 'magnetAdsorbed',
                });
            }
            data.currentView = this.graph.renderer.findViewByElem(target);
            if (data.currentView) {
                // If we found a view that is under the pointer, we need to find
                // the closest magnet based on the real target element of the event.
                data.currentMagnet = data.currentView.findMagnet(target);
                if (data.currentMagnet && (_a = this.graph.hook).validateConnection.apply(_a, __spreadArray(__spreadArray([], data.getValidateConnectionArgs(data.currentView, data.currentMagnet), false), [data.currentView.getEdgeTerminal(data.currentMagnet, x, y, this.cell, data.terminalType)], false))) {
                    data.currentView.highlight(data.currentMagnet, {
                        type: 'magnetAdsorbed',
                    });
                }
                else {
                    // This type of connection is not valid. Disregard this magnet.
                    data.currentMagnet = null;
                }
            }
            else {
                // Make sure we'll unset previous magnet.
                data.currentMagnet = null;
            }
        }
        data.currentTarget = target;
        this.cell.prop(data.terminalType, { x: x, y: y }, __assign(__assign({}, data.options), { ui: true }));
    };
    EdgeView.prototype.arrowheadDragged = function (data, x, y) {
        var view = data.currentView;
        var magnet = data.currentMagnet;
        if (!magnet || !view) {
            return;
        }
        view.unhighlight(magnet, { type: 'magnetAdsorbed' });
        var type = data.terminalType;
        var terminal = view.getEdgeTerminal(magnet, x, y, this.cell, type);
        this.cell.setTerminal(type, terminal, { ui: true });
    };
    EdgeView.prototype.snapArrowhead = function (x, y, data) {
        var _this = this;
        var graph = this.graph;
        var _a = graph.options.connecting, snap = _a.snap, allowEdge = _a.allowEdge;
        var radius = (typeof snap === 'object' && snap.radius) || 50;
        var findViewsOption = {
            x: x - radius,
            y: y - radius,
            width: 2 * radius,
            height: 2 * radius,
        };
        var views = graph.renderer.findViewsInArea(findViewsOption);
        if (allowEdge) {
            var edgeViews = graph.renderer
                .findEdgeViewsInArea(findViewsOption)
                .filter(function (view) {
                return view !== _this;
            });
            views.push.apply(views, edgeViews);
        }
        var prevView = data.closestView || null;
        var prevMagnet = data.closestMagnet || null;
        data.closestView = null;
        data.closestMagnet = null;
        var distance;
        var minDistance = Number.MAX_SAFE_INTEGER;
        var pos = new geometry_1.Point(x, y);
        views.forEach(function (view) {
            var _a;
            if (view.container.getAttribute('magnet') !== 'false') {
                // Find distance from the center of the cell to pointer coordinates
                distance = view.cell.getBBox().getCenter().distance(pos);
                // the connection is looked up in a circle area by `distance < r`
                if (distance < radius && distance < minDistance) {
                    if (prevMagnet === view.container || (_a = graph.hook).validateConnection.apply(_a, __spreadArray(__spreadArray([], data.getValidateConnectionArgs(view, null), false), [view.getEdgeTerminal(view.container, x, y, _this.cell, data.terminalType)], false))) {
                        minDistance = distance;
                        data.closestView = view;
                        data.closestMagnet = view.container;
                    }
                }
            }
            view.container.querySelectorAll('[magnet]').forEach(function (magnet) {
                var _a;
                if (magnet.getAttribute('magnet') !== 'false') {
                    var bbox = view.getBBoxOfElement(magnet);
                    distance = pos.distance(bbox.getCenter());
                    if (distance < radius && distance < minDistance) {
                        if (prevMagnet === magnet || (_a = graph.hook).validateConnection.apply(_a, __spreadArray(__spreadArray([], data.getValidateConnectionArgs(view, magnet), false), [view.getEdgeTerminal(magnet, x, y, _this.cell, data.terminalType)], false))) {
                            minDistance = distance;
                            data.closestView = view;
                            data.closestMagnet = magnet;
                        }
                    }
                }
            });
        });
        var terminal;
        var type = data.terminalType;
        var closestView = data.closestView;
        var closestMagnet = data.closestMagnet;
        var changed = prevMagnet !== closestMagnet;
        if (prevView && changed) {
            prevView.unhighlight(prevMagnet, {
                type: 'magnetAdsorbed',
            });
        }
        if (closestView) {
            if (!changed) {
                return;
            }
            closestView.highlight(closestMagnet, {
                type: 'magnetAdsorbed',
            });
            terminal = closestView.getEdgeTerminal(closestMagnet, x, y, this.cell, type);
        }
        else {
            terminal = { x: x, y: y };
        }
        this.cell.setTerminal(type, terminal, {}, __assign(__assign({}, data.options), { ui: true }));
    };
    EdgeView.prototype.snapArrowheadEnd = function (data) {
        // Finish off link snapping.
        // Everything except view unhighlighting was already done on pointermove.
        var closestView = data.closestView;
        var closestMagnet = data.closestMagnet;
        if (closestView && closestMagnet) {
            closestView.unhighlight(closestMagnet, {
                type: 'magnetAdsorbed',
            });
            data.currentMagnet = closestView.findMagnet(closestMagnet);
        }
        data.closestView = null;
        data.closestMagnet = null;
    };
    EdgeView.prototype.finishEmbedding = function (data) {
        // Resets parent of the edge if embedding is enabled
        if (this.graph.options.embedding.enabled && this.cell.updateParent()) {
            // Make sure we don't reverse to the original 'z' index
            data.zIndex = null;
        }
    };
    EdgeView.prototype.fallbackConnection = function (data) {
        switch (data.fallbackAction) {
            case 'remove':
                this.cell.remove({ ui: true });
                break;
            case 'revert':
            default:
                this.cell.prop(data.terminalType, data.initialTerminal, {
                    ui: true,
                });
                break;
        }
    };
    EdgeView.prototype.notifyConnectionEvent = function (data, e) {
        var terminalType = data.terminalType;
        var initialTerminal = data.initialTerminal;
        var currentTerminal = this.cell[terminalType];
        var changed = currentTerminal && !edge_1.Edge.equalTerminals(initialTerminal, currentTerminal);
        if (changed) {
            var graph = this.graph;
            var previous = initialTerminal;
            var previousCell = previous.cell
                ? graph.getCellById(previous.cell)
                : null;
            var previousPort = previous.port;
            var previousView = previousCell
                ? graph.findViewByCell(previousCell)
                : null;
            var previousPoint = previousCell || data.isNewEdge
                ? null
                : geometry_1.Point.create(initialTerminal).toJSON();
            var current = currentTerminal;
            var currentCell = current.cell ? graph.getCellById(current.cell) : null;
            var currentPort = current.port;
            var currentView = currentCell ? graph.findViewByCell(currentCell) : null;
            var currentPoint = currentCell
                ? null
                : geometry_1.Point.create(currentTerminal).toJSON();
            this.notify('edge:connected', {
                e: e,
                previousCell: previousCell,
                previousPort: previousPort,
                previousView: previousView,
                previousPoint: previousPoint,
                currentCell: currentCell,
                currentView: currentView,
                currentPort: currentPort,
                currentPoint: currentPoint,
                previousMagnet: data.initialMagnet,
                currentMagnet: data.currentMagnet,
                edge: this.cell,
                view: this,
                type: terminalType,
                isNew: data.isNewEdge,
            });
        }
    };
    EdgeView.prototype.highlightAvailableMagnets = function (data) {
        var _this = this;
        var graph = this.graph;
        var cells = graph.model.getCells();
        data.marked = {};
        var _loop_1 = function (i, ii) {
            var view = graph.renderer.findViewByCell(cells[i]);
            if (!view) {
                return "continue";
            }
            var magnets = Array.prototype.slice.call(view.container.querySelectorAll('[magnet]'));
            if (view.container.getAttribute('magnet') !== 'false') {
                magnets.push(view.container);
            }
            var availableMagnets = magnets.filter(function (magnet) {
                var _a;
                return (_a = graph.hook).validateConnection.apply(_a, __spreadArray(__spreadArray([], data.getValidateConnectionArgs(view, magnet), false), [view.getEdgeTerminal(magnet, data.x, data.y, _this.cell, data.terminalType)], false));
            });
            if (availableMagnets.length > 0) {
                // highlight all available magnets
                for (var j = 0, jj = availableMagnets.length; j < jj; j += 1) {
                    view.highlight(availableMagnets[j], { type: 'magnetAvailable' });
                }
                // highlight the entire view
                view.highlight(null, { type: 'nodeAvailable' });
                data.marked[view.cell.id] = availableMagnets;
            }
        };
        for (var i = 0, ii = cells.length; i < ii; i += 1) {
            _loop_1(i, ii);
        }
    };
    EdgeView.prototype.unhighlightAvailableMagnets = function (data) {
        var _this = this;
        var marked = data.marked || {};
        Object.keys(marked).forEach(function (id) {
            var view = _this.graph.renderer.findViewByCell(id);
            if (view) {
                var magnets = marked[id];
                magnets.forEach(function (magnet) {
                    view.unhighlight(magnet, { type: 'magnetAvailable' });
                });
                view.unhighlight(null, { type: 'nodeAvailable' });
            }
        });
        data.marked = null;
    };
    EdgeView.prototype.startArrowheadDragging = function (e, x, y) {
        if (!this.can('arrowheadMovable')) {
            this.notifyUnhandledMouseDown(e, x, y);
            return;
        }
        var elem = e.target;
        var type = elem.getAttribute('data-terminal');
        var data = this.prepareArrowheadDragging(type, { x: x, y: y });
        this.setEventData(e, data);
    };
    EdgeView.prototype.dragArrowhead = function (e, x, y) {
        var data = this.getEventData(e);
        if (this.graph.options.connecting.snap) {
            this.snapArrowhead(x, y, data);
        }
        else {
            this.arrowheadDragging(this.getEventTarget(e), x, y, data);
        }
    };
    EdgeView.prototype.stopArrowheadDragging = function (e, x, y) {
        var graph = this.graph;
        var data = this.getEventData(e);
        if (graph.options.connecting.snap) {
            this.snapArrowheadEnd(data);
        }
        else {
            this.arrowheadDragged(data, x, y);
        }
        var valid = graph.hook.validateEdge(this.cell, data.terminalType, data.initialTerminal);
        if (valid) {
            this.finishEmbedding(data);
            this.notifyConnectionEvent(data, e);
        }
        else {
            // If the changed edge is not allowed, revert to its previous state.
            this.fallbackConnection(data);
        }
        this.afterArrowheadDragging(data);
    };
    // #endregion
    // #region drag lable
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    EdgeView.prototype.startLabelDragging = function (e, x, y) {
        if (this.can('edgeLabelMovable')) {
            var target = e.currentTarget;
            var index = parseInt(target.getAttribute('data-index'), 10);
            var positionAngle = this.getLabelPositionAngle(index);
            var labelPositionArgs = this.getLabelPositionArgs(index);
            var defaultLabelPositionArgs = this.getDefaultLabelPositionArgs();
            var positionArgs = this.mergeLabelPositionArgs(labelPositionArgs, defaultLabelPositionArgs);
            this.setEventData(e, {
                index: index,
                positionAngle: positionAngle,
                positionArgs: positionArgs,
                stopPropagation: true,
                action: 'drag-label',
            });
        }
        else {
            // If labels can't be dragged no default action is triggered.
            this.setEventData(e, { stopPropagation: true });
        }
        this.graph.view.delegateDragEvents(e, this);
    };
    EdgeView.prototype.dragLabel = function (e, x, y) {
        var data = this.getEventData(e);
        var originLabel = this.cell.getLabelAt(data.index);
        var label = util_1.ObjectExt.merge({}, originLabel, {
            position: this.getLabelPosition(x, y, data.positionAngle, data.positionArgs),
        });
        this.cell.setLabelAt(data.index, label);
    };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    EdgeView.prototype.stopLabelDragging = function (e, x, y) { };
    // #endregion
    // #region drag vertex
    EdgeView.prototype.handleVertexAdding = function (e, x, y) {
        if (!this.can('vertexAddable')) {
            this.notifyUnhandledMouseDown(e, x, y);
            return;
        }
        // Store the index at which the new vertex has just been placed.
        // We'll be update the very same vertex position in `pointermove()`.
        var index = this.addVertex({ x: x, y: y }, { ui: true });
        this.setEventData(e, {
            index: index,
            action: 'drag-vertex',
        });
    };
    EdgeView.prototype.handleVertexRemoving = function (e, x, y) {
        if (!this.can('vertexDeletable')) {
            this.notifyUnhandledMouseDown(e, x, y);
            return;
        }
        var target = e.target;
        var index = parseInt(target.getAttribute('idx'), 10);
        this.cell.removeVertexAt(index);
    };
    EdgeView.prototype.startVertexDragging = function (e, x, y) {
        if (!this.can('vertexMovable')) {
            this.notifyUnhandledMouseDown(e, x, y);
            return;
        }
        var target = e.target;
        var index = parseInt(target.getAttribute('idx'), 10);
        this.setEventData(e, {
            index: index,
            action: 'drag-vertex',
        });
    };
    EdgeView.prototype.dragVertex = function (e, x, y) {
        var data = this.getEventData(e);
        this.cell.setVertexAt(data.index, { x: x, y: y }, { ui: true });
    };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    EdgeView.prototype.stopVertexDragging = function (e, x, y) { };
    return EdgeView;
}(cell_1.CellView));
exports.EdgeView = EdgeView;
(function (EdgeView) {
    EdgeView.toStringTag = "X6." + EdgeView.name;
    function isEdgeView(instance) {
        if (instance == null) {
            return false;
        }
        if (instance instanceof EdgeView) {
            return true;
        }
        var tag = instance[Symbol.toStringTag];
        var view = instance;
        if ((tag == null || tag === EdgeView.toStringTag) &&
            typeof view.isNodeView === 'function' &&
            typeof view.isEdgeView === 'function' &&
            typeof view.confirmUpdate === 'function' &&
            typeof view.update === 'function' &&
            typeof view.getConnection === 'function') {
            return true;
        }
        return false;
    }
    EdgeView.isEdgeView = isEdgeView;
})(EdgeView = exports.EdgeView || (exports.EdgeView = {}));
exports.EdgeView = EdgeView;
EdgeView.config({
    isSvgElement: true,
    priority: 1,
    bootstrap: ['render', 'source', 'target'],
    actions: {
        view: ['render'],
        markup: ['render'],
        attrs: ['update'],
        source: ['source', 'update'],
        target: ['target', 'update'],
        router: ['update'],
        connector: ['update'],
        labels: ['labels'],
        defaultLabel: ['labels'],
        vertices: ['vertices', 'update'],
        vertexMarkup: ['vertices'],
        toolMarkup: ['tools'],
        tools: ['widget'],
    },
    shortLength: 105,
    longLength: 155,
    toolsOffset: 40,
    doubleTools: false,
    doubleToolsOffset: 65,
    sampleInterval: 50,
});
EdgeView.registry.register('edge', EdgeView, true);
//# sourceMappingURL=edge.js.map