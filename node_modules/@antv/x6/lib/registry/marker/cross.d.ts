import { Attr } from '../attr';
import { Marker } from './index';
export interface CrossMarkerOptions extends Attr.SimpleAttrs {
    size?: number;
    width?: number;
    height?: number;
    offset?: number;
}
export declare const cross: Marker.Factory<CrossMarkerOptions>;
