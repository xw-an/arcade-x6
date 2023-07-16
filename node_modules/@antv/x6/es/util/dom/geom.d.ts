import { Point, Line, Rectangle, Polyline, Ellipse, Path } from '../../geometry';
/**
 * Returns the bounding box of the element after transformations are
 * applied. If `withoutTransformations` is `true`, transformations of
 * the element will not be considered when computing the bounding box.
 * If `target` is specified, bounding box will be computed relatively
 * to the `target` element.
 */
export declare function bbox(elem: SVGElement, withoutTransformations?: boolean, target?: SVGElement): Rectangle;
/**
 * Returns the bounding box of the element after transformations are
 * applied. Unlike `bbox()`, this function fixes a browser implementation
 * bug to return the correct bounding box if this elemenent is a group of
 * svg elements (if `options.recursive` is specified).
 */
export declare function getBBox(elem: SVGElement, options?: {
    target?: SVGElement | null;
    recursive?: boolean;
}): Rectangle;
export declare function getBBoxByElementAttr(elem: SVGElement): Rectangle | undefined;
export declare function getMatrixByElementAttr(elem: SVGElement, target: SVGElement): DOMMatrix;
/**
 * Returns an DOMMatrix that specifies the transformation necessary
 * to convert `elem` coordinate system into `target` coordinate system.
 */
export declare function getTransformToElement(elem: SVGElement, target: SVGElement): DOMMatrix;
/**
 * Converts a global point with coordinates `x` and `y` into the
 * coordinate space of the element.
 */
export declare function toLocalPoint(elem: SVGElement | SVGSVGElement, x: number, y: number): DOMPoint;
/**
 * Convert the SVGElement to an equivalent geometric shape. The element's
 * transformations are not taken into account.
 *
 * SVGRectElement      => Rectangle
 *
 * SVGLineElement      => Line
 *
 * SVGCircleElement    => Ellipse
 *
 * SVGEllipseElement   => Ellipse
 *
 * SVGPolygonElement   => Polyline
 *
 * SVGPolylineElement  => Polyline
 *
 * SVGPathElement      => Path
 *
 * others              => Rectangle
 */
export declare function toGeometryShape(elem: SVGElement): Polyline | Rectangle | Line | Path | Ellipse;
export declare function getIntersection(elem: SVGElement | SVGSVGElement, ref: Point | Point.PointLike | Point.PointData, target?: SVGElement): Point | null;
export interface AnimateCallbacks {
    start?: (e: Event) => void;
    repeat?: (e: Event) => void;
    complete?: (e: Event) => void;
}
export declare type AnimationOptions = AnimateCallbacks & {
    [name: string]: any;
};
export declare function animate(elem: SVGElement, options: AnimationOptions): () => any;
export declare function animateTransform(elem: SVGElement, options: AnimationOptions): () => any;
/**
 * Animate the element along the path SVG element (or Vector object).
 * `attrs` contain Animation Timing attributes describing the animation.
 */
export declare function animateAlongPath(elem: SVGElement, options: AnimationOptions, path: SVGPathElement): () => void;
export declare function getBoundingOffsetRect(elem: HTMLElement): {
    left: number;
    top: number;
    width: number;
    height: number;
};
