import { Point } from '../../geometry';
import { KeyValue } from '../../types';
import { Edge } from '../../model';
import { Graph } from '../../graph';
import { CellView } from '../../view';
import { Registry } from '../registry';
import * as strategies from './main';
export declare namespace ConnectionStrategy {
    type Definition = (this: Graph, terminal: Edge.TerminalCellData, cellView: CellView, magnet: Element, coords: Point.PointLike, edge: Edge, type: Edge.TerminalType, options: KeyValue) => Edge.TerminalCellData;
}
export declare namespace ConnectionStrategy {
    type Presets = typeof ConnectionStrategy['presets'];
    type NativeNames = keyof Presets;
    interface NativeItem<T extends NativeNames = NativeNames> {
        name: T;
        args?: KeyValue;
    }
    interface ManaualItem {
        name: Exclude<string, NativeNames>;
        args?: KeyValue;
    }
}
export declare namespace ConnectionStrategy {
    const presets: typeof strategies;
    const registry: Registry<Definition, typeof strategies, never>;
}
