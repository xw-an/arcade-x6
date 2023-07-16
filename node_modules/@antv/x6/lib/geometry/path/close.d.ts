import { Line } from '../line';
import { Point } from '../point';
import { Segment } from './segment';
export declare class Close extends Segment {
    get end(): Point;
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
    scale(): this;
    rotate(): this;
    translate(): this;
    equals(s: Segment): boolean;
    clone(): Close;
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
export declare namespace Close {
    function create(): Close;
}
