import { ManhattanRouterOptions } from './manhattan/options';
import { Router } from './index';
export interface MetroRouterOptions extends ManhattanRouterOptions {
}
export declare const metro: Router.Definition<Partial<MetroRouterOptions>>;
