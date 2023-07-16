/// <reference types="jquery" />
import { Point } from '../../geometry';
import { Graph } from '../../graph';
import { View } from '../../view/view';
import { EdgeView } from '../../view/edge';
import { Edge } from '../../model/edge';
import { ToolsView } from '../../view/tool';
import { Attr } from '../attr';
export declare class Vertices extends ToolsView.ToolItem<EdgeView, Vertices.Options> {
    protected handles: Vertices.Handle[];
    protected get vertices(): any[];
    protected onRender(): this;
    update(): this;
    protected resetHandles(): void;
    protected renderHandles(): void;
    protected updateHandles(): void;
    protected updatePath(): void;
    protected startHandleListening(handle: Vertices.Handle): void;
    protected stopHandleListening(handle: Vertices.Handle): void;
    protected getNeighborPoints(index: number): {
        prev: Point;
        next: Point;
    };
    protected getMouseEventArgs<T extends JQuery.TriggeredEvent>(evt: T): {
        e: T;
        x: number;
        y: number;
    };
    protected onHandleChange({ e }: Vertices.Handle.EventArgs['change']): void;
    protected onHandleChanging({ handle, e, }: Vertices.Handle.EventArgs['changing']): void;
    protected onHandleChanged({ e }: Vertices.Handle.EventArgs['changed']): void;
    protected snapVertex(vertex: Point.PointLike, index: number): void;
    protected onHandleRemove({ handle, e }: Vertices.Handle.EventArgs['remove']): void;
    protected onPathMouseDown(evt: JQuery.MouseDownEvent): void;
    protected onRemove(): void;
}
export declare namespace Vertices {
    interface Options extends ToolsView.ToolItem.Options {
        snapRadius?: number;
        addable?: boolean;
        removable?: boolean;
        removeRedundancies?: boolean;
        stopPropagation?: boolean;
        attrs?: Attr.SimpleAttrs | ((handle: Handle) => Attr.SimpleAttrs);
        createHandle?: (options: Handle.Options) => Handle;
        processHandle?: (handle: Handle) => void;
        onChanged?: (options: {
            edge: Edge;
            edgeView: EdgeView;
        }) => void;
    }
}
export declare namespace Vertices {
    class Handle extends View<Handle.EventArgs> {
        readonly options: Handle.Options;
        protected get graph(): Graph;
        constructor(options: Handle.Options);
        render(): void;
        updatePosition(x: number, y: number): void;
        onMouseDown(evt: JQuery.MouseDownEvent): void;
        protected onMouseMove(evt: JQuery.MouseMoveEvent): void;
        protected onMouseUp(evt: JQuery.MouseUpEvent): void;
        protected onDoubleClick(evt: JQuery.DoubleClickEvent): void;
    }
    namespace Handle {
        interface Options {
            graph: Graph;
            index: number;
            guard: (evt: JQuery.TriggeredEvent) => boolean;
            attrs: Attr.SimpleAttrs | ((handle: Handle) => Attr.SimpleAttrs);
        }
        interface EventArgs {
            change: {
                e: JQuery.MouseDownEvent;
                handle: Handle;
            };
            changing: {
                e: JQuery.MouseMoveEvent;
                handle: Handle;
            };
            changed: {
                e: JQuery.MouseUpEvent;
                handle: Handle;
            };
            remove: {
                e: JQuery.DoubleClickEvent;
                handle: Handle;
            };
        }
    }
}
export declare namespace Vertices {
}
