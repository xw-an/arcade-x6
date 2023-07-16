import { ResolveOptions } from './util';
import { NodeAnchor } from './index';
export interface OrthEndpointOptions extends ResolveOptions {
    padding: number;
}
/**
 * Tries to place the anchor of the edge inside the view bbox so that the
 * edge is made orthogonal. The anchor is placed along two line segments
 * inside the view bbox (between the centers of the top and bottom side and
 * between the centers of the left and right sides). If it is not possible
 * to place the anchor so that the edge would be orthogonal, the anchor is
 * placed at the center of the view bbox instead.
 */
export declare const orth: NodeAnchor.Definition<OrthEndpointOptions>;
