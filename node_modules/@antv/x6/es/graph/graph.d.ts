/// <reference types="jquery" />
/// <reference types="jquery-mousewheel" />
import { Basecoat } from '../common';
import { NumberExt, Dom } from '../util';
import { Point, Rectangle } from '../geometry';
import { KeyValue, ModifierKey } from '../types';
import { Cell } from '../model/cell';
import { Node } from '../model/node';
import { Edge } from '../model/edge';
import { Model } from '../model/model';
import { Collection } from '../model/collection';
import { CellView } from '../view/cell';
import * as Registry from '../registry';
import { HTML } from '../shape/standard/html';
import { Scroller as ScrollerWidget } from '../addon/scroller';
import { Base } from './base';
import { GraphView } from './view';
import { EventArgs } from './events';
import { CSSManager } from './css';
import { SizeManager } from './size';
import { Hook as HookManager } from './hook';
import { Options as GraphOptions } from './options';
import { DefsManager as Defs } from './defs';
import { GridManager as Grid } from './grid';
import { CoordManager as Coord } from './coord';
import { Keyboard as Shortcut } from './keyboard';
import { KnobManager as Knob } from './knob';
import { PrintManager as Print } from './print';
import { MouseWheel as Wheel } from './mousewheel';
import { FormatManager as Format } from './format';
import { Renderer as ViewRenderer } from './renderer';
import { HistoryManager as History } from './history';
import { PanningManager as Panning } from './panning';
import { MiniMapManager as MiniMap } from './minimap';
import { SnaplineManager as Snapline } from './snapline';
import { ScrollerManager as Scroller } from './scroller';
import { SelectionManager as Selection } from './selection';
import { HighlightManager as Highlight } from './highlight';
import { TransformManager as Transform } from './transform';
import { ClipboardManager as Clipboard } from './clipboard';
import { BackgroundManager as Background } from './background';
export declare class Graph extends Basecoat<EventArgs> {
    readonly options: GraphOptions.Definition;
    readonly css: CSSManager;
    readonly model: Model;
    readonly view: GraphView;
    readonly hook: HookManager;
    readonly grid: Grid;
    readonly defs: Defs;
    readonly knob: Knob;
    readonly coord: Coord;
    readonly renderer: ViewRenderer;
    readonly snapline: Snapline;
    readonly highlight: Highlight;
    readonly transform: Transform;
    readonly clipboard: Clipboard;
    readonly selection: Selection;
    readonly background: Background;
    readonly history: History;
    readonly scroller: Scroller;
    readonly minimap: MiniMap;
    readonly keyboard: Shortcut;
    readonly mousewheel: Wheel;
    readonly panning: Panning;
    readonly print: Print;
    readonly format: Format;
    readonly size: SizeManager;
    get container(): HTMLElement;
    protected get [Symbol.toStringTag](): string;
    constructor(options: Partial<GraphOptions.Manual>);
    isNode(cell: Cell): cell is Node;
    isEdge(cell: Cell): cell is Edge;
    resetCells(cells: Cell[], options?: Collection.SetOptions): this;
    clearCells(options?: Cell.SetOptions): this;
    toJSON(options?: Model.ToJSONOptions): {
        cells: Cell.Properties[];
    };
    parseJSON(data: Model.FromJSONData): (Edge<Edge.Properties> | Node<Node.Properties>)[];
    fromJSON(data: Model.FromJSONData, options?: Model.FromJSONOptions): this;
    getCellById(id: string): Cell<Cell.Properties>;
    addNode(metadata: Node.Metadata, options?: Model.AddOptions): Node;
    addNode(node: Node, options?: Model.AddOptions): Node;
    addNodes(nodes: (Node | Node.Metadata)[], options?: Model.AddOptions): this;
    createNode(metadata: Node.Metadata): Node<Node.Properties>;
    removeNode(nodeId: string, options?: Collection.RemoveOptions): Node | null;
    removeNode(node: Node, options?: Collection.RemoveOptions): Node | null;
    addEdge(metadata: Edge.Metadata, options?: Model.AddOptions): Edge;
    addEdge(edge: Edge, options?: Model.AddOptions): Edge;
    addEdges(edges: (Edge | Edge.Metadata)[], options?: Model.AddOptions): this;
    removeEdge(edgeId: string, options?: Collection.RemoveOptions): Edge | null;
    removeEdge(edge: Edge, options?: Collection.RemoveOptions): Edge | null;
    createEdge(metadata: Edge.Metadata): Edge<Edge.Properties>;
    addCell(cell: Cell | Cell[], options?: Model.AddOptions): this;
    removeCell(cellId: string, options?: Collection.RemoveOptions): Cell | null;
    removeCell(cell: Cell, options?: Collection.RemoveOptions): Cell | null;
    removeCells(cells: (Cell | string)[], options?: Cell.RemoveOptions): (Cell<Cell.Properties> | null)[];
    removeConnectedEdges(cell: Cell | string, options?: Cell.RemoveOptions): Edge<Edge.Properties>[];
    disconnectConnectedEdges(cell: Cell | string, options?: Edge.SetOptions): this;
    hasCell(cellId: string): boolean;
    hasCell(cell: Cell): boolean;
    /**
     * **Deprecation Notice:** `getCell` is deprecated and will be moved in next
     * major release. Use `getCellById()` instead.
     *
     * @deprecated
     */
    getCell<T extends Cell = Cell>(id: string): T;
    getCells(): Cell<Cell.Properties>[];
    getCellCount(): number;
    /**
     * Returns all the nodes in the graph.
     */
    getNodes(): Node<Node.Properties>[];
    /**
     * Returns all the edges in the graph.
     */
    getEdges(): Edge<Edge.Properties>[];
    /**
     * Returns all outgoing edges for the node.
     */
    getOutgoingEdges(cell: Cell | string): Edge<Edge.Properties>[] | null;
    /**
     * Returns all incoming edges for the node.
     */
    getIncomingEdges(cell: Cell | string): Edge<Edge.Properties>[] | null;
    /**
     * Returns edges connected with cell.
     */
    getConnectedEdges(cell: Cell | string, options?: Model.GetConnectedEdgesOptions): Edge<Edge.Properties>[];
    /**
     * Returns an array of all the roots of the graph.
     */
    getRootNodes(): Node<Node.Properties>[];
    /**
     * Returns an array of all the leafs of the graph.
     */
    getLeafNodes(): Node<Node.Properties>[];
    /**
     * Returns `true` if the node is a root node, i.e.
     * there is no  edges coming to the node.
     */
    isRootNode(cell: Cell | string): boolean;
    /**
     * Returns `true` if the node is a leaf node, i.e.
     * there is no edges going out from the node.
     */
    isLeafNode(cell: Cell | string): boolean;
    /**
     * Returns all the neighbors of node in the graph. Neighbors are all
     * the nodes connected to node via either incoming or outgoing edge.
     */
    getNeighbors(cell: Cell, options?: Model.GetNeighborsOptions): Cell<Cell.Properties>[];
    /**
     * Returns `true` if `cell2` is a neighbor of `cell1`.
     */
    isNeighbor(cell1: Cell, cell2: Cell, options?: Model.GetNeighborsOptions): boolean;
    getSuccessors(cell: Cell, options?: Model.GetPredecessorsOptions): Cell<Cell.Properties>[];
    /**
     * Returns `true` if `cell2` is a successor of `cell1`.
     */
    isSuccessor(cell1: Cell, cell2: Cell, options?: Model.GetPredecessorsOptions): boolean;
    getPredecessors(cell: Cell, options?: Model.GetPredecessorsOptions): Cell<Cell.Properties>[];
    /**
     * Returns `true` if `cell2` is a predecessor of `cell1`.
     */
    isPredecessor(cell1: Cell, cell2: Cell, options?: Model.GetPredecessorsOptions): boolean;
    getCommonAncestor(...cells: (Cell | null | undefined)[]): Cell<Cell.Properties> | null;
    /**
     * Returns an array of cells that result from finding nodes/edges that
     * are connected to any of the cells in the cells array. This function
     * loops over cells and if the current cell is a edge, it collects its
     * source/target nodes; if it is an node, it collects its incoming and
     * outgoing edges if both the edge terminal (source/target) are in the
     * cells array.
     */
    getSubGraph(cells: Cell[], options?: Model.GetSubgraphOptions): Cell<Cell.Properties>[];
    /**
     * Clones the whole subgraph (including all the connected links whose
     * source/target is in the subgraph). If `options.deep` is `true`, also
     * take into account all the embedded cells of all the subgraph cells.
     *
     * Returns a map of the form: { [original cell ID]: [clone] }.
     */
    cloneSubGraph(cells: Cell[], options?: Model.GetSubgraphOptions): KeyValue<Cell<Cell.Properties>>;
    cloneCells(cells: Cell[]): KeyValue<Cell<Cell.Properties>>;
    /**
     * Returns an array of nodes whose bounding box contains point.
     * Note that there can be more then one node as nodes might overlap.
     */
    getNodesFromPoint(x: number, y: number): Node[];
    getNodesFromPoint(p: Point.PointLike): Node[];
    /**
     * Returns an array of nodes whose bounding box top/left coordinate
     * falls into the rectangle.
     */
    getNodesInArea(x: number, y: number, w: number, h: number, options?: Model.GetCellsInAreaOptions): Node[];
    getNodesInArea(rect: Rectangle.RectangleLike, options?: Model.GetCellsInAreaOptions): Node[];
    getNodesUnderNode(node: Node, options?: {
        by?: 'bbox' | Rectangle.KeyPoint;
    }): Node<Node.Properties>[];
    searchCell(cell: Cell, iterator: Model.SearchIterator, options?: Model.SearchOptions): this;
    /** *
     * Returns an array of IDs of nodes on the shortest
     * path between source and target.
     */
    getShortestPath(source: Cell | string, target: Cell | string, options?: Model.GetShortestPathOptions): string[];
    /**
     * Returns the bounding box that surrounds all cells in the graph.
     */
    getAllCellsBBox(): Rectangle | null;
    /**
     * Returns the bounding box that surrounds all the given cells.
     */
    getCellsBBox(cells: Cell[], options?: Cell.GetCellsBBoxOptions): Rectangle | null;
    startBatch(name: string | Model.BatchName, data?: KeyValue): void;
    stopBatch(name: string | Model.BatchName, data?: KeyValue): void;
    batchUpdate<T>(execute: () => T, data?: KeyValue): T;
    batchUpdate<T>(name: string | Model.BatchName, execute: () => T, data?: KeyValue): T;
    updateCellId(cell: Cell, newId: string): Cell<Cell.Properties>;
    isFrozen(): boolean;
    freeze(options?: ViewRenderer.FreezeOptions): this;
    unfreeze(options?: ViewRenderer.UnfreezeOptions): this;
    isAsync(): boolean;
    setAsync(async: boolean): this;
    findView(ref: Cell | JQuery | Element): CellView<Cell<Cell.Properties>, CellView.Options> | null;
    findViews(ref: Point.PointLike | Rectangle.RectangleLike): CellView<Cell<Cell.Properties>, CellView.Options>[];
    findViewByCell(cellId: string | number): CellView | null;
    findViewByCell(cell: Cell | null): CellView | null;
    findViewByElem(elem: string | JQuery | Element | undefined | null): CellView<Cell<Cell.Properties>, CellView.Options> | null;
    findViewsFromPoint(x: number, y: number): CellView[];
    findViewsFromPoint(p: Point.PointLike): CellView[];
    findViewsInArea(x: number, y: number, width: number, height: number, options?: ViewRenderer.FindViewsInAreaOptions): CellView[];
    findViewsInArea(rect: Rectangle.RectangleLike, options?: ViewRenderer.FindViewsInAreaOptions): CellView[];
    isViewMounted(view: CellView): boolean;
    getMountedViews(): import("..").View<any>[];
    getUnmountedViews(): import("..").View<any>[];
    /**
     * Returns the current transformation matrix of the graph.
     */
    matrix(): DOMMatrix;
    /**
     * Sets new transformation with the given `matrix`
     */
    matrix(mat: DOMMatrix | Dom.MatrixLike | null): this;
    resize(width?: number, height?: number): this;
    resizeGraph(width?: number, height?: number): this;
    resizeScroller(width?: number, height?: number): this;
    resizePage(width?: number, height?: number): this;
    scale(): Dom.Scale;
    scale(sx: number, sy?: number, cx?: number, cy?: number): this;
    zoom(): number;
    zoom(factor: number, options?: Transform.ZoomOptions): this;
    zoomTo(factor: number, options?: Omit<Transform.ZoomOptions, 'absolute'>): this;
    zoomToRect(rect: Rectangle.RectangleLike, options?: Transform.ScaleContentToFitOptions & Transform.ScaleContentToFitOptions): this;
    zoomToFit(options?: Transform.GetContentAreaOptions & Transform.ScaleContentToFitOptions): this;
    rotate(): Dom.Rotation;
    rotate(angle: number, cx?: number, cy?: number): this;
    translate(): Dom.Translation;
    translate(tx: number, ty: number): this;
    translateBy(dx: number, dy: number): this;
    /**
     * **Deprecation Notice:** `getArea` is deprecated and will be moved in next
     * major release. Use `getGraphArea()` instead.
     *
     * @deprecated
     */
    getArea(): Rectangle;
    getGraphArea(): Rectangle;
    getContentArea(options?: Transform.GetContentAreaOptions): Rectangle;
    getContentBBox(options?: Transform.GetContentAreaOptions): Rectangle;
    fitToContent(gridWidth?: number, gridHeight?: number, padding?: NumberExt.SideOptions, options?: Transform.FitToContentOptions): Rectangle;
    fitToContent(options?: Transform.FitToContentFullOptions): Rectangle;
    scaleContentToFit(options?: Transform.ScaleContentToFitOptions): this;
    /**
     * Position the center of graph to the center of the viewport.
     */
    center(optons?: ScrollerWidget.CenterOptions): this;
    /**
     * Position the point (x,y) on the graph (in local coordinates) to the
     * center of the viewport. If only one of the coordinates is specified,
     * only center along the specified dimension and keep the other coordinate
     * unchanged.
     */
    centerPoint(x: number, y: null | number, options?: ScrollerWidget.CenterOptions): this;
    centerPoint(x: null | number, y: number, options?: ScrollerWidget.CenterOptions): this;
    centerPoint(optons?: ScrollerWidget.CenterOptions): this;
    centerContent(options?: ScrollerWidget.PositionContentOptions): this;
    centerCell(cell: Cell, options?: ScrollerWidget.CenterOptions): this;
    positionPoint(point: Point.PointLike, x: number | string, y: number | string, options?: ScrollerWidget.CenterOptions): this;
    positionRect(rect: Rectangle.RectangleLike, direction: ScrollerWidget.Direction, options?: ScrollerWidget.CenterOptions): this;
    positionCell(cell: Cell, direction: ScrollerWidget.Direction, options?: ScrollerWidget.CenterOptions): this;
    positionContent(pos: ScrollerWidget.Direction, options?: ScrollerWidget.PositionContentOptions): this;
    getClientMatrix(): DOMMatrix;
    /**
     * Returns coordinates of the graph viewport, relative to the window.
     */
    getClientOffset(): Point;
    /**
     * Returns coordinates of the graph viewport, relative to the document.
     */
    getPageOffset(): Point;
    snapToGrid(p: Point.PointLike): Point;
    snapToGrid(x: number, y: number): Point;
    pageToLocal(rect: Rectangle.RectangleLike): Rectangle;
    pageToLocal(x: number, y: number, width: number, height: number): Rectangle;
    pageToLocal(p: Point.PointLike): Point;
    pageToLocal(x: number, y: number): Point;
    localToPage(rect: Rectangle.RectangleLike): Rectangle;
    localToPage(x: number, y: number, width: number, height: number): Rectangle;
    localToPage(p: Point.PointLike): Point;
    localToPage(x: number, y: number): Point;
    clientToLocal(rect: Rectangle.RectangleLike): Rectangle;
    clientToLocal(x: number, y: number, width: number, height: number): Rectangle;
    clientToLocal(p: Point.PointLike): Point;
    clientToLocal(x: number, y: number): Point;
    localToClient(rect: Rectangle.RectangleLike): Rectangle;
    localToClient(x: number, y: number, width: number, height: number): Rectangle;
    localToClient(p: Point.PointLike): Point;
    localToClient(x: number, y: number): Point;
    /**
     * Transform the rectangle `rect` defined in the local coordinate system to
     * the graph coordinate system.
     */
    localToGraph(rect: Rectangle.RectangleLike): Rectangle;
    /**
     * Transform the rectangle `x`, `y`, `width`, `height` defined in the local
     * coordinate system to the graph coordinate system.
     */
    localToGraph(x: number, y: number, width: number, height: number): Rectangle;
    /**
     * Transform the point `p` defined in the local coordinate system to
     * the graph coordinate system.
     */
    localToGraph(p: Point.PointLike): Point;
    /**
     * Transform the point `x`, `y` defined in the local coordinate system to
     * the graph coordinate system.
     */
    localToGraph(x: number, y: number): Point;
    graphToLocal(rect: Rectangle.RectangleLike): Rectangle;
    graphToLocal(x: number, y: number, width: number, height: number): Rectangle;
    graphToLocal(p: Point.PointLike): Point;
    graphToLocal(x: number, y: number): Point;
    clientToGraph(rect: Rectangle.RectangleLike): Rectangle;
    clientToGraph(x: number, y: number, width: number, height: number): Rectangle;
    clientToGraph(p: Point.PointLike): Point;
    clientToGraph(x: number, y: number): Point;
    defineFilter(options: Defs.FilterOptions): string;
    defineGradient(options: Defs.GradientOptions): string;
    defineMarker(options: Defs.MarkerOptions): string;
    getGridSize(): number;
    setGridSize(gridSize: number): this;
    showGrid(): this;
    hideGrid(): this;
    clearGrid(): this;
    drawGrid(options?: Grid.DrawGridOptions): this;
    updateBackground(): this;
    drawBackground(options?: Background.Options, onGraph?: boolean): this;
    clearBackground(onGraph?: boolean): this;
    isClipboardEnabled(): boolean;
    enableClipboard(): this;
    disableClipboard(): this;
    toggleClipboard(enabled?: boolean): this;
    isClipboardEmpty(): boolean;
    getCellsInClipboard(): Cell<Cell.Properties>[];
    cleanClipboard(): this;
    copy(cells: Cell[], options?: Clipboard.CopyOptions): this;
    cut(cells: Cell[], options?: Clipboard.CopyOptions): this;
    paste(options?: Clipboard.PasteOptions, graph?: Graph): Cell<Cell.Properties>[];
    isHistoryEnabled(): boolean;
    enableHistory(): this;
    disableHistory(): this;
    toggleHistory(enabled?: boolean): this;
    undo(options?: KeyValue): this;
    undoAndCancel(options?: KeyValue): this;
    redo(options?: KeyValue): this;
    canUndo(): boolean;
    canRedo(): boolean;
    cleanHistory(options?: KeyValue): void;
    isKeyboardEnabled(): boolean;
    enableKeyboard(): this;
    disableKeyboard(): this;
    toggleKeyboard(enabled?: boolean): this;
    bindKey(keys: string | string[], callback: Shortcut.Handler, action?: Shortcut.Action): this;
    unbindKey(keys: string | string[], action?: Shortcut.Action): this;
    isMouseWheelEnabled(): boolean;
    enableMouseWheel(): this;
    disableMouseWheel(): this;
    toggleMouseWheel(enabled?: boolean): this;
    isPannable(): boolean;
    enablePanning(): this;
    disablePanning(): this;
    togglePanning(pannable?: boolean): this;
    lockScroller(): void;
    unlockScroller(): void;
    updateScroller(): void;
    getScrollbarPosition(): {
        left: number;
        top: number;
    };
    setScrollbarPosition(left?: number, top?: number, options?: ScrollerWidget.ScrollOptions): this;
    /**
     * Try to scroll to ensure that the position (x,y) on the graph (in local
     * coordinates) is at the center of the viewport. If only one of the
     * coordinates is specified, only scroll in the specified dimension and
     * keep the other coordinate unchanged.
     */
    scrollToPoint(x: number | null | undefined, y: number | null | undefined, options?: ScrollerWidget.ScrollOptions): this;
    /**
     * Try to scroll to ensure that the center of graph content is at the
     * center of the viewport.
     */
    scrollToContent(options?: ScrollerWidget.ScrollOptions): this;
    /**
     * Try to scroll to ensure that the center of cell is at the center of
     * the viewport.
     */
    scrollToCell(cell: Cell, options?: ScrollerWidget.ScrollOptions): this;
    transitionToPoint(p: Point.PointLike, options?: ScrollerWidget.TransitionOptions): this;
    transitionToPoint(x: number, y: number, options?: ScrollerWidget.TransitionOptions): this;
    transitionToRect(rect: Rectangle.RectangleLike, options?: ScrollerWidget.TransitionToRectOptions): this;
    isSelectionEnabled(): boolean;
    enableSelection(): this;
    disableSelection(): this;
    toggleSelection(enabled?: boolean): this;
    isMultipleSelection(): boolean;
    enableMultipleSelection(): this;
    disableMultipleSelection(): this;
    toggleMultipleSelection(multiple?: boolean): this;
    isSelectionMovable(): boolean;
    enableSelectionMovable(): this;
    disableSelectionMovable(): this;
    toggleSelectionMovable(movable?: boolean): this;
    isRubberbandEnabled(): boolean;
    enableRubberband(): this;
    disableRubberband(): this;
    toggleRubberband(enabled?: boolean): this;
    isStrictRubberband(): boolean;
    enableStrictRubberband(): this;
    disableStrictRubberband(): this;
    toggleStrictRubberband(strict?: boolean): this;
    setRubberbandModifiers(modifiers?: string | ModifierKey[] | null): void;
    setSelectionFilter(filter?: Selection.Filter): this;
    setSelectionDisplayContent(content?: Selection.Content): this;
    isSelectionEmpty(): boolean;
    cleanSelection(options?: Selection.SetOptions): this;
    resetSelection(cells?: Cell | string | (Cell | string)[], options?: Selection.SetOptions): this;
    getSelectedCells(): Cell<Cell.Properties>[];
    getSelectedCellCount(): number;
    isSelected(cell: Cell | string): boolean;
    select(cells: Cell | string | (Cell | string)[], options?: Selection.AddOptions): this;
    unselect(cells: Cell | string | (Cell | string)[], options?: Selection.RemoveOptions): this;
    isSnaplineEnabled(): boolean;
    enableSnapline(): this;
    disableSnapline(): this;
    toggleSnapline(enabled?: boolean): this | undefined;
    hideSnapline(): this;
    setSnaplineFilter(filter?: Snapline.Filter): this;
    isSnaplineOnResizingEnabled(): boolean;
    enableSnaplineOnResizing(): this;
    disableSnaplineOnResizing(): this;
    toggleSnaplineOnResizing(enableOnResizing?: boolean): this;
    isSharpSnapline(): boolean;
    enableSharpSnapline(): this;
    disableSharpSnapline(): this;
    toggleSharpSnapline(sharp?: boolean): this;
    getSnaplineTolerance(): number | undefined;
    setSnaplineTolerance(tolerance: number): this;
    removeTools(): this;
    hideTools(): this;
    showTools(): this;
    toSVG(callback: Format.ToSVGCallback, options?: Format.ToSVGOptions): void;
    toDataURL(callback: Format.ToSVGCallback, options: Format.ToDataURLOptions): void;
    toPNG(callback: Format.ToSVGCallback, options?: Format.ToImageOptions): void;
    toJPEG(callback: Format.ToSVGCallback, options?: Format.ToImageOptions): void;
    printPreview(options?: Partial<Print.Options>): void;
    dispose(): void;
}
export declare namespace Graph {
    export import View = GraphView;
    export import Hook = HookManager;
    export import Renderer = ViewRenderer;
    export import Keyboard = Shortcut;
    export import MouseWheel = Wheel;
    export import BaseManager = Base;
    export import DefsManager = Defs;
    export import GridManager = Grid;
    export import CoordManager = Coord;
    export import PrintManager = Print;
    export import FormatManager = Format;
    export import MiniMapManager = MiniMap;
    export import HistoryManager = History;
    export import SnaplineManager = Snapline;
    export import ScrollerManager = Scroller;
    export import ClipboardManager = Clipboard;
    export import TransformManager = Transform;
    export import HighlightManager = Highlight;
    export import BackgroundManager = Background;
    export import SelectionManager = Selection;
}
export declare namespace Graph {
    interface Options extends GraphOptions.Manual {
    }
}
export declare namespace Graph {
    const toStringTag: string;
    function isGraph(instance: any): instance is Graph;
}
export declare namespace Graph {
    function render(options: Partial<Options>, data?: Model.FromJSONData): Graph;
    function render(container: HTMLElement, data?: Model.FromJSONData): Graph;
}
export declare namespace Graph {
    const registerNode: {
        (entities: {
            [name: string]: Node.Definition | (Node.Config & {
                inherit?: string | Node.Definition | undefined;
            });
        }, force?: boolean | undefined): void;
        <K extends string | number | symbol>(name: K, entity: never[K], force?: boolean | undefined): Node.Definition;
        (name: string, entity: Node.Definition | (Node.Config & {
            inherit?: string | Node.Definition | undefined;
        }), force?: boolean | undefined): Node.Definition;
    };
    const registerEdge: {
        (entities: {
            [name: string]: Edge.Definition | (Edge.Config & {
                inherit?: string | Edge.Definition | undefined;
            });
        }, force?: boolean | undefined): void;
        <K extends string | number | symbol>(name: K, entity: never[K], force?: boolean | undefined): Edge.Definition;
        (name: string, entity: Edge.Definition | (Edge.Config & {
            inherit?: string | Edge.Definition | undefined;
        }), force?: boolean | undefined): Edge.Definition;
    };
    const registerView: {
        (entities: {
            [name: string]: CellView.Definition;
        }, force?: boolean | undefined): void;
        <K extends string | number>(name: K, entity: KeyValue<CellView.Definition>[K], force?: boolean | undefined): CellView.Definition;
        (name: string, entity: CellView.Definition, force?: boolean | undefined): CellView.Definition;
    };
    const registerAttr: {
        (entities: {
            [name: string]: Registry.Attr.Definition;
        }, force?: boolean | undefined): void;
        <K extends string | number>(name: K, entity: Registry.Attr.Definitions[K], force?: boolean | undefined): Registry.Attr.Definition;
        (name: string, entity: Registry.Attr.Definition, force?: boolean | undefined): Registry.Attr.Definition;
    };
    const registerGrid: {
        (entities: {
            [name: string]: Registry.Grid.CommonDefinition;
        }, force?: boolean | undefined): void;
        <K extends "dot" | "fixedDot" | "mesh" | "doubleMesh">(name: K, entity: typeof import("../registry/grid/main")[K], force?: boolean | undefined): Registry.Grid.CommonDefinition;
        (name: string, entity: Registry.Grid.CommonDefinition, force?: boolean | undefined): Registry.Grid.CommonDefinition;
    };
    const registerFilter: {
        (entities: {
            [name: string]: Registry.Filter.CommonDefinition;
        }, force?: boolean | undefined): void;
        <K extends "blur" | "highlight" | "outline" | "dropShadow" | "grayScale" | "sepia" | "saturate" | "hueRotate" | "invert" | "brightness" | "contrast">(name: K, entity: typeof import("../registry/filter/main")[K], force?: boolean | undefined): Registry.Filter.CommonDefinition;
        (name: string, entity: Registry.Filter.CommonDefinition, force?: boolean | undefined): Registry.Filter.CommonDefinition;
    };
    const registerNodeTool: {
        (entities: {
            [name: string]: import("..").ToolsView.ToolItem.Definition | (import("..").ToolsView.ToolItem.Options & {
                inherit?: string | undefined;
            } & KeyValue<any>);
        }, force?: boolean | undefined): void;
        <K extends "button" | "boundary" | "button-remove" | "node-editor">(name: K, entity: {
            boundary: typeof import("../registry/tool/boundary").Boundary;
            button: typeof import("../registry/tool/button").Button;
            'button-remove': typeof import("..").ToolsView.ToolItem;
            'node-editor': typeof import("..").ToolsView.ToolItem;
        }[K], force?: boolean | undefined): import("..").ToolsView.ToolItem.Definition;
        (name: string, entity: import("..").ToolsView.ToolItem.Definition | (import("..").ToolsView.ToolItem.Options & {
            inherit?: string | undefined;
        } & KeyValue<any>), force?: boolean | undefined): import("..").ToolsView.ToolItem.Definition;
    };
    const registerEdgeTool: {
        (entities: {
            [name: string]: import("..").ToolsView.ToolItem.Definition | (import("..").ToolsView.ToolItem.Options & {
                inherit?: string | undefined;
            } & KeyValue<any>);
        }, force?: boolean | undefined): void;
        <K extends "button" | "segments" | "vertices" | "boundary" | "button-remove" | "source-anchor" | "target-anchor" | "source-arrowhead" | "target-arrowhead" | "edge-editor">(name: K, entity: {
            boundary: typeof import("../registry/tool/boundary").Boundary;
            vertices: typeof import("../registry/tool/vertices").Vertices;
            segments: typeof import("../registry/tool/segments").Segments;
            button: typeof import("../registry/tool/button").Button;
            'button-remove': typeof import("..").ToolsView.ToolItem;
            'source-anchor': typeof import("..").ToolsView.ToolItem;
            'target-anchor': typeof import("..").ToolsView.ToolItem;
            'source-arrowhead': typeof import("..").ToolsView.ToolItem;
            'target-arrowhead': typeof import("..").ToolsView.ToolItem;
            'edge-editor': typeof import("..").ToolsView.ToolItem;
        }[K], force?: boolean | undefined): import("..").ToolsView.ToolItem.Definition;
        (name: string, entity: import("..").ToolsView.ToolItem.Definition | (import("..").ToolsView.ToolItem.Options & {
            inherit?: string | undefined;
        } & KeyValue<any>), force?: boolean | undefined): import("..").ToolsView.ToolItem.Definition;
    };
    const registerBackground: {
        (entities: {
            [name: string]: Registry.Background.Definition<Registry.Background.CommonOptions>;
        }, force?: boolean | undefined): void;
        <K extends string | number>(name: K, entity: {
            [name: string]: Registry.Background.Definition<Registry.Background.CommonOptions>;
        }[K], force?: boolean | undefined): Registry.Background.Definition<Registry.Background.CommonOptions>;
        (name: string, entity: Registry.Background.Definition<Registry.Background.CommonOptions>, force?: boolean | undefined): Registry.Background.Definition<Registry.Background.CommonOptions>;
    };
    const registerHighlighter: {
        (entities: {
            [name: string]: Registry.Highlighter.CommonDefinition;
        }, force?: boolean | undefined): void;
        <K extends "className" | "stroke" | "opacity">(name: K, entity: typeof import("../registry/highlighter/main")[K], force?: boolean | undefined): Registry.Highlighter.CommonDefinition;
        (name: string, entity: Registry.Highlighter.CommonDefinition, force?: boolean | undefined): Registry.Highlighter.CommonDefinition;
    };
    const registerPortLayout: {
        (entities: {
            [name: string]: Registry.PortLayout.CommonDefinition;
        }, force?: boolean | undefined): void;
        <K extends "ellipse" | "line" | "left" | "top" | "right" | "bottom" | "absolute" | "ellipseSpread">(name: K, entity: typeof import("../registry/port-layout/main")[K], force?: boolean | undefined): Registry.PortLayout.CommonDefinition;
        (name: string, entity: Registry.PortLayout.CommonDefinition, force?: boolean | undefined): Registry.PortLayout.CommonDefinition;
    };
    const registerPortLabelLayout: {
        (entities: {
            [name: string]: Registry.PortLabelLayout.CommonDefinition;
        }, force?: boolean | undefined): void;
        <K extends "left" | "top" | "right" | "bottom" | "manual" | "outside" | "outsideOriented" | "inside" | "insideOriented" | "radial" | "radialOriented">(name: K, entity: typeof import("../registry/port-label-layout/main")[K], force?: boolean | undefined): Registry.PortLabelLayout.CommonDefinition;
        (name: string, entity: Registry.PortLabelLayout.CommonDefinition, force?: boolean | undefined): Registry.PortLabelLayout.CommonDefinition;
    };
    const registerMarker: {
        (entities: {
            [name: string]: Registry.Marker.Factory<KeyValue<any>>;
        }, force?: boolean | undefined): void;
        <K extends "circle" | "ellipse" | "path" | "async" | "block" | "classic" | "diamond" | "cross" | "circlePlus">(name: K, entity: typeof import("../registry/marker/main")[K], force?: boolean | undefined): Registry.Marker.Factory<KeyValue<any>>;
        (name: string, entity: Registry.Marker.Factory<KeyValue<any>>, force?: boolean | undefined): Registry.Marker.Factory<KeyValue<any>>;
    };
    const registerRouter: {
        (entities: {
            [name: string]: Registry.Router.CommonDefinition;
        }, force?: boolean | undefined): void;
        <K extends "orth" | "normal" | "oneSide" | "metro" | "manhattan" | "er" | "loop">(name: K, entity: typeof import("../registry/router/main")[K], force?: boolean | undefined): Registry.Router.CommonDefinition;
        (name: string, entity: Registry.Router.CommonDefinition, force?: boolean | undefined): Registry.Router.CommonDefinition;
    };
    const registerConnector: {
        (entities: {
            [name: string]: Registry.Connector.Definition<Registry.Connector.BaseOptions>;
        }, force?: boolean | undefined): void;
        <K extends "normal" | "loop" | "rounded" | "smooth" | "jumpover">(name: K, entity: typeof import("../registry/connector/main")[K], force?: boolean | undefined): Registry.Connector.Definition<Registry.Connector.BaseOptions>;
        (name: string, entity: Registry.Connector.Definition<Registry.Connector.BaseOptions>, force?: boolean | undefined): Registry.Connector.Definition<Registry.Connector.BaseOptions>;
    };
    const registerAnchor: {
        (entities: {
            [name: string]: Registry.NodeAnchor.CommonDefinition;
        }, force?: boolean | undefined): void;
        <K extends "left" | "top" | "right" | "bottom" | "center" | "topLeft" | "topRight" | "bottomLeft" | "bottomRight" | "orth" | "nodeCenter" | "midSide">(name: K, entity: typeof import("../registry/node-anchor/main")[K], force?: boolean | undefined): Registry.NodeAnchor.CommonDefinition;
        (name: string, entity: Registry.NodeAnchor.CommonDefinition, force?: boolean | undefined): Registry.NodeAnchor.CommonDefinition;
    };
    const registerEdgeAnchor: {
        (entities: {
            [name: string]: Registry.EdgeAnchor.CommonDefinition;
        }, force?: boolean | undefined): void;
        <K extends "length" | "orth" | "closest" | "ratio">(name: K, entity: typeof import("../registry/edge-anchor/main")[K], force?: boolean | undefined): Registry.EdgeAnchor.CommonDefinition;
        (name: string, entity: Registry.EdgeAnchor.CommonDefinition, force?: boolean | undefined): Registry.EdgeAnchor.CommonDefinition;
    };
    const registerConnectionPoint: {
        (entities: {
            [name: string]: Registry.ConnectionPoint.CommonDefinition;
        }, force?: boolean | undefined): void;
        <K extends "rect" | "anchor" | "bbox" | "boundary">(name: K, entity: typeof import("../registry/connection-point/main")[K], force?: boolean | undefined): Registry.ConnectionPoint.CommonDefinition;
        (name: string, entity: Registry.ConnectionPoint.CommonDefinition, force?: boolean | undefined): Registry.ConnectionPoint.CommonDefinition;
    };
    const registerConnectionStrategy: {
        (entities: {
            [name: string]: Registry.ConnectionStrategy.Definition;
        }, force?: boolean | undefined): void;
        <K extends "noop" | "pinRelative" | "pinAbsolute">(name: K, entity: typeof import("../registry/connection-strategy/main")[K], force?: boolean | undefined): Registry.ConnectionStrategy.Definition;
        (name: string, entity: Registry.ConnectionStrategy.Definition, force?: boolean | undefined): Registry.ConnectionStrategy.Definition;
    };
    const registerHTMLComponent: {
        (entities: {
            [name: string]: HTML.Component | HTML.UpdatableComponent;
        }, force?: boolean | undefined): void;
        <K extends string | number>(name: K, entity: KeyValue<HTML.Component | HTML.UpdatableComponent>[K], force?: boolean | undefined): HTML.Component | HTML.UpdatableComponent;
        (name: string, entity: HTML.Component | HTML.UpdatableComponent, force?: boolean | undefined): HTML.Component | HTML.UpdatableComponent;
    };
}
export declare namespace Graph {
    const unregisterNode: {
        <K extends string | number | symbol>(name: K): Node.Definition | null;
        (name: string): Node.Definition | null;
    };
    const unregisterEdge: {
        <K extends string | number | symbol>(name: K): Edge.Definition | null;
        (name: string): Edge.Definition | null;
    };
    const unregisterView: {
        <K extends string | number>(name: K): CellView.Definition | null;
        (name: string): CellView.Definition | null;
    };
    const unregisterAttr: {
        <K extends string | number>(name: K): Registry.Attr.Definition | null;
        (name: string): Registry.Attr.Definition | null;
    };
    const unregisterGrid: {
        <K extends "dot" | "fixedDot" | "mesh" | "doubleMesh">(name: K): Registry.Grid.CommonDefinition | null;
        (name: string): Registry.Grid.CommonDefinition | null;
    };
    const unregisterFilter: {
        <K extends "blur" | "highlight" | "outline" | "dropShadow" | "grayScale" | "sepia" | "saturate" | "hueRotate" | "invert" | "brightness" | "contrast">(name: K): Registry.Filter.CommonDefinition | null;
        (name: string): Registry.Filter.CommonDefinition | null;
    };
    const unregisterNodeTool: {
        <K extends "button" | "boundary" | "button-remove" | "node-editor">(name: K): import("..").ToolsView.ToolItem.Definition | null;
        (name: string): import("..").ToolsView.ToolItem.Definition | null;
    };
    const unregisterEdgeTool: {
        <K extends "button" | "segments" | "vertices" | "boundary" | "button-remove" | "source-anchor" | "target-anchor" | "source-arrowhead" | "target-arrowhead" | "edge-editor">(name: K): import("..").ToolsView.ToolItem.Definition | null;
        (name: string): import("..").ToolsView.ToolItem.Definition | null;
    };
    const unregisterBackground: {
        <K extends string | number>(name: K): Registry.Background.Definition<Registry.Background.CommonOptions> | null;
        (name: string): Registry.Background.Definition<Registry.Background.CommonOptions> | null;
    };
    const unregisterHighlighter: {
        <K extends "className" | "stroke" | "opacity">(name: K): Registry.Highlighter.CommonDefinition | null;
        (name: string): Registry.Highlighter.CommonDefinition | null;
    };
    const unregisterPortLayout: {
        <K extends "ellipse" | "line" | "left" | "top" | "right" | "bottom" | "absolute" | "ellipseSpread">(name: K): Registry.PortLayout.CommonDefinition | null;
        (name: string): Registry.PortLayout.CommonDefinition | null;
    };
    const unregisterPortLabelLayout: {
        <K extends "left" | "top" | "right" | "bottom" | "manual" | "outside" | "outsideOriented" | "inside" | "insideOriented" | "radial" | "radialOriented">(name: K): Registry.PortLabelLayout.CommonDefinition | null;
        (name: string): Registry.PortLabelLayout.CommonDefinition | null;
    };
    const unregisterMarker: {
        <K extends "circle" | "ellipse" | "path" | "async" | "block" | "classic" | "diamond" | "cross" | "circlePlus">(name: K): Registry.Marker.Factory<KeyValue<any>> | null;
        (name: string): Registry.Marker.Factory<KeyValue<any>> | null;
    };
    const unregisterRouter: {
        <K extends "orth" | "normal" | "oneSide" | "metro" | "manhattan" | "er" | "loop">(name: K): Registry.Router.CommonDefinition | null;
        (name: string): Registry.Router.CommonDefinition | null;
    };
    const unregisterConnector: {
        <K extends "normal" | "loop" | "rounded" | "smooth" | "jumpover">(name: K): Registry.Connector.Definition<Registry.Connector.BaseOptions> | null;
        (name: string): Registry.Connector.Definition<Registry.Connector.BaseOptions> | null;
    };
    const unregisterAnchor: {
        <K extends "left" | "top" | "right" | "bottom" | "center" | "topLeft" | "topRight" | "bottomLeft" | "bottomRight" | "orth" | "nodeCenter" | "midSide">(name: K): Registry.NodeAnchor.CommonDefinition | null;
        (name: string): Registry.NodeAnchor.CommonDefinition | null;
    };
    const unregisterEdgeAnchor: {
        <K extends "length" | "orth" | "closest" | "ratio">(name: K): Registry.EdgeAnchor.CommonDefinition | null;
        (name: string): Registry.EdgeAnchor.CommonDefinition | null;
    };
    const unregisterConnectionPoint: {
        <K extends "rect" | "anchor" | "bbox" | "boundary">(name: K): Registry.ConnectionPoint.CommonDefinition | null;
        (name: string): Registry.ConnectionPoint.CommonDefinition | null;
    };
    const unregisterConnectionStrategy: {
        <K extends "noop" | "pinRelative" | "pinAbsolute">(name: K): Registry.ConnectionStrategy.Definition | null;
        (name: string): Registry.ConnectionStrategy.Definition | null;
    };
    const unregisterHTMLComponent: {
        <K extends string | number>(name: K): HTML.Component | HTML.UpdatableComponent | null;
        (name: string): HTML.Component | HTML.UpdatableComponent | null;
    };
}
