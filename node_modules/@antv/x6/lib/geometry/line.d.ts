import { Path } from './path';
import { Point } from './point';
import { Ellipse } from './ellipse';
import { Geometry } from './geometry';
import { Polyline } from './polyline';
import { Rectangle } from './rectangle';
export declare class Line extends Geometry {
    start: Point;
    end: Point;
    protected get [Symbol.toStringTag](): string;
    get center(): Point;
    constructor(x1: number, y1: number, x2: number, y2: number);
    constructor(p1: Point.PointLike | Point.PointData, p2: Point.PointLike | Point.PointData);
    getCenter(): Point;
    /**
     * Rounds the line to the given `precision`.
     */
    round(precision?: number): this;
    translate(tx: number, ty: number): this;
    translate(p: Point.PointLike | Point.PointData): this;
    /**
     * Rotate the line by `angle` around `origin`.
     */
    rotate(angle: number, origin?: Point.PointLike | Point.PointData): this;
    /**
     * Scale the line by `sx` and `sy` about the given `origin`. If origin is not
     * specified, the line is scaled around `0,0`.
     */
    scale(sx: number, sy: number, origin?: Point.PointLike | Point.PointData): this;
    /**
     * Returns the length of the line.
     */
    length(): number;
    /**
     * Useful for distance comparisons in which real length is not necessary
     * (saves one `Math.sqrt()` operation).
     */
    squaredLength(): number;
    /**
     * Scale the line so that it has the requested length. The start point of
     * the line is preserved.
     */
    setLength(length: number): this;
    parallel(distance: number): Line;
    /**
     * Returns the vector of the line with length equal to length of the line.
     */
    vector(): Point;
    /**
     * Returns the angle of incline of the line.
     *
     * The function returns `NaN` if the start and end endpoints of the line
     * both lie at the same coordinates(it is impossible to determine the angle
     * of incline of a line that appears to be a point). The
     * `line.isDifferentiable()` function may be used in advance to determine
     * whether the angle of incline can be computed for a given line.
     */
    angle(): number;
    /**
     * Returns a rectangle that is the bounding box of the line.
     */
    bbox(): Rectangle;
    /**
     * Returns the bearing (cardinal direction) of the line.
     *
     * The return value is one of the following strings:
     * 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW' and 'N'.
     *
     * The function returns 'N' if the two endpoints of the line are coincident.
     */
    bearing(): Point.Bearing;
    /**
     * Returns the point on the line that lies closest to point `p`.
     */
    closestPoint(p: Point.PointLike | Point.PointData): Point;
    /**
     * Returns the length of the line up to the point that lies closest to point `p`.
     */
    closestPointLength(p: Point.PointLike | Point.PointData): number;
    /**
     * Returns a line that is tangent to the line at the point that lies closest
     * to point `p`.
     */
    closestPointTangent(p: Point.PointLike | Point.PointData): Line | null;
    /**
     * Returns the normalized length (distance from the start of the line / total
     * line length) of the line up to the point that lies closest to point.
     */
    closestPointNormalizedLength(p: Point.PointLike | Point.PointData): number;
    /**
     * Returns a point on the line that lies `rate` (normalized length) away from
     * the beginning of the line.
     */
    pointAt(ratio: number): Point;
    /**
     * Returns a point on the line that lies length away from the beginning of
     * the line.
     */
    pointAtLength(length: number): Point;
    /**
     * Divides the line into two lines at the point that lies `rate` (normalized
     * length) away from the beginning of the line.
     */
    divideAt(ratio: number): Line[];
    /**
     * Divides the line into two lines at the point that lies length away from
     * the beginning of the line.
     */
    divideAtLength(length: number): Line[];
    /**
     * Returns `true` if the point `p` lies on the line. Return `false` otherwise.
     */
    containsPoint(p: Point.PointLike | Point.PointData): boolean;
    /**
     * Returns an array of the intersection points of the line with another
     * geometry shape.
     */
    intersect(shape: Line | Rectangle | Polyline | Ellipse): Point[] | null;
    intersect(shape: Path, options?: Path.Options): Point[] | null;
    /**
     * Returns the intersection point of the line with another line. Returns
     * `null` if no intersection exists.
     */
    intersectsWithLine(line: Line): Point | null;
    /**
     * Returns `true` if a tangent line can be found for the line.
     *
     * Tangents cannot be found if both of the line endpoints are coincident
     * (the line appears to be a point).
     */
    isDifferentiable(): boolean;
    /**
     * Returns the perpendicular distance between the line and point. The
     * distance is positive if the point lies to the right of the line, negative
     * if the point lies to the left of the line, and `0` if the point lies on
     * the line.
     */
    pointOffset(p: Point.PointLike | Point.PointData): number;
    /**
     * Returns the squared distance between the line and the point.
     */
    pointSquaredDistance(x: number, y: number): number;
    pointSquaredDistance(p: Point.PointLike | Point.PointData): number;
    /**
     * Returns the distance between the line and the point.
     */
    pointDistance(x: number, y: number): number;
    pointDistance(p: Point.PointLike | Point.PointData): number;
    /**
     * Returns a line tangent to the line at point that lies `rate` (normalized
     * length) away from the beginning of the line.
     */
    tangentAt(ratio: number): Line | null;
    /**
     * Returns a line tangent to the line at point that lies `length` away from
     * the beginning of the line.
     */
    tangentAtLength(length: number): Line | null;
    /**
     * Returns which direction the line would have to rotate in order to direct
     * itself at a point.
     *
     * Returns 1 if the given point on the right side of the segment, 0 if its
     * on the segment, and -1 if the point is on the left side of the segment.
     *
     * @see https://softwareengineering.stackexchange.com/questions/165776/what-do-ptlinedist-and-relativeccw-do
     */
    relativeCcw(x: number, y: number): -1 | 0 | 1;
    relativeCcw(p: Point.PointLike | Point.PointData): -1 | 0 | 1;
    /**
     * Return `true` if the line equals the other line.
     */
    equals(l: Line): boolean;
    /**
     * Returns another line which is a clone of the line.
     */
    clone(): Line;
    toJSON(): {
        start: {
            x: number;
            y: number;
        };
        end: {
            x: number;
            y: number;
        };
    };
    serialize(): string;
}
export declare namespace Line {
    const toStringTag: string;
    function isLine(instance: any): instance is Line;
}
