import { KeyValue } from '../../types';
import { Registry } from '../registry';
import * as patterns from './main';
export declare class Grid {
    root: Element;
    patterns: {
        [id: string]: Element;
    };
    constructor();
    add(id: string, elem: Element): void;
    get(id: string): Element;
    has(id: string): boolean;
}
export declare namespace Grid {
    export interface Options {
        color: string;
        thickness: number;
    }
    interface BaseDefinition<T extends Options = Options> extends Options {
        markup: string;
        update: (elem: Element, options: {
            sx: number;
            sy: number;
            ox: number;
            oy: number;
            width: number;
            height: number;
        } & T) => void;
    }
    export type Definition<T extends Options = Options> = T & BaseDefinition<T>;
    export type CommonDefinition = Definition<Grid.Options> | Definition<Grid.Options>[];
    export {};
}
export declare namespace Grid {
    const presets: typeof patterns;
    const registry: Registry<CommonDefinition, typeof patterns, never>;
}
export declare namespace Grid {
    type Presets = typeof Grid['presets'];
    type OptionsMap = {
        dot: patterns.DotOptions;
        fixedDot: patterns.FixedDotOptions;
        mesh: patterns.MeshOptions;
        doubleMesh: patterns.DoubleMeshOptions[];
    };
    type NativeNames = keyof Presets;
    interface NativeItem<T extends NativeNames = NativeNames> {
        type: T;
        args?: OptionsMap[T];
    }
    interface ManaualItem {
        type: Exclude<string, NativeNames>;
        args?: KeyValue;
    }
}
