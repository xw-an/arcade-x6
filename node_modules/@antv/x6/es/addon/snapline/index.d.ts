import { IDisablable } from '../../common';
import { Point } from '../../geometry';
import { Graph } from '../../graph';
import { EventArgs } from '../../graph/events';
import { Model } from '../../model/model';
import { Node } from '../../model/node';
import { Vector } from '../../util/vector';
import { CellView } from '../../view/cell';
import { View } from '../../view/view';
export declare class Snapline extends View implements IDisablable {
    readonly options: Snapline.Options;
    protected readonly graph: Graph;
    protected filterShapes: {
        [type: string]: boolean;
    };
    protected filterCells: {
        [id: string]: boolean;
    };
    protected filterFunction: Snapline.FilterFunction | null;
    protected offset: Point.PointLike;
    protected timer: number | null;
    container: SVGElement;
    protected containerWrapper: Vector;
    protected horizontal: Vector;
    protected vertical: Vector;
    protected get model(): Model;
    protected get containerClassName(): string;
    protected get verticalClassName(): string;
    protected get horizontalClassName(): string;
    constructor(options: Snapline.Options & {
        graph: Graph;
    });
    get disabled(): boolean;
    enable(): void;
    disable(): void;
    setFilter(filter?: Snapline.Filter): void;
    protected render(): void;
    protected startListening(): void;
    protected stopListening(): void;
    protected parseFilter(): void;
    protected onBatchStop({ name, data }: Model.EventArgs['batch:stop']): void;
    captureCursorOffset({ view, x, y }: EventArgs['node:mousedown']): void;
    protected isNodeMovable(view: CellView): boolean;
    protected snapOnResizing(node: Node, options: Node.ResizeOptions): void;
    snapOnMoving({ view, e, x, y }: EventArgs['node:mousemove']): void;
    protected isIgnored(snapNode: Node, targetNode: Node): boolean | null;
    protected update(metadata: {
        verticalLeft?: number;
        verticalTop?: number;
        verticalHeight?: number;
        horizontalTop?: number;
        horizontalLeft?: number;
        horizontalWidth?: number;
    }): void;
    protected resetTimer(): void;
    show(): this;
    hide(): this;
    protected onRemove(): void;
    dispose(): void;
}
export declare namespace Snapline {
    interface Options {
        enabled?: boolean;
        className?: string;
        tolerance?: number;
        sharp?: boolean;
        /**
         * Specify if snap on node resizing or not.
         */
        resizing?: boolean;
        clean?: boolean | number;
        filter?: Filter;
    }
    type Filter = null | (string | {
        id: string;
    })[] | FilterFunction;
    type FilterFunction = (this: Graph, node: Node) => boolean;
}
