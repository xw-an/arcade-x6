import { KeyValue } from '../../types';
import { Marker } from './index';
export interface AsyncMarkerOptions extends KeyValue {
    width?: number;
    height?: number;
    offset?: number;
    open?: boolean;
    flip?: boolean;
}
export declare const async: Marker.Factory<AsyncMarkerOptions>;
