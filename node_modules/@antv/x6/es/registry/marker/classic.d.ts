import { KeyValue } from '../../types';
import { Marker } from './index';
interface Common {
    size?: number;
    width?: number;
    height?: number;
    offset?: number;
}
export interface BlockMarkerOptions extends Common, KeyValue {
    open?: boolean;
}
export interface ClassicMarkerOptions extends Common, KeyValue {
    factor?: number;
}
export declare const block: Marker.Factory<BlockMarkerOptions>;
export declare const classic: Marker.Factory<ClassicMarkerOptions>;
export {};
