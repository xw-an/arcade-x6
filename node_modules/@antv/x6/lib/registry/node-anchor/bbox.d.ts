import { NodeAnchor } from './index';
export interface BBoxEndpointOptions {
    dx?: number | string;
    dy?: number | string;
    /**
     * Should the anchor bbox rotate with the terminal view.
     *
     * Default is `false`, meaning that the unrotated bbox is used.
     */
    rotate?: boolean;
}
export declare const center: NodeAnchor.Definition<BBoxEndpointOptions>;
export declare const top: NodeAnchor.Definition<BBoxEndpointOptions>;
export declare const bottom: NodeAnchor.Definition<BBoxEndpointOptions>;
export declare const left: NodeAnchor.Definition<BBoxEndpointOptions>;
export declare const right: NodeAnchor.Definition<BBoxEndpointOptions>;
export declare const topLeft: NodeAnchor.Definition<BBoxEndpointOptions>;
export declare const topRight: NodeAnchor.Definition<BBoxEndpointOptions>;
export declare const bottomLeft: NodeAnchor.Definition<BBoxEndpointOptions>;
export declare const bottomRight: NodeAnchor.Definition<BBoxEndpointOptions>;
