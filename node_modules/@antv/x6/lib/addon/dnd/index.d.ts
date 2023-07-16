/// <reference types="jquery" />
/// <reference types="jquery-mousewheel" />
import { Rectangle, Point } from '../../geometry';
import { Cell } from '../../model/cell';
import { Node } from '../../model/node';
import { View } from '../../view/view';
import { NodeView } from '../../view/node';
import { Graph } from '../../graph/graph';
import { Scroller } from '../scroller';
export declare class Dnd extends View {
    readonly options: Dnd.Options;
    readonly draggingGraph: Graph;
    protected readonly $container: JQuery<HTMLDivElement>;
    protected sourceNode: Node | null;
    protected draggingNode: Node | null;
    protected draggingView: NodeView | null;
    protected draggingBBox: Rectangle;
    protected geometryBBox: Rectangle;
    protected candidateEmbedView: NodeView | null;
    protected delta: Point | null;
    protected padding: number | null;
    protected snapOffset: Point.PointLike | null;
    protected originOffset: null | {
        left: number;
        top: number;
    };
    protected get targetScroller(): Scroller | null;
    protected get targetGraph(): Graph;
    protected get targetModel(): import("../..").Model;
    protected get snapline(): import("..").Snapline;
    constructor(options: Partial<Dnd.Options> & {
        target: Graph | Scroller;
    });
    start(node: Node, evt: JQuery.MouseDownEvent | MouseEvent): void;
    protected isSnaplineEnabled(): boolean;
    protected prepareDragging(sourceNode: Node, clientX: number, clientY: number): void;
    protected updateGraphPosition(clientX: number, clientY: number): {
        left: number;
        top: number;
    };
    protected updateNodePosition(x: number, y: number): Point;
    protected snap({ cell, current, options, }: Cell.EventArgs['change:position']): void;
    protected onDragging(evt: JQuery.MouseMoveEvent): void;
    protected onDragEnd(evt: JQuery.MouseUpEvent): void;
    protected clearDragging(): void;
    protected onDropped(draggingNode: Node): void;
    protected onDropInvalid(): void;
    protected isInsideValidArea(p: Point.PointLike): boolean;
    protected getDropArea(elem: Element): Rectangle;
    protected drop(draggingNode: Node, pos: Point.PointLike): Node<Node.Properties> | Promise<Node<Node.Properties> | null> | null;
    protected onRemove(): void;
    dispose(): void;
}
export declare namespace Dnd {
    interface Options {
        target: Graph | Scroller;
        /**
         * Should scale the dragging node or not.
         */
        scaled?: boolean;
        delegateGraphOptions?: Graph.Options;
        animation?: boolean | {
            duration?: number;
            easing?: string;
        };
        draggingContainer?: HTMLElement;
        /**
         * dnd tool box container.
         */
        dndContainer?: HTMLElement;
        getDragNode: (sourceNode: Node, options: GetDragNodeOptions) => Node;
        getDropNode: (draggingNode: Node, options: GetDropNodeOptions) => Node;
        validateNode?: (droppingNode: Node, options: ValidateNodeOptions) => boolean | Promise<boolean>;
    }
    interface GetDragNodeOptions {
        sourceNode: Node;
        targetGraph: Graph;
        draggingGraph: Graph;
    }
    interface GetDropNodeOptions extends GetDragNodeOptions {
        draggingNode: Node;
    }
    interface ValidateNodeOptions extends GetDropNodeOptions {
        droppingNode: Node;
    }
    const defaults: Partial<Options>;
    const documentEvents: {
        mousemove: string;
        touchmove: string;
        mouseup: string;
        touchend: string;
        touchcancel: string;
    };
}
