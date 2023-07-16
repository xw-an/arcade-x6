import { Point } from '../../geometry';
import { PortLayout } from './index';
export interface SideArgs extends PortLayout.CommonArgs {
    strict?: boolean;
}
export interface LineArgs extends SideArgs {
    start?: Point.PointLike;
    end?: Point.PointLike;
}
export declare const line: PortLayout.Definition<LineArgs>;
export declare const left: PortLayout.Definition<SideArgs>;
export declare const right: PortLayout.Definition<SideArgs>;
export declare const top: PortLayout.Definition<SideArgs>;
export declare const bottom: PortLayout.Definition<SideArgs>;
