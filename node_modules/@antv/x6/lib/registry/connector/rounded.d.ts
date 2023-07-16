import { Connector } from './index';
export interface RoundedConnectorOptions extends Connector.BaseOptions {
    radius?: number;
}
export declare const rounded: Connector.Definition<RoundedConnectorOptions>;
