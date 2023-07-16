/// <reference types="jquery" />
import { Cell } from '../model';
import { View, Markup, CellView } from '../view';
import { Graph } from './graph';
export declare class GraphView extends View {
    protected readonly graph: Graph;
    readonly container: HTMLElement;
    readonly background: HTMLDivElement;
    readonly grid: HTMLDivElement;
    readonly svg: SVGSVGElement;
    readonly defs: SVGDefsElement;
    readonly viewport: SVGGElement;
    readonly primer: SVGGElement;
    readonly stage: SVGGElement;
    readonly decorator: SVGGElement;
    readonly overlay: SVGGElement;
    private restore;
    protected get model(): import("../model").Model;
    protected get options(): import("./options").Options.Definition;
    constructor(graph: Graph);
    delegateEvents(): this;
    /**
     * Guard the specified event. If the event is not interesting, it
     * returns `true`, otherwise returns `false`.
     */
    guard(e: JQuery.TriggeredEvent, view?: CellView | null): any;
    protected findView(elem: Element): CellView<Cell<Cell.Properties>, CellView.Options> | null;
    protected onDblClick(evt: JQuery.DoubleClickEvent): void;
    protected onClick(evt: JQuery.ClickEvent): void;
    protected isPreventDefaultContextMenu(evt: JQuery.ContextMenuEvent, view: CellView | null): boolean;
    protected onContextMenu(evt: JQuery.ContextMenuEvent): void;
    delegateDragEvents(e: JQuery.MouseDownEvent, view: CellView | null): void;
    getMouseMovedCount(e: JQuery.TriggeredEvent): number;
    protected onMouseDown(evt: JQuery.MouseDownEvent): void;
    protected onMouseMove(evt: JQuery.MouseMoveEvent): void;
    protected onMouseUp(e: JQuery.MouseUpEvent): void;
    protected onMouseOver(evt: JQuery.MouseOverEvent): void;
    protected onMouseOut(evt: JQuery.MouseOutEvent): void;
    protected onMouseEnter(evt: JQuery.MouseEnterEvent): void;
    protected onMouseLeave(evt: JQuery.MouseLeaveEvent): void;
    protected onMouseWheel(evt: JQuery.TriggeredEvent): void;
    protected onCustomEvent(evt: JQuery.MouseDownEvent): void;
    protected handleMagnetEvent<T extends JQuery.TriggeredEvent>(evt: T, handler: (this: Graph, view: CellView, e: T, magnet: Element, x: number, y: number) => void): void;
    protected onMagnetMouseDown(e: JQuery.MouseDownEvent): void;
    protected onMagnetDblClick(e: JQuery.DoubleClickEvent): void;
    protected onMagnetContextMenu(evt: JQuery.ContextMenuEvent): void;
    protected onLabelMouseDown(evt: JQuery.MouseDownEvent): void;
    protected onImageDragStart(): boolean;
    dispose(): void;
}
export declare namespace GraphView {
    type SortType = 'none' | 'approx' | 'exact';
}
export declare namespace GraphView {
    const markup: Markup.JSONMarkup[];
    function snapshoot(elem: Element): () => void;
}
export declare namespace GraphView {
    const events: {
        [x: string]: string;
        dblclick: string;
        contextmenu: string;
        touchstart: string;
        mousedown: string;
        mouseover: string;
        mouseout: string;
        mouseenter: string;
        mouseleave: string;
        mousewheel: string;
        DOMMouseScroll: string;
    };
    const documentEvents: {
        mousemove: string;
        touchmove: string;
        mouseup: string;
        touchend: string;
        touchcancel: string;
    };
}
