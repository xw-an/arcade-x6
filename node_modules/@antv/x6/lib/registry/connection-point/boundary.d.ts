import { Rectangle, Segment } from '../../geometry';
import { ConnectionPoint } from './index';
export interface BoundaryOptions extends ConnectionPoint.StrokedOptions {
    selector?: string | string[];
    insideout?: boolean;
    precision?: number;
    extrapolate?: boolean;
    sticky?: boolean;
}
export interface BoundaryCache {
    shapeBBox?: Rectangle | null;
    segmentSubdivisions?: Segment[][];
}
/**
 * Places the connection point at the intersection between the
 * edge path end segment and the actual shape of the target magnet.
 */
export declare const boundary: ConnectionPoint.Definition<BoundaryOptions>;
