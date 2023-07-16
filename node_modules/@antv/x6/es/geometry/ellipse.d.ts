import { Point } from './point';
import { Line } from './line';
import { Rectangle } from './rectangle';
import { Geometry } from './geometry';
export declare class Ellipse extends Geometry implements Ellipse.EllipseLike {
    x: number;
    y: number;
    a: number;
    b: number;
    protected get [Symbol.toStringTag](): string;
    get center(): Point;
    constructor(x?: number, y?: number, a?: number, b?: number);
    /**
     * Returns a rectangle that is the bounding box of the ellipse.
     */
    bbox(): Rectangle;
    /**
     * Returns a point that is the center of the ellipse.
     */
    getCenter(): Point;
    /**
     * Returns ellipse inflated in axis-x by `2 * amount` and in axis-y by
     * `2 * amount`.
     */
    inflate(amount: number): this;
    /**
     * Returns ellipse inflated in axis-x by `2 * dx` and in axis-y by `2 * dy`.
     */
    inflate(dx: number, dy: number): this;
    /**
     * Returns a normalized distance from the ellipse center to point `p`.
     * Returns `n < 1` for points inside the ellipse, `n = 1` for points
     * lying on the ellipse boundary and `n > 1` for points outside the ellipse.
     */
    normalizedDistance(x: number, y: number): number;
    normalizedDistance(p: Point.PointLike | Point.PointData): number;
    /**
     * Returns `true` if the point `p` is inside the ellipse (inclusive).
     * Returns `false` otherwise.
     */
    containsPoint(x: number, y: number): boolean;
    containsPoint(p: Point.PointLike | Point.PointData): boolean;
    /**
     * Returns an array of the intersection points of the ellipse and the line.
     * Returns `null` if no intersection exists.
     */
    intersectsWithLine(line: Line): Point[] | null;
    /**
     * Returns the point on the boundary of the ellipse that is the
     * intersection of the ellipse with a line starting in the center
     * of the ellipse ending in the point `p`.
     *
     * If angle is specified, the intersection will take into account
     * the rotation of the ellipse by angle degrees around its center.
     */
    intersectsWithLineFromCenterToPoint(p: Point.PointLike | Point.PointData, angle?: number): Point;
    /**
     * Returns the angle between the x-axis and the tangent from a point. It is
     * valid for points lying on the ellipse boundary only.
     */
    tangentTheta(p: Point.PointLike | Point.PointData): number;
    scale(sx: number, sy: number): this;
    rotate(angle: number, origin?: Point.PointLike | Point.PointData): this;
    translate(dx: number, dy: number): this;
    translate(p: Point.PointLike | Point.PointData): this;
    equals(ellipse: Ellipse): boolean;
    clone(): Ellipse;
    toJSON(): {
        x: number;
        y: number;
        a: number;
        b: number;
    };
    serialize(): string;
}
export declare namespace Ellipse {
    const toStringTag: string;
    function isEllipse(instance: any): instance is Ellipse;
}
export declare namespace Ellipse {
    interface EllipseLike extends Point.PointLike {
        x: number;
        y: number;
        a: number;
        b: number;
    }
    type EllipseData = [number, number, number, number];
}
export declare namespace Ellipse {
    function create(x?: number | Ellipse | EllipseLike | EllipseData, y?: number, a?: number, b?: number): Ellipse;
    function parse(e: Ellipse | EllipseLike | EllipseData): Ellipse;
    function fromRect(rect: Rectangle): Ellipse;
}
