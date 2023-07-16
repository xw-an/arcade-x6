import { Connector } from './index';
export interface SmoothConnectorOptions extends Connector.BaseOptions {
    direction?: 'H' | 'V';
}
export declare const smooth: Connector.Definition<SmoothConnectorOptions>;
