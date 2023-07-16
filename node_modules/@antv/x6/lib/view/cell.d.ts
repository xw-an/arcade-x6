/// <reference types="jquery" />
import { Nilable, KeyValue } from '../types';
import { Rectangle } from '../geometry';
import { Dom } from '../util';
import { Attr } from '../registry/attr';
import { Registry } from '../registry/registry';
import { Cell } from '../model/cell';
import { Edge } from '../model/edge';
import { Model } from '../model/model';
import { Graph } from '../graph/graph';
import { View } from './view';
import { Cache } from './cache';
import { Markup } from './markup';
import { EdgeView } from './edge';
import { NodeView } from './node';
import { ToolsView } from './tool';
import { AttrManager } from './attr';
import { FlagManager } from './flag';
export declare class CellView<Entity extends Cell = Cell, Options extends CellView.Options = CellView.Options> extends View<CellView.EventArgs> {
    protected static defaults: Partial<CellView.Options>;
    static getDefaults(): Partial<CellView.Options>;
    static config<T extends CellView.Options = CellView.Options>(options: Partial<T>): void;
    static getOptions<T extends CellView.Options = CellView.Options>(options: Partial<T>): T;
    graph: Graph;
    cell: Entity;
    protected selectors: Markup.Selectors;
    protected readonly options: Options;
    protected readonly flag: FlagManager;
    protected readonly attr: AttrManager;
    protected readonly cache: Cache;
    scalableNode: Element | null;
    rotatableNode: Element | null;
    protected get [Symbol.toStringTag](): string;
    constructor(cell: Entity, options?: Partial<Options>);
    protected init(): void;
    protected onRemove(): void;
    get priority(): number;
    protected get rootSelector(): string;
    protected getConstructor<T extends CellView.Definition>(): T;
    protected ensureOptions(options: Partial<Options>): Options;
    protected getContainerTagName(): string;
    protected getContainerStyle(): Nilable<JQuery.PlainObject<string | number>> | void;
    protected getContainerAttrs(): Nilable<Attr.SimpleAttrs>;
    protected getContainerClassName(): Nilable<string | string[]>;
    protected ensureContainer(): SVGElement | HTMLElement;
    protected setContainer(container: Element): this;
    isNodeView(): this is NodeView;
    isEdgeView(): this is EdgeView;
    render(): this;
    confirmUpdate(flag: number, options?: any): number;
    getBootstrapFlag(): number;
    getFlag(actions: FlagManager.Actions): number;
    hasAction(flag: number, actions: FlagManager.Actions): number;
    removeAction(flag: number, actions: FlagManager.Actions): number;
    handleAction(flag: number, action: FlagManager.Action, handle: () => void, additionalRemovedActions?: FlagManager.Actions | null): number;
    protected setup(): void;
    protected onAttrsChange(options: Cell.MutateOptions): void;
    parseJSONMarkup(markup: Markup.JSONMarkup | Markup.JSONMarkup[], rootElem?: Element): Markup.ParseResult;
    can(feature: CellView.InteractionNames): boolean;
    cleanCache(): this;
    getCache(elem: Element): Cache.Item;
    getDataOfElement(elem: Element): import("../util").JSONObject;
    getMatrixOfElement(elem: Element): DOMMatrix;
    getShapeOfElement(elem: SVGElement): import("../geometry").Polyline | Rectangle | import("../geometry").Line | import("../geometry").Path | import("../geometry").Ellipse;
    getScaleOfElement(node: Element, scalableNode?: SVGElement): {
        sx: number;
        sy: number;
    };
    getBoundingRectOfElement(elem: Element): Rectangle;
    getBBoxOfElement(elem: Element): Rectangle;
    getUnrotatedBBoxOfElement(elem: SVGElement): Rectangle;
    getBBox(options?: {
        useCellGeometry?: boolean;
    }): Rectangle;
    getRootTranslatedMatrix(): DOMMatrix;
    getRootRotatedMatrix(): DOMMatrix;
    findMagnet(elem?: Element): Element | null;
    updateAttrs(rootNode: Element, attrs: Attr.CellAttrs, options?: Partial<AttrManager.UpdateOptions>): void;
    isEdgeElement(magnet?: Element | null): boolean;
    protected prepareHighlight(elem?: Element | null, options?: CellView.HighlightOptions): any;
    highlight(elem?: Element | null, options?: CellView.HighlightOptions): this;
    unhighlight(elem?: Element | null, options?: CellView.HighlightOptions): this;
    notifyUnhighlight(magnet: Element, options: CellView.HighlightOptions): void;
    getEdgeTerminal(magnet: Element, x: number, y: number, edge: Edge, type: Edge.TerminalType): Edge.TerminalCellData;
    protected customizeEdgeTerminal(terminal: Edge.TerminalCellData, magnet: Element, x: number, y: number, edge: Edge, type: Edge.TerminalType): Edge.TerminalCellData;
    getMagnetFromEdgeTerminal(terminal: Edge.TerminalData): any;
    animate(elem: SVGElement | string, options: Dom.AnimationOptions): () => any;
    animateTransform(elem: SVGElement | string, options: Dom.AnimationOptions): () => any;
    protected tools: ToolsView | null;
    hasTools(name?: string): boolean;
    addTools(options: ToolsView.Options | null): this;
    addTools(tools: ToolsView | null): this;
    updateTools(options?: ToolsView.UpdateOptions): this;
    removeTools(): this;
    hideTools(): this;
    showTools(): this;
    protected renderTools(): this;
    notify<Key extends keyof CellView.EventArgs>(name: Key, args: CellView.EventArgs[Key]): this;
    notify(name: Exclude<string, keyof CellView.EventArgs>, args: any): this;
    protected getEventArgs<E>(e: E): CellView.MouseEventArgs<E>;
    protected getEventArgs<E>(e: E, x: number, y: number): CellView.MousePositionEventArgs<E>;
    onClick(e: JQuery.ClickEvent, x: number, y: number): void;
    onDblClick(e: JQuery.DoubleClickEvent, x: number, y: number): void;
    onContextMenu(e: JQuery.ContextMenuEvent, x: number, y: number): void;
    protected cachedModelForMouseEvent: Model | null;
    onMouseDown(e: JQuery.MouseDownEvent, x: number, y: number): void;
    onMouseUp(e: JQuery.MouseUpEvent, x: number, y: number): void;
    onMouseMove(e: JQuery.MouseMoveEvent, x: number, y: number): void;
    onMouseOver(e: JQuery.MouseOverEvent): void;
    onMouseOut(e: JQuery.MouseOutEvent): void;
    onMouseEnter(e: JQuery.MouseEnterEvent): void;
    onMouseLeave(e: JQuery.MouseLeaveEvent): void;
    onMouseWheel(e: JQuery.TriggeredEvent, x: number, y: number, delta: number): void;
    onCustomEvent(e: JQuery.MouseDownEvent, name: string, x: number, y: number): void;
    onMagnetMouseDown(e: JQuery.MouseDownEvent, magnet: Element, x: number, y: number): void;
    onMagnetDblClick(e: JQuery.DoubleClickEvent, magnet: Element, x: number, y: number): void;
    onMagnetContextMenu(e: JQuery.ContextMenuEvent, magnet: Element, x: number, y: number): void;
    onLabelMouseDown(e: JQuery.MouseDownEvent, x: number, y: number): void;
    checkMouseleave(e: JQuery.TriggeredEvent): void;
}
export declare namespace CellView {
    export interface Options {
        graph: Graph;
        priority: number;
        isSvgElement: boolean;
        rootSelector: string;
        bootstrap: FlagManager.Actions;
        actions: KeyValue<FlagManager.Actions>;
        events?: View.Events | null;
        documentEvents?: View.Events | null;
    }
    type Interactable = boolean | ((this: Graph, cellView: CellView) => boolean);
    interface InteractionMap {
        edgeMovable?: Interactable;
        edgeLabelMovable?: Interactable;
        arrowheadMovable?: Interactable;
        vertexMovable?: Interactable;
        vertexAddable?: Interactable;
        vertexDeletable?: Interactable;
        useEdgeTools?: Interactable;
        nodeMovable?: Interactable;
        magnetConnectable?: Interactable;
        stopDelegateOnDragging?: Interactable;
        toolsAddable?: Interactable;
    }
    export type InteractionNames = keyof InteractionMap;
    export type Interacting = boolean | InteractionMap | ((this: Graph, cellView: CellView) => InteractionMap | boolean);
    export interface HighlightOptions {
        highlighter?: string | {
            name: string;
            args: KeyValue;
        };
        type?: 'embedding' | 'nodeAvailable' | 'magnetAvailable' | 'magnetAdsorbed';
        partial?: boolean;
    }
    export {};
}
export declare namespace CellView {
    interface PositionEventArgs {
        x: number;
        y: number;
    }
    interface MouseDeltaEventArgs {
        delta: number;
    }
    interface MouseEventArgs<E> {
        e: E;
        view: CellView;
        cell: Cell;
    }
    interface MousePositionEventArgs<E> extends MouseEventArgs<E>, PositionEventArgs {
    }
    interface EventArgs extends NodeView.EventArgs, EdgeView.EventArgs {
        'cell:click': MousePositionEventArgs<JQuery.ClickEvent>;
        'cell:dblclick': MousePositionEventArgs<JQuery.DoubleClickEvent>;
        'cell:contextmenu': MousePositionEventArgs<JQuery.ContextMenuEvent>;
        'cell:mousedown': MousePositionEventArgs<JQuery.MouseDownEvent>;
        'cell:mousemove': MousePositionEventArgs<JQuery.MouseMoveEvent>;
        'cell:mouseup': MousePositionEventArgs<JQuery.MouseUpEvent>;
        'cell:mouseover': MouseEventArgs<JQuery.MouseOverEvent>;
        'cell:mouseout': MouseEventArgs<JQuery.MouseOutEvent>;
        'cell:mouseenter': MouseEventArgs<JQuery.MouseEnterEvent>;
        'cell:mouseleave': MouseEventArgs<JQuery.MouseLeaveEvent>;
        'cell:mousewheel': MousePositionEventArgs<JQuery.TriggeredEvent> & MouseDeltaEventArgs;
        'cell:customevent': MousePositionEventArgs<JQuery.MouseDownEvent> & {
            name: string;
        };
        'cell:highlight': {
            magnet: Element;
            view: CellView;
            cell: Cell;
            options: CellView.HighlightOptions;
        };
        'cell:unhighlight': EventArgs['cell:highlight'];
    }
}
export declare namespace CellView {
    const Flag: typeof FlagManager;
    const Attr: typeof AttrManager;
}
export declare namespace CellView {
    const toStringTag: string;
    function isCellView(instance: any): instance is CellView;
}
export declare namespace CellView {
    function priority(value: number): (ctor: Definition) => void;
    function bootstrap(actions: FlagManager.Actions): (ctor: Definition) => void;
}
export declare namespace CellView {
    type CellViewClass = typeof CellView;
    export interface Definition extends CellViewClass {
        new <Entity extends Cell = Cell, Options extends CellView.Options = CellView.Options>(cell: Entity, options: Partial<Options>): CellView;
    }
    export const registry: Registry<Definition, KeyValue<Definition>, never>;
    export {};
}
