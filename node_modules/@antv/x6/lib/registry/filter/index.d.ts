import { NonUndefined } from 'utility-types';
import { KeyValue } from '../../types';
import { Registry } from '../registry';
import * as filters from './main';
export declare namespace Filter {
    type Definition<T> = (args: T) => string;
    type CommonDefinition = Definition<KeyValue>;
}
export declare namespace Filter {
    type Presets = typeof Filter['presets'];
    type OptionsMap = {
        readonly [K in keyof Presets]-?: NonUndefined<Parameters<Presets[K]>[0]>;
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
export declare namespace Filter {
    const presets: typeof filters;
    const registry: Registry<CommonDefinition, typeof filters, never>;
}
