import { Point } from './point';
import { Line } from './line';
import { Rectangle } from './rectangle';
import { Polyline } from './polyline';
import { Geometry } from './geometry';
export declare class Curve extends Geometry {
    start: Point;
    end: Point;
    controlPoint1: Point;
    controlPoint2: Point;
    PRECISION: number;
    protected get [Symbol.toStringTag](): string;
    constructor(start: Point.PointLike | Point.PointData, controlPoint1: Point.PointLike | Point.PointData, controlPoint2: Point.PointLike | Point.PointData, end: Point.PointLike | Point.PointData);
    bbox(): Rectangle;
    closestPoint(p: Point.PointLike | Point.PointData, options?: Curve.Options): Point;
    closestPointLength(p: Point.PointLike | Point.PointData, options?: Curve.Options): number;
    closestPointNormalizedLength(p: Point.PointLike | Point.PointData, options?: Curve.Options): number;
    closestPointT(p: Point.PointLike | Point.PointData, options?: Curve.Options): number;
    closestPointTangent(p: Point.PointLike | Point.PointData, options?: Curve.Options): Line | null;
    containsPoint(p: Point.PointLike | Point.PointData, options?: Curve.Options): boolean;
    divideAt(ratio: number, options?: Curve.Options): [Curve, Curve];
    divideAtLength(length: number, options?: Curve.Options): [Curve, Curve];
    divide(t: number): [Curve, Curve];
    divideAtT(t: number): [Curve, Curve];
    endpointDistance(): number;
    getSkeletonPoints(t: number): {
        startControlPoint1: Point;
        startControlPoint2: Point;
        divider: Point;
        dividerControlPoint1: Point;
        dividerControlPoint2: Point;
    };
    getSubdivisions(options?: Curve.Options): Curve[];
    length(options?: Curve.Options): number;
    lengthAtT(t: number, options?: Curve.Options): number;
    pointAt(ratio: number, options?: Curve.Options): Point;
    pointAtLength(length: number, options?: Curve.Options): Point;
    pointAtT(t: number): Point;
    isDifferentiable(): boolean;
    tangentAt(ratio: number, options?: Curve.Options): Line | null;
    tangentAtLength(length: number, options?: Curve.Options): Line | null;
    tangentAtT(t: number): Line | null;
    protected getPrecision(options?: Curve.Options): number;
    protected getDivisions(options?: Curve.Options): Curve[];
    protected getOptions(options?: Curve.Options): Curve.Options;
    protected tAt(ratio: number, options?: Curve.Options): number;
    protected tAtLength(length: number, options?: Curve.Options): number;
    toPoints(options?: Curve.Options): Point[];
    toPolyline(options?: Curve.Options): Polyline;
    scale(sx: number, sy: number, origin?: Point.PointLike | Point.PointData): this;
    rotate(angle: number, origin?: Point.PointLike | Point.PointData): this;
    translate(tx: number, ty: number): this;
    translate(p: Point.PointLike | Point.PointData): this;
    equals(c: Curve): boolean;
    clone(): Curve;
    toJSON(): {
        start: {
            x: number;
            y: number;
        };
        controlPoint1: {
            x: number;
            y: number;
        };
        controlPoint2: {
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
export declare namespace Curve {
    const toStringTag: string;
    function isCurve(instance: any): instance is Curve;
}
export declare namespace Curve {
    interface Options {
        precision?: number;
        subdivisions?: Curve[];
    }
}
export declare namespace Curve {
    function throughPoints(points: (Point.PointLike | Point.PointData)[]): Curve[];
}
