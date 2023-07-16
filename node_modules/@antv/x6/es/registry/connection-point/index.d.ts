import { KeyValue } from '../../types';
import { Point, Line } from '../../geometry';
import { Edge } from '../../model/edge';
import { CellView } from '../../view/cell';
import { Registry } from '../registry';
import * as connectionPoints from './main';
export declare namespace ConnectionPoint {
    type Definition<T> = (line: Line, view: CellView, magnet: SVGElement, options: T, type: Edge.TerminalType) => Point;
    type CommonDefinition = Definition<KeyValue>;
    interface BaseOptions {
        /**
         * Offset the connection point from the anchor by the specified
         * distance along the end edge path segment.
         *
         * Default is `0`.
         */
        offset?: number | Point.PointLike;
    }
    interface StrokedOptions extends BaseOptions {
        /**
         * If the stroke width should be included when calculating the
         * connection point.
         *
         * Default is `false`.
         */
        stroked?: boolean;
    }
}
export declare namespace ConnectionPoint {
    type Presets = typeof ConnectionPoint['presets'];
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
export declare namespace ConnectionPoint {
    const presets: typeof connectionPoints;
    const registry: Registry<CommonDefinition, typeof connectionPoints, never>;
}
