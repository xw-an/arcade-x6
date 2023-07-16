import { NumberExt } from '../../util';
import { Point, Rectangle } from '../../geometry';
import { EdgeView } from '../../view/edge';
export interface PaddingOptions {
    padding?: NumberExt.SideOptions;
}
export declare function getPointBBox(p: Point): Rectangle;
export declare function getPaddingBox(options?: PaddingOptions): {
    x: number;
    y: number;
    width: number;
    height: number;
};
export declare function getSourceBBox(view: EdgeView, options?: PaddingOptions): Rectangle;
export declare function getTargetBBox(view: EdgeView, options?: PaddingOptions): Rectangle;
export declare function getSourceAnchor(view: EdgeView, options?: PaddingOptions): Point;
export declare function getTargetAnchor(view: EdgeView, options?: PaddingOptions): Point;
