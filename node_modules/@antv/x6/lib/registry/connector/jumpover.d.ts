import { Connector } from './index';
export declare type JumpType = 'arc' | 'gap' | 'cubic';
export interface JumpoverConnectorOptions extends Connector.BaseOptions {
    size?: number;
    radius?: number;
    type?: JumpType;
    ignoreConnectors?: string[];
}
export declare const jumpover: Connector.Definition<JumpoverConnectorOptions>;
