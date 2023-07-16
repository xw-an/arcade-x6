import { Attr } from '../attr';
import { Marker } from './index';
export interface PathMarkerOptions extends Attr.SimpleAttrs {
    d: string;
    offsetX?: number;
    offsetY?: number;
}
export declare const path: Marker.Factory<PathMarkerOptions>;
