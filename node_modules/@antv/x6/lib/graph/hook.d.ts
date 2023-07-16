/// <reference types="jquery" />
import { Cell } from '../model/cell';
import { Node } from '../model/node';
import { Edge } from '../model/edge';
import { Model } from '../model/model';
import { View } from '../view/view';
import { Markup } from '../view/markup';
import { CellView } from '../view/cell';
import { NodeView } from '../view/node';
import { EdgeView } from '../view/edge';
import { Widget } from '../addon/common';
import { Knob } from '../addon/knob';
import { MiniMap } from '../addon/minimap';
import { Snapline } from '../addon/snapline';
import { Scroller } from '../addon/scroller';
import { Selection } from '../addon/selection';
import { Clipboard } from '../addon/clipboard';
import { Transform } from '../addon/transform';
import { HTML } from '../shape/standard/html';
import { Base } from './base';
import { Graph } from './graph';
import { Renderer } from './renderer';
import { GraphView } from './view';
import { DefsManager } from './defs';
import { GridManager } from './grid';
import { CoordManager } from './coord';
import { SnaplineManager } from './snapline';
import { ScrollerManager } from './scroller';
import { ClipboardManager } from './clipboard';
import { HighlightManager } from './highlight';
import { TransformManager } from './transform';
import { SelectionManager } from './selection';
import { BackgroundManager } from './background';
import { HistoryManager } from './history';
import { MiniMapManager } from './minimap';
import { Keyboard } from './keyboard';
import { MouseWheel } from './mousewheel';
import { PrintManager } from './print';
import { FormatManager } from './format';
import { PortManager } from '../model/port';
import { Rectangle } from '../geometry';
import { KnobManager } from './knob';
import { PanningManager } from './panning';
import { SizeManager } from './size';
export declare class Hook extends Base implements Hook.IHook {
    /**
     * Get the native value of hooked method.
     */
    getNativeValue: (<T>() => T | null) | null;
    createModel(): Model;
    createView(): Graph.View;
    createRenderer(): Graph.Renderer;
    createDefsManager(): Graph.DefsManager;
    createGridManager(): Graph.GridManager;
    createCoordManager(): Graph.CoordManager;
    createKnobManager(): KnobManager;
    createTransform(node: Node, widgetOptions?: Widget.Options): Transform | null;
    createKnob(node: Node, widgetOptions?: Widget.Options): Knob[];
    protected getTransformOptions(node: Node): Transform.Options;
    createTransformManager(): Graph.TransformManager;
    createHighlightManager(): Graph.HighlightManager;
    createBackgroundManager(): Graph.BackgroundManager;
    createClipboard(): Clipboard;
    createClipboardManager(): Graph.ClipboardManager;
    createSnapline(): Snapline;
    createSnaplineManager(): Graph.SnaplineManager;
    createSelection(): Selection;
    createSelectionManager(): Graph.SelectionManager;
    allowRubberband(e: JQuery.MouseDownEvent): boolean;
    createHistoryManager(): Graph.HistoryManager;
    createScroller(): Scroller | null;
    createScrollerManager(): Graph.ScrollerManager;
    allowPanning(e: JQuery.MouseDownEvent): boolean;
    createMiniMap(): MiniMap | null;
    createMiniMapManager(): Graph.MiniMapManager;
    createKeyboard(): Graph.Keyboard;
    createMouseWheel(): Graph.MouseWheel;
    createPrintManager(): Graph.PrintManager;
    createFormatManager(): Graph.FormatManager;
    createPanningManager(): PanningManager;
    createSizeManager(): SizeManager;
    protected allowConnectToBlank(edge: Edge): boolean;
    validateEdge(edge: Edge, type: Edge.TerminalType, initialTerminal: Edge.TerminalData): boolean;
    validateMagnet(cellView: CellView, magnet: Element, e: JQuery.MouseDownEvent | JQuery.MouseEnterEvent): boolean;
    getDefaultEdge(sourceView: CellView, sourceMagnet: Element): Edge<Edge.Properties>;
    validateConnection(sourceView: CellView | null | undefined, sourceMagnet: Element | null | undefined, targetView: CellView | null | undefined, targetMagnet: Element | null | undefined, terminalType: Edge.TerminalType, edgeView?: EdgeView | null | undefined, candidateTerminal?: Edge.TerminalCellData | null | undefined): boolean;
    getRestrictArea(view?: NodeView): Rectangle.RectangleLike | null;
    onViewUpdated(view: CellView, flag: number, options: Renderer.RequestViewUpdateOptions): void;
    onViewPostponed(view: CellView, flag: number, options: Renderer.UpdateViewOptions): boolean;
    getCellView(cell: Cell): null | undefined | typeof CellView | (new (...args: any[]) => CellView);
    createCellView(cell: Cell): CellView<Cell<Cell.Properties>, CellView.Options> | EdgeView<Edge<Edge.Properties>, EdgeView.Options> | null;
    getHTMLComponent(node: HTML): HTMLElement | string | null | undefined;
    shouldUpdateHTMLComponent(node: HTML): boolean;
    onEdgeLabelRendered(args: Hook.OnEdgeLabelRenderedArgs): void;
    onPortRendered(args: Hook.OnPortRenderedArgs): void;
    onToolItemCreated(args: Hook.OnToolItemCreatedArgs): void;
}
export declare namespace Hook {
    type CreateManager<T> = (this: Graph) => T;
    type CreateManagerWidthNode<T> = (this: Graph, node: Node) => T;
    type CreateManagerWidthOptions<T, Options> = (this: Graph, options: Options) => T;
    export interface OnEdgeLabelRenderedArgs {
        edge: Edge;
        label: Edge.Label;
        container: Element;
        selectors: Markup.Selectors;
    }
    export interface OnPortRenderedArgs {
        node: Node;
        port: PortManager.Port;
        container: Element;
        selectors?: Markup.Selectors;
        labelContainer: Element;
        labelSelectors?: Markup.Selectors;
        contentContainer: Element;
        contentSelectors?: Markup.Selectors;
    }
    export interface OnToolItemCreatedArgs {
        name: string;
        cell: Cell;
        view: CellView;
        tool: View;
    }
    export interface IHook {
        createView: CreateManager<GraphView>;
        createModel: CreateManager<Model>;
        createRenderer: CreateManager<Renderer>;
        createDefsManager: CreateManager<DefsManager>;
        createGridManager: CreateManager<GridManager>;
        createCoordManager: CreateManager<CoordManager>;
        createHighlightManager: CreateManager<HighlightManager>;
        createBackgroundManager: CreateManager<BackgroundManager>;
        createSizeManager: CreateManager<SizeManager>;
        createTransform: CreateManagerWidthNode<Transform | null>;
        createTransformManager: CreateManager<TransformManager>;
        createClipboard: CreateManager<Clipboard>;
        createClipboardManager: CreateManager<ClipboardManager>;
        createSnapline: CreateManager<Snapline>;
        createSnaplineManager: CreateManager<SnaplineManager>;
        createSelection: CreateManager<Selection>;
        createSelectionManager: CreateManager<SelectionManager>;
        allowRubberband: (e: JQuery.MouseDownEvent) => boolean;
        createHistoryManager: CreateManagerWidthOptions<HistoryManager, HistoryManager.Options>;
        createScroller: CreateManager<Scroller | null>;
        createScrollerManager: CreateManager<ScrollerManager>;
        allowPanning: (e: JQuery.MouseDownEvent) => boolean;
        createMiniMap: CreateManager<MiniMap | null>;
        createMiniMapManager: CreateManager<MiniMapManager>;
        createKeyboard: CreateManager<Keyboard>;
        createMouseWheel: CreateManager<MouseWheel>;
        createPrintManager: CreateManager<PrintManager>;
        createFormatManager: CreateManager<FormatManager>;
        createPanningManager: CreateManager<PanningManager>;
        createCellView(this: Graph, cell: Cell): CellView | null | undefined;
        getCellView(this: Graph, cell: Cell): null | undefined | typeof CellView | (new (...args: any[]) => CellView);
        getHTMLComponent(this: Graph, node: HTML): HTMLElement | string | null | undefined;
        shouldUpdateHTMLComponent(this: Graph, node: HTML): boolean;
        onViewUpdated: (this: Graph, view: CellView, flag: number, options: Renderer.RequestViewUpdateOptions) => void;
        onViewPostponed: (this: Graph, view: CellView, flag: number, options: Renderer.UpdateViewOptions) => boolean;
        onEdgeLabelRendered(this: Graph, args: OnEdgeLabelRenderedArgs): void;
        onPortRendered(this: Graph, args: OnPortRenderedArgs): void;
        onToolItemCreated(this: Graph, args: OnToolItemCreatedArgs): void;
    }
    export {};
}
