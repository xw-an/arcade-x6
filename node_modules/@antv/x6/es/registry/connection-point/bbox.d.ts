import { ConnectionPoint } from './index';
export interface BBoxOptions extends ConnectionPoint.StrokedOptions {
}
/**
 * Places the connection point at the intersection between the edge
 * path end segment and the target node bbox.
 */
export declare const bbox: ConnectionPoint.Definition<BBoxOptions>;
