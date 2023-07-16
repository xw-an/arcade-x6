import { KeyValue } from '../../types';
import { CellView } from '../../view';
import { Registry } from '../registry';
import * as highlighters from './main';
export declare namespace Highlighter {
    interface Definition<T> {
        highlight: (cellView: CellView, magnet: Element, options: T) => void;
        unhighlight: (cellView: CellView, magnet: Element, options: T) => void;
    }
    type CommonDefinition = Highlighter.Definition<KeyValue>;
}
export declare namespace Highlighter {
    function check(name: string, highlighter: Highlighter.CommonDefinition): void;
}
export declare namespace Highlighter {
    type Presets = typeof Highlighter['presets'];
    type OptionsMap = {
        readonly [K in keyof Presets]-?: Parameters<Presets[K]['highlight']>[2];
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
export declare namespace Highlighter {
    const presets: typeof highlighters;
    const registry: Registry<CommonDefinition, typeof highlighters, never>;
}
