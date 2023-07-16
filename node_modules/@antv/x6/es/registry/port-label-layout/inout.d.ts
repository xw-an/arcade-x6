import { PortLabelLayout } from './index';
export interface InOutArgs extends PortLabelLayout.CommonOptions {
    offset?: number;
}
export declare const outside: PortLabelLayout.Definition<InOutArgs>;
export declare const outsideOriented: PortLabelLayout.Definition<InOutArgs>;
export declare const inside: PortLabelLayout.Definition<InOutArgs>;
export declare const insideOriented: PortLabelLayout.Definition<InOutArgs>;
