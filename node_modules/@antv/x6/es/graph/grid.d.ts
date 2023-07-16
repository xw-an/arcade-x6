import * as Registry from '../registry';
import { Base } from './base';
export declare class GridManager extends Base {
    protected instance: Registry.Grid | null;
    protected patterns: Registry.Grid.Definition[];
    protected get elem(): HTMLDivElement;
    protected get grid(): GridManager.Options;
    protected init(): void;
    protected startListening(): void;
    protected stopListening(): void;
    protected setVisible(visible: boolean): void;
    getGridSize(): number;
    setGridSize(size: number): void;
    show(): void;
    hide(): void;
    clear(): void;
    draw(options?: GridManager.DrawGridOptions): void;
    update(options?: Partial<Registry.Grid.Options> | Partial<Registry.Grid.Options>[]): void;
    protected getInstance(): Registry.Grid;
    protected resolveGrid(options?: GridManager.DrawGridOptions): Registry.Grid.Definition[] | never;
    dispose(): void;
}
export declare namespace GridManager {
    type DrawGridOptions = Registry.Grid.NativeItem | Registry.Grid.ManaualItem | {
        args?: Registry.Grid.OptionsMap['dot'];
    };
    interface CommonOptions {
        size: number;
        visible: boolean;
    }
    type Options = CommonOptions & DrawGridOptions;
}
