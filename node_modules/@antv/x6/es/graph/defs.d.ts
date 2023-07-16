import { Attr, Filter, Marker } from '../registry';
import { Base } from './base';
export declare class DefsManager extends Base {
    protected get cid(): string;
    protected get svg(): SVGSVGElement;
    protected get defs(): SVGDefsElement;
    protected isDefined(id: string): boolean;
    filter(options: DefsManager.FilterOptions): string;
    gradient(options: DefsManager.GradientOptions): string;
    marker(options: DefsManager.MarkerOptions): string;
    remove(id: string): void;
}
export declare namespace DefsManager {
    type MarkerOptions = Marker.Result;
    interface GradientOptions {
        id?: string;
        type: string;
        stops: {
            offset: number;
            color: string;
            opacity?: number;
        }[];
        attrs?: Attr.SimpleAttrs;
    }
    type FilterOptions = (Filter.NativeItem | Filter.ManaualItem) & {
        id?: string;
        attrs?: Attr.SimpleAttrs;
    };
}
