/// <reference types="jquery" />
import { Point } from '../../geometry';
import { Graph } from '../../graph';
import { Edge } from '../../model/edge';
import { View } from '../../view/view';
import { CellView } from '../../view/cell';
import { EdgeView } from '../../view/edge';
import { ToolsView } from '../../view/tool';
import { Attr } from '../attr';
export declare class Segments extends ToolsView.ToolItem<EdgeView, Segments.Options> {
    protected handles: Segments.Handle[];
    protected get vertices(): any[];
    update(): this;
    protected onRender(): this;
    protected renderHandle(vertex: Point.PointLike, nextVertex: Point.PointLike, index: number): Segments.Handle;
    protected startHandleListening(handle: Segments.Handle): void;
    protected stopHandleListening(handle: Segments.Handle): void;
    protected resetHandles(): void;
    protected shiftHandleIndexes(delta: number): void;
    protected resetAnchor(type: Edge.TerminalType, anchor: Edge.TerminalCellData['anchor']): void;
    protected snapHandle(handle: Segments.Handle, position: Point.PointLike, data: Segments.EventData): Point.PointLike;
    protected onHandleChanging({ handle, e, }: Segments.Handle.EventArgs['changing']): void;
    protected onHandleChange({ handle, e }: Segments.Handle.EventArgs['change']): void;
    protected onHandleChanged({ e }: Segments.Handle.EventArgs['changed']): void;
    protected updateHandle(handle: Segments.Handle, vertex: Point.PointLike, nextVertex: Point.PointLike, offset?: number): void;
    protected onRemove(): void;
}
export declare namespace Segments {
    interface Options extends ToolsView.ToolItem.Options {
        threshold: number;
        precision?: number;
        snapRadius: number;
        stopPropagation: boolean;
        removeRedundancies: boolean;
        attrs: Attr.SimpleAttrs | ((handle: Handle) => Attr.SimpleAttrs);
        anchor?: (this: EdgeView, pos: Point, terminalView: CellView, terminalMagnet: Element | null, terminalType: Edge.TerminalType, edgeView: EdgeView, toolView: Segments) => Edge.TerminalCellData['anchor'];
        createHandle?: (options: Handle.Options) => Handle;
        processHandle?: (handle: Handle) => void;
        onChanged?: (options: {
            edge: Edge;
            edgeView: EdgeView;
        }) => void;
    }
    interface EventData {
        sourceAnchor: Point;
        targetAnchor: Point;
        sourceAnchorDef: Edge.TerminalCellData['anchor'];
        targetAnchorDef: Edge.TerminalCellData['anchor'];
    }
}
export declare namespace Segments {
    class Handle extends View<Handle.EventArgs> {
        options: Handle.Options;
        container: SVGRectElement;
        constructor(options: Handle.Options);
        render(): void;
        updatePosition(x: number, y: number, angle: number, view: EdgeView): void;
        protected onMouseDown(evt: JQuery.MouseDownEvent): void;
        protected onMouseMove(evt: JQuery.MouseMoveEvent): void;
        protected onMouseUp(evt: JQuery.MouseUpEvent): void;
        show(): void;
        hide(): void;
    }
    namespace Handle {
        interface Options {
            graph: Graph;
            guard: (evt: JQuery.TriggeredEvent) => boolean;
            attrs: Attr.SimpleAttrs | ((handle: Handle) => Attr.SimpleAttrs);
            index?: number;
            axis?: 'x' | 'y';
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
        }
    }
}
export declare namespace Segments {
}
