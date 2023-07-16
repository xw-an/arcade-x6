import { Node } from '../model/node';
export declare class Base<Properties extends Node.Properties = Node.Properties> extends Node<Properties> {
    get label(): string | undefined | null;
    set label(val: string | undefined | null);
    getLabel(): string;
    setLabel(label?: string | null, options?: Node.SetOptions): this;
    removeLabel(): this;
}
export declare namespace Base {
    const bodyAttr: {
        fill: string;
        stroke: string;
        strokeWidth: number;
    };
    const labelAttr: {
        fontSize: number;
        fill: string;
        refX: number;
        refY: number;
        textAnchor: string;
        textVerticalAnchor: string;
        fontFamily: string;
    };
}
