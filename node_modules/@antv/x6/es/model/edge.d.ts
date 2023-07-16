import { Size, KeyValue } from '../types';
import { Point, Polyline } from '../geometry';
import { Registry, Attr, Router, Connector, EdgeAnchor, NodeAnchor, ConnectionPoint, ConnectionStrategy } from '../registry';
import { Markup } from '../view/markup';
import { Store } from './store';
import { Cell } from './cell';
import { Node } from './node';
export declare class Edge<Properties extends Edge.Properties = Edge.Properties> extends Cell<Properties> {
    protected static defaults: Edge.Defaults;
    protected readonly store: Store<Edge.Properties>;
    protected get [Symbol.toStringTag](): string;
    constructor(metadata?: Edge.Metadata);
    protected preprocess(metadata: Edge.Metadata, ignoreIdCheck?: boolean): Properties;
    protected setup(): void;
    isEdge(): this is Edge;
    disconnect(options?: Edge.SetOptions): this;
    get source(): Edge.TerminalData;
    set source(data: Edge.TerminalData);
    getSource(): Edge.TerminalData;
    getSourceCellId(): string;
    getSourcePortId(): string | undefined;
    setSource(node: Node, args?: Edge.SetCellTerminalArgs, options?: Edge.SetOptions): this;
    setSource(edge: Edge, args?: Edge.SetEdgeTerminalArgs, options?: Edge.SetOptions): this;
    setSource(point: Point | Point.PointLike, args?: Edge.SetTerminalCommonArgs, options?: Edge.SetOptions): this;
    setSource(args: Edge.TerminalData, options?: Edge.SetOptions): this;
    get target(): Edge.TerminalData;
    set target(data: Edge.TerminalData);
    getTarget(): Edge.TerminalData;
    getTargetCellId(): string;
    getTargetPortId(): string | undefined;
    setTarget(edge: Node, args?: Edge.SetCellTerminalArgs, options?: Edge.SetOptions): this;
    setTarget(edge: Edge, args?: Edge.SetEdgeTerminalArgs, options?: Edge.SetOptions): this;
    setTarget(point: Point | Point.PointLike, args?: Edge.SetTerminalCommonArgs, options?: Edge.SetOptions): this;
    setTarget(args: Edge.TerminalData, options?: Edge.SetOptions): this;
    getTerminal(type: Edge.TerminalType): Edge.TerminalData;
    setTerminal(type: Edge.TerminalType, terminal: Node | Edge | Point | Point.PointLike | Edge.TerminalData, args?: Edge.SetTerminalCommonArgs | Edge.SetOptions, options?: Edge.SetOptions): this;
    getSourcePoint(): Point;
    getTargetPoint(): Point;
    protected getTerminalPoint(type: Edge.TerminalType): Point;
    getSourceCell(): Cell<Cell.Properties> | null;
    getTargetCell(): Cell<Cell.Properties> | null;
    protected getTerminalCell(type: Edge.TerminalType): Cell<Cell.Properties> | null;
    getSourceNode(): Node<Node.Properties> | null;
    getTargetNode(): Node<Node.Properties> | null;
    protected getTerminalNode(type: Edge.TerminalType): Node | null;
    get router(): Edge.RouterData | undefined;
    set router(data: Edge.RouterData | undefined);
    getRouter(): Edge.RouterData;
    setRouter(name: string, args?: KeyValue, options?: Edge.SetOptions): this;
    setRouter(router: Edge.RouterData, options?: Edge.SetOptions): this;
    removeRouter(options?: Edge.SetOptions): this;
    get connector(): Edge.ConnectorData | undefined;
    set connector(data: Edge.ConnectorData | undefined);
    getConnector(): any;
    setConnector(name: string, args?: KeyValue, options?: Edge.SetOptions): this;
    setConnector(connector: Edge.ConnectorData, options?: Edge.SetOptions): this;
    removeConnector(options?: Edge.SetOptions): Store<Edge.Properties>;
    get strategy(): Edge.StrategyData | undefined;
    set strategy(data: Edge.StrategyData | undefined);
    getStrategy(): any;
    setStrategy(name: string, args?: KeyValue, options?: Edge.SetOptions): this;
    setStrategy(strategy: Edge.StrategyData, options?: Edge.SetOptions): this;
    removeStrategy(options?: Edge.SetOptions): Store<Edge.Properties>;
    getDefaultLabel(): Edge.Label;
    get labels(): Edge.Label[];
    set labels(labels: Edge.Label[]);
    getLabels(): Edge.Label[];
    setLabels(labels: Edge.Label | Edge.Label[] | string | string[], options?: Edge.SetOptions): this;
    insertLabel(label: Edge.Label | string, index?: number, options?: Edge.SetOptions): this;
    appendLabel(label: Edge.Label | string, options?: Edge.SetOptions): this;
    getLabelAt(index: number): Edge.Label | null;
    setLabelAt(index: number, label: Edge.Label | string, options?: Edge.SetOptions): this;
    removeLabelAt(index: number, options?: Edge.SetOptions): Edge.Label | null;
    protected parseLabel(label: string | Edge.Label): Edge.Label;
    protected onLabelsChanged({ previous, current, }: Cell.ChangeArgs<Edge.Label[]>): void;
    get vertexMarkup(): Markup;
    set vertexMarkup(markup: Markup);
    getDefaultVertexMarkup(): any;
    getVertexMarkup(): any;
    setVertexMarkup(markup?: Markup, options?: Edge.SetOptions): this;
    get vertices(): Point.PointLike | Point.PointLike[];
    set vertices(vertices: Point.PointLike | Point.PointLike[]);
    getVertices(): any[];
    setVertices(vertices: Point.PointLike | Point.PointLike[], options?: Edge.SetOptions): this;
    insertVertex(vertice: Point.PointLike, index?: number, options?: Edge.SetOptions): this;
    appendVertex(vertex: Point.PointLike, options?: Edge.SetOptions): this;
    getVertexAt(index: number): any;
    setVertexAt(index: number, vertice: Point.PointLike, options?: Edge.SetOptions): this;
    removeVertexAt(index: number, options?: Edge.SetOptions): this;
    protected onVertexsChanged({ previous, current, }: Cell.ChangeArgs<Point.PointLike[]>): void;
    getDefaultMarkup(): any;
    getMarkup(): any;
    get toolMarkup(): Markup;
    set toolMarkup(markup: Markup);
    getDefaultToolMarkup(): any;
    getToolMarkup(): any;
    setToolMarkup(markup?: Markup, options?: Edge.SetOptions): this;
    get doubleToolMarkup(): Markup | undefined;
    set doubleToolMarkup(markup: Markup | undefined);
    getDefaultDoubleToolMarkup(): any;
    getDoubleToolMarkup(): any;
    setDoubleToolMarkup(markup?: Markup, options?: Edge.SetOptions): this;
    get arrowheadMarkup(): Markup;
    set arrowheadMarkup(markup: Markup);
    getDefaultArrowheadMarkup(): any;
    getArrowheadMarkup(): any;
    setArrowheadMarkup(markup?: Markup, options?: Edge.SetOptions): this;
    /**
     * Translate the edge vertices (and source and target if they are points)
     * by `tx` pixels in the x-axis and `ty` pixels in the y-axis.
     */
    translate(tx: number, ty: number, options?: Cell.TranslateOptions): this;
    /**
     * Scales the edge's points (vertices) relative to the given origin.
     */
    scale(sx: number, sy: number, origin?: Point | Point.PointLike, options?: Edge.SetOptions): this;
    protected applyToPoints(worker: (p: Point.PointLike) => Point.PointLike, options?: Edge.SetOptions): this;
    getBBox(): import("../geometry").Rectangle;
    getConnectionPoint(): Point;
    getPolyline(): Polyline;
    updateParent(options?: Edge.SetOptions): Cell<Cell.Properties> | null;
    hasLoop(options?: {
        deep?: boolean;
    }): boolean;
    getFragmentAncestor(): Cell | null;
    isFragmentDescendantOf(cell: Cell): boolean;
}
export declare namespace Edge {
    type RouterData = Router.NativeItem | Router.ManaualItem;
    type ConnectorData = Connector.NativeItem | Connector.ManaualItem;
    type StrategyData = ConnectionStrategy.NativeItem | ConnectionStrategy.ManaualItem;
}
export declare namespace Edge {
    interface Common extends Cell.Common {
        source?: TerminalData;
        target?: TerminalData;
        router?: RouterData;
        connector?: ConnectorData;
        strategy?: StrategyData;
        labels?: Label[] | string[];
        defaultLabel?: Label;
        vertices?: (Point.PointLike | Point.PointData)[];
        toolMarkup?: Markup;
        doubleToolMarkup?: Markup;
        vertexMarkup?: Markup;
        arrowheadMarkup?: Markup;
        defaultMarkup?: Markup;
        defaultToolMarkup?: Markup;
        defaultDoubleToolMarkup?: Markup;
        defaultVertexMarkup?: Markup;
        defaultArrowheadMarkup?: Markup;
    }
    interface TerminalOptions {
        sourceCell?: Cell | string;
        sourcePort?: string;
        sourcePoint?: Point.PointLike | Point.PointData;
        targetCell?: Cell | string;
        targetPort?: string;
        targetPoint?: Point.PointLike | Point.PointData;
        source?: string | Cell | Point.PointLike | Point.PointData | TerminalPointData | TerminalCellLooseData;
        target?: string | Cell | Point.PointLike | Point.PointData | TerminalPointData | TerminalCellLooseData;
    }
    export interface BaseOptions extends Common, Cell.Metadata {
    }
    export interface Metadata extends Omit<BaseOptions, TerminalType>, TerminalOptions {
    }
    export interface Defaults extends Common, Cell.Defaults {
    }
    export interface Properties extends Cell.Properties, Omit<BaseOptions, 'tools'> {
    }
    export interface Config extends Omit<Defaults, TerminalType>, TerminalOptions, Cell.Config<Metadata, Edge> {
    }
    export {};
}
export declare namespace Edge {
    interface SetOptions extends Cell.SetOptions {
    }
    type TerminalType = 'source' | 'target';
    interface SetTerminalCommonArgs {
        selector?: string;
        magnet?: string;
        connectionPoint?: string | ConnectionPoint.NativeItem | ConnectionPoint.ManaualItem;
    }
    interface SetCellTerminalArgs extends SetTerminalCommonArgs {
        port?: string;
        priority?: boolean;
        anchor?: string | NodeAnchor.NativeItem | NodeAnchor.ManaualItem;
    }
    interface SetEdgeTerminalArgs extends SetTerminalCommonArgs {
        anchor?: string | EdgeAnchor.NativeItem | EdgeAnchor.ManaualItem;
    }
    interface TerminalPointData extends SetTerminalCommonArgs, Point.PointLike {
    }
    interface TerminalCellData extends SetCellTerminalArgs {
        cell: string;
        port?: string;
    }
    interface TerminalCellLooseData extends SetCellTerminalArgs {
        cell: string | Cell;
        port?: string;
    }
    type TerminalData = TerminalPointData | TerminalCellLooseData;
    function equalTerminals(a: TerminalData, b: TerminalData): boolean;
}
export declare namespace Edge {
    interface Label extends KeyValue {
        markup?: Markup;
        attrs?: Attr.CellAttrs;
        /**
         * If the distance is in the `[0,1]` range (inclusive), then the position
         * of the label is defined as a percentage of the total length of the edge
         * (the normalized length). For example, passing the number `0.5` positions
         * the label to the middle of the edge.
         *
         * If the distance is larger than `1` (exclusive), the label will be
         * positioned distance pixels away from the beginning of the path along
         * the edge.
         *
         * If the distance is a negative number, the label will be positioned
         * distance pixels away from the end of the path along the edge.
         */
        position?: LabelPosition;
        size?: Size;
    }
    interface LabelPositionOptions {
        /**
         * Forces absolute coordinates for distance.
         */
        absoluteDistance?: boolean;
        /**
         * Forces reverse absolute coordinates (if absoluteDistance = true)
         */
        reverseDistance?: boolean;
        /**
         * Forces absolute coordinates for offset.
         */
        absoluteOffset?: boolean;
        /**
         * Auto-adjusts the angle of the label to match path gradient at position.
         */
        keepGradient?: boolean;
        /**
         * Whether rotates labels so they are never upside-down.
         */
        ensureLegibility?: boolean;
    }
    interface LabelPositionObject {
        distance: number;
        offset?: number | {
            x?: number;
            y?: number;
        };
        angle?: number;
        options?: LabelPositionOptions;
    }
    type LabelPosition = number | LabelPositionObject;
    const defaultLabel: Label;
    function parseStringLabel(text: string): Label;
}
export declare namespace Edge {
    const toStringTag: string;
    function isEdge(instance: any): instance is Edge;
}
export declare namespace Edge {
    const registry: Registry<Definition, never, Config & {
        inherit?: string | Definition | undefined;
    }>;
}
export declare namespace Edge {
    type EdgeClass = typeof Edge;
    export interface Definition extends EdgeClass {
        new <T extends Properties = Properties>(metadata: T): Edge;
    }
    export function define(config: Config): Definition;
    export function create(options: Metadata): Edge<Properties>;
    export {};
}
export declare namespace Edge {
}
