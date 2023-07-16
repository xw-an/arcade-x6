import { Geometry } from './geometry';
import { Rectangle } from './rectangle';
export declare class Point extends Geometry implements Point.PointLike {
    x: number;
    y: number;
    protected get [Symbol.toStringTag](): string;
    constructor(x?: number, y?: number);
    /**
     * Rounds the point to the given precision.
     */
    round(precision?: number): this;
    add(x: number, y: number): this;
    add(p: Point.PointLike | Point.PointData): this;
    /**
     * Update the point's `x` and `y` coordinates with new values and return the
     * point itself. Useful for chaining.
     */
    update(x: number, y: number): this;
    update(p: Point.PointLike | Point.PointData): this;
    translate(dx: number, dy: number): this;
    translate(p: Point.PointLike | Point.PointData): this;
    /**
     * Rotate the point by `degree` around `center`.
     */
    rotate(degree: number, center?: Point.PointLike | Point.PointData): this;
    /**
     * Scale point by `sx` and `sy` around the given `origin`. If origin is not
     * specified, the point is scaled around `0,0`.
     */
    scale(sx: number, sy: number, origin?: Point.PointLike | Point.PointData): this;
    /**
     * Chooses the point closest to this point from among `points`. If `points`
     * is an empty array, `null` is returned.
     */
    closest(points: (Point.PointLike | Point.PointData)[]): Point | null;
    /**
     * Returns the distance between the point and another point `p`.
     */
    distance(p: Point.PointLike | Point.PointData): number;
    /**
     * Returns the squared distance between the point and another point `p`.
     *
     * Useful for distance comparisons in which real distance is not necessary
     * (saves one `Math.sqrt()` operation).
     */
    squaredDistance(p: Point.PointLike | Point.PointData): number;
    manhattanDistance(p: Point.PointLike | Point.PointData): number;
    /**
     * Returns the magnitude of the point vector.
     *
     * @see http://en.wikipedia.org/wiki/Magnitude_(mathematics)
     */
    magnitude(): number;
    /**
     * Returns the angle(in degrees) between vector from this point to `p` and
     * the x-axis.
     */
    theta(p?: Point.PointLike | Point.PointData): number;
    /**
     * Returns the angle(in degrees) between vector from this point to `p1` and
     * the vector from this point to `p2`.
     *
     * The ordering of points `p1` and `p2` is important.
     *
     * The function returns a value between `0` and `180` when the angle (in the
     * direction from `p1` to `p2`) is clockwise, and a value between `180` and
     * `360` when the angle is counterclockwise.
     *
     * Returns `NaN` if either of the points `p1` and `p2` is equal with this point.
     */
    angleBetween(p1: Point.PointLike | Point.PointData, p2: Point.PointLike | Point.PointData): number;
    /**
     * Returns the angle(in degrees) between the line from `(0,0)` and this point
     * and the line from `(0,0)` to `p`.
     *
     * The function returns a value between `0` and `180` when the angle (in the
     * direction from this point to `p`) is clockwise, and a value between `180`
     * and `360` when the angle is counterclockwise. Returns `NaN` if called from
     * point `(0,0)` or if `p` is `(0,0)`.
     */
    vectorAngle(p: Point.PointLike | Point.PointData): number;
    /**
     * Converts rectangular to polar coordinates.
     */
    toPolar(origin?: Point.PointLike | Point.PointData): this;
    /**
     * Returns the change in angle(in degrees) that is the result of moving the
     * point from its previous position to its current position.
     *
     * More specifically, this function computes the angle between the line from
     * the ref point to the previous position of this point(i.e. current position
     * `-dx`, `-dy`) and the line from the `ref` point to the current position of
     * this point.
     *
     * The function returns a positive value between `0` and `180` when the angle
     * (in the direction from previous position of this point to its current
     * position) is clockwise, and a negative value between `0` and `-180` when
     * the angle is counterclockwise.
     *
     * The function returns `0` if the previous and current positions of this
     * point are the same (i.e. both `dx` and `dy` are `0`).
     */
    changeInAngle(dx: number, dy: number, ref?: Point.PointLike | Point.PointData): number;
    /**
     * If the point lies outside the rectangle `rect`, adjust the point so that
     * it becomes the nearest point on the boundary of `rect`.
     */
    adhereToRect(rect: Rectangle.RectangleLike): this;
    /**
     * Returns the bearing(cardinal direction) between me and the given point.
     *
     * @see https://en.wikipedia.org/wiki/Cardinal_direction
     */
    bearing(p: Point.PointLike | Point.PointData): Point.Bearing;
    /**
     * Returns the cross product of the vector from me to `p1` and the vector
     * from me to `p2`.
     *
     * The left-hand rule is used because the coordinate system is left-handed.
     */
    cross(p1: Point.PointLike | Point.PointData, p2: Point.PointLike | Point.PointData): number;
    /**
     * Returns the dot product of this point with given other point.
     */
    dot(p: Point.PointLike | Point.PointData): number;
    /**
     * Returns a point that has coordinates computed as a difference between the
     * point and another point with coordinates `dx` and `dy`.
     *
     * If only `dx` is specified and is a number, `dy` is considered to be zero.
     * If only `dx` is specified and is an object, it is considered to be another
     * point or an object in the form `{ x: [number], y: [number] }`
     */
    diff(dx: number, dy: number): Point;
    diff(p: Point.PointLike | Point.PointData): Point;
    /**
     * Returns an interpolation between me and point `p` for a parametert in
     * the closed interval `[0, 1]`.
     */
    lerp(p: Point.PointLike | Point.PointData, t: number): Point;
    /**
     * Normalize the point vector, scale the line segment between `(0, 0)`
     * and the point in order for it to have the given length. If length is
     * not specified, it is considered to be `1`; in that case, a unit vector
     * is computed.
     */
    normalize(length?: number): this;
    /**
     * Moves this point along the line starting from `ref` to this point by a
     * certain `distance`.
     */
    move(ref: Point.PointLike | Point.PointData, distance: number): this;
    /**
     * Returns a point that is the reflection of me with the center of inversion
     * in `ref` point.
     */
    reflection(ref: Point.PointLike | Point.PointData): Point;
    /**
     * Snaps the point(change its x and y coordinates) to a grid of size `gridSize`
     * (or `gridSize` x `gridSizeY` for non-uniform grid).
     */
    snapToGrid(gridSize: number): this;
    snapToGrid(gx: number, gy: number): this;
    snapToGrid(gx: number, gy?: number): this;
    equals(p: Point.PointLike | Point.PointData): boolean;
    clone(): Point;
    /**
     * Returns the point as a simple JSON object. For example: `{ x: 0, y: 0 }`.
     */
    toJSON(): {
        x: number;
        y: number;
    };
    serialize(): string;
}
export declare namespace Point {
    const toStringTag: string;
    function isPoint(instance: any): instance is Point;
}
export declare namespace Point {
    interface PointLike {
        x: number;
        y: number;
    }
    type PointData = [number, number];
    type Bearing = 'NE' | 'E' | 'SE' | 'S' | 'SW' | 'W' | 'NW' | 'N';
    function isPointLike(p: any): p is PointLike;
    function isPointData(p: any): p is PointData;
}
export declare namespace Point {
    function create(x?: number | Point | PointLike | PointData, y?: number): Point;
    function clone(p: Point | PointLike | PointData): Point;
    function toJSON(p: Point | PointLike | PointData): {
        x: number;
        y: number;
    };
    /**
     * Returns a new Point object from the given polar coordinates.
     * @see http://en.wikipedia.org/wiki/Polar_coordinate_system
     */
    function fromPolar(r: number, rad: number, origin?: Point | PointLike | PointData): Point;
    /**
     * Converts rectangular to polar coordinates.
     */
    function toPolar(point: Point | PointLike | PointData, origin?: Point | PointLike | PointData): Point;
    function equals(p1?: Point.PointLike, p2?: Point.PointLike): boolean;
    function equalPoints(p1: Point.PointLike[], p2: Point.PointLike[]): boolean;
    /**
     * Returns a point with random coordinates that fall within the range
     * `[x1, x2]` and `[y1, y2]`.
     */
    function random(x1: number, x2: number, y1: number, y2: number): Point;
    function rotate(point: Point | PointLike | PointData, angle: number, center?: Point | PointLike | PointData): Point;
    function rotateEx(point: Point | PointLike | PointData, cos: number, sin: number, center?: Point | PointLike | PointData): Point;
}
