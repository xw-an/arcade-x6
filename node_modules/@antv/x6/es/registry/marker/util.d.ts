/**
 * Normalizes marker's path data by translate the center
 * of an arbitrary path at <0 + offset,0>.
 */
export declare function normalize(d: string, offset: {
    x?: number;
    y?: number;
}): string;
export declare function normalize(d: string, offsetX?: number, offsetY?: number): string;
