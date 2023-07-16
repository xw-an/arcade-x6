import { PaddingOptions } from './util';
import { Router } from './index';
export interface OneSideRouterOptions extends PaddingOptions {
    side?: 'left' | 'top' | 'right' | 'bottom';
}
/**
 * Routes the edge always to/from a certain side
 */
export declare const oneSide: Router.Definition<OneSideRouterOptions>;
