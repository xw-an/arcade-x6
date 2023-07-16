/// <reference types="jquery" />
import { KeyValue } from '../types';
import { Rectangle, Point, Path, Line } from '../geometry';
import { Dom } from '../util';
import { Attr, NodeAnchor, ConnectionPoint } from '../registry';
import { Cell } from '../model/cell';
import { Edge } from '../model/edge';
import { Markup } from './markup';
import { CellView } from './cell';
export declare class EdgeView<Entity extends Edge = Edge, Options extends EdgeView.Options = EdgeView.Options> extends CellView<Entity, Options> {
    protected readonly POINT_ROUNDING = 2;
    path: Path;
    routePoints: Point[];
    sourceAnchor: Point;
    targetAnchor: Point;
    sourcePoint: Point;
    targetPoint: Point;
    sourceView: CellView | null;
    targetView: CellView | null;
    sourceMagnet: Element | null;
    targetMagnet: Element | null;
    protected toolCache: Element;
    protected tool2Cache: Element;
    protected readonly markerCache: {
        sourcePoint?: Point;
        targetPoint?: Point;
        sourceBBox?: Rectangle;
        targetBBox?: Rectangle;
    };
    protected get [Symbol.toStringTag](): string;
    protected getContainerClassName(): string;
    get sourceBBox(): Rectangle;
    get targetBBox(): Rectangle;
    isEdgeView(): this is EdgeView;
    confirmUpdate(flag: number, options?: any): number;
    onLabelsChange(options?: any): void;
    protected shouldRerenderLabels(options?: any): boolean;
    protected containers: EdgeView.ContainerCache;
    protected labelCache: {
        [index: number]: Element;
    };
    protected labelSelectors: {
        [index: number]: Markup.Selectors;
    };
    render(): this;
    protected renderMarkup(): void;
    protected renderJSONMarkup(markup: Markup.JSONMarkup | Markup.JSONMarkup[]): void;
    protected renderStringMarkup(markup: string): void;
    protected renderLabels(): this;
    protected parseLabelMarkup(markup?: Markup): {
        fragment: DocumentFragment;
        selectors: {};
    } | null;
    protected parseLabelStringMarkup(labelMarkup: string): {
        fragment: DocumentFragment;
        selectors: {};
    };
    protected normalizeLabelMarkup(markup?: {
        fragment: DocumentFragment;
        selectors: Markup.Selectors;
    } | null): {
        node: SVGElement;
        selectors: Markup.Selectors;
    } | undefined;
    protected updateLabels(): void;
    protected mergeLabelAttrs(hasCustomMarkup: boolean, labelAttrs?: Attr.CellAttrs | null, defaultLabelAttrs?: Attr.CellAttrs | null): Attr.CellAttrs | null | undefined;
    protected customizeLabels(): void;
    protected renderTools(): this;
    protected renderExternalTools(): this;
    renderVertexMarkers(): this;
    renderArrowheadMarkers(): this;
    update(partialAttrs?: Attr.CellAttrs | null, options?: any): this;
    removeRedundantLinearVertices(options?: Edge.SetOptions): number;
    updateConnectionPath(): void;
    getTerminalView(type: Edge.TerminalType): CellView<Cell<Cell.Properties>, CellView.Options> | null;
    getTerminalAnchor(type: Edge.TerminalType): Point;
    getTerminalConnectionPoint(type: Edge.TerminalType): Point;
    getTerminalMagnet(type: Edge.TerminalType, options?: {
        raw?: boolean;
    }): Element | null;
    updateConnection(options?: any): void;
    protected findAnchors(vertices: Point.PointLike[]): {
        [x: string]: Point;
    };
    protected findAnchorsOrdered(firstType: Edge.TerminalType, firstPoint: Point.PointLike, secondType: Edge.TerminalType, secondPoint: Point.PointLike): {
        [x: string]: Point;
    };
    protected getAnchor(def: NodeAnchor.ManaualItem | string | undefined, cellView: CellView, magnet: Element | null, ref: Point | Element | null, terminalType: Edge.TerminalType): Point;
    protected findRoutePoints(vertices?: Point.PointLike[]): Point[];
    protected findConnectionPoints(routePoints: Point[], sourceAnchor: Point, targetAnchor: Point): {
        source: Point;
        target: Point;
    };
    protected getConnectionPoint(def: string | ConnectionPoint.ManaualItem | undefined, view: CellView, magnet: Element, line: Line, endType: Edge.TerminalType): Point;
    protected updateMarkerAttr(type: Edge.TerminalType): void;
    protected findMarkerPoints(routePoints: Point[], sourcePoint: Point, targetPoint: Point): {
        source: Point | undefined;
        target: Point | undefined;
    };
    protected findPath(routePoints: Point[], sourcePoint: Point, targetPoint: Point): Path;
    protected translateConnectionPoints(tx: number, ty: number): void;
    updateLabelPositions(): this;
    updateToolsPosition(): this;
    updateArrowheadMarkers(): this;
    updateTerminalProperties(type: Edge.TerminalType): boolean;
    updateTerminalMagnet(type: Edge.TerminalType): void;
    protected translateAndAutoOrientArrows(sourceArrow?: Element, targetArrow?: Element): void;
    protected getLabelPositionAngle(idx: number): number;
    protected getLabelPositionArgs(idx: number): Edge.LabelPositionOptions | undefined;
    protected getDefaultLabelPositionArgs(): Edge.LabelPositionOptions | undefined;
    protected mergeLabelPositionArgs(labelPositionArgs?: Edge.LabelPositionOptions, defaultLabelPositionArgs?: Edge.LabelPositionOptions): Edge.LabelPositionOptions | null | undefined;
    addLabel(x: number, y: number, options?: Edge.LabelPositionOptions & Edge.SetOptions): number;
    addLabel(x: number, y: number, angle: number, options?: Edge.LabelPositionOptions & Edge.SetOptions): number;
    addLabel(p: Point | Point.PointLike, options?: Edge.LabelPositionOptions & Edge.SetOptions): number;
    addLabel(p: Point | Point.PointLike, angle: number, options?: Edge.LabelPositionOptions & Edge.SetOptions): number;
    addVertex(p: Point | Point.PointLike, options?: Edge.SetOptions): number;
    addVertex(x: number, y: number, options?: Edge.SetOptions): number;
    sendToken(token: string | SVGElement, options?: number | ({
        duration?: number;
        reversed?: boolean;
        selector?: string;
        rotate?: boolean | number | 'auto' | 'auto-reverse';
        timing?: 'linear' | 'discrete' | 'paced' | 'spline';
    } & Dom.AnimateCallbacks & KeyValue<string | number | undefined>), callback?: () => void): () => void;
    getConnection(): Path | null;
    getConnectionPathData(): string;
    getConnectionSubdivisions(): import("../geometry").Segment[][] | null | undefined;
    getConnectionLength(): number | undefined;
    getPointAtLength(length: number): Point | null;
    getPointAtRatio(ratio: number): Point | null;
    getTangentAtLength(length: number): Line | null;
    getTangentAtRatio(ratio: number): Line | null;
    getClosestPoint(point: Point.PointLike): Point | null;
    getClosestPointLength(point: Point.PointLike): number | null;
    getClosestPointRatio(point: Point.PointLike): number | null;
    getLabelPosition(x: number, y: number, options?: Edge.LabelPositionOptions | null): Edge.LabelPositionObject;
    getLabelPosition(x: number, y: number, angle: number, options?: Edge.LabelPositionOptions | null): Edge.LabelPositionObject;
    protected normalizeLabelPosition(): undefined;
    protected normalizeLabelPosition(pos: Edge.LabelPosition): Edge.LabelPositionObject;
    protected getLabelTransformationMatrix(labelPosition: Edge.LabelPosition): DOMMatrix;
    getLabelCoordinates(pos: Edge.LabelPosition): Point;
    getVertexIndex(x: number, y: number): number;
    protected getEventArgs<E>(e: E): EdgeView.MouseEventArgs<E>;
    protected getEventArgs<E>(e: E, x: number, y: number): EdgeView.PositionEventArgs<E>;
    protected notifyUnhandledMouseDown(e: JQuery.MouseDownEvent, x: number, y: number): void;
    notifyMouseDown(e: JQuery.MouseDownEvent, x: number, y: number): void;
    notifyMouseMove(e: JQuery.MouseMoveEvent, x: number, y: number): void;
    notifyMouseUp(e: JQuery.MouseUpEvent, x: number, y: number): void;
    onClick(e: JQuery.ClickEvent, x: number, y: number): void;
    onDblClick(e: JQuery.DoubleClickEvent, x: number, y: number): void;
    onContextMenu(e: JQuery.ContextMenuEvent, x: number, y: number): void;
    onMouseDown(e: JQuery.MouseDownEvent, x: number, y: number): void;
    onMouseMove(e: JQuery.MouseMoveEvent, x: number, y: number): KeyValue<any>;
    onMouseUp(e: JQuery.MouseUpEvent, x: number, y: number): KeyValue<any>;
    onMouseOver(e: JQuery.MouseOverEvent): void;
    onMouseOut(e: JQuery.MouseOutEvent): void;
    onMouseEnter(e: JQuery.MouseEnterEvent): void;
    onMouseLeave(e: JQuery.MouseLeaveEvent): void;
    onMouseWheel(e: JQuery.TriggeredEvent, x: number, y: number, delta: number): void;
    onCustomEvent(e: JQuery.MouseDownEvent, name: string, x: number, y: number): void;
    onLabelMouseDown(e: JQuery.MouseDownEvent, x: number, y: number): void;
    protected startEdgeDragging(e: JQuery.MouseDownEvent, x: number, y: number): void;
    protected dragEdge(e: JQuery.MouseMoveEvent, x: number, y: number): void;
    protected stopEdgeDragging(e: JQuery.MouseUpEvent, x: number, y: number): void;
    prepareArrowheadDragging(type: Edge.TerminalType, options: {
        x: number;
        y: number;
        options?: KeyValue;
        isNewEdge?: boolean;
        fallbackAction?: EventData.ArrowheadDragging['fallbackAction'];
    }): EventData.ArrowheadDragging;
    protected createValidateConnectionArgs(type: Edge.TerminalType): (cellView: CellView, magnet: Element) => EventData.ValidateConnectionArgs;
    protected beforeArrowheadDragging(data: EventData.ArrowheadDragging): void;
    protected afterArrowheadDragging(data: EventData.ArrowheadDragging): void;
    protected arrowheadDragging(target: Element, x: number, y: number, data: EventData.ArrowheadDragging): void;
    protected arrowheadDragged(data: EventData.ArrowheadDragging, x: number, y: number): void;
    protected snapArrowhead(x: number, y: number, data: EventData.ArrowheadDragging): void;
    protected snapArrowheadEnd(data: EventData.ArrowheadDragging): void;
    protected finishEmbedding(data: EventData.ArrowheadDragging): void;
    protected fallbackConnection(data: EventData.ArrowheadDragging): void;
    protected notifyConnectionEvent(data: EventData.ArrowheadDragging, e: JQuery.MouseUpEvent): void;
    protected highlightAvailableMagnets(data: EventData.ArrowheadDragging): void;
    protected unhighlightAvailableMagnets(data: EventData.ArrowheadDragging): void;
    protected startArrowheadDragging(e: JQuery.MouseDownEvent, x: number, y: number): void;
    protected dragArrowhead(e: JQuery.MouseMoveEvent, x: number, y: number): void;
    protected stopArrowheadDragging(e: JQuery.MouseUpEvent, x: number, y: number): void;
    startLabelDragging(e: JQuery.MouseDownEvent, x: number, y: number): void;
    dragLabel(e: JQuery.MouseMoveEvent, x: number, y: number): void;
    stopLabelDragging(e: JQuery.MouseUpEvent, x: number, y: number): void;
    handleVertexAdding(e: JQuery.MouseDownEvent, x: number, y: number): void;
    handleVertexRemoving(e: JQuery.MouseDownEvent, x: number, y: number): void;
    startVertexDragging(e: JQuery.MouseDownEvent, x: number, y: number): void;
    dragVertex(e: JQuery.MouseMoveEvent, x: number, y: number): void;
    stopVertexDragging(e: JQuery.MouseUpEvent, x: number, y: number): void;
}
export declare namespace EdgeView {
    interface Options extends CellView.Options {
        perpendicular: boolean;
        doubleTools: boolean;
        shortLength: number;
        longLength: number;
        toolsOffset: number;
        doubleToolsOffset: number;
        sampleInterval: number;
    }
    interface ContainerCache {
        connection?: Element;
        connectionWrap?: Element;
        sourceMarker?: Element;
        targetMarker?: Element;
        labels?: Element;
        vertices?: Element;
        arrowheads?: Element;
        sourceArrowhead?: Element;
        targetArrowhead?: Element;
        tools?: Element;
    }
}
export declare namespace EdgeView {
    interface MouseEventArgs<E> {
        e: E;
        edge: Edge;
        cell: Edge;
        view: EdgeView;
    }
    interface PositionEventArgs<E> extends MouseEventArgs<E>, CellView.PositionEventArgs {
    }
    interface EventArgs {
        'edge:click': PositionEventArgs<JQuery.ClickEvent>;
        'edge:dblclick': PositionEventArgs<JQuery.DoubleClickEvent>;
        'edge:contextmenu': PositionEventArgs<JQuery.ContextMenuEvent>;
        'edge:mousedown': PositionEventArgs<JQuery.MouseDownEvent>;
        'edge:mousemove': PositionEventArgs<JQuery.MouseMoveEvent>;
        'edge:mouseup': PositionEventArgs<JQuery.MouseUpEvent>;
        'edge:mouseover': MouseEventArgs<JQuery.MouseOverEvent>;
        'edge:mouseout': MouseEventArgs<JQuery.MouseOutEvent>;
        'edge:mouseenter': MouseEventArgs<JQuery.MouseEnterEvent>;
        'edge:mouseleave': MouseEventArgs<JQuery.MouseLeaveEvent>;
        'edge:mousewheel': PositionEventArgs<JQuery.TriggeredEvent> & CellView.MouseDeltaEventArgs;
        'edge:customevent': EdgeView.PositionEventArgs<JQuery.MouseDownEvent> & {
            name: string;
        };
        'edge:unhandled:mousedown': PositionEventArgs<JQuery.MouseDownEvent>;
        'edge:connected': {
            e: JQuery.MouseUpEvent;
            edge: Edge;
            view: EdgeView;
            isNew: boolean;
            type: Edge.TerminalType;
            previousCell?: Cell | null;
            previousView?: CellView | null;
            previousPort?: string | null;
            previousPoint?: Point.PointLike | null;
            previousMagnet?: Element | null;
            currentCell?: Cell | null;
            currentView?: CellView | null;
            currentPort?: string | null;
            currentPoint?: Point.PointLike | null;
            currentMagnet?: Element | null;
        };
        'edge:highlight': {
            magnet: Element;
            view: EdgeView;
            edge: Edge;
            cell: Edge;
            options: CellView.HighlightOptions;
        };
        'edge:unhighlight': EventArgs['edge:highlight'];
        'edge:move': PositionEventArgs<JQuery.MouseMoveEvent>;
        'edge:moving': PositionEventArgs<JQuery.MouseMoveEvent>;
        'edge:moved': PositionEventArgs<JQuery.MouseUpEvent>;
    }
}
export declare namespace EdgeView {
    const toStringTag: string;
    function isEdgeView(instance: any): instance is EdgeView;
}
declare namespace EventData {
    interface MousemoveEventData {
    }
    interface EdgeDragging {
        action: 'drag-edge';
        moving: boolean;
        x: number;
        y: number;
    }
    type ValidateConnectionArgs = [
        CellView | null | undefined,
        // source view
        Element | null | undefined,
        // source magnet
        CellView | null | undefined,
        // target view
        Element | null | undefined,
        Edge.TerminalType,
        EdgeView
    ];
    interface ArrowheadDragging {
        action: 'drag-arrowhead';
        x: number;
        y: number;
        isNewEdge: boolean;
        terminalType: Edge.TerminalType;
        fallbackAction: 'remove' | 'revert';
        initialMagnet: Element | null;
        initialTerminal: Edge.TerminalData;
        getValidateConnectionArgs: (cellView: CellView, magnet: Element | null) => ValidateConnectionArgs;
        zIndex?: number | null;
        pointerEvents?: string | null;
        /**
         * Current event target.
         */
        currentTarget?: Element;
        /**
         * Current view under pointer.
         */
        currentView?: CellView | null;
        /**
         * Current magnet under pointer.
         */
        currentMagnet?: Element | null;
        closestView?: CellView | null;
        closestMagnet?: Element | null;
        marked?: KeyValue<Element[]> | null;
        options?: KeyValue;
    }
    interface LabelDragging {
        action: 'drag-label';
        index: number;
        positionAngle: number;
        positionArgs?: Edge.LabelPositionOptions | null;
        stopPropagation: true;
    }
    interface VertexDragging {
        action: 'drag-vertex';
        index: number;
    }
}
export {};
