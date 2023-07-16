import { KeyValue } from '../../types';
import { Registry } from '../registry';
import { Attr } from '../attr';
import * as markers from './main';
import { normalize as normalizeMarker } from './util';
export declare namespace Marker {
    type Factory<T extends KeyValue = KeyValue> = (options: T) => Result;
    interface BaseResult extends Attr.SimpleAttrs {
        tagName?: string;
    }
    type Result = BaseResult & {
        id?: string;
        refX?: number;
        refY?: number;
        markerUnits?: string;
        markerOrient?: 'auto' | 'auto-start-reverse' | number;
        children?: BaseResult[];
    };
}
export declare namespace Marker {
    type Presets = typeof Marker['presets'];
    type OptionsMap = {
        readonly [K in keyof Presets]-?: Parameters<Presets[K]>[0];
    };
    type NativeNames = keyof OptionsMap;
    interface NativeItem<T extends NativeNames = NativeNames> {
        name: T;
        args?: OptionsMap[T];
    }
    interface ManaualItem {
        name: Exclude<string, NativeNames>;
        args?: KeyValue;
    }
}
export declare namespace Marker {
    const presets: typeof markers;
    const registry: Registry<Factory<KeyValue<any>>, typeof markers, never>;
}
export declare namespace Marker {
    const normalize: typeof normalizeMarker;
}
