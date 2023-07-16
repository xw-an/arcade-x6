import { Attr } from '../attr';
import { Marker } from './index';
export interface EllipseMarkerOptions extends Attr.SimpleAttrs {
    rx?: number;
    ry?: number;
}
export declare const ellipse: Marker.Factory<EllipseMarkerOptions>;
