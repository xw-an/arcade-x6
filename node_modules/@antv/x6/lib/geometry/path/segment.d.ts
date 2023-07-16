import { Line } from '../line';
import { Point } from '../point';
import { Rectangle } from '../rectangle';
import { Geometry } from '../geometry';
export declare abstract class Segment extends Geometry {
    isVisible: boolean;
    isSegment: boolean;
    isSubpathStart: boolean;
    nextSegment: Segment | null;
    previousSegment: Segment | null;
    subpathStartSegment: Segment | null;
    protected endPoint: Point;
    get end(): Point;
    get start(): Point;
    abstract get type(): string;
    abstract bbox(): Rectangle | null;
    abstract closestPoint(p: Point.PointLike | Point.PointData): Point;
    abstract closestPointLength(p: Point.PointLike | Point.PointData): number;
    abstract closestPointNormalizedLength(p: Point.PointLike | Point.PointData): number;
    closestPointT(p: Point.PointLike | Point.PointData, options?: Segment.Options): number;
    abstract closestPointTangent(p: Point.PointLike | Point.PointData): Line | null;
    abstract length(options?: Segment.Options): number;
    lengthAtT(t: number, options?: Segment.Options): number;
    abstract divideAt(ratio: number, options?: Segment.Options): [Segment, Segment];
    abstract divideAtLength(length: number, options?: Segment.Options): [Segment, Segment];
    divideAtT(t: number): [Segment, Segment];
    abstract getSubdivisions(options?: Segment.Options): Segment[];
    abstract pointAt(ratio: number): Point;
    abstract pointAtLength(length: number, options?: Segment.Options): Point;
    pointAtT(t: number): Point;
    abstract tangentAt(ratio: number): Line | null;
    abstract tangentAtLength(length: number, options?: Segment.Options): Line | null;
    tangentAtT(t: number): Line | null;
    abstract isDifferentiable(): boolean;
    abstract clone(): Segment;
}
export declare namespace Segment {
    interface Options {
        precision?: number;
        subdivisions?: Segment[];
    }
}
