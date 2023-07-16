import { Node } from '../model/node';
import { Knob } from '../addon/knob';
import { Base } from './base';
import { EventArgs } from './events';
export declare class KnobManager extends Base {
    protected widgets: Map<Node, Knob[]>;
    protected get isSelectionEnabled(): boolean;
    protected init(): void;
    protected startListening(): void;
    protected stopListening(): void;
    protected onNodeMouseUp({ node }: EventArgs['node:mouseup']): void;
    protected onNodeSelected({ node }: EventArgs['node:selected']): void;
    protected onNodeUnSelected({ node }: EventArgs['node:unselected']): void;
}
