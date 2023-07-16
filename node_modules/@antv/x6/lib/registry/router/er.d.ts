import { Router } from './index';
export interface ErRouterOptions {
    min?: number;
    offset?: number | 'center';
    direction?: 'T' | 'B' | 'L' | 'R' | 'H' | 'V';
}
export declare const er: Router.Definition<ErRouterOptions>;
