import { Connector } from './index';
export interface LoopConnectorOptions extends Connector.BaseOptions {
    split?: boolean | number;
}
export declare const loop: Connector.Definition<LoopConnectorOptions>;
