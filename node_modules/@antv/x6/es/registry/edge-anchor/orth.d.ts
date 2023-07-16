import { ResolveOptions } from '../node-anchor/util';
import { EdgeAnchor } from './index';
export interface OrthEndpointOptions extends ResolveOptions {
    fallbackAt?: number | string;
}
export declare const orth: EdgeAnchor.Definition<OrthEndpointOptions>;
