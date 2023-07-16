import { KeyValue } from '../types';
import { CellView } from './cell';
export declare class FlagManager {
    protected view: CellView;
    protected attrs: {
        [attr: string]: number;
    };
    protected flags: {
        [name: string]: number;
    };
    protected bootstrap: FlagManager.Actions;
    protected get cell(): import("..").Cell<import("..").Cell.Properties>;
    constructor(view: CellView, actions: KeyValue<FlagManager.Actions>, bootstrap?: FlagManager.Actions);
    getFlag(label: FlagManager.Actions): number;
    hasAction(flag: number, label: FlagManager.Actions): number;
    removeAction(flag: number, label: FlagManager.Actions): number;
    getBootstrapFlag(): number;
    getChangedFlag(): number;
}
export declare namespace FlagManager {
    type Action = 'render' | 'update' | 'resize' | 'scale' | 'rotate' | 'translate' | 'ports' | 'tools' | 'source' | 'target' | 'vertices' | 'labels' | 'widget';
    type Actions = Action | Action[];
}
