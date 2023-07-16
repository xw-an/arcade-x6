import { Point } from '../point';
export declare function isValid(data: any): boolean;
export interface DrawPointsOptions {
    round?: number;
    initialMove?: boolean;
    close?: boolean;
    exclude?: number[];
}
export declare function drawPoints(points: (Point.PointLike | Point.PointData)[], options?: DrawPointsOptions): string;
/**
 * Converts the given arc to a series of curves.
 */
export declare function arcToCurves(x0: number, y0: number, r1: number, r2: number, angle: number | undefined, largeArcFlag: number | undefined, sweepFlag: number | undefined, x: number, y: number): number[];
export declare function drawArc(startX: number, startY: number, rx: number, ry: number, xAxisRotation: number | undefined, largeArcFlag: 0 | 1 | undefined, sweepFlag: 0 | 1 | undefined, stopX: number, stopY: number): string;
