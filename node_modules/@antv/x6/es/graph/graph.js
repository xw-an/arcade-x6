var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Basecoat } from '../common';
import { Point, Rectangle } from '../geometry';
import { Cell } from '../model/cell';
import { Node } from '../model/node';
import { Edge } from '../model/edge';
import { CellView } from '../view/cell';
import * as Registry from '../registry';
import { HTML } from '../shape/standard/html';
import { Base } from './base';
import { GraphView } from './view';
import { Decorator } from './decorator';
import { CSSManager } from './css';
import { Hook as HookManager } from './hook';
import { Options as GraphOptions } from './options';
import { DefsManager as Defs } from './defs';
import { GridManager as Grid } from './grid';
import { CoordManager as Coord } from './coord';
import { Keyboard as Shortcut } from './keyboard';
import { PrintManager as Print } from './print';
import { MouseWheel as Wheel } from './mousewheel';
import { FormatManager as Format } from './format';
import { Renderer as ViewRenderer } from './renderer';
import { HistoryManager as History } from './history';
import { MiniMapManager as MiniMap } from './minimap';
import { SnaplineManager as Snapline } from './snapline';
import { ScrollerManager as Scroller } from './scroller';
import { SelectionManager as Selection } from './selection';
import { HighlightManager as Highlight } from './highlight';
import { TransformManager as Transform } from './transform';
import { ClipboardManager as Clipboard } from './clipboard';
import { BackgroundManager as Background } from './background';
export class Graph extends Basecoat {
    constructor(options) {
        super();
        this.options = GraphOptions.get(options);
        this.css = new CSSManager(this);
        this.hook = new HookManager(this);
        this.view = this.hook.createView();
        this.defs = this.hook.createDefsManager();
        this.coord = this.hook.createCoordManager();
        this.transform = this.hook.createTransformManager();
        this.knob = this.hook.createKnobManager();
        this.highlight = this.hook.createHighlightManager();
        this.grid = this.hook.createGridManager();
        this.background = this.hook.createBackgroundManager();
        this.model = this.hook.createModel();
        this.renderer = this.hook.createRenderer();
        this.clipboard = this.hook.createClipboardManager();
        this.snapline = this.hook.createSnaplineManager();
        this.selection = this.hook.createSelectionManager();
        this.history = this.hook.createHistoryManager();
        this.scroller = this.hook.createScrollerManager();
        this.minimap = this.hook.createMiniMapManager();
        this.keyboard = this.hook.createKeyboard();
        this.mousewheel = this.hook.createMouseWheel();
        this.print = this.hook.createPrintManager();
        this.format = this.hook.createFormatManager();
        this.panning = this.hook.createPanningManager();
        this.size = this.hook.createSizeManager();
    }
    get container() {
        return this.view.container;
    }
    get [Symbol.toStringTag]() {
        return Graph.toStringTag;
    }
    // #region model
    isNode(cell) {
        return cell.isNode();
    }
    isEdge(cell) {
        return cell.isEdge();
    }
    resetCells(cells, options = {}) {
        this.model.resetCells(cells, options);
        return this;
    }
    clearCells(options = {}) {
        this.model.clear(options);
        return this;
    }
    toJSON(options = {}) {
        return this.model.toJSON(options);
    }
    parseJSON(data) {
        return this.model.parseJSON(data);
    }
    fromJSON(data, options = {}) {
        this.model.fromJSON(data, options);
        return this;
    }
    getCellById(id) {
        return this.model.getCell(id);
    }
    addNode(node, options = {}) {
        return this.model.addNode(node, options);
    }
    addNodes(nodes, options = {}) {
        return this.addCell(nodes.map((node) => (Node.isNode(node) ? node : this.createNode(node))), options);
    }
    createNode(metadata) {
        return this.model.createNode(metadata);
    }
    removeNode(node, options = {}) {
        return this.model.removeCell(node, options);
    }
    addEdge(edge, options = {}) {
        return this.model.addEdge(edge, options);
    }
    addEdges(edges, options = {}) {
        return this.addCell(edges.map((edge) => (Edge.isEdge(edge) ? edge : this.createEdge(edge))), options);
    }
    removeEdge(edge, options = {}) {
        return this.model.removeCell(edge, options);
    }
    createEdge(metadata) {
        return this.model.createEdge(metadata);
    }
    addCell(cell, options = {}) {
        this.model.addCell(cell, options);
        return this;
    }
    removeCell(cell, options = {}) {
        return this.model.removeCell(cell, options);
    }
    removeCells(cells, options = {}) {
        return this.model.removeCells(cells, options);
    }
    removeConnectedEdges(cell, options = {}) {
        return this.model.removeConnectedEdges(cell, options);
    }
    disconnectConnectedEdges(cell, options = {}) {
        this.model.disconnectConnectedEdges(cell, options);
        return this;
    }
    hasCell(cell) {
        return this.model.has(cell);
    }
    /**
     * **Deprecation Notice:** `getCell` is deprecated and will be moved in next
     * major release. Use `getCellById()` instead.
     *
     * @deprecated
     */
    getCell(id) {
        return this.model.getCell(id);
    }
    getCells() {
        return this.model.getCells();
    }
    getCellCount() {
        return this.model.total();
    }
    /**
     * Returns all the nodes in the graph.
     */
    getNodes() {
        return this.model.getNodes();
    }
    /**
     * Returns all the edges in the graph.
     */
    getEdges() {
        return this.model.getEdges();
    }
    /**
     * Returns all outgoing edges for the node.
     */
    getOutgoingEdges(cell) {
        return this.model.getOutgoingEdges(cell);
    }
    /**
     * Returns all incoming edges for the node.
     */
    getIncomingEdges(cell) {
        return this.model.getIncomingEdges(cell);
    }
    /**
     * Returns edges connected with cell.
     */
    getConnectedEdges(cell, options = {}) {
        return this.model.getConnectedEdges(cell, options);
    }
    /**
     * Returns an array of all the roots of the graph.
     */
    getRootNodes() {
        return this.model.getRoots();
    }
    /**
     * Returns an array of all the leafs of the graph.
     */
    getLeafNodes() {
        return this.model.getLeafs();
    }
    /**
     * Returns `true` if the node is a root node, i.e.
     * there is no  edges coming to the node.
     */
    isRootNode(cell) {
        return this.model.isRoot(cell);
    }
    /**
     * Returns `true` if the node is a leaf node, i.e.
     * there is no edges going out from the node.
     */
    isLeafNode(cell) {
        return this.model.isLeaf(cell);
    }
    /**
     * Returns all the neighbors of node in the graph. Neighbors are all
     * the nodes connected to node via either incoming or outgoing edge.
     */
    getNeighbors(cell, options = {}) {
        return this.model.getNeighbors(cell, options);
    }
    /**
     * Returns `true` if `cell2` is a neighbor of `cell1`.
     */
    isNeighbor(cell1, cell2, options = {}) {
        return this.model.isNeighbor(cell1, cell2, options);
    }
    getSuccessors(cell, options = {}) {
        return this.model.getSuccessors(cell, options);
    }
    /**
     * Returns `true` if `cell2` is a successor of `cell1`.
     */
    isSuccessor(cell1, cell2, options = {}) {
        return this.model.isSuccessor(cell1, cell2, options);
    }
    getPredecessors(cell, options = {}) {
        return this.model.getPredecessors(cell, options);
    }
    /**
     * Returns `true` if `cell2` is a predecessor of `cell1`.
     */
    isPredecessor(cell1, cell2, options = {}) {
        return this.model.isPredecessor(cell1, cell2, options);
    }
    getCommonAncestor(...cells) {
        return this.model.getCommonAncestor(...cells);
    }
    /**
     * Returns an array of cells that result from finding nodes/edges that
     * are connected to any of the cells in the cells array. This function
     * loops over cells and if the current cell is a edge, it collects its
     * source/target nodes; if it is an node, it collects its incoming and
     * outgoing edges if both the edge terminal (source/target) are in the
     * cells array.
     */
    getSubGraph(cells, options = {}) {
        return this.model.getSubGraph(cells, options);
    }
    /**
     * Clones the whole subgraph (including all the connected links whose
     * source/target is in the subgraph). If `options.deep` is `true`, also
     * take into account all the embedded cells of all the subgraph cells.
     *
     * Returns a map of the form: { [original cell ID]: [clone] }.
     */
    cloneSubGraph(cells, options = {}) {
        return this.model.cloneSubGraph(cells, options);
    }
    cloneCells(cells) {
        return this.model.cloneCells(cells);
    }
    getNodesFromPoint(x, y) {
        return this.model.getNodesFromPoint(x, y);
    }
    getNodesInArea(x, y, w, h, options) {
        return this.model.getNodesInArea(x, y, w, h, options);
    }
    getNodesUnderNode(node, options = {}) {
        return this.model.getNodesUnderNode(node, options);
    }
    searchCell(cell, iterator, options = {}) {
        this.model.search(cell, iterator, options);
        return this;
    }
    /** *
     * Returns an array of IDs of nodes on the shortest
     * path between source and target.
     */
    getShortestPath(source, target, options = {}) {
        return this.model.getShortestPath(source, target, options);
    }
    /**
     * Returns the bounding box that surrounds all cells in the graph.
     */
    getAllCellsBBox() {
        return this.model.getAllCellsBBox();
    }
    /**
     * Returns the bounding box that surrounds all the given cells.
     */
    getCellsBBox(cells, options = {}) {
        return this.model.getCellsBBox(cells, options);
    }
    startBatch(name, data = {}) {
        this.model.startBatch(name, data);
    }
    stopBatch(name, data = {}) {
        this.model.stopBatch(name, data);
    }
    batchUpdate(arg1, arg2, arg3) {
        const name = typeof arg1 === 'string' ? arg1 : 'update';
        const execute = typeof arg1 === 'string' ? arg2 : arg1;
        const data = typeof arg2 === 'function' ? arg3 : arg2;
        this.startBatch(name, data);
        const result = execute();
        this.stopBatch(name, data);
        return result;
    }
    updateCellId(cell, newId) {
        return this.model.updateCellId(cell, newId);
    }
    // #endregion
    // #region view
    isFrozen() {
        return this.renderer.isFrozen();
    }
    freeze(options = {}) {
        this.renderer.freeze(options);
        return this;
    }
    unfreeze(options = {}) {
        this.renderer.unfreeze(options);
        return this;
    }
    isAsync() {
        return this.renderer.isAsync();
    }
    setAsync(async) {
        this.renderer.setAsync(async);
        return this;
    }
    findView(ref) {
        if (Cell.isCell(ref)) {
            return this.findViewByCell(ref);
        }
        return this.findViewByElem(ref);
    }
    findViews(ref) {
        if (Rectangle.isRectangleLike(ref)) {
            return this.findViewsInArea(ref);
        }
        if (Point.isPointLike(ref)) {
            return this.findViewsFromPoint(ref);
        }
        return [];
    }
    findViewByCell(cell) {
        return this.renderer.findViewByCell(cell);
    }
    findViewByElem(elem) {
        return this.renderer.findViewByElem(elem);
    }
    findViewsFromPoint(x, y) {
        const p = typeof x === 'number' ? { x, y: y } : x;
        return this.renderer.findViewsFromPoint(p);
    }
    findViewsInArea(x, y, width, height, options) {
        const rect = typeof x === 'number'
            ? {
                x,
                y: y,
                width: width,
                height: height,
            }
            : x;
        const localOptions = typeof x === 'number'
            ? options
            : y;
        return this.renderer.findViewsInArea(rect, localOptions);
    }
    isViewMounted(view) {
        return this.renderer.isViewMounted(view);
    }
    getMountedViews() {
        return this.renderer.getMountedViews();
    }
    getUnmountedViews() {
        return this.renderer.getUnmountedViews();
    }
    matrix(mat) {
        if (typeof mat === 'undefined') {
            return this.transform.getMatrix();
        }
        this.transform.setMatrix(mat);
        return this;
    }
    resize(width, height) {
        this.size.resize(width, height);
        return this;
    }
    resizeGraph(width, height) {
        this.size.resizeGraph(width, height);
        return this;
    }
    resizeScroller(width, height) {
        this.size.resizeScroller(width, height);
        return this;
    }
    resizePage(width, height) {
        this.size.resizePage(width, height);
        return this;
    }
    scale(sx, sy = sx, cx = 0, cy = 0) {
        if (typeof sx === 'undefined') {
            return this.transform.getScale();
        }
        this.transform.scale(sx, sy, cx, cy);
        return this;
    }
    zoom(factor, options) {
        const scroller = this.scroller.widget;
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
    }
    zoomTo(factor, options = {}) {
        const scroller = this.scroller.widget;
        if (scroller) {
            scroller.zoom(factor, Object.assign(Object.assign({}, options), { absolute: true }));
        }
        else {
            this.transform.zoom(factor, Object.assign(Object.assign({}, options), { absolute: true }));
        }
        return this;
    }
    zoomToRect(rect, options = {}) {
        const scroller = this.scroller.widget;
        if (scroller) {
            scroller.zoomToRect(rect, options);
        }
        else {
            this.transform.zoomToRect(rect, options);
        }
        return this;
    }
    zoomToFit(options = {}) {
        const scroller = this.scroller.widget;
        if (scroller) {
            scroller.zoomToFit(options);
        }
        else {
            this.transform.zoomToFit(options);
        }
        return this;
    }
    rotate(angle, cx, cy) {
        if (typeof angle === 'undefined') {
            return this.transform.getRotation();
        }
        this.transform.rotate(angle, cx, cy);
        return this;
    }
    translate(tx, ty) {
        if (typeof tx === 'undefined') {
            return this.transform.getTranslation();
        }
        this.transform.translate(tx, ty);
        return this;
    }
    translateBy(dx, dy) {
        const ts = this.translate();
        const tx = ts.tx + dx;
        const ty = ts.ty + dy;
        return this.translate(tx, ty);
    }
    /**
     * **Deprecation Notice:** `getArea` is deprecated and will be moved in next
     * major release. Use `getGraphArea()` instead.
     *
     * @deprecated
     */
    getArea() {
        return this.transform.getGraphArea();
    }
    getGraphArea() {
        return this.transform.getGraphArea();
    }
    getContentArea(options = {}) {
        return this.transform.getContentArea(options);
    }
    getContentBBox(options = {}) {
        return this.transform.getContentBBox(options);
    }
    fitToContent(gridWidth, gridHeight, padding, options) {
        return this.transform.fitToContent(gridWidth, gridHeight, padding, options);
    }
    scaleContentToFit(options = {}) {
        this.transform.scaleContentToFit(options);
        return this;
    }
    /**
     * Position the center of graph to the center of the viewport.
     */
    center(optons) {
        return this.centerPoint(optons);
    }
    centerPoint(x, y, options) {
        const scroller = this.scroller.widget;
        if (scroller) {
            scroller.centerPoint(x, y, options);
        }
        else {
            this.transform.centerPoint(x, y);
        }
        return this;
    }
    centerContent(options) {
        const scroller = this.scroller.widget;
        if (scroller) {
            scroller.centerContent(options);
        }
        else {
            this.transform.centerContent(options);
        }
        return this;
    }
    centerCell(cell, options) {
        const scroller = this.scroller.widget;
        if (scroller) {
            scroller.centerCell(cell, options);
        }
        else {
            this.transform.centerCell(cell);
        }
        return this;
    }
    positionPoint(point, x, y, options = {}) {
        const scroller = this.scroller.widget;
        if (scroller) {
            scroller.positionPoint(point, x, y, options);
        }
        else {
            this.transform.positionPoint(point, x, y);
        }
        return this;
    }
    positionRect(rect, direction, options) {
        const scroller = this.scroller.widget;
        if (scroller) {
            scroller.positionRect(rect, direction, options);
        }
        else {
            this.transform.positionRect(rect, direction);
        }
        return this;
    }
    positionCell(cell, direction, options) {
        const scroller = this.scroller.widget;
        if (scroller) {
            scroller.positionCell(cell, direction, options);
        }
        else {
            this.transform.positionCell(cell, direction);
        }
        return this;
    }
    positionContent(pos, options) {
        const scroller = this.scroller.widget;
        if (scroller) {
            scroller.positionContent(pos, options);
        }
        else {
            this.transform.positionContent(pos, options);
        }
        return this;
    }
    // #endregion
    // #region coord
    getClientMatrix() {
        return this.coord.getClientMatrix();
    }
    /**
     * Returns coordinates of the graph viewport, relative to the window.
     */
    getClientOffset() {
        return this.coord.getClientOffset();
    }
    /**
     * Returns coordinates of the graph viewport, relative to the document.
     */
    getPageOffset() {
        return this.coord.getPageOffset();
    }
    snapToGrid(x, y) {
        return this.coord.snapToGrid(x, y);
    }
    pageToLocal(x, y, width, height) {
        if (Rectangle.isRectangleLike(x)) {
            return this.coord.pageToLocalRect(x);
        }
        if (typeof x === 'number' &&
            typeof y === 'number' &&
            typeof width === 'number' &&
            typeof height === 'number') {
            return this.coord.pageToLocalRect(x, y, width, height);
        }
        return this.coord.pageToLocalPoint(x, y);
    }
    localToPage(x, y, width, height) {
        if (Rectangle.isRectangleLike(x)) {
            return this.coord.localToPageRect(x);
        }
        if (typeof x === 'number' &&
            typeof y === 'number' &&
            typeof width === 'number' &&
            typeof height === 'number') {
            return this.coord.localToPageRect(x, y, width, height);
        }
        return this.coord.localToPagePoint(x, y);
    }
    clientToLocal(x, y, width, height) {
        if (Rectangle.isRectangleLike(x)) {
            return this.coord.clientToLocalRect(x);
        }
        if (typeof x === 'number' &&
            typeof y === 'number' &&
            typeof width === 'number' &&
            typeof height === 'number') {
            return this.coord.clientToLocalRect(x, y, width, height);
        }
        return this.coord.clientToLocalPoint(x, y);
    }
    localToClient(x, y, width, height) {
        if (Rectangle.isRectangleLike(x)) {
            return this.coord.localToClientRect(x);
        }
        if (typeof x === 'number' &&
            typeof y === 'number' &&
            typeof width === 'number' &&
            typeof height === 'number') {
            return this.coord.localToClientRect(x, y, width, height);
        }
        return this.coord.localToClientPoint(x, y);
    }
    localToGraph(x, y, width, height) {
        if (Rectangle.isRectangleLike(x)) {
            return this.coord.localToGraphRect(x);
        }
        if (typeof x === 'number' &&
            typeof y === 'number' &&
            typeof width === 'number' &&
            typeof height === 'number') {
            return this.coord.localToGraphRect(x, y, width, height);
        }
        return this.coord.localToGraphPoint(x, y);
    }
    graphToLocal(x, y, width, height) {
        if (Rectangle.isRectangleLike(x)) {
            return this.coord.graphToLocalRect(x);
        }
        if (typeof x === 'number' &&
            typeof y === 'number' &&
            typeof width === 'number' &&
            typeof height === 'number') {
            return this.coord.graphToLocalRect(x, y, width, height);
        }
        return this.coord.graphToLocalPoint(x, y);
    }
    clientToGraph(x, y, width, height) {
        if (Rectangle.isRectangleLike(x)) {
            return this.coord.clientToGraphRect(x);
        }
        if (typeof x === 'number' &&
            typeof y === 'number' &&
            typeof width === 'number' &&
            typeof height === 'number') {
            return this.coord.clientToGraphRect(x, y, width, height);
        }
        return this.coord.clientToGraphPoint(x, y);
    }
    // #endregion
    // #region defs
    defineFilter(options) {
        return this.defs.filter(options);
    }
    defineGradient(options) {
        return this.defs.gradient(options);
    }
    defineMarker(options) {
        return this.defs.marker(options);
    }
    // #endregion
    // #region grid
    getGridSize() {
        return this.grid.getGridSize();
    }
    setGridSize(gridSize) {
        this.grid.setGridSize(gridSize);
        return this;
    }
    showGrid() {
        this.grid.show();
        return this;
    }
    hideGrid() {
        this.grid.hide();
        return this;
    }
    clearGrid() {
        this.grid.clear();
        return this;
    }
    drawGrid(options) {
        this.grid.draw(options);
        return this;
    }
    // #endregion
    // #region background
    updateBackground() {
        this.background.update();
        return this;
    }
    drawBackground(options, onGraph) {
        const scroller = this.scroller.widget;
        if (scroller != null && (this.options.background == null || !onGraph)) {
            scroller.backgroundManager.draw(options);
        }
        else {
            this.background.draw(options);
        }
        return this;
    }
    clearBackground(onGraph) {
        const scroller = this.scroller.widget;
        if (scroller != null && (this.options.background == null || !onGraph)) {
            scroller.backgroundManager.clear();
        }
        else {
            this.background.clear();
        }
        return this;
    }
    // #endregion
    // #region clipboard
    isClipboardEnabled() {
        return !this.clipboard.disabled;
    }
    enableClipboard() {
        this.clipboard.enable();
        return this;
    }
    disableClipboard() {
        this.clipboard.disable();
        return this;
    }
    toggleClipboard(enabled) {
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
    }
    isClipboardEmpty() {
        return this.clipboard.isEmpty();
    }
    getCellsInClipboard() {
        return this.clipboard.cells;
    }
    cleanClipboard() {
        this.clipboard.clean();
        return this;
    }
    copy(cells, options = {}) {
        this.clipboard.copy(cells, options);
        return this;
    }
    cut(cells, options = {}) {
        this.clipboard.cut(cells, options);
        return this;
    }
    paste(options = {}, graph = this) {
        return this.clipboard.paste(options, graph);
    }
    // #endregion
    // #region redo/undo
    isHistoryEnabled() {
        return !this.history.disabled;
    }
    enableHistory() {
        this.history.enable();
        return this;
    }
    disableHistory() {
        this.history.disable();
        return this;
    }
    toggleHistory(enabled) {
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
    }
    undo(options = {}) {
        this.history.undo(options);
        return this;
    }
    undoAndCancel(options = {}) {
        this.history.cancel(options);
        return this;
    }
    redo(options = {}) {
        this.history.redo(options);
        return this;
    }
    canUndo() {
        return this.history.canUndo();
    }
    canRedo() {
        return this.history.canRedo();
    }
    cleanHistory(options = {}) {
        this.history.clean(options);
    }
    // #endregion
    // #region keyboard
    isKeyboardEnabled() {
        return !this.keyboard.disabled;
    }
    enableKeyboard() {
        this.keyboard.enable();
        return this;
    }
    disableKeyboard() {
        this.keyboard.disable();
        return this;
    }
    toggleKeyboard(enabled) {
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
    }
    bindKey(keys, callback, action) {
        this.keyboard.on(keys, callback, action);
        return this;
    }
    unbindKey(keys, action) {
        this.keyboard.off(keys, action);
        return this;
    }
    // #endregion
    // #region mousewheel
    isMouseWheelEnabled() {
        return !this.mousewheel.disabled;
    }
    enableMouseWheel() {
        this.mousewheel.enable();
        return this;
    }
    disableMouseWheel() {
        this.mousewheel.disable();
        return this;
    }
    toggleMouseWheel(enabled) {
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
    }
    // #endregion
    // #region panning
    isPannable() {
        const scroller = this.scroller.widget;
        if (scroller) {
            return this.scroller.pannable;
        }
        return this.panning.pannable;
    }
    enablePanning() {
        const scroller = this.scroller.widget;
        if (scroller) {
            this.scroller.enablePanning();
        }
        else {
            this.panning.enablePanning();
        }
        return this;
    }
    disablePanning() {
        const scroller = this.scroller.widget;
        if (scroller) {
            this.scroller.disablePanning();
        }
        else {
            this.panning.disablePanning();
        }
        return this;
    }
    togglePanning(pannable) {
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
    }
    // #endregion
    // #region scroller
    lockScroller() {
        var _a;
        (_a = this.scroller.widget) === null || _a === void 0 ? void 0 : _a.lock();
    }
    unlockScroller() {
        var _a;
        (_a = this.scroller.widget) === null || _a === void 0 ? void 0 : _a.unlock();
    }
    updateScroller() {
        var _a;
        (_a = this.scroller.widget) === null || _a === void 0 ? void 0 : _a.update();
    }
    getScrollbarPosition() {
        const scroller = this.scroller.widget;
        return scroller.scrollbarPosition();
    }
    setScrollbarPosition(left, top, options) {
        const scroller = this.scroller.widget;
        scroller.scrollbarPosition(left, top, options);
        return this;
    }
    /**
     * Try to scroll to ensure that the position (x,y) on the graph (in local
     * coordinates) is at the center of the viewport. If only one of the
     * coordinates is specified, only scroll in the specified dimension and
     * keep the other coordinate unchanged.
     */
    scrollToPoint(x, y, options) {
        const scroller = this.scroller.widget;
        scroller.scrollToPoint(x, y, options);
        return this;
    }
    /**
     * Try to scroll to ensure that the center of graph content is at the
     * center of the viewport.
     */
    scrollToContent(options) {
        const scroller = this.scroller.widget;
        scroller.scrollToContent(options);
        return this;
    }
    /**
     * Try to scroll to ensure that the center of cell is at the center of
     * the viewport.
     */
    scrollToCell(cell, options) {
        const scroller = this.scroller.widget;
        scroller.scrollToCell(cell, options);
        return this;
    }
    transitionToPoint(x, y, options) {
        const scroller = this.scroller.widget;
        scroller.transitionToPoint(x, y, options);
        return this;
    }
    transitionToRect(rect, options = {}) {
        const scroller = this.scroller.widget;
        scroller.transitionToRect(rect, options);
        return this;
    }
    // #endregion
    // #region selection
    isSelectionEnabled() {
        return !this.selection.disabled;
    }
    enableSelection() {
        this.selection.enable();
        return this;
    }
    disableSelection() {
        this.selection.disable();
        return this;
    }
    toggleSelection(enabled) {
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
    }
    isMultipleSelection() {
        return this.selection.isMultiple();
    }
    enableMultipleSelection() {
        this.selection.enableMultiple();
        return this;
    }
    disableMultipleSelection() {
        this.selection.disableMultiple();
        return this;
    }
    toggleMultipleSelection(multiple) {
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
    }
    isSelectionMovable() {
        return this.selection.widget.options.movable !== false;
    }
    enableSelectionMovable() {
        this.selection.widget.options.movable = true;
        return this;
    }
    disableSelectionMovable() {
        this.selection.widget.options.movable = false;
        return this;
    }
    toggleSelectionMovable(movable) {
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
    }
    isRubberbandEnabled() {
        return !this.selection.rubberbandDisabled;
    }
    enableRubberband() {
        this.selection.enableRubberband();
        return this;
    }
    disableRubberband() {
        this.selection.disableRubberband();
        return this;
    }
    toggleRubberband(enabled) {
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
    }
    isStrictRubberband() {
        return this.selection.widget.options.strict === true;
    }
    enableStrictRubberband() {
        this.selection.widget.options.strict = true;
        return this;
    }
    disableStrictRubberband() {
        this.selection.widget.options.strict = false;
        return this;
    }
    toggleStrictRubberband(strict) {
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
    }
    setRubberbandModifiers(modifiers) {
        this.selection.setModifiers(modifiers);
    }
    setSelectionFilter(filter) {
        this.selection.setFilter(filter);
        return this;
    }
    setSelectionDisplayContent(content) {
        this.selection.setContent(content);
        return this;
    }
    isSelectionEmpty() {
        return this.selection.isEmpty();
    }
    cleanSelection(options) {
        this.selection.clean(options);
        return this;
    }
    resetSelection(cells, options) {
        this.selection.reset(cells, options);
        return this;
    }
    getSelectedCells() {
        return this.selection.cells;
    }
    getSelectedCellCount() {
        return this.selection.length;
    }
    isSelected(cell) {
        return this.selection.isSelected(cell);
    }
    select(cells, options) {
        this.selection.select(cells, options);
        return this;
    }
    unselect(cells, options) {
        this.selection.unselect(cells, options);
        return this;
    }
    // #endregion
    // #region snapline
    isSnaplineEnabled() {
        return !this.snapline.widget.disabled;
    }
    enableSnapline() {
        this.snapline.widget.enable();
        return this;
    }
    disableSnapline() {
        this.snapline.widget.disable();
        return this;
    }
    toggleSnapline(enabled) {
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
    }
    hideSnapline() {
        this.snapline.widget.hide();
        return this;
    }
    setSnaplineFilter(filter) {
        this.snapline.widget.setFilter(filter);
        return this;
    }
    isSnaplineOnResizingEnabled() {
        return this.snapline.widget.options.resizing === true;
    }
    enableSnaplineOnResizing() {
        this.snapline.widget.options.resizing = true;
        return this;
    }
    disableSnaplineOnResizing() {
        this.snapline.widget.options.resizing = false;
        return this;
    }
    toggleSnaplineOnResizing(enableOnResizing) {
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
    }
    isSharpSnapline() {
        return this.snapline.widget.options.sharp === true;
    }
    enableSharpSnapline() {
        this.snapline.widget.options.sharp = true;
        return this;
    }
    disableSharpSnapline() {
        this.snapline.widget.options.sharp = false;
        return this;
    }
    toggleSharpSnapline(sharp) {
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
    }
    getSnaplineTolerance() {
        return this.snapline.widget.options.tolerance;
    }
    setSnaplineTolerance(tolerance) {
        this.snapline.widget.options.tolerance = tolerance;
        return this;
    }
    // #endregion
    // #region tools
    removeTools() {
        this.emit('tools:remove');
        return this;
    }
    hideTools() {
        this.emit('tools:hide');
        return this;
    }
    showTools() {
        this.emit('tools:show');
        return this;
    }
    // #endregion
    // #region format
    toSVG(callback, options = {}) {
        this.format.toSVG(callback, options);
    }
    toDataURL(callback, options) {
        this.format.toDataURL(callback, options);
    }
    toPNG(callback, options = {}) {
        this.format.toPNG(callback, options);
    }
    toJPEG(callback, options = {}) {
        this.format.toJPEG(callback, options);
    }
    // #endregion
    // #region print
    printPreview(options) {
        this.print.show(options);
    }
    // #endregion
    // #region dispose
    dispose() {
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
    }
}
__decorate([
    Decorator.checkScroller()
], Graph.prototype, "lockScroller", null);
__decorate([
    Decorator.checkScroller()
], Graph.prototype, "unlockScroller", null);
__decorate([
    Decorator.checkScroller()
], Graph.prototype, "updateScroller", null);
__decorate([
    Decorator.checkScroller()
], Graph.prototype, "getScrollbarPosition", null);
__decorate([
    Decorator.checkScroller()
], Graph.prototype, "setScrollbarPosition", null);
__decorate([
    Decorator.checkScroller()
], Graph.prototype, "scrollToPoint", null);
__decorate([
    Decorator.checkScroller()
], Graph.prototype, "scrollToContent", null);
__decorate([
    Decorator.checkScroller()
], Graph.prototype, "scrollToCell", null);
__decorate([
    Decorator.checkScroller()
], Graph.prototype, "transitionToPoint", null);
__decorate([
    Decorator.checkScroller()
], Graph.prototype, "transitionToRect", null);
__decorate([
    Basecoat.dispose()
], Graph.prototype, "dispose", null);
(function (Graph) {
    /* eslint-disable @typescript-eslint/no-unused-vars */
    Graph.View = GraphView;
    Graph.Hook = HookManager;
    Graph.Renderer = ViewRenderer;
    Graph.Keyboard = Shortcut;
    Graph.MouseWheel = Wheel;
    Graph.BaseManager = Base;
    Graph.DefsManager = Defs;
    Graph.GridManager = Grid;
    Graph.CoordManager = Coord;
    Graph.PrintManager = Print;
    Graph.FormatManager = Format;
    Graph.MiniMapManager = MiniMap;
    Graph.HistoryManager = History;
    Graph.SnaplineManager = Snapline;
    Graph.ScrollerManager = Scroller;
    Graph.ClipboardManager = Clipboard;
    Graph.TransformManager = Transform;
    Graph.HighlightManager = Highlight;
    Graph.BackgroundManager = Background;
    Graph.SelectionManager = Selection;
})(Graph || (Graph = {}));
(function (Graph) {
    Graph.toStringTag = `X6.${Graph.name}`;
    function isGraph(instance) {
        if (instance == null) {
            return false;
        }
        if (instance instanceof Graph) {
            return true;
        }
        const tag = instance[Symbol.toStringTag];
        const graph = instance;
        if ((tag == null || tag === Graph.toStringTag) &&
            graph.hook != null &&
            graph.view != null &&
            graph.model != null) {
            return true;
        }
        return false;
    }
    Graph.isGraph = isGraph;
})(Graph || (Graph = {}));
(function (Graph) {
    function render(options, data) {
        const graph = options instanceof HTMLElement
            ? new Graph({ container: options })
            : new Graph(options);
        if (data != null) {
            graph.fromJSON(data);
        }
        return graph;
    }
    Graph.render = render;
})(Graph || (Graph = {}));
(function (Graph) {
    Graph.registerNode = Node.registry.register;
    Graph.registerEdge = Edge.registry.register;
    Graph.registerView = CellView.registry.register;
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
    Graph.registerHTMLComponent = HTML.componentRegistry.register;
})(Graph || (Graph = {}));
(function (Graph) {
    Graph.unregisterNode = Node.registry.unregister;
    Graph.unregisterEdge = Edge.registry.unregister;
    Graph.unregisterView = CellView.registry.unregister;
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
    Graph.unregisterHTMLComponent = HTML.componentRegistry.unregister;
})(Graph || (Graph = {}));
//# sourceMappingURL=graph.js.map