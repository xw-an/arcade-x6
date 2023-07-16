import { NodeAnchor } from './index';
export interface NodeCenterEndpointOptions {
    dx?: number;
    dy?: number;
}
/**
 * Places the anchor of the edge at center of the node bbox.
 */
export declare const nodeCenter: NodeAnchor.Definition<NodeCenterEndpointOptions>;
