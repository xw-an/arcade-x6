import { DeepPartial, Omit } from 'utility-types';
import { Size, KeyValue } from '../types';
import { Registry } from '../registry';
import { Point, Rectangle } from '../geometry';
import { NumberExt } from '../util';
import { Markup } from '../view/markup';
import { Cell } from './cell';
import { Edge } from './edge';
import { Store } from './store';
import { PortManager } from './port';
import { Animation } from './animation';
export declare class Node<Properties extends Node.Properties = Node.Properties> extends Cell<Properties> {
    protected static defaults: Node.Defaults;
    protected readonly store: Store<Node.Properties>;
    protected port: PortManager;
    protected get [Symbol.toStringTag](): string;
    constructor(metadata?: Node.Metadata);
    protected preprocess(metadata: Node.Metadata, ignoreIdCheck?: boolean): Properties;
    isNode(): this is Node;
    size(): Size;
    size(size: Size, options?: Node.ResizeOptions): this;
    size(width: number, height: number, options?: Node.ResizeOptions): this;
    getSize(): {
        width: number;
        height: number;
    };
    setSize(size: Size, options?: Node.ResizeOptions): this;
    setSize(width: number, height: number, options?: Node.ResizeOptions): this;
    resize(width: number, height: number, options?: Node.ResizeOptions): this;
    scale(sx: number, sy: number, origin?: Point.PointLike | null, options?: Node.SetOptions): this;
    position(x: number, y: number, options?: Node.SetPositionOptions): this;
    position(options?: Node.GetPositionOptions): Point.PointLike;
    getPosition(options?: Node.GetPositionOptions): Point.PointLike;
    setPosition(p: Point | Point.PointLike, options?: Node.SetPositionOptions): this;
    setPosition(x: number, y: number, options?: Node.SetPositionOptions): this;
    translate(tx?: number, ty?: number, options?: Node.TranslateOptions): this;
    angle(): number;
    angle(val: number, options?: Node.RotateOptions): this;
    getAngle(): number;
    rotate(angle: number, options?: Node.RotateOptions): this;
    getBBox(options?: {
        deep?: boolean;
    }): Rectangle;
    getConnectionPoint(edge: Edge, type: Edge.TerminalType): Point;
    /**
     * Sets cell's size and position based on the children bbox and given padding.
     */
    fit(options?: Node.FitEmbedsOptions): this;
    get portContainerMarkup(): Markup;
    set portContainerMarkup(markup: Markup);
    getDefaultPortContainerMarkup(): Markup;
    getPortContainerMarkup(): Markup;
    setPortContainerMarkup(markup?: Markup, options?: Node.SetOptions): this;
    get portMarkup(): Markup;
    set portMarkup(markup: Markup);
    getDefaultPortMarkup(): Markup;
    getPortMarkup(): Markup;
    setPortMarkup(markup?: Markup, options?: Node.SetOptions): this;
    get portLabelMarkup(): Markup;
    set portLabelMarkup(markup: Markup);
    getDefaultPortLabelMarkup(): Markup;
    getPortLabelMarkup(): Markup;
    setPortLabelMarkup(markup?: Markup, options?: Node.SetOptions): this;
    get ports(): PortManager.Metadata;
    getPorts(): PortManager.PortMetadata[];
    getPortsByGroup(groupName: string): PortManager.PortMetadata[];
    getPort(portId: string): PortManager.PortMetadata | undefined;
    getPortAt(index: number): PortManager.PortMetadata;
    hasPorts(): boolean;
    hasPort(portId: string): boolean;
    getPortIndex(port: PortManager.PortMetadata | string): number;
    getPortsPosition(groupName: string): KeyValue<{
        position: Point.PointLike;
        angle: number;
    }>;
    getPortProp(portId: string): PortManager.PortMetadata;
    getPortProp<T>(portId: string, path: string | string[]): T;
    setPortProp(portId: string, path: string | string[], value: any, options?: Node.SetOptions): this;
    setPortProp(portId: string, value: DeepPartial<PortManager.PortMetadata>, options?: Node.SetOptions): this;
    removePortProp(portId: string, options?: Node.SetOptions): this;
    removePortProp(portId: string, path: string | string[], options?: Node.SetOptions): this;
    portProp(portId: string): PortManager.PortMetadata;
    portProp<T>(portId: string, path: string | string[]): T;
    portProp(portId: string, path: string | string[], value: any, options?: Node.SetOptions): this;
    portProp(portId: string, value: DeepPartial<PortManager.PortMetadata>, options?: Node.SetOptions): this;
    protected prefixPortPath(portId: string, path?: string | string[]): string | string[];
    addPort(port: PortManager.PortMetadata, options?: Node.SetOptions): this;
    addPorts(ports: PortManager.PortMetadata[], options?: Node.SetOptions): this;
    insertPort(index: number, port: PortManager.PortMetadata, options?: Node.SetOptions): this;
    removePort(port: PortManager.PortMetadata | string, options?: Node.SetOptions): this;
    removePortAt(index: number, options?: Node.SetOptions): this;
    removePorts(options?: Node.SetOptions): this;
    removePorts(portsForRemoval: (PortManager.PortMetadata | string)[], options?: Node.SetOptions): this;
    getParsedPorts(): PortManager.Port[];
    getParsedGroups(): {
        [name: string]: PortManager.Group;
    };
    getPortsLayoutByGroup(groupName: string | undefined, bbox: Rectangle): PortManager.LayoutResult[];
    protected initPorts(): void;
    protected processRemovedPort(): void;
    protected validatePorts(): string[];
    protected generatePortId(): string;
    protected updatePortData(): void;
}
export declare namespace Node {
    interface Common extends Cell.Common {
        size?: {
            width: number;
            height: number;
        };
        position?: {
            x: number;
            y: number;
        };
        angle?: number;
        ports?: Partial<PortManager.Metadata> | PortManager.PortMetadata[];
        portContainerMarkup?: Markup;
        portMarkup?: Markup;
        portLabelMarkup?: Markup;
        defaultPortMarkup?: Markup;
        defaultPortLabelMarkup?: Markup;
        defaultPortContainerMarkup?: Markup;
    }
    interface Boundary {
        x?: number;
        y?: number;
        width?: number;
        height?: number;
    }
    export interface Defaults extends Common, Cell.Defaults {
    }
    export interface Metadata extends Common, Cell.Metadata, Boundary {
    }
    export interface Properties extends Common, Omit<Cell.Metadata, 'tools'>, Cell.Properties {
    }
    export interface Config extends Defaults, Boundary, Cell.Config<Metadata, Node> {
    }
    export {};
}
export declare namespace Node {
    interface SetOptions extends Cell.SetOptions {
    }
    interface GetPositionOptions {
        relative?: boolean;
    }
    interface SetPositionOptions extends SetOptions {
        deep?: boolean;
        relative?: boolean;
    }
    interface TranslateOptions extends Cell.TranslateOptions {
        transition?: boolean | Animation.StartOptions<Point.PointLike>;
        restrict?: Rectangle.RectangleLike | null;
        exclude?: Cell[];
    }
    interface RotateOptions extends SetOptions {
        absolute?: boolean;
        center?: Point.PointLike | null;
    }
    type ResizeDirection = 'left' | 'top' | 'right' | 'bottom' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
    interface ResizeOptions extends SetOptions {
        absolute?: boolean;
        direction?: ResizeDirection;
    }
    interface FitEmbedsOptions extends SetOptions {
        deep?: boolean;
        padding?: NumberExt.SideOptions;
    }
}
export declare namespace Node {
    const toStringTag: string;
    function isNode(instance: any): instance is Node;
}
export declare namespace Node {
}
export declare namespace Node {
    const registry: Registry<Definition, never, Config & {
        inherit?: string | Definition | undefined;
    }>;
}
export declare namespace Node {
    type NodeClass = typeof Node;
    export interface Definition extends NodeClass {
        new <T extends Properties = Properties>(metadata: T): Node;
    }
    export function define(config: Config): typeof Node;
    export function create(options: Metadata): Node<Properties>;
    export {};
}
