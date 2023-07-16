import { Base } from './base';
import { Point, Rectangle } from '../geometry';
export declare class CoordManager extends Base {
    getClientMatrix(): DOMMatrix;
    /**
     * Returns coordinates of the graph viewport, relative to the window.
     */
    getClientOffset(): Point;
    /**
     * Returns coordinates of the graph viewport, relative to the document.
     */
    getPageOffset(): Point;
    snapToGrid(x: number | Point | Point.PointLike, y?: number): Point;
    localToGraphPoint(x: number | Point | Point.PointLike, y?: number): Point;
    localToClientPoint(x: number | Point | Point.PointLike, y?: number): Point;
    localToPagePoint(x: number | Point | Point.PointLike, y?: number): Point;
    localToGraphRect(x: number | Rectangle | Rectangle.RectangleLike, y?: number, width?: number, height?: number): Rectangle;
    localToClientRect(x: number | Rectangle | Rectangle.RectangleLike, y?: number, width?: number, height?: number): Rectangle;
    localToPageRect(x: number | Rectangle | Rectangle.RectangleLike, y?: number, width?: number, height?: number): Rectangle;
    graphToLocalPoint(x: number | Point | Point.PointLike, y?: number): Point;
    clientToLocalPoint(x: number | Point | Point.PointLike, y?: number): Point;
    clientToGraphPoint(x: number | Point | Point.PointLike, y?: number): Point;
    pageToLocalPoint(x: number | Point | Point.PointLike, y?: number): Point;
    graphToLocalRect(x: number | Rectangle | Rectangle.RectangleLike, y?: number, width?: number, height?: number): Rectangle;
    clientToLocalRect(x: number | Rectangle | Rectangle.RectangleLike, y?: number, width?: number, height?: number): Rectangle;
    clientToGraphRect(x: number | Rectangle | Rectangle.RectangleLike, y?: number, width?: number, height?: number): Rectangle;
    pageToLocalRect(x: number | Rectangle | Rectangle.RectangleLike, y?: number, width?: number, height?: number): Rectangle;
}
export declare namespace CoordManager { }
