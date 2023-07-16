import { Router } from './index';
import * as Util from './util';
export interface OrthRouterOptions extends Util.PaddingOptions {
}
/**
 * Returns a route with orthogonal line segments.
 */
export declare const orth: Router.Definition<OrthRouterOptions>;
