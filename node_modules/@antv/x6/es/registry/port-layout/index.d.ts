import { KeyValue } from '../../types';
import { Rectangle, Point } from '../../geometry';
import { Registry } from '../registry';
import * as layouts from './main';
export declare namespace PortLayout {
    const presets: typeof layouts;
    const registry: Registry<CommonDefinition, typeof layouts, never>;
}
export declare namespace PortLayout {
    interface Result {
        position: Point.PointLike;
        angle?: number;
    }
    interface CommonArgs {
        x?: number;
        y?: number;
        dx?: number;
        dy?: number;
    }
    type Definition<T> = (portsPositionArgs: T[], elemBBox: Rectangle, groupPositionArgs: T) => Result[];
    type CommonDefinition = Definition<KeyValue>;
}
export declare namespace PortLayout {
    type Presets = typeof PortLayout['presets'];
    type OptionsMap = {
        readonly [K in keyof Presets]-?: Parameters<Presets[K]>[2];
    };
    type NativeNames = keyof Presets;
    interface NativeItem<T extends NativeNames = NativeNames> {
        name: T;
        args?: OptionsMap[T];
    }
    interface ManaualItem {
        name: Exclude<string, NativeNames>;
        args?: CommonArgs;
    }
}
