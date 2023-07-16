import { Basecoat } from '../common';
import { Cell } from './cell';
import { Node } from './node';
import { Edge } from './edge';
export declare class Collection extends Basecoat<Collection.EventArgs> {
    length: number;
    comparator: Collection.Comparator | null;
    private cells;
    private map;
    constructor(cells: Cell | Cell[], options?: Collection.Options);
    toJSON(): Cell.Properties[];
    add(cells: Cell | Cell[], options?: Collection.AddOptions): this;
    add(cells: Cell | Cell[], index: number, options?: Collection.AddOptions): this;
    remove(cell: Cell, options?: Collection.RemoveOptions): Cell;
    remove(cells: Cell[], options?: Collection.RemoveOptions): Cell[];
    protected removeCells(cells: Cell[], options: Collection.RemoveOptions): Cell<Cell.Properties>[];
    reset(cells: Cell | Cell[], options?: Collection.SetOptions): this;
    push(cell: Cell, options?: Collection.SetOptions): this;
    pop(options?: Collection.SetOptions): Cell<Cell.Properties>;
    unshift(cell: Cell, options?: Collection.SetOptions): this;
    shift(options?: Collection.SetOptions): Cell<Cell.Properties>;
    get(cell?: string | number | Cell | null): Cell | null;
    has(cell: string | Cell): boolean;
    at(index: number): Cell | null;
    first(): Cell<Cell.Properties> | null;
    last(): Cell<Cell.Properties> | null;
    indexOf(cell: Cell): number;
    toArray(): Cell<Cell.Properties>[];
    sort(options?: Collection.SetOptions): this;
    clone(): Collection;
    protected reference(cell: Cell): void;
    protected unreference(cell: Cell): void;
    protected notifyCellEvent<K extends keyof Cell.EventArgs>(name: K, args: Cell.EventArgs[K]): void;
    protected clean(): void;
}
export declare namespace Collection {
    type Comparator = string | string[] | ((cell: Cell) => number);
    interface Options {
        comparator?: Comparator;
    }
    interface SetOptions extends Cell.SetOptions {
    }
    interface RemoveOptions extends Cell.SetOptions {
        /**
         * The default is to remove all the associated links.
         * Set `disconnectEdges` option to `true` to disconnect edges
         * when a cell is removed.
         */
        disconnectEdges?: boolean;
        dryrun?: boolean;
    }
    interface AddOptions extends SetOptions {
        sort?: boolean;
        merge?: boolean;
        dryrun?: boolean;
    }
}
export declare namespace Collection {
    export interface EventArgs extends CellEventArgs, NodeEventArgs, EdgeEventArgs {
        sorted?: null;
        reseted: {
            current: Cell[];
            previous: Cell[];
            options: SetOptions;
        };
        updated: {
            added: Cell[];
            merged: Cell[];
            removed: Cell[];
            options: SetOptions;
        };
        added: {
            cell: Cell;
            index: number;
            options: AddOptions;
        };
        removed: {
            cell: Cell;
            index: number;
            options: RemoveOptions;
        };
    }
    interface NodeEventCommonArgs {
        node: Node;
    }
    interface EdgeEventCommonArgs {
        edge: Edge;
    }
    export interface CellEventArgs {
        'cell:transition:start': Cell.EventArgs['transition:start'];
        'cell:transition:progress': Cell.EventArgs['transition:progress'];
        'cell:transition:complete': Cell.EventArgs['transition:complete'];
        'cell:transition:stop': Cell.EventArgs['transition:stop'];
        'cell:transition:finish': Cell.EventArgs['transition:finish'];
        'cell:changed': Cell.EventArgs['changed'];
        'cell:added': Cell.EventArgs['added'];
        'cell:removed': Cell.EventArgs['removed'];
        'cell:change:*': Cell.EventArgs['change:*'];
        'cell:change:attrs': Cell.EventArgs['change:attrs'];
        'cell:change:zIndex': Cell.EventArgs['change:zIndex'];
        'cell:change:markup': Cell.EventArgs['change:markup'];
        'cell:change:visible': Cell.EventArgs['change:visible'];
        'cell:change:parent': Cell.EventArgs['change:parent'];
        'cell:change:children': Cell.EventArgs['change:children'];
        'cell:change:tools': Cell.EventArgs['change:tools'];
        'cell:change:view': Cell.EventArgs['change:view'];
        'cell:change:data': Cell.EventArgs['change:data'];
        'cell:change:size': Cell.EventArgs['change:size'];
        'cell:change:angle': Cell.EventArgs['change:angle'];
        'cell:change:position': Cell.EventArgs['change:position'];
        'cell:change:ports': Cell.EventArgs['change:ports'];
        'cell:change:portMarkup': Cell.EventArgs['change:portMarkup'];
        'cell:change:portLabelMarkup': Cell.EventArgs['change:portLabelMarkup'];
        'cell:change:portContainerMarkup': Cell.EventArgs['change:portContainerMarkup'];
        'cell:ports:added': Cell.EventArgs['ports:added'];
        'cell:ports:removed': Cell.EventArgs['ports:removed'];
        'cell:change:source': Cell.EventArgs['change:source'];
        'cell:change:target': Cell.EventArgs['change:target'];
        'cell:change:router': Cell.EventArgs['change:router'];
        'cell:change:connector': Cell.EventArgs['change:connector'];
        'cell:change:vertices': Cell.EventArgs['change:vertices'];
        'cell:change:labels': Cell.EventArgs['change:labels'];
        'cell:change:defaultLabel': Cell.EventArgs['change:defaultLabel'];
        'cell:change:toolMarkup': Cell.EventArgs['change:toolMarkup'];
        'cell:change:doubleToolMarkup': Cell.EventArgs['change:doubleToolMarkup'];
        'cell:change:vertexMarkup': Cell.EventArgs['change:vertexMarkup'];
        'cell:change:arrowheadMarkup': Cell.EventArgs['change:arrowheadMarkup'];
        'cell:vertexs:added': Cell.EventArgs['vertexs:added'];
        'cell:vertexs:removed': Cell.EventArgs['vertexs:removed'];
        'cell:labels:added': Cell.EventArgs['labels:added'];
        'cell:labels:removed': Cell.EventArgs['labels:removed'];
        'cell:batch:start': Cell.EventArgs['batch:start'];
        'cell:batch:stop': Cell.EventArgs['batch:stop'];
    }
    export interface NodeEventArgs {
        'node:transition:start': NodeEventCommonArgs & Cell.EventArgs['transition:start'];
        'node:transition:progress': NodeEventCommonArgs & Cell.EventArgs['transition:progress'];
        'node:transition:complete': NodeEventCommonArgs & Cell.EventArgs['transition:complete'];
        'node:transition:stop': NodeEventCommonArgs & Cell.EventArgs['transition:stop'];
        'node:transition:finish': NodeEventCommonArgs & Cell.EventArgs['transition:finish'];
        'node:changed': NodeEventCommonArgs & CellEventArgs['cell:changed'];
        'node:added': NodeEventCommonArgs & CellEventArgs['cell:added'];
        'node:removed': NodeEventCommonArgs & CellEventArgs['cell:removed'];
        'node:change:*': NodeEventCommonArgs & Cell.EventArgs['change:*'];
        'node:change:attrs': NodeEventCommonArgs & Cell.EventArgs['change:attrs'];
        'node:change:zIndex': NodeEventCommonArgs & Cell.EventArgs['change:zIndex'];
        'node:change:markup': NodeEventCommonArgs & Cell.EventArgs['change:markup'];
        'node:change:visible': NodeEventCommonArgs & Cell.EventArgs['change:visible'];
        'node:change:parent': NodeEventCommonArgs & Cell.EventArgs['change:parent'];
        'node:change:children': NodeEventCommonArgs & Cell.EventArgs['change:children'];
        'node:change:tools': NodeEventCommonArgs & Cell.EventArgs['change:tools'];
        'node:change:view': NodeEventCommonArgs & Cell.EventArgs['change:view'];
        'node:change:data': NodeEventCommonArgs & Cell.EventArgs['change:data'];
        'node:change:size': NodeEventCommonArgs & Cell.EventArgs['change:size'];
        'node:change:position': NodeEventCommonArgs & Cell.EventArgs['change:position'];
        'node:change:angle': NodeEventCommonArgs & Cell.EventArgs['change:angle'];
        'node:change:ports': NodeEventCommonArgs & Cell.EventArgs['change:ports'];
        'node:change:portMarkup': NodeEventCommonArgs & Cell.EventArgs['change:portMarkup'];
        'node:change:portLabelMarkup': NodeEventCommonArgs & Cell.EventArgs['change:portLabelMarkup'];
        'node:change:portContainerMarkup': NodeEventCommonArgs & Cell.EventArgs['change:portContainerMarkup'];
        'node:ports:added': NodeEventCommonArgs & Cell.EventArgs['ports:added'];
        'node:ports:removed': NodeEventCommonArgs & Cell.EventArgs['ports:removed'];
        'node:batch:start': NodeEventCommonArgs & Cell.EventArgs['batch:start'];
        'node:batch:stop': NodeEventCommonArgs & Cell.EventArgs['batch:stop'];
    }
    export interface EdgeEventArgs {
        'edge:transition:start': EdgeEventCommonArgs & Cell.EventArgs['transition:start'];
        'edge:transition:progress': EdgeEventCommonArgs & Cell.EventArgs['transition:progress'];
        'edge:transition:complete': EdgeEventCommonArgs & Cell.EventArgs['transition:complete'];
        'edge:transition:stop': EdgeEventCommonArgs & Cell.EventArgs['transition:stop'];
        'edge:transition:finish': EdgeEventCommonArgs & Cell.EventArgs['transition:finish'];
        'edge:changed': EdgeEventCommonArgs & CellEventArgs['cell:changed'];
        'edge:added': EdgeEventCommonArgs & CellEventArgs['cell:added'];
        'edge:removed': EdgeEventCommonArgs & CellEventArgs['cell:removed'];
        'edge:change:*': EdgeEventCommonArgs & Cell.EventArgs['change:*'];
        'edge:change:attrs': EdgeEventCommonArgs & Cell.EventArgs['change:attrs'];
        'edge:change:zIndex': EdgeEventCommonArgs & Cell.EventArgs['change:zIndex'];
        'edge:change:markup': EdgeEventCommonArgs & Cell.EventArgs['change:markup'];
        'edge:change:visible': EdgeEventCommonArgs & Cell.EventArgs['change:visible'];
        'edge:change:parent': EdgeEventCommonArgs & Cell.EventArgs['change:parent'];
        'edge:change:children': EdgeEventCommonArgs & Cell.EventArgs['change:children'];
        'edge:change:tools': EdgeEventCommonArgs & Cell.EventArgs['change:tools'];
        'edge:change:data': EdgeEventCommonArgs & Cell.EventArgs['change:data'];
        'edge:change:source': EdgeEventCommonArgs & Cell.EventArgs['change:source'];
        'edge:change:target': EdgeEventCommonArgs & Cell.EventArgs['change:target'];
        'edge:change:router': EdgeEventCommonArgs & Cell.EventArgs['change:router'];
        'edge:change:connector': EdgeEventCommonArgs & Cell.EventArgs['change:connector'];
        'edge:change:vertices': EdgeEventCommonArgs & Cell.EventArgs['change:vertices'];
        'edge:change:labels': EdgeEventCommonArgs & Cell.EventArgs['change:labels'];
        'edge:change:defaultLabel': EdgeEventCommonArgs & Cell.EventArgs['change:defaultLabel'];
        'edge:change:toolMarkup': EdgeEventCommonArgs & Cell.EventArgs['change:toolMarkup'];
        'edge:change:doubleToolMarkup': EdgeEventCommonArgs & Cell.EventArgs['change:doubleToolMarkup'];
        'edge:change:vertexMarkup': EdgeEventCommonArgs & Cell.EventArgs['change:vertexMarkup'];
        'edge:change:arrowheadMarkup': EdgeEventCommonArgs & Cell.EventArgs['change:arrowheadMarkup'];
        'edge:vertexs:added': EdgeEventCommonArgs & Cell.EventArgs['vertexs:added'];
        'edge:vertexs:removed': EdgeEventCommonArgs & Cell.EventArgs['vertexs:removed'];
        'edge:labels:added': EdgeEventCommonArgs & Cell.EventArgs['labels:added'];
        'edge:labels:removed': EdgeEventCommonArgs & Cell.EventArgs['labels:removed'];
        'edge:batch:start': EdgeEventCommonArgs & Cell.EventArgs['batch:start'];
        'edge:batch:stop': EdgeEventCommonArgs & Cell.EventArgs['batch:stop'];
    }
    export {};
}
