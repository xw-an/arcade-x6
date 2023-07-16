import { ConnectionPoint } from './index';
export interface RectangleOptions extends ConnectionPoint.StrokedOptions {
}
/**
 * Places the connection point at the intersection between the
 * link path end segment and the element's unrotated bbox.
 */
export declare const rect: ConnectionPoint.Definition<RectangleOptions>;
