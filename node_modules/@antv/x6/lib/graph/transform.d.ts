import { Dom, NumberExt } from '../util';
import { Point, Rectangle } from '../geometry';
import { Transform } from '../addon/transform';
import { Node } from '../model/node';
import { Cell } from '../model/cell';
import { EventArgs } from './events';
import { Base } from './base';
export declare class TransformManager extends Base {
    protected widgets: Map<Node, Transform>;
    protected viewportMatrix: DOMMatrix | null;
    protected viewportTransformString: string | null;
    protected get container(): HTMLElement;
    protected get viewport(): SVGGElement;
    protected get isSelectionEnabled(): boolean;
    protected init(): void;
    protected startListening(): void;
    protected stopListening(): void;
    protected onNodeMouseUp({ node }: EventArgs['node:mouseup']): void;
    protected onNodeSelected({ node }: EventArgs['node:selected']): void;
    protected onNodeUnSelected({ node }: EventArgs['node:unselected']): void;
    /**
     * Returns the current transformation matrix of the graph.
     */
    getMatrix(): DOMMatrix;
    /**
     * Sets new transformation with the given `matrix`
     */
    setMatrix(matrix: DOMMatrix | Dom.MatrixLike | null): void;
    resize(width?: number, height?: number): this;
    getComputedSize(): {
        width: number;
        height: number;
    };
    getScale(): Dom.Scale;
    scale(sx: number, sy?: number, ox?: number, oy?: number, options?: TransformManager.TransformOptions): this;
    clampScale(scale: number): number;
    getZoom(): number;
    zoom(factor: number, options?: TransformManager.ZoomOptions & TransformManager.TransformOptions): this;
    getRotation(): Dom.Rotation;
    rotate(angle: number, cx?: number, cy?: number): this;
    getTranslation(): Dom.Translation;
    translate(tx: number, ty: number, options?: TransformManager.TransformOptions): this;
    setOrigin(ox?: number, oy?: number): this;
    fitToContent(gridWidth?: number | TransformManager.FitToContentFullOptions, gridHeight?: number, padding?: NumberExt.SideOptions, options?: TransformManager.FitToContentOptions): Rectangle;
    scaleContentToFit(options?: TransformManager.ScaleContentToFitOptions): void;
    scaleContentToFitImpl(options?: TransformManager.ScaleContentToFitOptions, translate?: boolean): void;
    getContentArea(options?: TransformManager.GetContentAreaOptions): Rectangle;
    getContentBBox(options?: TransformManager.GetContentAreaOptions): Rectangle;
    getGraphArea(): Rectangle;
    zoomToRect(rect: Rectangle.RectangleLike, options?: TransformManager.ScaleContentToFitOptions): this;
    zoomToFit(options?: TransformManager.GetContentAreaOptions & TransformManager.ScaleContentToFitOptions): this;
    centerPoint(x?: number, y?: number): void;
    centerContent(options?: TransformManager.GetContentAreaOptions): void;
    centerCell(cell: Cell): void | this;
    positionPoint(point: Point.PointLike, x: number | string, y: number | string): void;
    positionRect(rect: Rectangle.RectangleLike, pos: TransformManager.Direction): void | this;
    positionCell(cell: Cell, pos: TransformManager.Direction): void | this;
    positionContent(pos: TransformManager.Direction, options?: TransformManager.GetContentAreaOptions): void | this;
    dispose(): void;
}
export declare namespace TransformManager {
    interface TransformOptions {
        ui?: boolean;
    }
    interface FitToContentOptions extends GetContentAreaOptions {
        minWidth?: number;
        minHeight?: number;
        maxWidth?: number;
        maxHeight?: number;
        contentArea?: Rectangle | Rectangle.RectangleLike;
        border?: number;
        allowNewOrigin?: 'negative' | 'positive' | 'any';
    }
    interface FitToContentFullOptions extends FitToContentOptions {
        gridWidth?: number;
        gridHeight?: number;
        padding?: NumberExt.SideOptions;
    }
    interface ScaleContentToFitOptions extends GetContentAreaOptions {
        padding?: NumberExt.SideOptions;
        minScale?: number;
        maxScale?: number;
        minScaleX?: number;
        minScaleY?: number;
        maxScaleX?: number;
        maxScaleY?: number;
        scaleGrid?: number;
        contentArea?: Rectangle.RectangleLike;
        viewportArea?: Rectangle.RectangleLike;
        preserveAspectRatio?: boolean;
    }
    interface GetContentAreaOptions {
        useCellGeometry?: boolean;
    }
    interface ZoomOptions {
        absolute?: boolean;
        minScale?: number;
        maxScale?: number;
        scaleGrid?: number;
        center?: Point.PointLike;
    }
    type Direction = 'center' | 'top' | 'top-right' | 'top-left' | 'right' | 'bottom-right' | 'bottom' | 'bottom-left' | 'left';
}
