import { KeyValue } from '../../types';
import { Point } from '../../geometry';
import { Edge } from '../../model/edge';
import { EdgeView } from '../../view';
import { Registry } from '../registry';
import * as anchors from './main';
export declare namespace EdgeAnchor {
    type Definition<T> = (this: EdgeView, view: EdgeView, magnet: SVGElement, ref: Point | Point.PointLike | SVGElement, options: T, type: Edge.TerminalType) => Point;
    type CommonDefinition = Definition<KeyValue>;
    type ResolvedDefinition<T> = (this: EdgeView, view: EdgeView, magnet: SVGElement, refPoint: Point, options: T) => Point;
}
export declare namespace EdgeAnchor {
    type Presets = typeof EdgeAnchor['presets'];
    type OptionsMap = {
        readonly [K in keyof Presets]-?: Parameters<Presets[K]>[3];
    };
    type NativeNames = keyof Presets;
    interface NativeItem<T extends NativeNames = NativeNames> {
        name: T;
        args?: OptionsMap[T];
    }
    interface ManaualItem {
        name: Exclude<string, NativeNames>;
        args?: KeyValue;
    }
}
export declare namespace EdgeAnchor {
    const presets: typeof anchors;
    const registry: Registry<CommonDefinition, typeof anchors, never>;
}
