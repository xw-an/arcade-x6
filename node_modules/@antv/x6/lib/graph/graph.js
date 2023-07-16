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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Graph = void 0;
var common_1 = require("../common");
var geometry_1 = require("../geometry");
var cell_1 = require("../model/cell");
var node_1 = require("../model/node");
var edge_1 = require("../model/edge");
var cell_2 = require("../view/cell");
var Registry = __importStar(require("../registry"));
var html_1 = require("../shape/standard/html");
var base_1 = require("./base");
var view_1 = require("./view");
var decorator_1 = require("./decorator");
var css_1 = require("./css");
var hook_1 = require("./hook");
var options_1 = require("./options");
var defs_1 = require("./defs");
var grid_1 = require("./grid");
var coord_1 = require("./coord");
var keyboard_1 = require("./keyboard");
var print_1 = require("./print");
var mousewheel_1 = require("./mousewheel");
var format_1 = require("./format");
var renderer_1 = require("./renderer");
var history_1 = require("./history");
var minimap_1 = require("./minimap");
var snapline_1 = require("./snapline");
var scroller_1 = require("./scroller");
var selection_1 = require("./selection");
var highlight_1 = require("./highlight");
var transform_1 = require("./transform");
var clipboard_1 = require("./clipboard");
var background_1 = require("./background");
var Graph = /** @class */ (function (_super) {
    __extends(Graph, _super);
    function Graph(options) {
        var _this = _super.call(this) || this;
        _this.options = options_1.Options.get(options);
        _this.css = new css_1.CSSManager(_this);
        _this.hook = new hook_1.Hook(_this);
        _this.view = _this.hook.createView();
        _this.defs = _this.hook.createDefsManager();
        _this.coord = _this.hook.createCoordManager();
        _this.transform = _this.hook.createTransformManager();
        _this.knob = _this.hook.createKnobManager();
        _this.highlight = _this.hook.createHighlightManager();
        _this.grid = _this.hook.createGridManager();
        _this.background = _this.hook.createBackgroundManager();
        _this.model = _this.hook.createModel();
        _this.renderer = _this.hook.createRenderer();
        _this.clipboard = _this.hook.createClipboardManager();
        _this.snapline = _this.hook.createSnaplineManager();
        _this.selection = _this.hook.createSelectionManager();
        _this.history = _this.hook.createHistoryManager();
        _this.scroller = _this.hook.createScrollerManager();
        _this.minimap = _this.hook.createMiniMapManager();
        _this.keyboard = _this.hook.createKeyboard();
        _this.mousewheel = _this.hook.createMouseWheel();
        _this.print = _this.hook.createPrintManager();
        _this.format = _this.hook.createFormatManager();
        _this.panning = _this.hook.createPanningManager();
        _this.size = _this.hook.createSizeManager();
        return _this;
    }
    Object.defineProperty(Graph.prototype, "container", {
        get: function () {
            return this.view.container;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Graph.prototype, Symbol.toStringTag, {
        get: function () {
            return Graph.toStringTag;
        },
        enumerable: false,
        configurable: true
    });
    // #region model
    Graph.prototype.isNode = function (cell) {
        return cell.isNode();
    };
    Graph.prototype.isEdge = function (cell) {
        return cell.isEdge();
    };
    Graph.prototype.resetCells = function (cells, options) {
        if (options === void 0) { options = {}; }
        this.model.resetCells(cells, options);
        return this;
    };
    Graph.prototype.clearCells = function (options) {
        if (options === void 0) { options = {}; }
        this.model.clear(options);
        return this;
    };
    Graph.prototype.toJSON = function (options) {
        if (options === void 0) { options = {}; }
        return this.model.toJSON(options);
    };
    Graph.prototype.parseJSON = function (data) {
        return this.model.parseJSON(data);
    };
    Graph.prototype.fromJSON = function (data, options) {
        if (options === void 0) { options = {}; }
        this.model.fromJSON(data, options);
        return this;
    };
    Graph.prototype.getCellById = function (id) {
        return this.model.getCell(id);
    };
    Graph.prototype.addNode = function (node, options) {
        if (options === void 0) { options = {}; }
        return this.model.addNode(node, options);
    };
    Graph.prototype.addNodes = function (nodes, options) {
        var _this = this;
        if (options === void 0) { options = {}; }
        return this.addCell(nodes.map(function (node) { return (node_1.Node.isNode(node) ? node : _this.createNode(node)); }), options);
    };
    Graph.prototype.createNode = function (metadata) {
        return this.model.createNode(metadata);
    };
    Graph.prototype.removeNode = function (node, options) {
        if (options === void 0) { options = {}; }
        return this.model.removeCell(node, options);
    };
    Graph.prototype.addEdge = function (edge, options) {
        if (options === void 0) { options = {}; }
        return this.model.addEdge(edge, options);
    };
    Graph.prototype.addEdges = function (edges, options) {
        var _this = this;
        if (options === void 0) { options = {}; }
        return this.addCell(edges.map(function (edge) { return (edge_1.Edge.isEdge(edge) ? edge : _this.createEdge(edge)); }), options);
    };
    Graph.prototype.removeEdge = function (edge, options) {
        if (options === void 0) { options = {}; }
        return this.model.removeCell(edge, options);
    };
    Graph.prototype.createEdge = function (metadata) {
        return this.model.createEdge(metadata);
    };
    Graph.prototype.addCell = function (cell, options) {
        if (options === void 0) { options = {}; }
        this.model.addCell(cell, options);
        return this;
    };
    Graph.prototype.removeCell = function (cell, options) {
        if (options === void 0) { options = {}; }
        return this.model.removeCell(cell, options);
    };
    Graph.prototype.removeCells = function (cells, options) {
        if (options === void 0) { options = {}; }
        return this.model.removeCells(cells, options);
    };
    Graph.prototype.removeConnectedEdges = function (cell, options) {
        if (options === void 0) { options = {}; }
        return this.model.removeConnectedEdges(cell, options);
    };
    Graph.prototype.disconnectConnectedEdges = function (cell, options) {
        if (options === void 0) { options = {}; }
        this.model.disconnectConnectedEdges(cell, options);
        return this;
    };
    Graph.prototype.hasCell = function (cell) {
        return this.model.has(cell);
    };
    /**
     * **Deprecation Notice:** `getCell` is deprecated and will be moved in next
     * major release. Use `getCellById()` instead.
     *
     * @deprecated
     */
    Graph.prototype.getCell = function (id) {
        return this.model.getCell(id);
    };
    Graph.prototype.getCells = function () {
        return this.model.getCells();
    };
    Graph.prototype.getCellCount = function () {
        return this.model.total();
    };
    /**
     * Returns all the nodes in the graph.
     */
    Graph.prototype.getNodes = function () {
        return this.model.getNodes();
    };
    /**
     * Returns all the edges in the graph.
     */
    Graph.prototype.getEdges = function () {
        return this.model.getEdges();
    };
    /**
     * Returns all outgoing edges for the node.
     */
    Graph.prototype.getOutgoingEdges = function (cell) {
        return this.model.getOutgoingEdges(cell);
    };
    /**
     * Returns all incoming edges for the node.
     */
    Graph.prototype.getIncomingEdges = function (cell) {
        return this.model.getIncomingEdges(cell);
    };
    /**
     * Returns edges connected with cell.
     */
    Graph.prototype.getConnectedEdges = function (cell, options) {
        if (options === void 0) { options = {}; }
        return this.model.getConnectedEdges(cell, options);
    };
    /**
     * Returns an array of all the roots of the graph.
     */
    Graph.prototype.getRootNodes = function () {
        return this.model.getRoots();
    };
    /**
     * Returns an array of all the leafs of the graph.
     */
    Graph.prototype.getLeafNodes = function () {
        return this.model.getLeafs();
    };
    /**
     * Returns `true` if the node is a root node, i.e.
     * there is no  edges coming to the node.
     */
    Graph.prototype.isRootNode = function (cell) {
        return this.model.isRoot(cell);
    };
    /**
     * Returns `true` if the node is a leaf node, i.e.
     * there is no edges going out from the node.
     */
    Graph.prototype.isLeafNode = function (cell) {
        return this.model.isLeaf(cell);
    };
    /**
     * Returns all the neighbors of node in the graph. Neighbors are all
     * the nodes connected to node via either incoming or outgoing edge.
     */
    Graph.prototype.getNeighbors = function (cell, options) {
        if (options === void 0) { options = {}; }
        return this.model.getNeighbors(cell, options);
    };
    /**
     * Returns `true` if `cell2` is a neighbor of `cell1`.
     */
    Graph.prototype.isNeighbor = function (cell1, cell2, options) {
        if (options === void 0) { options = {}; }
        return this.model.isNeighbor(cell1, cell2, options);
    };
    Graph.prototype.getSuccessors = function (cell, options) {
        if (options === void 0) { options = {}; }
        return this.model.getSuccessors(cell, options);
    };
    /**
     * Returns `true` if `cell2` is a successor of `cell1`.
     */
    Graph.prototype.isSuccessor = function (cell1, cell2, options) {
        if (options === void 0) { options = {}; }
        return this.model.isSuccessor(cell1, cell2, options);
    };
    Graph.prototype.getPredecessors = function (cell, options) {
        if (options === void 0) { options = {}; }
        return this.model.getPredecessors(cell, options);
    };
    /**
     * Returns `true` if `cell2` is a predecessor of `cell1`.
     */
    Graph.prototype.isPredecessor = function (cell1, cell2, options) {
        if (options === void 0) { options = {}; }
        return this.model.isPredecessor(cell1, cell2, options);
    };
    Graph.prototype.getCommonAncestor = function () {
        var _a;
        var cells = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            cells[_i] = arguments[_i];
        }
        return (_a = this.model).getCommonAncestor.apply(_a, cells);
    };
    /**
     * Returns an array of cells that result from finding nodes/edges that
     * are connected to any of the cells in the cells array. This function
     * loops over cells and if the current cell is a edge, it collects its
     * source/target nodes; if it is an node, it collects its incoming and
     * outgoing edges if both the edge terminal (source/target) are in the
     * cells array.
     */
    Graph.prototype.getSubGraph = function (cells, options) {
        if (options === void 0) { options = {}; }
        return this.model.getSubGraph(cells, options);
    };
    /**
     * Clones the whole subgraph (including all the connected links whose
     * source/target is in the subgraph). If `options.deep` is `true`, also
     * take into account all the embedded cells of all the subgraph cells.
     *
     * Returns a map of the form: { [original cell ID]: [clone] }.
     */
    Graph.prototype.cloneSubGraph = function (cells, options) {
        if (options === void 0) { options = {}; }
        return this.model.cloneSubGraph(cells, options);
    };
    Graph.prototype.cloneCells = function (cells) {
        return this.model.cloneCells(cells);
    };
    Graph.prototype.getNodesFromPoint = function (x, y) {
        return this.model.getNodesFromPoint(x, y);
    };
    Graph.prototype.getNodesInArea = function (x, y, w, h, options) {
        return this.model.getNodesInArea(x, y, w, h, options);
    };
    Graph.prototype.getNodesUnderNode = function (node, options) {
        if (options === void 0) { options = {}; }
        return this.model.getNodesUnderNode(node, options);
    };
    Graph.prototype.searchCell = function (cell, iterator, options) {
        if (options === void 0) { options = {}; }
        this.model.search(cell, iterator, options);
        return this;
    };
    /** *
     * Returns an array of IDs of nodes on the shortest
     * path between source and target.
     */
    Graph.prototype.getShortestPath = function (source, target, options) {
        if (options === void 0) { options = {}; }
        return this.model.getShortestPath(source, target, options);
    };
    /**
     * Returns the bounding box that surrounds all cells in the graph.
     */
    Graph.prototype.getAllCellsBBox = function () {
        return this.model.getAllCellsBBox();
    };
    /**
     * Returns the bounding box that surrounds all the given cells.
     */
    Graph.prototype.getCellsBBox = function (cells, options) {
        if (options === void 0) { options = {}; }
        return this.model.getCellsBBox(cells, options);
    };
    Graph.prototype.startBatch = function (name, data) {
        if (data === void 0) { data = {}; }
        this.model.startBatch(name, data);
    };
    Graph.prototype.stopBatch = function (name, data) {
        if (data === void 0) { data = {}; }
        this.model.stopBatch(name, data);
    };
    Graph.prototype.batchUpdate = function (arg1, arg2, arg3) {
        var name = typeof arg1 === 'string' ? arg1 : 'update';
        var execute = typeof arg1 === 'string' ? arg2 : arg1;
        var data = typeof arg2 === 'function' ? arg3 : arg2;
        this.startBatch(name, data);
        var result = execute();
        this.stopBatch(name, data);
        return result;
    };
    Graph.prototype.updateCellId = function (cell, newId) {
        return this.model.updateCellId(cell, newId);
    };
    // #endregion
    // #region view
    Graph.prototype.isFrozen = function () {
        return this.renderer.isFrozen();
    };
    Graph.prototype.freeze = function (options) {
        if (options === void 0) { options = {}; }
        this.renderer.freeze(options);
        return this;
    };
    Graph.prototype.unfreeze = function (options) {
        if (options === void 0) { options = {}; }
        this.renderer.unfreeze(options);
        return this;
    };
    Graph.prototype.isAsync = function () {
        return this.renderer.isAsync();
    };
    Graph.prototype.setAsync = function (async) {
        this.renderer.setAsync(async);
        return this;
    };
    Graph.prototype.findView = function (ref) {
        if (cell_1.Cell.isCell(ref)) {
            return this.findViewByCell(ref);
        }
        return this.findViewByElem(ref);
    };
    Graph.prototype.findViews = function (ref) {
        if (geometry_1.Rectangle.isRectangleLike(ref)) {
            return this.findViewsInArea(ref);
        }
        if (geometry_1.Point.isPointLike(ref)) {
            return this.findViewsFromPoint(ref);
        }
        return [];
    };
    Graph.prototype.findViewByCell = function (cell) {
        return this.renderer.findViewByCell(cell);
    };
    Graph.prototype.findViewByElem = function (elem) {
        return this.renderer.findViewByElem(elem);
    };
    Graph.prototype.findViewsFromPoint = function (x, y) {
        var p = typeof x === 'number' ? { x: x, y: y } : x;
        return this.renderer.findViewsFromPoint(p);
    };
    Graph.prototype.findViewsInArea = function (x, y, width, height, options) {
        var rect = typeof x === 'number'
            ? {
                x: x,
                y: y,
                width: width,
                height: height,
            }
            : x;
        var localOptions = typeof x === 'number'
            ? options
            : y;
        return this.renderer.findViewsInArea(rect, localOptions);
    };
    Graph.prototype.isViewMounted = function (view) {
        return this.renderer.isViewMounted(view);
    };
    Graph.prototype.getMountedViews = function () {
        return this.renderer.getMountedViews();
    };
    Graph.prototype.getUnmountedViews = function () {
        return this.renderer.getUnmountedViews();
    };
    Graph.prototype.matrix = function (mat) {
        if (typeof mat === 'undefined') {
            return this.transform.getMatrix();
        }
        this.transform.setMatrix(mat);
        return this;
    };
    Graph.prototype.resize = function (width, height) {
        this.size.resize(width, height);
        return this;
    };
    Graph.prototype.resizeGraph = function (width, height) {
        this.size.resizeGraph(width, height);
        return this;
    };
    Graph.prototype.resizeScroller = function (width, height) {
        this.size.resizeScroller(width, height);
        return this;
    };
    Graph.prototype.resizePage = function (width, height) {
        this.size.resizePage(width, height);
        return this;
    };
    Graph.prototype.scale = function (sx, sy, cx, cy) {
        if (sy === void 0) { sy = sx; }
        if (cx === void 0) { cx = 0; }
        if (cy === void 0) { cy = 0; }
        if (typeof sx === 'undefined') {
            return this.transform.getScale();
        }
        this.transform.scale(sx, sy, cx, cy);
        return this;
    };
    Graph.prototype.zoom = function (factor, options) {
        var scroller = this.scroller.widget;
        if (scroller) {
            if (typeof factor === 'undefined') {
                return scroller.zoom();
            }
            scroller.zoom(factor, options);
        }
        else {
            if (typeof factor === 'undefined') {
                return this.transform.getZoom();
            }
            this.transform.zoom(factor, options);
        }
        return this;
    };
    Graph.prototype.zoomTo = function (factor, options) {
        if (options === void 0) { options = {}; }
        var scroller = this.scroller.widget;
        if (scroller) {
            scroller.zoom(factor, __assign(__assign({}, options), { absolute: true }));
        }
        else {
            this.transform.zoom(factor, __assign(__assign({}, options), { absolute: true }));
        }
        return this;
    };
    Graph.prototype.zoomToRect = function (rect, options) {
        if (options === void 0) { options = {}; }
        var scroller = this.scroller.widget;
        if (scroller) {
            scroller.zoomToRect(rect, options);
        }
        else {
            this.transform.zoomToRect(rect, options);
        }
        return this;
    };
    Graph.prototype.zoomToFit = function (options) {
        if (options === void 0) { options = {}; }
        var scroller = this.scroller.widget;
        if (scroller) {
            scroller.zoomToFit(options);
        }
        else {
            this.transform.zoomToFit(options);
        }
        return this;
    };
    Graph.prototype.rotate = function (angle, cx, cy) {
        if (typeof angle === 'undefined') {
            return this.transform.getRotation();
        }
        this.transform.rotate(angle, cx, cy);
        return this;
    };
    Graph.prototype.translate = function (tx, ty) {
        if (typeof tx === 'undefined') {
            return this.transform.getTranslation();
        }
        this.transform.translate(tx, ty);
        return this;
    };
    Graph.prototype.translateBy = function (dx, dy) {
        var ts = this.translate();
        var tx = ts.tx + dx;
        var ty = ts.ty + dy;
        return this.translate(tx, ty);
    };
    /**
     * **Deprecation Notice:** `getArea` is deprecated and will be moved in next
     * major release. Use `getGraphArea()` instead.
     *
     * @deprecated
     */
    Graph.prototype.getArea = function () {
        return this.transform.getGraphArea();
    };
    Graph.prototype.getGraphArea = function () {
        return this.transform.getGraphArea();
    };
    Graph.prototype.getContentArea = function (options) {
        if (options === void 0) { options = {}; }
        return this.transform.getContentArea(options);
    };
    Graph.prototype.getContentBBox = function (options) {
        if (options === void 0) { options = {}; }
        return this.transform.getContentBBox(options);
    };
    Graph.prototype.fitToContent = function (gridWidth, gridHeight, padding, options) {
        return this.transform.fitToContent(gridWidth, gridHeight, padding, options);
    };
    Graph.prototype.scaleContentToFit = function (options) {
        if (options === void 0) { options = {}; }
        this.transform.scaleContentToFit(options);
        return this;
    };
    /**
     * Position the center of graph to the center of the viewport.
     */
    Graph.prototype.center = function (optons) {
        return this.centerPoint(optons);
    };
    Graph.prototype.centerPoint = function (x, y, options) {
        var scroller = this.scroller.widget;
        if (scroller) {
            scroller.centerPoint(x, y, options);
        }
        else {
            this.transform.centerPoint(x, y);
        }
        return this;
    };
    Graph.prototype.centerContent = function (options) {
        var scroller = this.scroller.widget;
        if (scroller) {
            scroller.centerContent(options);
        }
        else {
            this.transform.centerContent(options);
        }
        return this;
    };
    Graph.prototype.centerCell = function (cell, options) {
        var scroller = this.scroller.widget;
        if (scroller) {
            scroller.centerCell(cell, options);
        }
        else {
            this.transform.centerCell(cell);
        }
        return this;
    };
    Graph.prototype.positionPoint = function (point, x, y, options) {
        if (options === void 0) { options = {}; }
        var scroller = this.scroller.widget;
        if (scroller) {
            scroller.positionPoint(point, x, y, options);
        }
        else {
            this.transform.positionPoint(point, x, y);
        }
        return this;
    };
    Graph.prototype.positionRect = function (rect, direction, options) {
        var scroller = this.scroller.widget;
        if (scroller) {
            scroller.positionRect(rect, direction, options);
        }
        else {
            this.transform.positionRect(rect, direction);
        }
        return this;
    };
    Graph.prototype.positionCell = function (cell, direction, options) {
        var scroller = this.scroller.widget;
        if (scroller) {
            scroller.positionCell(cell, direction, options);
        }
        else {
            this.transform.positionCell(cell, direction);
        }
        return this;
    };
    Graph.prototype.positionContent = function (pos, options) {
        var scroller = this.scroller.widget;
        if (scroller) {
            scroller.positionContent(pos, options);
        }
        else {
            this.transform.positionContent(pos, options);
        }
        return this;
    };
    // #endregion
    // #region coord
    Graph.prototype.getClientMatrix = function () {
        return this.coord.getClientMatrix();
    };
    /**
     * Returns coordinates of the graph viewport, relative to the window.
     */
    Graph.prototype.getClientOffset = function () {
        return this.coord.getClientOffset();
    };
    /**
     * Returns coordinates of the graph viewport, relative to the document.
     */
    Graph.prototype.getPageOffset = function () {
        return this.coord.getPageOffset();
    };
    Graph.prototype.snapToGrid = function (x, y) {
        return this.coord.snapToGrid(x, y);
    };
    Graph.prototype.pageToLocal = function (x, y, width, height) {
        if (geometry_1.Rectangle.isRectangleLike(x)) {
            return this.coord.pageToLocalRect(x);
        }
        if (typeof x === 'number' &&
            typeof y === 'number' &&
            typeof width === 'number' &&
            typeof height === 'number') {
            return this.coord.pageToLocalRect(x, y, width, height);
        }
        return this.coord.pageToLocalPoint(x, y);
    };
    Graph.prototype.localToPage = function (x, y, width, height) {
        if (geometry_1.Rectangle.isRectangleLike(x)) {
            return this.coord.localToPageRect(x);
        }
        if (typeof x === 'number' &&
            typeof y === 'number' &&
            typeof width === 'number' &&
            typeof height === 'number') {
            return this.coord.localToPageRect(x, y, width, height);
        }
        return this.coord.localToPagePoint(x, y);
    };
    Graph.prototype.clientToLocal = function (x, y, width, height) {
        if (geometry_1.Rectangle.isRectangleLike(x)) {
            return this.coord.clientToLocalRect(x);
        }
        if (typeof x === 'number' &&
            typeof y === 'number' &&
            typeof width === 'number' &&
            typeof height === 'number') {
            return this.coord.clientToLocalRect(x, y, width, height);
        }
        return this.coord.clientToLocalPoint(x, y);
    };
    Graph.prototype.localToClient = function (x, y, width, height) {
        if (geometry_1.Rectangle.isRectangleLike(x)) {
            return this.coord.localToClientRect(x);
        }
        if (typeof x === 'number' &&
            typeof y === 'number' &&
            typeof width === 'number' &&
            typeof height === 'number') {
            return this.coord.localToClientRect(x, y, width, height);
        }
        return this.coord.localToClientPoint(x, y);
    };
    Graph.prototype.localToGraph = function (x, y, width, height) {
        if (geometry_1.Rectangle.isRectangleLike(x)) {
            return this.coord.localToGraphRect(x);
        }
        if (typeof x === 'number' &&
            typeof y === 'number' &&
            typeof width === 'number' &&
            typeof height === 'number') {
            return this.coord.localToGraphRect(x, y, width, height);
        }
        return this.coord.localToGraphPoint(x, y);
    };
    Graph.prototype.graphToLocal = function (x, y, width, height) {
        if (geometry_1.Rectangle.isRectangleLike(x)) {
            return this.coord.graphToLocalRect(x);
        }
        if (typeof x === 'number' &&
            typeof y === 'number' &&
            typeof width === 'number' &&
            typeof height === 'number') {
            return this.coord.graphToLocalRect(x, y, width, height);
        }
        return this.coord.graphToLocalPoint(x, y);
    };
    Graph.prototype.clientToGraph = function (x, y, width, height) {
        if (geometry_1.Rectangle.isRectangleLike(x)) {
            return this.coord.clientToGraphRect(x);
        }
        if (typeof x === 'number' &&
            typeof y === 'number' &&
            typeof width === 'number' &&
            typeof height === 'number') {
            return this.coord.clientToGraphRect(x, y, width, height);
        }
        return this.coord.clientToGraphPoint(x, y);
    };
    // #endregion
    // #region defs
    Graph.prototype.defineFilter = function (options) {
        return this.defs.filter(options);
    };
    Graph.prototype.defineGradient = function (options) {
        return this.defs.gradient(options);
    };
    Graph.prototype.defineMarker = function (options) {
        return this.defs.marker(options);
    };
    // #endregion
    // #region grid
    Graph.prototype.getGridSize = function () {
        return this.grid.getGridSize();
    };
    Graph.prototype.setGridSize = function (gridSize) {
        this.grid.setGridSize(gridSize);
        return this;
    };
    Graph.prototype.showGrid = function () {
        this.grid.show();
        return this;
    };
    Graph.prototype.hideGrid = function () {
        this.grid.hide();
        return this;
    };
    Graph.prototype.clearGrid = function () {
        this.grid.clear();
        return this;
    };
    Graph.prototype.drawGrid = function (options) {
        this.grid.draw(options);
        return this;
    };
    // #endregion
    // #region background
    Graph.prototype.updateBackground = function () {
        this.background.update();
        return this;
    };
    Graph.prototype.drawBackground = function (options, onGraph) {
        var scroller = this.scroller.widget;
        if (scroller != null && (this.options.background == null || !onGraph)) {
            scroller.backgroundManager.draw(options);
        }
        else {
            this.background.draw(options);
        }
        return this;
    };
    Graph.prototype.clearBackground = function (onGraph) {
        var scroller = this.scroller.widget;
        if (scroller != null && (this.options.background == null || !onGraph)) {
            scroller.backgroundManager.clear();
        }
        else {
            this.background.clear();
        }
        return this;
    };
    // #endregion
    // #region clipboard
    Graph.prototype.isClipboardEnabled = function () {
        return !this.clipboard.disabled;
    };
    Graph.prototype.enableClipboard = function () {
        this.clipboard.enable();
        return this;
    };
    Graph.prototype.disableClipboard = function () {
        this.clipboard.disable();
        return this;
    };
    Graph.prototype.toggleClipboard = function (enabled) {
        if (enabled != null) {
            if (enabled !== this.isClipboardEnabled()) {
                if (enabled) {
                    this.enableClipboard();
                }
                else {
                    this.disableClipboard();
                }
            }
        }
        else if (this.isClipboardEnabled()) {
            this.disableClipboard();
        }
        else {
            this.enableClipboard();
        }
        return this;
    };
    Graph.prototype.isClipboardEmpty = function () {
        return this.clipboard.isEmpty();
    };
    Graph.prototype.getCellsInClipboard = function () {
        return this.clipboard.cells;
    };
    Graph.prototype.cleanClipboard = function () {
        this.clipboard.clean();
        return this;
    };
    Graph.prototype.copy = function (cells, options) {
        if (options === void 0) { options = {}; }
        this.clipboard.copy(cells, options);
        return this;
    };
    Graph.prototype.cut = function (cells, options) {
        if (options === void 0) { options = {}; }
        this.clipboard.cut(cells, options);
        return this;
    };
    Graph.prototype.paste = function (options, graph) {
        if (options === void 0) { options = {}; }
        if (graph === void 0) { graph = this; }
        return this.clipboard.paste(options, graph);
    };
    // #endregion
    // #region redo/undo
    Graph.prototype.isHistoryEnabled = function () {
        return !this.history.disabled;
    };
    Graph.prototype.enableHistory = function () {
        this.history.enable();
        return this;
    };
    Graph.prototype.disableHistory = function () {
        this.history.disable();
        return this;
    };
    Graph.prototype.toggleHistory = function (enabled) {
        if (enabled != null) {
            if (enabled !== this.isHistoryEnabled()) {
                if (enabled) {
                    this.enableHistory();
                }
                else {
                    this.disableHistory();
                }
            }
        }
        else if (this.isHistoryEnabled()) {
            this.disableHistory();
        }
        else {
            this.enableHistory();
        }
        return this;
    };
    Graph.prototype.undo = function (options) {
        if (options === void 0) { options = {}; }
        this.history.undo(options);
        return this;
    };
    Graph.prototype.undoAndCancel = function (options) {
        if (options === void 0) { options = {}; }
        this.history.cancel(options);
        return this;
    };
    Graph.prototype.redo = function (options) {
        if (options === void 0) { options = {}; }
        this.history.redo(options);
        return this;
    };
    Graph.prototype.canUndo = function () {
        return this.history.canUndo();
    };
    Graph.prototype.canRedo = function () {
        return this.history.canRedo();
    };
    Graph.prototype.cleanHistory = function (options) {
        if (options === void 0) { options = {}; }
        this.history.clean(options);
    };
    // #endregion
    // #region keyboard
    Graph.prototype.isKeyboardEnabled = function () {
        return !this.keyboard.disabled;
    };
    Graph.prototype.enableKeyboard = function () {
        this.keyboard.enable();
        return this;
    };
    Graph.prototype.disableKeyboard = function () {
        this.keyboard.disable();
        return this;
    };
    Graph.prototype.toggleKeyboard = function (enabled) {
        if (enabled != null) {
            if (enabled !== this.isKeyboardEnabled()) {
                if (enabled) {
                    this.enableKeyboard();
                }
                else {
                    this.disableKeyboard();
                }
            }
        }
        else if (this.isKeyboardEnabled()) {
            this.disableKeyboard();
        }
        else {
            this.enableKeyboard();
        }
        return this;
    };
    Graph.prototype.bindKey = function (keys, callback, action) {
        this.keyboard.on(keys, callback, action);
        return this;
    };
    Graph.prototype.unbindKey = function (keys, action) {
        this.keyboard.off(keys, action);
        return this;
    };
    // #endregion
    // #region mousewheel
    Graph.prototype.isMouseWheelEnabled = function () {
        return !this.mousewheel.disabled;
    };
    Graph.prototype.enableMouseWheel = function () {
        this.mousewheel.enable();
        return this;
    };
    Graph.prototype.disableMouseWheel = function () {
        this.mousewheel.disable();
        return this;
    };
    Graph.prototype.toggleMouseWheel = function (enabled) {
        if (enabled == null) {
            if (this.isMouseWheelEnabled()) {
                this.disableMouseWheel();
            }
            else {
                this.enableMouseWheel();
            }
        }
        else if (enabled) {
            this.enableMouseWheel();
        }
        else {
            this.disableMouseWheel();
        }
        return this;
    };
    // #endregion
    // #region panning
    Graph.prototype.isPannable = function () {
        var scroller = this.scroller.widget;
        if (scroller) {
            return this.scroller.pannable;
        }
        return this.panning.pannable;
    };
    Graph.prototype.enablePanning = function () {
        var scroller = this.scroller.widget;
        if (scroller) {
            this.scroller.enablePanning();
        }
        else {
            this.panning.enablePanning();
        }
        return this;
    };
    Graph.prototype.disablePanning = function () {
        var scroller = this.scroller.widget;
        if (scroller) {
            this.scroller.disablePanning();
        }
        else {
            this.panning.disablePanning();
        }
        return this;
    };
    Graph.prototype.togglePanning = function (pannable) {
        if (pannable == null) {
            if (this.isPannable()) {
                this.disablePanning();
            }
            else {
                this.enablePanning();
            }
        }
        else if (pannable !== this.isPannable()) {
            if (pannable) {
                this.enablePanning();
            }
            else {
                this.disablePanning();
            }
        }
        return this;
    };
    // #endregion
    // #region scroller
    Graph.prototype.lockScroller = function () {
        var _a;
        (_a = this.scroller.widget) === null || _a === void 0 ? void 0 : _a.lock();
    };
    Graph.prototype.unlockScroller = function () {
        var _a;
        (_a = this.scroller.widget) === null || _a === void 0 ? void 0 : _a.unlock();
    };
    Graph.prototype.updateScroller = function () {
        var _a;
        (_a = this.scroller.widget) === null || _a === void 0 ? void 0 : _a.update();
    };
    Graph.prototype.getScrollbarPosition = function () {
        var scroller = this.scroller.widget;
        return scroller.scrollbarPosition();
    };
    Graph.prototype.setScrollbarPosition = function (left, top, options) {
        var scroller = this.scroller.widget;
        scroller.scrollbarPosition(left, top, options);
        return this;
    };
    /**
     * Try to scroll to ensure that the position (x,y) on the graph (in local
     * coordinates) is at the center of the viewport. If only one of the
     * coordinates is specified, only scroll in the specified dimension and
     * keep the other coordinate unchanged.
     */
    Graph.prototype.scrollToPoint = function (x, y, options) {
        var scroller = this.scroller.widget;
        scroller.scrollToPoint(x, y, options);
        return this;
    };
    /**
     * Try to scroll to ensure that the center of graph content is at the
     * center of the viewport.
     */
    Graph.prototype.scrollToContent = function (options) {
        var scroller = this.scroller.widget;
        scroller.scrollToContent(options);
        return this;
    };
    /**
     * Try to scroll to ensure that the center of cell is at the center of
     * the viewport.
     */
    Graph.prototype.scrollToCell = function (cell, options) {
        var scroller = this.scroller.widget;
        scroller.scrollToCell(cell, options);
        return this;
    };
    Graph.prototype.transitionToPoint = function (x, y, options) {
        var scroller = this.scroller.widget;
        scroller.transitionToPoint(x, y, options);
        return this;
    };
    Graph.prototype.transitionToRect = function (rect, options) {
        if (options === void 0) { options = {}; }
        var scroller = this.scroller.widget;
        scroller.transitionToRect(rect, options);
        return this;
    };
    // #endregion
    // #region selection
    Graph.prototype.isSelectionEnabled = function () {
        return !this.selection.disabled;
    };
    Graph.prototype.enableSelection = function () {
        this.selection.enable();
        return this;
    };
    Graph.prototype.disableSelection = function () {
        this.selection.disable();
        return this;
    };
    Graph.prototype.toggleSelection = function (enabled) {
        if (enabled != null) {
            if (enabled !== this.isSelectionEnabled()) {
                if (enabled) {
                    this.enableSelection();
                }
                else {
                    this.disableSelection();
                }
            }
        }
        else if (this.isSelectionEnabled()) {
            this.disableSelection();
        }
        else {
            this.enableSelection();
        }
        return this;
    };
    Graph.prototype.isMultipleSelection = function () {
        return this.selection.isMultiple();
    };
    Graph.prototype.enableMultipleSelection = function () {
        this.selection.enableMultiple();
        return this;
    };
    Graph.prototype.disableMultipleSelection = function () {
        this.selection.disableMultiple();
        return this;
    };
    Graph.prototype.toggleMultipleSelection = function (multiple) {
        if (multiple != null) {
            if (multiple !== this.isMultipleSelection()) {
                if (multiple) {
                    this.enableMultipleSelection();
                }
                else {
                    this.disableMultipleSelection();
                }
            }
        }
        else if (this.isMultipleSelection()) {
            this.disableMultipleSelection();
        }
        else {
            this.enableMultipleSelection();
        }
        return this;
    };
    Graph.prototype.isSelectionMovable = function () {
        return this.selection.widget.options.movable !== false;
    };
    Graph.prototype.enableSelectionMovable = function () {
        this.selection.widget.options.movable = true;
        return this;
    };
    Graph.prototype.disableSelectionMovable = function () {
        this.selection.widget.options.movable = false;
        return this;
    };
    Graph.prototype.toggleSelectionMovable = function (movable) {
        if (movable != null) {
            if (movable !== this.isSelectionMovable()) {
                if (movable) {
                    this.enableSelectionMovable();
                }
                else {
                    this.disableSelectionMovable();
                }
            }
        }
        else if (this.isSelectionMovable()) {
            this.disableSelectionMovable();
        }
        else {
            this.enableSelectionMovable();
        }
        return this;
    };
    Graph.prototype.isRubberbandEnabled = function () {
        return !this.selection.rubberbandDisabled;
    };
    Graph.prototype.enableRubberband = function () {
        this.selection.enableRubberband();
        return this;
    };
    Graph.prototype.disableRubberband = function () {
        this.selection.disableRubberband();
        return this;
    };
    Graph.prototype.toggleRubberband = function (enabled) {
        if (enabled != null) {
            if (enabled !== this.isRubberbandEnabled()) {
                if (enabled) {
                    this.enableRubberband();
                }
                else {
                    this.disableRubberband();
                }
            }
        }
        else if (this.isRubberbandEnabled()) {
            this.disableRubberband();
        }
        else {
            this.enableRubberband();
        }
        return this;
    };
    Graph.prototype.isStrictRubberband = function () {
        return this.selection.widget.options.strict === true;
    };
    Graph.prototype.enableStrictRubberband = function () {
        this.selection.widget.options.strict = true;
        return this;
    };
    Graph.prototype.disableStrictRubberband = function () {
        this.selection.widget.options.strict = false;
        return this;
    };
    Graph.prototype.toggleStrictRubberband = function (strict) {
        if (strict != null) {
            if (strict !== this.isStrictRubberband()) {
                if (strict) {
                    this.enableStrictRubberband();
                }
                else {
                    this.disableStrictRubberband();
                }
            }
        }
        else if (this.isStrictRubberband()) {
            this.disableStrictRubberband();
        }
        else {
            this.enableStrictRubberband();
        }
        return this;
    };
    Graph.prototype.setRubberbandModifiers = function (modifiers) {
        this.selection.setModifiers(modifiers);
    };
    Graph.prototype.setSelectionFilter = function (filter) {
        this.selection.setFilter(filter);
        return this;
    };
    Graph.prototype.setSelectionDisplayContent = function (content) {
        this.selection.setContent(content);
        return this;
    };
    Graph.prototype.isSelectionEmpty = function () {
        return this.selection.isEmpty();
    };
    Graph.prototype.cleanSelection = function (options) {
        this.selection.clean(options);
        return this;
    };
    Graph.prototype.resetSelection = function (cells, options) {
        this.selection.reset(cells, options);
        return this;
    };
    Graph.prototype.getSelectedCells = function () {
        return this.selection.cells;
    };
    Graph.prototype.getSelectedCellCount = function () {
        return this.selection.length;
    };
    Graph.prototype.isSelected = function (cell) {
        return this.selection.isSelected(cell);
    };
    Graph.prototype.select = function (cells, options) {
        this.selection.select(cells, options);
        return this;
    };
    Graph.prototype.unselect = function (cells, options) {
        this.selection.unselect(cells, options);
        return this;
    };
    // #endregion
    // #region snapline
    Graph.prototype.isSnaplineEnabled = function () {
        return !this.snapline.widget.disabled;
    };
    Graph.prototype.enableSnapline = function () {
        this.snapline.widget.enable();
        return this;
    };
    Graph.prototype.disableSnapline = function () {
        this.snapline.widget.disable();
        return this;
    };
    Graph.prototype.toggleSnapline = function (enabled) {
        if (enabled != null) {
            if (enabled !== this.isSnaplineEnabled()) {
                if (enabled) {
                    this.enableSnapline();
                }
                else {
                    this.disableSnapline();
                }
            }
        }
        else {
            if (this.isSnaplineEnabled()) {
                this.disableSnapline();
            }
            else {
                this.enableSnapline();
            }
            return this;
        }
    };
    Graph.prototype.hideSnapline = function () {
        this.snapline.widget.hide();
        return this;
    };
    Graph.prototype.setSnaplineFilter = function (filter) {
        this.snapline.widget.setFilter(filter);
        return this;
    };
    Graph.prototype.isSnaplineOnResizingEnabled = function () {
        return this.snapline.widget.options.resizing === true;
    };
    Graph.prototype.enableSnaplineOnResizing = function () {
        this.snapline.widget.options.resizing = true;
        return this;
    };
    Graph.prototype.disableSnaplineOnResizing = function () {
        this.snapline.widget.options.resizing = false;
        return this;
    };
    Graph.prototype.toggleSnaplineOnResizing = function (enableOnResizing) {
        if (enableOnResizing != null) {
            if (enableOnResizing !== this.isSnaplineOnResizingEnabled()) {
                if (enableOnResizing) {
                    this.enableSnaplineOnResizing();
                }
                else {
                    this.disableSnaplineOnResizing();
                }
            }
        }
        else if (this.isSnaplineOnResizingEnabled()) {
            this.disableSnaplineOnResizing();
        }
        else {
            this.enableSnaplineOnResizing();
        }
        return this;
    };
    Graph.prototype.isSharpSnapline = function () {
        return this.snapline.widget.options.sharp === true;
    };
    Graph.prototype.enableSharpSnapline = function () {
        this.snapline.widget.options.sharp = true;
        return this;
    };
    Graph.prototype.disableSharpSnapline = function () {
        this.snapline.widget.options.sharp = false;
        return this;
    };
    Graph.prototype.toggleSharpSnapline = function (sharp) {
        if (sharp != null) {
            if (sharp !== this.isSharpSnapline()) {
                if (sharp) {
                    this.enableSharpSnapline();
                }
                else {
                    this.disableSharpSnapline();
                }
            }
        }
        else if (this.isSharpSnapline()) {
            this.disableSharpSnapline();
        }
        else {
            this.enableSharpSnapline();
        }
        return this;
    };
    Graph.prototype.getSnaplineTolerance = function () {
        return this.snapline.widget.options.tolerance;
    };
    Graph.prototype.setSnaplineTolerance = function (tolerance) {
        this.snapline.widget.options.tolerance = tolerance;
        return this;
    };
    // #endregion
    // #region tools
    Graph.prototype.removeTools = function () {
        this.emit('tools:remove');
        return this;
    };
    Graph.prototype.hideTools = function () {
        this.emit('tools:hide');
        return this;
    };
    Graph.prototype.showTools = function () {
        this.emit('tools:show');
        return this;
    };
    // #endregion
    // #region format
    Graph.prototype.toSVG = function (callback, options) {
        if (options === void 0) { options = {}; }
        this.format.toSVG(callback, options);
    };
    Graph.prototype.toDataURL = function (callback, options) {
        this.format.toDataURL(callback, options);
    };
    Graph.prototype.toPNG = function (callback, options) {
        if (options === void 0) { options = {}; }
        this.format.toPNG(callback, options);
    };
    Graph.prototype.toJPEG = function (callback, options) {
        if (options === void 0) { options = {}; }
        this.format.toJPEG(callback, options);
    };
    // #endregion
    // #region print
    Graph.prototype.printPreview = function (options) {
        this.print.show(options);
    };
    // #endregion
    // #region dispose
    Graph.prototype.dispose = function () {
        this.clearCells();
        this.off();
        this.css.dispose();
        this.hook.dispose();
        this.defs.dispose();
        this.grid.dispose();
        this.coord.dispose();
        this.transform.dispose();
        this.knob.dispose();
        this.highlight.dispose();
        this.background.dispose();
        this.clipboard.dispose();
        this.snapline.dispose();
        this.selection.dispose();
        this.history.dispose();
        this.keyboard.dispose();
        this.mousewheel.dispose();
        this.print.dispose();
        this.format.dispose();
        this.minimap.dispose();
        this.panning.dispose();
        this.scroller.dispose();
        this.view.dispose();
        this.renderer.dispose();
        this.size.dispose();
    };
    __decorate([
        decorator_1.Decorator.checkScroller()
    ], Graph.prototype, "lockScroller", null);
    __decorate([
        decorator_1.Decorator.checkScroller()
    ], Graph.prototype, "unlockScroller", null);
    __decorate([
        decorator_1.Decorator.checkScroller()
    ], Graph.prototype, "updateScroller", null);
    __decorate([
        decorator_1.Decorator.checkScroller()
    ], Graph.prototype, "getScrollbarPosition", null);
    __decorate([
        decorator_1.Decorator.checkScroller()
    ], Graph.prototype, "setScrollbarPosition", null);
    __decorate([
        decorator_1.Decorator.checkScroller()
    ], Graph.prototype, "scrollToPoint", null);
    __decorate([
        decorator_1.Decorator.checkScroller()
    ], Graph.prototype, "scrollToContent", null);
    __decorate([
        decorator_1.Decorator.checkScroller()
    ], Graph.prototype, "scrollToCell", null);
    __decorate([
        decorator_1.Decorator.checkScroller()
    ], Graph.prototype, "transitionToPoint", null);
    __decorate([
        decorator_1.Decorator.checkScroller()
    ], Graph.prototype, "transitionToRect", null);
    __decorate([
        common_1.Basecoat.dispose()
    ], Graph.prototype, "dispose", null);
    return Graph;
}(common_1.Basecoat));
exports.Graph = Graph;
(function (Graph) {
    /* eslint-disable @typescript-eslint/no-unused-vars */
    Graph.View = view_1.GraphView;
    Graph.Hook = hook_1.Hook;
    Graph.Renderer = renderer_1.Renderer;
    Graph.Keyboard = keyboard_1.Keyboard;
    Graph.MouseWheel = mousewheel_1.MouseWheel;
    Graph.BaseManager = base_1.Base;
    Graph.DefsManager = defs_1.DefsManager;
    Graph.GridManager = grid_1.GridManager;
    Graph.CoordManager = coord_1.CoordManager;
    Graph.PrintManager = print_1.PrintManager;
    Graph.FormatManager = format_1.FormatManager;
    Graph.MiniMapManager = minimap_1.MiniMapManager;
    Graph.HistoryManager = history_1.HistoryManager;
    Graph.SnaplineManager = snapline_1.SnaplineManager;
    Graph.ScrollerManager = scroller_1.ScrollerManager;
    Graph.ClipboardManager = clipboard_1.ClipboardManager;
    Graph.TransformManager = transform_1.TransformManager;
    Graph.HighlightManager = highlight_1.HighlightManager;
    Graph.BackgroundManager = background_1.BackgroundManager;
    Graph.SelectionManager = selection_1.SelectionManager;
})(Graph = exports.Graph || (exports.Graph = {}));
exports.Graph = Graph;
(function (Graph) {
    Graph.toStringTag = "X6." + Graph.name;
    function isGraph(instance) {
        if (instance == null) {
            return false;
        }
        if (instance instanceof Graph) {
            return true;
        }
        var tag = instance[Symbol.toStringTag];
        var graph = instance;
        if ((tag == null || tag === Graph.toStringTag) &&
            graph.hook != null &&
            graph.view != null &&
            graph.model != null) {
            return true;
        }
        return false;
    }
    Graph.isGraph = isGraph;
})(Graph = exports.Graph || (exports.Graph = {}));
exports.Graph = Graph;
(function (Graph) {
    function render(options, data) {
        var graph = options instanceof HTMLElement
            ? new Graph({ container: options })
            : new Graph(options);
        if (data != null) {
            graph.fromJSON(data);
        }
        return graph;
    }
    Graph.render = render;
})(Graph = exports.Graph || (exports.Graph = {}));
exports.Graph = Graph;
(function (Graph) {
    Graph.registerNode = node_1.Node.registry.register;
    Graph.registerEdge = edge_1.Edge.registry.register;
    Graph.registerView = cell_2.CellView.registry.register;
    Graph.registerAttr = Registry.Attr.registry.register;
    Graph.registerGrid = Registry.Grid.registry.register;
    Graph.registerFilter = Registry.Filter.registry.register;
    Graph.registerNodeTool = Registry.NodeTool.registry.register;
    Graph.registerEdgeTool = Registry.EdgeTool.registry.register;
    Graph.registerBackground = Registry.Background.registry.register;
    Graph.registerHighlighter = Registry.Highlighter.registry.register;
    Graph.registerPortLayout = Registry.PortLayout.registry.register;
    Graph.registerPortLabelLayout = Registry.PortLabelLayout.registry.register;
    Graph.registerMarker = Registry.Marker.registry.register;
    Graph.registerRouter = Registry.Router.registry.register;
    Graph.registerConnector = Registry.Connector.registry.register;
    Graph.registerAnchor = Registry.NodeAnchor.registry.register;
    Graph.registerEdgeAnchor = Registry.EdgeAnchor.registry.register;
    Graph.registerConnectionPoint = Registry.ConnectionPoint.registry.register;
    Graph.registerConnectionStrategy = Registry.ConnectionStrategy.registry.register;
    Graph.registerHTMLComponent = html_1.HTML.componentRegistry.register;
})(Graph = exports.Graph || (exports.Graph = {}));
exports.Graph = Graph;
(function (Graph) {
    Graph.unregisterNode = node_1.Node.registry.unregister;
    Graph.unregisterEdge = edge_1.Edge.registry.unregister;
    Graph.unregisterView = cell_2.CellView.registry.unregister;
    Graph.unregisterAttr = Registry.Attr.registry.unregister;
    Graph.unregisterGrid = Registry.Grid.registry.unregister;
    Graph.unregisterFilter = Registry.Filter.registry.unregister;
    Graph.unregisterNodeTool = Registry.NodeTool.registry.unregister;
    Graph.unregisterEdgeTool = Registry.EdgeTool.registry.unregister;
    Graph.unregisterBackground = Registry.Background.registry.unregister;
    Graph.unregisterHighlighter = Registry.Highlighter.registry.unregister;
    Graph.unregisterPortLayout = Registry.PortLayout.registry.unregister;
    Graph.unregisterPortLabelLayout = Registry.PortLabelLayout.registry.unregister;
    Graph.unregisterMarker = Registry.Marker.registry.unregister;
    Graph.unregisterRouter = Registry.Router.registry.unregister;
    Graph.unregisterConnector = Registry.Connector.registry.unregister;
    Graph.unregisterAnchor = Registry.NodeAnchor.registry.unregister;
    Graph.unregisterEdgeAnchor = Registry.EdgeAnchor.registry.unregister;
    Graph.unregisterConnectionPoint = Registry.ConnectionPoint.registry.unregister;
    Graph.unregisterConnectionStrategy = Registry.ConnectionStrategy.registry.unregister;
    Graph.unregisterHTMLComponent = html_1.HTML.componentRegistry.unregister;
})(Graph = exports.Graph || (exports.Graph = {}));
exports.Graph = Graph;
//# sourceMappingURL=graph.js.map