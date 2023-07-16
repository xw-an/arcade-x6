import { Line } from '../line';
import { Point } from '../point';
import { Curve } from '../curve';
import { Polyline } from '../polyline';
import { Rectangle } from '../rectangle';
import { Geometry } from '../geometry';
import { Close } from './close';
import { LineTo } from './lineto';
import { MoveTo } from './moveto';
import { CurveTo } from './curveto';
import { Segment } from './segment';
import { normalizePathData } from './normalize';
import * as Util from './util';
export declare class Path extends Geometry {
    protected readonly PRECISION: number;
    segments: Segment[];
    protected get [Symbol.toStringTag](): string;
    constructor();
    constructor(line: Line);
    constructor(curve: Curve);
    constructor(polyline: Polyline);
    constructor(segment: Segment);
    constructor(segments: Segment[]);
    constructor(lines: Line[]);
    constructor(curves: Curve[]);
    get start(): Point | null;
    get end(): Point | null;
    moveTo(x: number, y: number): this;
    moveTo(point: Point.PointLike): this;
    moveTo(line: Line): this;
    moveTo(curve: Curve): this;
    moveTo(point: Point.PointLike, ...points: Point.PointLike[]): this;
    moveTo(x: number, y: number, ...coords: number[]): this;
    lineTo(x: number, y: number): this;
    lineTo(point: Point.PointLike): this;
    lineTo(line: Line): this;
    lineTo(x: number, y: number, ...coords: number[]): this;
    lineTo(point: Point.PointLike, ...points: Point.PointLike[]): this;
    curveTo(x0: number, y0: number, x1: number, y1: number, x2: number, y2: number): this;
    curveTo(x0: number, y0: number, x1: number, y1: number, x2: number, y2: number, ...coords: number[]): this;
    curveTo(p1: Point.PointLike, p2: Point.PointLike, p3: Point.PointLike): this;
    curveTo(p1: Point.PointLike, p2: Point.PointLike, p3: Point.PointLike, ...points: Point.PointLike[]): this;
    arcTo(rx: number, ry: number, xAxisRotation: number, largeArcFlag: 0 | 1, sweepFlag: 0 | 1, endX: number, endY: number): this;
    arcTo(rx: number, ry: number, xAxisRotation: number, largeArcFlag: 0 | 1, sweepFlag: 0 | 1, endPoint: Point.PointLike): this;
    quadTo(controlPoint: Point.PointLike, endPoint: Point.PointLike): this;
    quadTo(controlPointX: number, controlPointY: number, endPointX: number, endPointY: number): this;
    close(): this;
    drawPoints(points: (Point.PointLike | Point.PointData)[], options?: Util.DrawPointsOptions): void;
    bbox(): Rectangle | null;
    appendSegment(seg: Segment | Segment[]): this;
    insertSegment(index: number, seg: Segment | Segment[]): this;
    removeSegment(index: number): Segment;
    replaceSegment(index: number, seg: Segment | Segment[]): void;
    getSegment(index: number): Segment;
    protected fixIndex(index: number): number;
    segmentAt(ratio: number, options?: Path.Options): Segment | null;
    segmentAtLength(length: number, options?: Path.Options): Segment | null;
    segmentIndexAt(ratio: number, options?: Path.Options): number | null;
    segmentIndexAtLength(length: number, options?: Path.Options): number | null;
    getSegmentSubdivisions(options?: Path.Options): Segment[][];
    protected updateSubpathStartSegment(segment: Segment): void;
    protected prepareSegment(segment: Segment, previousSegment: Segment | null, nextSegment: Segment | null): Segment;
    closestPoint(p: Point.PointLike, options?: Path.Options): Point | null;
    closestPointLength(p: Point.PointLike, options?: Path.Options): number;
    closestPointNormalizedLength(p: Point.PointLike, options?: Path.Options): number;
    closestPointT(p: Point.PointLike, options?: Path.Options): {
        segmentIndex: number;
        value: number;
    } | null;
    closestPointTangent(p: Point.PointLike, options?: Path.Options): Line | null;
    containsPoint(p: Point.PointLike, options?: Path.Options): boolean;
    pointAt(ratio: number, options?: Path.Options): Point | null;
    pointAtLength(length: number, options?: Path.Options): Point | null;
    pointAtT(t: {
        segmentIndex: number;
        value: number;
    }): Point | null;
    divideAt(ratio: number, options?: Path.Options): Path[] | null;
    divideAtLength(length: number, options?: Path.Options): Path[] | null;
    intersectsWithLine(line: Line, options?: Path.Options): Point[] | null;
    isDifferentiable(): boolean;
    isValid(): boolean;
    length(options?: Path.Options): number;
    lengthAtT(t: {
        segmentIndex: number;
        value: number;
    }, options?: Path.Options): number;
    tangentAt(ratio: number, options?: Path.Options): Line | null;
    tangentAtLength(length: number, options?: Path.Options): Line | null;
    tangentAtT(t: {
        segmentIndex: number;
        value: number;
    }): Line | null;
    protected getPrecision(options?: Path.Options): number;
    protected getSubdivisions(options?: Path.Options): Segment[][];
    protected getOptions(options?: Path.Options): {
        precision: number;
        segmentSubdivisions: Segment[][];
    };
    toPoints(options?: Path.Options): Point[][] | null;
    toPolylines(options?: Path.Options): Polyline[] | null;
    scale(sx: number, sy: number, origin?: Point.PointLike): this;
    rotate(angle: number, origin?: Point.PointLike | Point.PointData): this;
    translate(tx: number, ty: number): this;
    translate(p: Point.PointLike): this;
    clone(): Path;
    equals(p: Path): boolean;
    toJSON(): (import("../..").JSONObject | import("../..").JSONArray)[];
    serialize(): string;
    toString(): string;
}
export declare namespace Path {
    const toStringTag: string;
    function isPath(instance: any): instance is Path;
}
export declare namespace Path {
    interface Options {
        precision?: number | null;
        segmentSubdivisions?: Segment[][] | null;
    }
}
export declare namespace Path {
    function parse(pathData: string): Path;
    function createSegment(type: 'M', x: number, y: number): MoveTo;
    function createSegment(type: 'M', point: Point.PointLike): MoveTo;
    function createSegment(type: 'M', line: Line): MoveTo;
    function createSegment(type: 'M', curve: Curve): MoveTo;
    function createSegment(type: 'M', point: Point.PointLike, ...points: Point.PointLike[]): Segment[];
    function createSegment(type: 'M', x: number, y: number, ...coords: number[]): Segment[];
    function createSegment(type: 'L', x: number, y: number): LineTo;
    function createSegment(type: 'L', point: Point.PointLike): LineTo;
    function createSegment(type: 'L', line: Line): LineTo;
    function createSegment(type: 'L', point: Point.PointLike, ...points: Point.PointLike[]): LineTo[];
    function createSegment(type: 'L', x: number, y: number, ...coords: number[]): LineTo[];
    function createSegment(type: 'C', x0: number, y0: number, x1: number, y1: number, x2: number, y2: number): CurveTo;
    function createSegment(type: 'C', x0: number, y0: number, x1: number, y1: number, x2: number, y2: number, ...coords: number[]): CurveTo[];
    function createSegment(type: 'C', p1: Point.PointLike, p2: Point.PointLike, p3: Point.PointLike): CurveTo;
    function createSegment(type: 'C', p1: Point.PointLike, p2: Point.PointLike, p3: Point.PointLike, ...points: Point.PointLike[]): CurveTo[];
    function createSegment(type: 'Z' | 'z'): Close;
}
export declare namespace Path {
    const normalize: typeof normalizePathData;
    const isValid: typeof Util.isValid;
    const drawArc: typeof Util.drawArc;
    const drawPoints: typeof Util.drawPoints;
    const arcToCurves: typeof Util.arcToCurves;
}
