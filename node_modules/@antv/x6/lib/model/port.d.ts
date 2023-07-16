import { Attr, PortLayout, PortLabelLayout } from '../registry';
import { JSONObject } from '../util';
import { Point, Rectangle } from '../geometry';
import { Size, KeyValue } from '../types';
import { Markup } from '../view';
export declare class PortManager {
    ports: PortManager.Port[];
    groups: {
        [name: string]: PortManager.Group;
    };
    constructor(data: PortManager.Metadata);
    getPorts(): PortManager.Port[];
    getGroup(groupName?: string | null): PortManager.Group | null;
    getPortsByGroup(groupName?: string): PortManager.Port[];
    getPortsLayoutByGroup(groupName: string | undefined, elemBBox: Rectangle): PortManager.LayoutResult[];
    protected init(data: PortManager.Metadata): void;
    protected parseGroup(group: PortManager.GroupMetadata): PortManager.Group;
    protected parsePort(port: PortManager.PortMetadata): PortManager.Port;
    protected getZIndex(group: PortManager.Group, port: PortManager.PortMetadata): number | "auto";
    protected createPosition(group: PortManager.Group, port: PortManager.PortMetadata): PortManager.PortPosition;
    protected getPortPosition(position?: PortManager.PortPositionMetadata, setDefault?: boolean): PortManager.PortPosition;
    protected getPortLabelPosition(position?: PortManager.PortLabelPositionMetadata, setDefault?: boolean): PortManager.PortLabelPosition;
    protected getLabel(item: PortManager.GroupMetadata, setDefaults?: boolean): PortManager.Label;
    protected getPortLabelLayout(port: PortManager.Port, portPosition: Point, elemBBox: Rectangle): PortLabelLayout.Result | null;
}
export declare namespace PortManager {
    export interface Metadata {
        groups?: {
            [name: string]: GroupMetadata;
        };
        items: PortMetadata[];
    }
    export type PortPosition = Partial<PortLayout.NativeItem> | Partial<PortLayout.ManaualItem>;
    export type PortPositionMetadata = PortLayout.NativeNames | Exclude<string, PortLayout.NativeNames> | Point.PointData | PortPosition;
    export type PortLabelPosition = Partial<PortLabelLayout.NativeItem> | Partial<PortLabelLayout.ManaualItem>;
    export type PortLabelPositionMetadata = PortLabelLayout.NativeNames | Exclude<string, PortLabelLayout.NativeNames> | PortLabelPosition;
    export interface LabelMetadata {
        markup?: Markup;
        size?: Size;
        position?: PortLabelPositionMetadata;
    }
    export interface Label {
        markup: string;
        size?: Size;
        position: PortLabelPosition;
    }
    interface Common {
        markup: Markup;
        attrs: Attr.CellAttrs;
        zIndex: number | 'auto';
        size?: Size;
    }
    export interface GroupMetadata extends Partial<Common>, KeyValue {
        label?: LabelMetadata;
        position?: PortPositionMetadata;
    }
    export interface Group extends Partial<Common> {
        label: Label;
        position: PortPosition;
    }
    interface PortBase {
        group?: string;
        /**
         * Arguments for the port layout function.
         */
        args?: JSONObject;
    }
    export interface PortMetadata extends Partial<Common>, PortBase, KeyValue {
        id?: string;
        label?: LabelMetadata;
    }
    export interface Port extends Group, PortBase {
        id: string;
    }
    export interface LayoutResult {
        portId: string;
        portAttrs?: Attr.CellAttrs;
        portSize?: Size;
        portLayout: PortLayout.Result;
        labelSize?: Size;
        labelLayout: PortLabelLayout.Result | null;
    }
    export {};
}
