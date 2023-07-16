import { Curve } from '../curve';
import { Point } from '../point';
import { Segment } from './segment';
export declare class CurveTo extends Segment {
    controlPoint1: Point;
    controlPoint2: Point;
    constructor(curve: Curve);
    constructor(x1: number, y1: number, x2: number, y2: number, x: number, y: number);
    constructor(p1: Point.PointLike | Point.PointData, p2: Point.PointLike | Point.PointData, p3: Point.PointLike | Point.PointData);
    get type(): string;
    get curve(): Curve;
    bbox(): import("..").Rectangle;
    closestPoint(p: Point.PointLike | Point.PointData): Point;
    closestPointLength(p: Point.PointLike | Point.PointData): number;
    closestPointNormalizedLength(p: Point.PointLike | Point.PointData): number;
    closestPointTangent(p: Point.PointLike | Point.PointData): import("..").Line | null;
    length(): number;
    divideAt(ratio: number, options?: Segment.Options): [Segment, Segment];
    divideAtLength(length: number, options?: Segment.Options): [Segment, Segment];
    divideAtT(t: number): [Segment, Segment];
    getSubdivisions(): never[];
    pointAt(ratio: number): Point;
    pointAtLength(length: number): Point;
    tangentAt(ratio: number): import("..").Line | null;
    tangentAtLength(length: number): import("..").Line | null;
    isDifferentiable(): boolean;
    scale(sx: number, sy: number, origin?: Point.PointLike | Point.PointData): this;
    rotate(angle: number, origin?: Point.PointLike | Point.PointData): this;
    translate(tx: number, ty: number): this;
    translate(p: Point.PointLike | Point.PointData): this;
    equals(s: Segment): boolean;
    clone(): CurveTo;
    toJSON(): {
        type: string;
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
export declare namespace CurveTo {
    function create(x1: number, y1: number, x2: number, y2: number, x: number, y: number): CurveTo;
    function create(x1: number, y1: number, x2: number, y2: number, x: number, y: number, ...coords: number[]): CurveTo[];
    function create(c1: Point.PointLike, c2: Point.PointLike, p: Point.PointLike): CurveTo;
    function create(c1: Point.PointLike, c2: Point.PointLike, p: Point.PointLike, ...points: Point.PointLike[]): CurveTo[];
}
