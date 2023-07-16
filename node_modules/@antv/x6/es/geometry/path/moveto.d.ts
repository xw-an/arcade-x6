import { Line } from '../line';
import { Curve } from '../curve';
import { Point } from '../point';
import { Segment } from './segment';
export declare class MoveTo extends Segment {
    constructor(line: Line);
    constructor(curve: Curve);
    constructor(x: number, y: number);
    constructor(p: Point.PointLike | Point.PointData);
    get start(): Point;
    get type(): string;
    bbox(): null;
    closestPoint(): Point;
    closestPointLength(): number;
    closestPointNormalizedLength(): number;
    closestPointT(): number;
    closestPointTangent(): null;
    length(): number;
    lengthAtT(): number;
    divideAt(): [Segment, Segment];
    divideAtLength(): [Segment, Segment];
    getSubdivisions(): never[];
    pointAt(): Point;
    pointAtLength(): Point;
    pointAtT(): Point;
    tangentAt(): null;
    tangentAtLength(): null;
    tangentAtT(): null;
    isDifferentiable(): boolean;
    scale(sx: number, sy: number, origin?: Point.PointLike | Point.PointData): this;
    rotate(angle: number, origin?: Point.PointLike | Point.PointData): this;
    translate(tx: number, ty: number): this;
    translate(p: Point.PointLike | Point.PointData): this;
    clone(): MoveTo;
    equals(s: Segment): boolean;
    toJSON(): {
        type: string;
        end: {
            x: number;
            y: number;
        };
    };
    serialize(): string;
}
export declare namespace MoveTo {
    function create(line: Line): MoveTo;
    function create(curve: Curve): MoveTo;
    function create(point: Point.PointLike): MoveTo;
    function create(x: number, y: number): MoveTo;
    function create(point: Point.PointLike, ...points: Point.PointLike[]): Segment[];
    function create(x: number, y: number, ...coords: number[]): Segment[];
}
