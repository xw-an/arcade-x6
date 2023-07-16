import { PortLayout } from './index';
export interface AbsoluteArgs {
    x?: string | number;
    y?: string | number;
    angle?: number;
}
export declare const absolute: PortLayout.Definition<AbsoluteArgs>;
