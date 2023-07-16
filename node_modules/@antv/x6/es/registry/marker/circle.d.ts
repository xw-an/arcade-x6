import { Attr } from '../attr';
import { Marker } from './index';
export interface CircleMarkerOptions extends Attr.SimpleAttrs {
    r?: number;
}
export interface CirclePlusMarkerOptions extends CircleMarkerOptions {
}
export declare const circle: Marker.Factory<CircleMarkerOptions>;
export declare const circlePlus: Marker.Factory<CircleMarkerOptions>;
