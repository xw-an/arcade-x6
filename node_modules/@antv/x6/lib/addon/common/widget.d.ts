import { KeyValue } from '../../types';
import { View, CellView } from '../../view';
import { Cell, Node, Edge, Model } from '../../model';
import { Graph } from '../../graph';
export declare class Widget<Options extends Widget.Options = Widget.Options, EventArgs = any> extends View<EventArgs> {
    private static readonly instanceCache;
    private static ensureCache;
    static register(instance: Widget, graph?: Graph): void;
    static unregister(instance: Widget, graph?: Graph): void;
    static removeInstances(graph: Graph): void;
    static getInstances(graph: Graph): KeyValue<Widget<Widget.Options, any>>;
    options: Options;
    readonly cell: Cell;
    readonly view: CellView;
    readonly model: Model;
    readonly graph: Graph;
    constructor(options: Options & (Types.ViewOptions | Types.CellOptions));
    protected init(options: Options): void;
    protected render(): this;
    protected startListening(): void;
    protected stopListening(): void;
    remove(): this;
    dispose(): void;
}
export declare namespace Widget {
    interface Options {
        /**
         * If set to `true` (the default value), clear all the existing widget
         * from the page when a new widget is created. This is the most common
         * behavior as it is assumed that there is only one widget visible on
         * the page at a time. However, some applications might need to have more
         * than one widget visible. In this case, set `clearAll` to `false` (and
         * make sure to call `remove()` once you don't need a widget anymore)
         */
        clearAll?: boolean;
        clearOnBlankMouseDown?: boolean;
    }
}
declare namespace Types {
    interface ViewOptions {
        view: CellView;
    }
    interface CellOptions {
        cell?: Cell;
        node?: Node;
        edge?: Edge;
        graph: Graph;
    }
}
export {};
