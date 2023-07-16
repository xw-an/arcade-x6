import { Line } from '../line';
import { Point } from '../point';
import { Segment } from './segment';
export declare class LineTo extends Segment {
    constructor(line: Line);
    constructor(x: number, y: number);
    constructor(p: Point.PointLike | Point.PointData);
    get type(): string;
    get line(): Line;
    bbox(): import("..").Rectangle;
    closestPoint(p: Point.PointLike | Point.PointData): Point;
    closestPointLength(p: Point.PointLike | Point.PointData): number;
    closestPointNormalizedLength(p: Point.PointLike | Point.PointData): number;
    closestPointTangent(p: Point.PointLike | Point.PointData): Line | null;
    length(): number;
    divideAt(ratio: number): [Segment, Segment];
    divideAtLength(length: number): [Segment, Segment];
    getSubdivisions(): never[];
    pointAt(ratio: number): Point;
    pointAtLength(length: number): Point;
    tangentAt(ratio: number): Line | null;
    tangentAtLength(length: number): Line | null;
    isDifferentiable(): boolean;
    clone(): LineTo;
    scale(sx: number, sy: number, origin?: Point.PointLike | Point.PointData): this;
    rotate(angle: number, origin?: Point.PointLike | Point.PointData): this;
    translate(tx: number, ty: number): this;
    translate(p: Point.PointLike | Point.PointData): this;
    equals(s: Segment): boolean;
    toJSON(): {
        type: string;
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
export declare namespace LineTo {
    function create(line: Line): LineTo;
    function create(point: Point.PointLike): LineTo;
    function create(x: number, y: number): LineTo;
    function create(point: Point.PointLike, ...points: Point.PointLike[]): LineTo[];
    function create(x: number, y: number, ...coords: number[]): LineTo[];
}
