import { PortLayout } from './index';
export interface EllipseArgs extends PortLayout.CommonArgs {
    start?: number;
    step?: number;
    compensateRotate?: boolean;
    /**
     * delta radius
     */
    dr?: number;
}
export declare const ellipse: PortLayout.Definition<EllipseArgs>;
export declare const ellipseSpread: PortLayout.Definition<EllipseArgs>;
