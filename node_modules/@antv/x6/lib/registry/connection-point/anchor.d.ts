import { ConnectionPoint } from './index';
declare type Align = 'top' | 'right' | 'bottom' | 'left';
export interface AnchorOptions extends ConnectionPoint.BaseOptions {
    align?: Align;
    alignOffset?: number;
}
/**
 * Places the connection point at the edge's endpoint.
 */
export declare const anchor: ConnectionPoint.Definition<AnchorOptions>;
export {};
