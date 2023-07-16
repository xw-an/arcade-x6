import { Point } from './point';
import { Rectangle } from './rectangle';
import { Line } from './line';
import { Geometry } from './geometry';
export declare class Polyline extends Geometry {
    points: Point[];
    protected get [Symbol.toStringTag](): string;
    get start(): Point | null;
    get end(): Point | null;
    constructor(points?: (Point.PointLike | Point.PointData)[] | string);
    scale(sx: number, sy: number, origin?: Point.PointLike | Point.PointData): this;
    rotate(angle: number, origin?: Point.PointLike | Point.PointData): this;
    translate(dx: number, dy: number): this;
    translate(p: Point.PointLike | Point.PointData): this;
    bbox(): Rectangle;
    closestPoint(p: Point.PointLike | Point.PointData): Point | null;
    closestPointLength(p: Point.PointLike | Point.PointData): number;
    closestPointNormalizedLength(p: Point.PointLike | Point.PointData): number;
    closestPointTangent(p: Point.PointLike | Point.PointData): Line | null;
    containsPoint(p: Point.PointLike | Point.PointData): boolean;
    intersectsWithLine(line: Line): Point[] | null;
    isDifferentiable(): boolean;
    length(): number;
    pointAt(ratio: number): Point | null;
    pointAtLength(length: number): Point | null;
    tangentAt(ratio: number): Line | null;
    tangentAtLength(length: number): Line | null;
    simplify(options?: {
        /**
         * The max distance of middle point from chord to be simplified.
         */
        threshold?: number;
    }): this;
    toHull(): Polyline;
    equals(p: Polyline): boolean;
    clone(): Polyline;
    toJSON(): {
        x: number;
        y: number;
    }[];
    serialize(): string;
}
export declare namespace Polyline {
    const toStringTag: string;
    function isPolyline(instance: any): instance is Polyline;
}
export declare namespace Polyline {
    function parse(svgString: string): Polyline;
}
