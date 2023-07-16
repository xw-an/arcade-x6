import { KeyValue } from '../../../types';
import { Point, Rectangle } from '../../../geometry';
import { EdgeView } from '../../../view/edge';
import { ResolvedOptions, Direction } from './options';
export declare function getSourceBBox(view: EdgeView, options: ResolvedOptions): Rectangle;
export declare function getTargetBBox(view: EdgeView, options: ResolvedOptions): Rectangle;
export declare function getSourceEndpoint(view: EdgeView, options: ResolvedOptions): Point;
export declare function getTargetEndpoint(view: EdgeView, options: ResolvedOptions): Point;
export declare function getDirectionAngle(start: Point, end: Point, directionCount: number, grid: Grid, options: ResolvedOptions): number;
/**
 * Returns the change in direction between two direction angles.
 */
export declare function getDirectionChange(angle1: number, angle2: number): number;
export declare function getGridOffsets(grid: Grid, options: ResolvedOptions): {
    cost: number;
    offsetX: number;
    offsetY: number;
    angle?: number | undefined;
    gridOffsetX?: number | undefined;
    gridOffsetY?: number | undefined;
}[];
export interface Grid {
    source: Point;
    x: number;
    y: number;
}
export declare function getGrid(step: number, source: Point, target: Point): Grid;
export declare function round(point: Point, precision: number): Point;
export declare function align(point: Point, grid: Grid, precision: number): Point;
export declare function getKey(point: Point): string;
export declare function normalizePoint(point: Point.PointLike): Point;
export declare function getCost(from: Point, anchors: Point[]): number;
export declare function getRectPoints(anchor: Point, bbox: Rectangle, directionList: Direction[], grid: Grid, options: ResolvedOptions): Point[];
export declare function reconstructRoute(parents: KeyValue<Point>, points: KeyValue<Point>, tailPoint: Point, from: Point, to: Point): Point[];
