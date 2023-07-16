/// <reference types="jquery" />
/// <reference types="jquery-mousewheel" />
import { KeyValue } from '../types';
import { Point, Rectangle } from '../geometry';
import { Cell, Edge, Model } from '../model';
import { View, CellView } from '../view';
import { Graph } from './graph';
import { Base } from './base';
export declare class Renderer extends Base {
    protected views: KeyValue<CellView>;
    protected zPivots: KeyValue<Comment>;
    protected updates: Renderer.Updates;
    protected init(): void;
    protected startListening(): void;
    protected stopListening(): void;
    protected resetUpdates(): void;
    protected onSortModel(): void;
    protected onModelReseted({ options }: Model.EventArgs['reseted']): void;
    protected onBatchStop({ name, data }: Model.EventArgs['batch:stop']): void;
    protected onCellAdded({ cell, options }: Model.EventArgs['cell:added']): void;
    protected onCellRemoved({ cell, options }: Model.EventArgs['cell:removed']): void;
    protected onCellZIndexChanged({ cell, options, }: Model.EventArgs['cell:change:zIndex']): void;
    protected onCellVisibleChanged({ cell, current: visible, options, }: Model.EventArgs['cell:change:visible']): void;
    protected processEdgeOnTerminalVisibleChanged(node: Cell, visible: boolean): void;
    protected isEdgeTerminalVisible(edge: Edge, terminal: Edge.TerminalType): boolean;
    requestConnectedEdgesUpdate(view: CellView, options?: Renderer.RequestViewUpdateOptions): void;
    forcePostponedViewUpdate(view: CellView, flag: number): boolean;
    scheduleViewUpdate(view: View, flag: number, priority: number, options?: Renderer.RequestViewUpdateOptions): void;
    requestViewUpdate(view: CellView, flag: number, priority: number, options?: Renderer.RequestViewUpdateOptions): void;
    /**
     * Adds view into the DOM and update it.
     */
    dumpView(view: CellView, options?: any): number;
    /**
     * Adds all views into the DOM and update them.
     */
    dumpViews(options?: Renderer.UpdateViewOptions): void;
    /**
     * Ensure the view associated with the cell is attached
     * to the DOM and updated.
     */
    requireView(cell: Cell, options?: any): CellView<Cell<Cell.Properties>, CellView.Options> | null;
    updateView(view: View, flag: number, options?: any): number;
    updateViews(options?: Renderer.UpdateViewOptions): {
        priority: number;
        batchCount: number;
        updatedCount: number;
    };
    protected updateViewsBatch(options?: Renderer.UpdateViewOptions): {
        empty: boolean;
        priority: number;
        mountedCount: number;
        unmountedCount: number;
        updatedCount: number;
        postponedCount: number;
    };
    protected updateViewsAsync(options?: Renderer.UpdateViewsAsyncOptions, data?: {
        processed: number;
        priority: number;
    }): void;
    protected registerMountedView(view: View): number;
    protected registerUnmountedView(view: View): number;
    isViewMounted(view: CellView): boolean;
    getMountedViews(): View<any>[];
    getUnmountedViews(): View<any>[];
    protected checkMountedViews(viewportFn?: Renderer.CheckViewFn | null, batchSize?: number): number;
    protected checkUnmountedViews(checkView?: Renderer.CheckViewFn | null, batchSize?: number): number;
    protected checkViewImpl(options?: Renderer.CheckViewOptions & {
        mountedBatchSize?: number;
        unmountedBatchSize?: number;
    }): {
        mountedCount: number;
        unmountedCount: number;
    };
    /**
     * Determine every view in the graph should be attached/detached.
     */
    protected checkView(options?: Renderer.CheckViewOptions): {
        mountedCount: number;
        unmountedCount: number;
    };
    isFrozen(): boolean;
    /**
     * Freeze the graph then the graph does not automatically re-render upon
     * changes in the graph. This is useful when adding large numbers of cells.
     */
    freeze(options?: Renderer.FreezeOptions): void;
    unfreeze(options?: Renderer.UnfreezeOptions): void;
    isAsync(): boolean;
    setAsync(async: boolean): void;
    protected onRemove(): void;
    protected resetViews(cells?: Cell[], options?: any): void;
    protected removeView(cell: Cell): CellView<Cell<Cell.Properties>, CellView.Options>;
    protected removeViews(): void;
    protected renderView(cell: Cell, options?: any): void;
    protected isExactSorting(): boolean;
    sortViews(): void;
    protected sortElements(elems: Element[], comparator: (a: Element, b: Element) => number): void;
    sortViewsExact(): void;
    protected addZPivot(zIndex?: number): Comment;
    protected removeZPivots(): void;
    insertView(view: CellView): void;
    findViewByCell(cellId: string | number): CellView | null;
    findViewByCell(cell: Cell | null): CellView | null;
    findViewByElem(elem: string | JQuery | Element | undefined | null): CellView<Cell<Cell.Properties>, CellView.Options> | null;
    findViewsFromPoint(p: Point.PointLike): CellView<Cell<Cell.Properties>, CellView.Options>[];
    findEdgeViewsInArea(rect: Rectangle.RectangleLike, options?: Renderer.FindViewsInAreaOptions): CellView<Cell<Cell.Properties>, CellView.Options>[];
    findViewsInArea(rect: Rectangle.RectangleLike, options?: Renderer.FindViewsInAreaOptions): CellView<Cell<Cell.Properties>, CellView.Options>[];
    dispose(): void;
}
export declare namespace Renderer {
    interface Updates {
        priorities: KeyValue<number>[];
        mounted: KeyValue<boolean>;
        unmounted: KeyValue<number>;
        mountedCids: string[];
        unmountedCids: string[];
        animationId: number | null;
        count: number;
        sort: boolean;
        /**
         * The last frozen state of graph.
         */
        frozen: boolean;
        /**
         * The current freeze key of graph.
         */
        freezeKey: string | null;
    }
    type CheckViewFn = (this: Graph, args: {
        view: CellView;
        unmounted: boolean;
    }) => boolean;
    interface CheckViewOptions {
        /**
         * Callback function to determine whether a given view
         * should be added to the DOM.
         */
        checkView?: CheckViewFn;
    }
    interface UpdateViewOptions extends CheckViewOptions {
        /**
         * For async graph, how many views should there be per
         * one asynchronous process?
         */
        batchSize?: number;
    }
    interface RequestViewUpdateOptions extends UpdateViewOptions, Cell.SetOptions {
        async?: boolean;
    }
    interface UpdateViewsAsyncOptions extends UpdateViewOptions {
        before?: (this: Graph, graph: Graph) => void;
        after?: (this: Graph, graph: Graph) => void;
        /**
         * Callback function that is called whenever a batch is
         * finished processing.
         */
        progress?: (this: Graph, args: {
            done: boolean;
            current: number;
            total: number;
        }) => void;
    }
    interface FreezeOptions {
        key?: string;
    }
    interface UnfreezeOptions extends FreezeOptions, UpdateViewsAsyncOptions {
    }
    interface FindViewsInAreaOptions {
        strict?: boolean;
    }
}
export declare namespace Renderer {
    const FLAG_INSERT: number;
    const FLAG_REMOVE: number;
    const MOUNT_BATCH_SIZE = 1000;
    const UPDATE_BATCH_SIZE = 1000;
    const MIN_PRIORITY = 2;
    const SORT_DELAYING_BATCHES: Model.BatchName[];
    const UPDATE_DELAYING_BATCHES: Model.BatchName[];
}
