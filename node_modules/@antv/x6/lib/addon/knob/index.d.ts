/// <reference types="jquery" />
import { Widget } from '../common';
import { KeyValue } from '../../types';
import { Cell } from '../../model/cell';
import { Node } from '../../model/node';
import { Graph } from '../../graph/graph';
import { Point } from '../../geometry';
export declare class Knob extends Widget<Knob.Options> {
    container: HTMLDivElement;
    protected get node(): Node<Node.Properties>;
    protected get metadata(): Knob.Metadata | null;
    protected init(options: Knob.Options): void;
    protected startListening(): void;
    protected stopListening(): void;
    render(): this;
    remove(): this;
    protected update(): void;
    protected hide(): void;
    protected show(): void;
    protected onTransform(): void;
    protected onTransformed(): void;
    protected onKnobMouseDown({ knob }: {
        knob: Knob;
    }): void;
    protected onKnobMouseUp(): void;
    protected notify(name: string, evt: JQuery.TriggeredEvent): void;
    protected onMouseDown(e: JQuery.MouseDownEvent): void;
    protected onMouseMove(e: JQuery.MouseMoveEvent): void;
    protected onMouseUp(e: JQuery.MouseUpEvent): void;
}
export declare namespace Knob {
    export interface Options extends Widget.Options {
        className?: string;
        index?: number;
    }
    interface UpdateArgs {
        cell: Cell;
        node: Node;
        knob: Knob;
    }
    interface HandlerArgs<T> extends UpdateArgs {
        e: T;
        data: EventData.Knob;
    }
    export interface Metadata {
        enabled?: boolean | ((this: Graph, node: Node) => boolean);
        update?: (this: Graph, args: UpdateArgs) => void;
        position?: (this: Graph, args: UpdateArgs) => Point.PointLike;
        onMouseDown?: (this: Graph, args: HandlerArgs<JQuery.MouseDownEvent>) => void;
        onMouseMove?: (this: Graph, args: HandlerArgs<JQuery.MouseMoveEvent> & {
            deltaX: number;
            deltaY: number;
        }) => void;
        onMouseUp?: (this: Graph, args: HandlerArgs<JQuery.MouseUpEvent>) => void;
    }
    export {};
}
declare namespace EventData {
    interface Knob extends KeyValue {
        knobbing: boolean;
        originX: number;
        originY: number;
        clientX: number;
        clientY: number;
    }
}
export {};
