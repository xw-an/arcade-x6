import { PortLabelLayout } from './index';
export interface RadialArgs extends PortLabelLayout.CommonOptions {
    offset?: number;
}
export declare const radial: PortLabelLayout.Definition<RadialArgs>;
export declare const radialOriented: PortLabelLayout.Definition<RadialArgs>;
