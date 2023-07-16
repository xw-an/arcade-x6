/// <reference types="jquery" />
/// <reference types="jquery-mousewheel" />
import { NumberExt } from '../../util';
import { Point, Rectangle } from '../../geometry';
import { Model } from '../../model/model';
import { Cell } from '../../model/cell';
import { View } from '../../view/view';
import { Graph } from '../../graph';
import { EventArgs } from '../../graph/events';
import { TransformManager } from '../../graph/transform';
import { BackgroundManager } from '../../graph/background';
export declare class Scroller extends View {
    readonly options: Scroller.Options;
    readonly container: HTMLDivElement;
    readonly content: HTMLDivElement;
    readonly background: HTMLDivElement;
    readonly $container: JQuery<HTMLElement>;
    readonly backgroundManager: Scroller.Background;
    protected readonly $background: JQuery<HTMLElement>;
    protected readonly $content: JQuery<HTMLElement>;
    protected pageBreak: HTMLDivElement | null;
    get graph(): Graph;
    get model(): Model;
    protected sx: number;
    protected sy: number;
    protected clientX: number;
    protected clientY: number;
    protected padding: {
        left: number;
        top: number;
        right: number;
        bottom: number;
    };
    protected cachedScrollLeft: number | null;
    protected cachedScrollTop: number | null;
    protected cachedCenterPoint: Point.PointLike | null;
    protected cachedClientSize: {
        width: number;
        height: number;
    } | null;
    protected delegatedHandlers: {
        [name: string]: (...args: any) => any;
    };
    constructor(options: Scroller.Options);
    protected startListening(): void;
    protected stopListening(): void;
    enableAutoResize(): void;
    disableAutoResize(): void;
    protected onUpdate(): void;
    onBatchStop(args: {
        name: Model.BatchName;
    }): void;
    protected delegateBackgroundEvents(events?: View.Events): void;
    protected undelegateBackgroundEvents(): void;
    protected onBackgroundEvent(e: JQuery.TriggeredEvent): void;
    protected onRenderDone({ stats }: EventArgs['render:done']): void;
    protected onResize(): void;
    protected onScale({ sx, sy, ox, oy }: EventArgs['scale']): void;
    protected storeScrollPosition(): void;
    protected restoreScrollPosition(): void;
    protected storeClientSize(): void;
    protected restoreClientSize(): void;
    protected beforeManipulation(): void;
    protected afterManipulation(): void;
    updatePageSize(width?: number, height?: number): void;
    protected updatePageBreak(): void;
    update(): void;
    protected calcContextArea(resizeOptions: (TransformManager.FitToContentFullOptions & {
        direction?: Scroller.AutoResizeDirection | Scroller.AutoResizeDirection[];
    }) | undefined): Rectangle;
    protected getFitToContentOptions(options: TransformManager.FitToContentFullOptions): Graph.TransformManager.FitToContentFullOptions;
    protected updateScale(sx: number, sy: number): void;
    scrollbarPosition(): {
        left: number;
        top: number;
    };
    scrollbarPosition(left?: number, top?: number, options?: Scroller.ScrollOptions): this;
    /**
     * Try to scroll to ensure that the position (x,y) on the graph (in local
     * coordinates) is at the center of the viewport. If only one of the
     * coordinates is specified, only scroll in the specified dimension and
     * keep the other coordinate unchanged.
     */
    scrollToPoint(x: number | null | undefined, y: number | null | undefined, options?: Scroller.ScrollOptions): this;
    /**
     * Try to scroll to ensure that the center of graph content is at the
     * center of the viewport.
     */
    scrollToContent(options?: Scroller.ScrollOptions): this;
    /**
     * Try to scroll to ensure that the center of cell is at the center of
     * the viewport.
     */
    scrollToCell(cell: Cell, options?: Scroller.ScrollOptions): this;
    /**
     * The center methods are more aggressive than the scroll methods. These
     * methods position the graph so that a specific point on the graph lies
     * at the center of the viewport, adding paddings around the paper if
     * necessary (e.g. if the requested point lies in a corner of the paper).
     * This means that the requested point will always move into the center
     * of the viewport. (Use the scroll functions to avoid adding paddings
     * and only scroll the viewport as far as the graph boundary.)
     */
    /**
     * Position the center of graph to the center of the viewport.
     */
    center(optons?: Scroller.CenterOptions): this;
    /**
     * Position the point (x,y) on the graph (in local coordinates) to the
     * center of the viewport. If only one of the coordinates is specified,
     * only center along the specified dimension and keep the other coordinate
     * unchanged.
     */
    centerPoint(x: number, y: null | number, options?: Scroller.CenterOptions): this;
    centerPoint(x: null | number, y: number, options?: Scroller.CenterOptions): this;
    centerPoint(optons?: Scroller.CenterOptions): this;
    centerContent(options?: Scroller.PositionContentOptions): this;
    centerCell(cell: Cell, options?: Scroller.CenterOptions): this;
    /**
     * The position methods are a more general version of the center methods.
     * They position the graph so that a specific point on the graph lies at
     * requested coordinates inside the viewport.
     */
    /**
     *
     */
    positionContent(pos: Scroller.Direction, options?: Scroller.PositionContentOptions): this;
    positionCell(cell: Cell, pos: Scroller.Direction, options?: Scroller.CenterOptions): this;
    positionRect(rect: Rectangle.RectangleLike, pos: Scroller.Direction, options?: Scroller.CenterOptions): this;
    positionPoint(point: Point.PointLike, x: number | string, y: number | string, options?: Scroller.CenterOptions): this;
    zoom(): number;
    zoom(factor: number, options?: TransformManager.ZoomOptions): this;
    zoomToRect(rect: Rectangle.RectangleLike, options?: TransformManager.ScaleContentToFitOptions): this;
    zoomToFit(options?: TransformManager.GetContentAreaOptions & TransformManager.ScaleContentToFitOptions): this;
    transitionToPoint(p: Point.PointLike, options?: Scroller.TransitionOptions): this;
    transitionToPoint(x: number, y: number, options?: Scroller.TransitionOptions): this;
    protected syncTransition(scale: number, p: Point.PointLike): this;
    protected removeTransition(): this;
    transitionToRect(rectangle: Rectangle.RectangleLike, options?: Scroller.TransitionToRectOptions): this;
    startPanning(evt: JQuery.MouseDownEvent): void;
    pan(evt: JQuery.MouseMoveEvent): void;
    stopPanning(e: JQuery.MouseUpEvent): void;
    clientToLocalPoint(p: Point.PointLike): Point;
    clientToLocalPoint(x: number, y: number): Point;
    localToBackgroundPoint(p: Point.PointLike): Point;
    localToBackgroundPoint(x: number, y: number): Point;
    resize(width?: number, height?: number): void;
    getClientSize(): {
        width: number;
        height: number;
    };
    autoScroll(clientX: number, clientY: number): {
        scrollerX: number;
        scrollerY: number;
    };
    protected addPadding(left?: number, right?: number, top?: number, bottom?: number): this;
    protected getPadding(): {
        top: number;
        right: number;
        bottom: number;
        left: number;
    };
    /**
     * Returns the untransformed size and origin of the current viewport.
     */
    getVisibleArea(): Rectangle;
    isCellVisible(cell: Cell, options?: {
        strict?: boolean;
    }): boolean;
    isPointVisible(point: Point.PointLike): boolean;
    /**
     * Lock the current viewport by disabling user scrolling.
     */
    lock(): this;
    /**
     * Enable user scrolling if previously locked.
     */
    unlock(): this;
    protected onRemove(): void;
    dispose(): void;
}
export declare namespace Scroller {
    interface CommonOptions {
        className?: string;
        width?: number;
        height?: number;
        pageWidth?: number;
        pageHeight?: number;
        pageVisible?: boolean;
        pageBreak?: boolean;
        minVisibleWidth?: number;
        minVisibleHeight?: number;
        background?: false | BackgroundManager.Options;
        autoResize?: boolean;
        padding?: NumberExt.SideOptions | ((this: Scroller, scroller: Scroller) => NumberExt.SideOptions);
        /**
         * **Deprecation Notice:** Scroller option `fitTocontentOptions` is deprecated and will be
         * moved in next major release. Use `autoResizeOptions` instead.
         *
         * @deprecated
         */
        fitTocontentOptions?: (TransformManager.FitToContentFullOptions & {
            direction?: AutoResizeDirection | AutoResizeDirection[];
        }) | ((this: Scroller, scroller: Scroller) => TransformManager.FitToContentFullOptions & {
            direction?: AutoResizeDirection | AutoResizeDirection[];
        });
        autoResizeOptions?: (TransformManager.FitToContentFullOptions & {
            direction?: AutoResizeDirection | AutoResizeDirection[];
        }) | ((this: Scroller, scroller: Scroller) => TransformManager.FitToContentFullOptions & {
            direction?: AutoResizeDirection | AutoResizeDirection[];
        });
    }
    interface Options extends CommonOptions {
        graph: Graph;
    }
    interface ScrollOptions {
        animation?: JQuery.EffectsOptions<HTMLElement>;
    }
    interface CenterOptions extends ScrollOptions {
        padding?: NumberExt.SideOptions;
    }
    type PositionContentOptions = TransformManager.GetContentAreaOptions & Scroller.CenterOptions;
    type Direction = 'center' | 'top' | 'top-right' | 'top-left' | 'right' | 'bottom-right' | 'bottom' | 'bottom-left' | 'left';
    interface TransitionOptions {
        /**
         * The zoom level to reach at the end of the transition.
         */
        scale?: number;
        duration?: string;
        delay?: string;
        timing?: string;
        onTransitionEnd?: (this: Scroller, e: TransitionEvent) => void;
    }
    interface TransitionToRectOptions extends TransitionOptions {
        minScale?: number;
        maxScale?: number;
        scaleGrid?: number;
        visibility?: number;
        center?: Point.PointLike;
    }
    type AutoResizeDirection = 'top' | 'right' | 'bottom' | 'left';
}
export declare namespace Scroller {
    class Background extends BackgroundManager {
        protected readonly scroller: Scroller;
        protected get elem(): HTMLDivElement;
        constructor(scroller: Scroller);
        protected init(): void;
        protected updateBackgroundOptions(options?: BackgroundManager.Options): void;
    }
}
