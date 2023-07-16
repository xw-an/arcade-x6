import { Attr } from '../attr';
import { Marker } from './index';
export interface DiamondMarkerOptions extends Attr.SimpleAttrs {
    size?: number;
    width?: number;
    height?: number;
    offset?: number;
}
export declare const diamond: Marker.Factory<DiamondMarkerOptions>;
