/// <reference types="jquery" />
import { Rectangle, Point } from '../geometry';
import { Attr, PortLayout } from '../registry';
import { Cell } from '../model/cell';
import { Node } from '../model/node';
import { PortManager } from '../model/port';
import { Graph } from '../graph';
import { CellView } from './cell';
import { EdgeView } from './edge';
import { Markup } from './markup';
export declare class NodeView<Entity extends Node = Node, Options extends NodeView.Options = NodeView.Options> extends CellView<Entity, Options> {
    scalableNode: Element | null;
    rotatableNode: Element | null;
    protected readonly scalableSelector: string;
    protected readonly rotatableSelector: string;
    protected readonly defaultPortMarkup: Markup;
    protected readonly defaultPortLabelMarkup: Markup;
    protected readonly defaultPortContainerMarkup: Markup;
    protected portsCache: {
        [id: string]: NodeView.PortCache;
    };
    protected get [Symbol.toStringTag](): string;
    protected getContainerClassName(): string;
    protected updateClassName(e: JQuery.MouseEnterEvent): void;
    isNodeView(): this is NodeView;
    confirmUpdate(flag: number, options?: any): number;
    update(partialAttrs?: Attr.CellAttrs): void;
    protected renderMarkup(): void;
    protected renderJSONMarkup(markup: Markup.JSONMarkup | Markup.JSONMarkup[]): void;
    protected renderStringMarkup(markup: string): void;
    render(): this;
    resize(opt?: any): void;
    translate(): void;
    rotate(): void;
    protected getTranslationString(): string;
    protected getRotationString(): string | undefined;
    protected updateTransform(): void;
    protected updateRotation(): void;
    protected updateTranslation(): void;
    protected updateSize(opt?: any): void;
    findPortElem(portId?: string, selector?: string): Element | null;
    protected initializePorts(): void;
    protected refreshPorts(): void;
    protected cleanPortsCache(): void;
    protected removePorts(): void;
    protected renderPorts(): void;
    protected getPortsContainer(): Element;
    protected appendPorts(ports: PortManager.Port[], zIndex: number, refs: Element[]): void;
    protected getPortElement(port: PortManager.Port): Element;
    protected createPortElement(port: PortManager.Port): Element;
    protected updatePorts(): void;
    protected updatePortGroup(groupName?: string): void;
    protected applyPortTransform(element: Element, layout: PortLayout.Result, initialAngle?: number): void;
    protected getPortContainerMarkup(): Markup;
    protected getPortMarkup(port: PortManager.Port): Markup;
    protected getPortLabelMarkup(label: PortManager.Label): Markup;
    protected getEventArgs<E>(e: E): NodeView.MouseEventArgs<E>;
    protected getEventArgs<E>(e: E, x: number, y: number): NodeView.PositionEventArgs<E>;
    notifyMouseDown(e: JQuery.MouseDownEvent, x: number, y: number): void;
    notifyMouseMove(e: JQuery.MouseMoveEvent, x: number, y: number): void;
    notifyMouseUp(e: JQuery.MouseUpEvent, x: number, y: number): void;
    onClick(e: JQuery.ClickEvent, x: number, y: number): void;
    onDblClick(e: JQuery.DoubleClickEvent, x: number, y: number): void;
    onContextMenu(e: JQuery.ContextMenuEvent, x: number, y: number): void;
    onMouseDown(e: JQuery.MouseDownEvent, x: number, y: number): void;
    onMouseMove(e: JQuery.MouseMoveEvent, x: number, y: number): void;
    onMouseUp(e: JQuery.MouseUpEvent, x: number, y: number): void;
    onMouseOver(e: JQuery.MouseOverEvent): void;
    onMouseOut(e: JQuery.MouseOutEvent): void;
    onMouseEnter(e: JQuery.MouseEnterEvent): void;
    onMouseLeave(e: JQuery.MouseLeaveEvent): void;
    onMouseWheel(e: JQuery.TriggeredEvent, x: number, y: number, delta: number): void;
    onMagnetClick(e: JQuery.MouseUpEvent, magnet: Element, x: number, y: number): void;
    onMagnetDblClick(e: JQuery.DoubleClickEvent, magnet: Element, x: number, y: number): void;
    onMagnetContextMenu(e: JQuery.ContextMenuEvent, magnet: Element, x: number, y: number): void;
    onMagnetMouseDown(e: JQuery.MouseDownEvent, magnet: Element, x: number, y: number): void;
    onCustomEvent(e: JQuery.MouseDownEvent, name: string, x: number, y: number): void;
    protected prepareEmbedding(e: JQuery.MouseMoveEvent): void;
    processEmbedding(e: JQuery.MouseMoveEvent, data: EventData.MovingTargetNode): void;
    clearEmbedding(data: EventData.MovingTargetNode): void;
    finalizeEmbedding(e: JQuery.MouseUpEvent, data: EventData.MovingTargetNode): void;
    getDelegatedView(): NodeView<Node<Node.Properties>, NodeView.Options> | null;
    protected startMagnetDragging(e: JQuery.MouseDownEvent, x: number, y: number): void;
    protected startConnectting(e: JQuery.MouseDownEvent, magnet: Element, x: number, y: number): void;
    protected createEdgeFromMagnet(magnet: Element, x: number, y: number): EdgeView<import("..").Edge<import("..").Edge.Properties>, EdgeView.Options>;
    protected dragMagnet(e: JQuery.MouseMoveEvent, x: number, y: number): void;
    protected stopMagnetDragging(e: JQuery.MouseUpEvent, x: number, y: number): void;
    protected notifyUnhandledMouseDown(e: JQuery.MouseDownEvent, x: number, y: number): void;
    protected notifyNodeMove<Key extends keyof NodeView.EventArgs>(name: Key, e: JQuery.MouseMoveEvent | JQuery.MouseUpEvent, x: number, y: number, cell: Cell): void;
    protected startNodeDragging(e: JQuery.MouseDownEvent, x: number, y: number): void;
    protected dragNode(e: JQuery.MouseMoveEvent, x: number, y: number): void;
    protected stopNodeDragging(e: JQuery.MouseUpEvent, x: number, y: number): void;
    protected autoScrollGraph(x: number, y: number): void;
}
export declare namespace NodeView {
    interface Options extends CellView.Options {
    }
    interface PortCache {
        portElement: Element;
        portSelectors?: Markup.Selectors | null;
        portLabelElement: Element;
        portLabelSelectors?: Markup.Selectors | null;
        portContentElement: Element;
        portContentSelectors?: Markup.Selectors | null;
    }
}
export declare namespace NodeView {
    interface MagnetEventArgs {
        magnet: Element;
    }
    export interface MouseEventArgs<E> {
        e: E;
        node: Node;
        cell: Node;
        view: NodeView;
    }
    export interface PositionEventArgs<E> extends MouseEventArgs<E>, CellView.PositionEventArgs {
    }
    export interface TranslateEventArgs<E> extends PositionEventArgs<E> {
    }
    export interface ResizeEventArgs<E> extends PositionEventArgs<E> {
    }
    export interface RotateEventArgs<E> extends PositionEventArgs<E> {
    }
    export interface EventArgs {
        'node:click': PositionEventArgs<JQuery.ClickEvent>;
        'node:dblclick': PositionEventArgs<JQuery.DoubleClickEvent>;
        'node:contextmenu': PositionEventArgs<JQuery.ContextMenuEvent>;
        'node:mousedown': PositionEventArgs<JQuery.MouseDownEvent>;
        'node:mousemove': PositionEventArgs<JQuery.MouseMoveEvent>;
        'node:mouseup': PositionEventArgs<JQuery.MouseUpEvent>;
        'node:mouseover': MouseEventArgs<JQuery.MouseOverEvent>;
        'node:mouseout': MouseEventArgs<JQuery.MouseOutEvent>;
        'node:mouseenter': MouseEventArgs<JQuery.MouseEnterEvent>;
        'node:mouseleave': MouseEventArgs<JQuery.MouseLeaveEvent>;
        'node:mousewheel': PositionEventArgs<JQuery.TriggeredEvent> & CellView.MouseDeltaEventArgs;
        'node:customevent': PositionEventArgs<JQuery.MouseDownEvent> & {
            name: string;
        };
        'node:unhandled:mousedown': PositionEventArgs<JQuery.MouseDownEvent>;
        'node:highlight': {
            magnet: Element;
            view: NodeView;
            node: Node;
            cell: Node;
            options: CellView.HighlightOptions;
        };
        'node:unhighlight': EventArgs['node:highlight'];
        'node:magnet:click': PositionEventArgs<JQuery.MouseUpEvent> & MagnetEventArgs;
        'node:magnet:dblclick': PositionEventArgs<JQuery.DoubleClickEvent> & MagnetEventArgs;
        'node:magnet:contextmenu': PositionEventArgs<JQuery.ContextMenuEvent> & MagnetEventArgs;
        'node:move': TranslateEventArgs<JQuery.MouseMoveEvent>;
        'node:moving': TranslateEventArgs<JQuery.MouseMoveEvent>;
        'node:moved': TranslateEventArgs<JQuery.MouseUpEvent>;
        'node:resize': ResizeEventArgs<JQuery.MouseDownEvent>;
        'node:resizing': ResizeEventArgs<JQuery.MouseMoveEvent>;
        'node:resized': ResizeEventArgs<JQuery.MouseUpEvent>;
        'node:rotate': RotateEventArgs<JQuery.MouseDownEvent>;
        'node:rotating': RotateEventArgs<JQuery.MouseMoveEvent>;
        'node:rotated': RotateEventArgs<JQuery.MouseUpEvent>;
        'node:embed': PositionEventArgs<JQuery.MouseMoveEvent> & {
            currentParent: Node | null;
        };
        'node:embedding': PositionEventArgs<JQuery.MouseMoveEvent> & {
            currentParent: Node | null;
            candidateParent: Node | null;
        };
        'node:embedded': PositionEventArgs<JQuery.MouseUpEvent> & {
            currentParent: Node | null;
            previousParent: Node | null;
        };
    }
    export {};
}
export declare namespace NodeView {
    const toStringTag: string;
    function isNodeView(instance: any): instance is NodeView;
}
declare namespace EventData {
    type Mousemove = Moving | Magnet;
    interface Magnet {
        action: 'magnet';
        targetMagnet: Element;
        edgeView?: EdgeView;
    }
    interface Moving {
        action: 'move';
        targetView: NodeView;
    }
    interface MovingTargetNode {
        moving: boolean;
        offset: Point.PointLike;
        restrict?: Rectangle.RectangleLike | null;
        embedding?: boolean;
        candidateEmbedView?: NodeView | null;
        cell?: Node;
        graph?: Graph;
    }
}
export {};
