import { ValuesType } from 'utility-types';
import { KeyValue } from '../../types';
import { Property } from '../../types/csstype';
import { Registry } from '../registry';
export declare namespace Background {
    interface Options {
        color?: string;
        image?: string;
        position?: Property.BackgroundPosition<{
            x: number;
            y: number;
        }>;
        size?: Property.BackgroundSize<{
            width: number;
            height: number;
        }>;
        repeat?: Property.BackgroundRepeat;
        opacity?: number;
    }
    interface CommonOptions extends Omit<Options, 'repeat'> {
        quality?: number;
    }
    type Definition<T extends CommonOptions = CommonOptions> = (img: HTMLImageElement, options: T) => HTMLCanvasElement;
}
export declare namespace Background {
    type Presets = typeof Background['presets'];
    type OptionsMap = {
        readonly [K in keyof Presets]-?: Parameters<Presets[K]>[1] & {
            repeat: K;
        };
    };
    type NativeNames = keyof Presets;
    type NativeItem = ValuesType<OptionsMap>;
    type ManaualItem = CommonOptions & KeyValue & {
        repeat: string;
    };
}
export declare namespace Background {
    const presets: {
        [name: string]: Definition;
    };
    const registry: Registry<Definition<CommonOptions>, {
        [name: string]: Definition<CommonOptions>;
    }, never>;
}
