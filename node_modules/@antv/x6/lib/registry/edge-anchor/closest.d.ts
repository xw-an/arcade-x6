import { ResolveOptions } from '../node-anchor/util';
import { EdgeAnchor } from './index';
export interface ClosestEndpointOptions extends ResolveOptions {
}
export declare const getClosestPoint: EdgeAnchor.ResolvedDefinition<ClosestEndpointOptions>;
export declare const closest: EdgeAnchor.Definition<ClosestEndpointOptions>;
