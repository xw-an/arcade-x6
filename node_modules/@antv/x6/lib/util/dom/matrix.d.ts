import { Point, Line, Rectangle, Polyline } from '../../geometry';
export interface MatrixLike {
    a: number;
    b: number;
    c: number;
    d: number;
    e: number;
    f: number;
}
export interface Translation {
    tx: number;
    ty: number;
}
export interface Rotation {
    angle: number;
    cx?: number;
    cy?: number;
}
export interface Scale {
    sx: number;
    sy: number;
}
/**
 * Returns a SVG point object initialized with the `x` and `y` coordinates.
 * @see https://developer.mozilla.org/en/docs/Web/API/SVGPoint
 */
export declare function createSVGPoint(x: number, y: number): DOMPoint;
/**
 * Returns the SVG transformation matrix initialized with the given matrix.
 *
 * The given matrix is an object of the form:
 * {
 *   a: number
 *   b: number
 *   c: number
 *   d: number
 *   e: number
 *   f: number
 * }
 *
 * @see https://developer.mozilla.org/en/docs/Web/API/SVGMatrix
 */
export declare function createSVGMatrix(matrix?: DOMMatrix | MatrixLike | null): DOMMatrix;
/**
 * Returns a SVG transform object.
 * @see https://developer.mozilla.org/en/docs/Web/API/SVGTransform
 */
export declare function createSVGTransform(matrix?: DOMMatrix | MatrixLike): SVGTransform;
/**
 * Returns the SVG transformation matrix built from the `transformString`.
 *
 * E.g. 'translate(10,10) scale(2,2)' will result in matrix:
 * `{ a: 2, b: 0, c: 0, d: 2, e: 10, f: 10}`
 */
export declare function transformStringToMatrix(transform?: string | null): DOMMatrix;
export declare function matrixToTransformString(matrix?: DOMMatrix | Partial<MatrixLike>): string;
export declare function parseTransformString(transform: string): {
    raw: string;
    translation: Translation;
    rotation: Rotation;
    scale: Scale;
};
/**
 * Decomposes the SVG transformation matrix into separate transformations.
 *
 * Returns an object of the form:
 * {
 *   translateX: number
 *   translateY: number
 *   scaleX: number
 *   scaleY: number
 *   skewX: number
 *   skewY: number
 *   rotation: number
 * }
 *
 * @see https://developer.mozilla.org/en/docs/Web/API/SVGMatrix
 */
export declare function decomposeMatrix(matrix: DOMMatrix | MatrixLike): {
    skewX: number;
    skewY: number;
    translateX: number;
    translateY: number;
    scaleX: number;
    scaleY: number;
    rotation: number;
};
export declare function matrixToScale(matrix: DOMMatrix | MatrixLike): Scale;
export declare function matrixToRotation(matrix: DOMMatrix | MatrixLike): Rotation;
export declare function matrixToTranslation(matrix: DOMMatrix | MatrixLike): Translation;
/**
 * Transforms point by an SVG transformation represented by `matrix`.
 */
export declare function transformPoint(point: Point.PointLike, matrix: DOMMatrix): Point;
/**
 * Transforms line by an SVG transformation represented by `matrix`.
 */
export declare function transformLine(line: Line, matrix: DOMMatrix): Line;
/**
 * Transforms polyline by an SVG transformation represented by `matrix`.
 */
export declare function transformPolyline(polyline: Polyline, matrix: DOMMatrix): Polyline;
export declare function transformRectangle(rect: Rectangle.RectangleLike, matrix: DOMMatrix): Rectangle;
