import { NonUndefined } from 'utility-types';
import { Rectangle, Point } from '../geometry';
import { KeyValue, Size } from '../types';
import { Knob } from '../addon/knob';
import { Basecoat } from '../common';
import { Attr } from '../registry';
import { Markup, CellView } from '../view';
import { Graph } from '../graph';
import { Model } from './model';
import { Animation } from './animation';
import { PortManager } from './port';
import { Store } from './store';
import { Node } from './node';
import { Edge } from './edge';
export declare class Cell<Properties extends Cell.Properties = Cell.Properties> extends Basecoat<Cell.EventArgs> {
    protected static markup: Markup;
    protected static defaults: Cell.Defaults;
    protected static attrHooks: Attr.Definitions;
    protected static propHooks: Cell.PropHook[];
    static config<C extends Cell.Config = Cell.Config>(presets: C): void;
    static getMarkup(): Markup;
    static getDefaults<T extends Cell.Defaults = Cell.Defaults>(raw?: boolean): T;
    static getAttrHooks(): Attr.Definitions;
    static applyPropHooks(cell: Cell, metadata: Cell.Metadata): Cell.Metadata;
    protected get [Symbol.toStringTag](): string;
    readonly id: string;
    protected readonly store: Store<Cell.Properties>;
    protected readonly animation: Animation;
    protected _model: Model | null;
    protected _parent: Cell | null;
    protected _children: Cell[] | null;
    constructor(metadata?: Cell.Metadata);
    init(): void;
    get model(): Model | null;
    set model(model: Model | null);
    protected preprocess(metadata: Cell.Metadata, ignoreIdCheck?: boolean): Properties;
    protected postprocess(metadata: Cell.Metadata): void;
    protected setup(): void;
    notify<Key extends keyof Cell.EventArgs>(name: Key, args: Cell.EventArgs[Key]): this;
    notify(name: Exclude<string, keyof Cell.EventArgs>, args: any): this;
    isNode(): this is Node;
    isEdge(): this is Edge;
    isSameStore(cell: Cell): boolean;
    get view(): string | undefined;
    get shape(): string;
    getProp(): Properties;
    getProp<K extends keyof Properties>(key: K): Properties[K];
    getProp<K extends keyof Properties>(key: K, defaultValue: Properties[K]): NonUndefined<Properties[K]>;
    getProp<T>(key: string): T;
    getProp<T>(key: string, defaultValue: T): T;
    setProp<K extends keyof Properties>(key: K, value: Properties[K] | null | undefined | void, options?: Cell.SetOptions): this;
    setProp(key: string, value: any, options?: Cell.SetOptions): this;
    setProp(props: Partial<Properties>, options?: Cell.SetOptions): this;
    removeProp<K extends keyof Properties>(key: K | K[], options?: Cell.SetOptions): this;
    removeProp(key: string | string[], options?: Cell.SetOptions): this;
    removeProp(options?: Cell.SetOptions): this;
    hasChanged(): boolean;
    hasChanged<K extends keyof Properties>(key: K | null): boolean;
    hasChanged(key: string | null): boolean;
    getPropByPath<T>(path: string | string[]): T;
    setPropByPath(path: string | string[], value: any, options?: Cell.SetByPathOptions): this;
    removePropByPath(path: string | string[], options?: Cell.SetOptions): this;
    prop(): Properties;
    prop<K extends keyof Properties>(key: K): Properties[K];
    prop<T>(key: string): T;
    prop<T>(path: string[]): T;
    prop<K extends keyof Properties>(key: K, value: Properties[K] | null | undefined | void, options?: Cell.SetOptions): this;
    prop(key: string, value: any, options?: Cell.SetOptions): this;
    prop(path: string[], value: any, options?: Cell.SetOptions): this;
    prop(props: Partial<Properties>, options?: Cell.SetOptions): this;
    previous<K extends keyof Properties>(name: K): Properties[K] | undefined;
    previous<T>(name: string): T | undefined;
    get zIndex(): number | undefined | null;
    set zIndex(z: number | undefined | null);
    getZIndex(): number | undefined;
    setZIndex(z: number, options?: Cell.SetOptions): this;
    removeZIndex(options?: Cell.SetOptions): this;
    toFront(options?: Cell.ToFrontOptions): this;
    toBack(options?: Cell.ToBackOptions): this;
    get markup(): Markup | undefined | null;
    set markup(value: Markup | undefined | null);
    getMarkup(): Markup;
    setMarkup(markup: Markup, options?: Cell.SetOptions): this;
    removeMarkup(options?: Cell.SetOptions): this;
    get attrs(): Attr.CellAttrs | null | undefined;
    set attrs(value: Attr.CellAttrs | null | undefined);
    getAttrs(): {
        [x: string]: Attr.ComplexAttrs;
    };
    setAttrs(attrs: Attr.CellAttrs | null | undefined, options?: Cell.SetAttrOptions): this;
    replaceAttrs(attrs: Attr.CellAttrs, options?: Cell.SetOptions): this;
    updateAttrs(attrs: Attr.CellAttrs, options?: Cell.SetOptions): this;
    removeAttrs(options?: Cell.SetOptions): this;
    getAttrDefinition(attrName: string): string | Attr.Qualify | null;
    getAttrByPath(): Attr.CellAttrs;
    getAttrByPath<T>(path: string | string[]): T;
    setAttrByPath(path: string | string[], value: Attr.ComplexAttrValue, options?: Cell.SetOptions): this;
    removeAttrByPath(path: string | string[], options?: Cell.SetOptions): this;
    protected prefixAttrPath(path: string | string[]): string | string[];
    attr(): Attr.CellAttrs;
    attr<T>(path: string | string[]): T;
    attr(path: string | string[], value: Attr.ComplexAttrValue | null, options?: Cell.SetOptions): this;
    attr(attrs: Attr.CellAttrs, options?: Cell.SetAttrOptions): this;
    get visible(): boolean;
    set visible(value: boolean);
    setVisible(visible: boolean, options?: Cell.SetOptions): this;
    isVisible(): boolean;
    show(options?: Cell.SetOptions): this;
    hide(options?: Cell.SetOptions): this;
    toggleVisible(visible: boolean, options?: Cell.SetOptions): this;
    toggleVisible(options?: Cell.SetOptions): this;
    get data(): Properties['data'];
    set data(val: Properties['data']);
    getData<T = Properties['data']>(): T;
    setData<T = Properties['data']>(data: T, options?: Cell.SetDataOptions): this;
    replaceData<T = Properties['data']>(data: T, options?: Cell.SetOptions): this;
    updateData<T = Properties['data']>(data: T, options?: Cell.SetOptions): this;
    removeData(options?: Cell.SetOptions): this;
    get parent(): Cell | null;
    get children(): Cell<Cell.Properties>[] | null;
    getParentId(): string | undefined;
    getParent<T extends Cell = Cell>(): T | null;
    getChildren(): Cell<Cell.Properties>[] | null;
    hasParent(): boolean;
    isParentOf(child: Cell | null): boolean;
    isChildOf(parent: Cell | null): boolean;
    eachChild(iterator: (child: Cell, index: number, children: Cell[]) => void, context?: any): this;
    filterChild(filter: (cell: Cell, index: number, arr: Cell[]) => boolean, context?: any): Cell[];
    getChildCount(): number;
    getChildIndex(child: Cell): number;
    getChildAt(index: number): Cell<Cell.Properties> | null;
    getAncestors(options?: {
        deep?: boolean;
    }): Cell[];
    getDescendants(options?: Cell.GetDescendantsOptions): Cell[];
    isDescendantOf(ancestor: Cell | null, options?: {
        deep?: boolean;
    }): boolean;
    isAncestorOf(descendant: Cell | null, options?: {
        deep?: boolean;
    }): boolean;
    contains(cell: Cell | null): boolean;
    getCommonAncestor(...cells: (Cell | null | undefined)[]): Cell | null;
    setParent(parent: Cell | null, options?: Cell.SetOptions): this;
    setChildren(children: Cell[] | null, options?: Cell.SetOptions): this;
    unembed(child: Cell, options?: Cell.SetOptions): this;
    embed(child: Cell, options?: Cell.SetOptions): this;
    addTo(model: Model, options?: Cell.SetOptions): this;
    addTo(graph: Graph, options?: Cell.SetOptions): this;
    addTo(parent: Cell, options?: Cell.SetOptions): this;
    insertTo(parent: Cell, index?: number, options?: Cell.SetOptions): this;
    addChild(child: Cell | null, options?: Cell.SetOptions): this;
    insertChild(child: Cell | null, index?: number, options?: Cell.SetOptions): this;
    removeFromParent(options?: Cell.RemoveOptions): this;
    removeChild(child: Cell, options?: Cell.RemoveOptions): Cell<Cell.Properties> | null;
    removeChildAt(index: number, options?: Cell.RemoveOptions): Cell<Cell.Properties> | null;
    remove(options?: Cell.RemoveOptions): this;
    transition<K extends keyof Properties>(path: K, target: Properties[K], options?: Animation.StartOptions<Properties[K]>, delim?: string): () => void;
    transition<T extends Animation.TargetValue>(path: string | string[], target: T, options?: Animation.StartOptions<T>, delim?: string): () => void;
    stopTransition<T extends Animation.TargetValue>(path: string | string[], options?: Animation.StopOptions<T>, delim?: string): this;
    getTransitions(): string[];
    translate(tx: number, ty: number, options?: Cell.TranslateOptions): this;
    scale(sx: number, // eslint-disable-line
    sy: number, // eslint-disable-line
    origin?: Point | Point.PointLike, // eslint-disable-line
    options?: Node.SetOptions): this;
    addTools(items: Cell.ToolItem | Cell.ToolItem[], options?: Cell.AddToolOptions): void;
    addTools(items: Cell.ToolItem | Cell.ToolItem[], name: string, options?: Cell.AddToolOptions): void;
    setTools(tools?: Cell.ToolsLoose | null, options?: Cell.SetOptions): this;
    getTools(): Cell.Tools | null;
    removeTools(options?: Cell.SetOptions): this;
    hasTools(name?: string): boolean;
    hasTool(name: string): boolean;
    removeTool(name: string, options?: Cell.SetOptions): this;
    removeTool(index: number, options?: Cell.SetOptions): this;
    getBBox(options?: {
        deep?: boolean;
    }): Rectangle;
    getConnectionPoint(edge: Edge, type: Edge.TerminalType): Point;
    toJSON(options?: Cell.ToJSONOptions): this extends Node ? Node.Properties : this extends Edge ? Edge.Properties : Properties;
    clone(options?: Cell.CloneOptions): this extends Node ? Node : this extends Edge ? Edge : Cell;
    findView(graph: Graph): CellView | null;
    startBatch(name: Model.BatchName, data?: KeyValue, model?: Model | null): this;
    stopBatch(name: Model.BatchName, data?: KeyValue, model?: Model | null): this;
    batchUpdate<T>(name: Model.BatchName, execute: () => T, data?: KeyValue): T;
    dispose(): void;
}
export declare namespace Cell {
    interface Common {
        view?: string;
        shape?: string;
        markup?: Markup;
        attrs?: Attr.CellAttrs;
        zIndex?: number;
        visible?: boolean;
        data?: any;
        knob?: Knob.Metadata | Knob.Metadata[];
    }
    interface Defaults extends Common {
    }
    interface Metadata extends Common, KeyValue {
        id?: string;
        tools?: ToolsLoose;
    }
    interface Properties extends Defaults, Metadata {
        parent?: string;
        children?: string[];
        tools?: Tools;
    }
}
export declare namespace Cell {
    type ToolItem = string | {
        name: string;
        args?: any;
    };
    interface Tools {
        name?: string | null;
        local?: boolean;
        items: ToolItem[];
    }
    type ToolsLoose = ToolItem | ToolItem[] | Tools;
    function normalizeTools(raw: ToolsLoose): Tools;
}
export declare namespace Cell {
    interface SetOptions extends Store.SetOptions {
    }
    interface MutateOptions extends Store.MutateOptions {
    }
    interface RemoveOptions extends SetOptions {
        deep?: boolean;
    }
    interface SetAttrOptions extends SetOptions {
        deep?: boolean;
        overwrite?: boolean;
    }
    interface SetDataOptions extends SetOptions {
        deep?: boolean;
        overwrite?: boolean;
    }
    interface SetByPathOptions extends Store.SetByPathOptions {
    }
    interface ToFrontOptions extends SetOptions {
        deep?: boolean;
    }
    interface ToBackOptions extends ToFrontOptions {
    }
    interface TranslateOptions extends SetOptions {
        tx?: number;
        ty?: number;
        translateBy?: string | number;
    }
    interface AddToolOptions extends SetOptions {
        reset?: boolean;
        local?: boolean;
    }
    interface GetDescendantsOptions {
        deep?: boolean;
        breadthFirst?: boolean;
    }
    interface ToJSONOptions {
        diff?: boolean;
    }
    interface CloneOptions {
        deep?: boolean;
        keepId?: boolean;
    }
}
export declare namespace Cell {
    export interface EventArgs {
        'transition:start': Animation.CallbackArgs<Animation.TargetValue>;
        'transition:progress': Animation.ProgressArgs<Animation.TargetValue>;
        'transition:complete': Animation.CallbackArgs<Animation.TargetValue>;
        'transition:stop': Animation.StopArgs<Animation.TargetValue>;
        'transition:finish': Animation.CallbackArgs<Animation.TargetValue>;
        'change:*': ChangeAnyKeyArgs;
        'change:attrs': ChangeArgs<Attr.CellAttrs>;
        'change:zIndex': ChangeArgs<number>;
        'change:markup': ChangeArgs<Markup>;
        'change:visible': ChangeArgs<boolean>;
        'change:parent': ChangeArgs<string>;
        'change:children': ChangeArgs<string[]>;
        'change:tools': ChangeArgs<Tools>;
        'change:view': ChangeArgs<string>;
        'change:data': ChangeArgs<any>;
        'change:size': NodeChangeArgs<Size>;
        'change:angle': NodeChangeArgs<number>;
        'change:position': NodeChangeArgs<Point.PointLike>;
        'change:ports': NodeChangeArgs<PortManager.Port[]>;
        'change:portMarkup': NodeChangeArgs<Markup>;
        'change:portLabelMarkup': NodeChangeArgs<Markup>;
        'change:portContainerMarkup': NodeChangeArgs<Markup>;
        'ports:removed': {
            cell: Cell;
            node: Node;
            removed: PortManager.Port[];
        };
        'ports:added': {
            cell: Cell;
            node: Node;
            added: PortManager.Port[];
        };
        'change:source': EdgeChangeArgs<Edge.TerminalData>;
        'change:target': EdgeChangeArgs<Edge.TerminalData>;
        'change:terminal': EdgeChangeArgs<Edge.TerminalData> & {
            type: Edge.TerminalType;
        };
        'change:router': EdgeChangeArgs<Edge.RouterData>;
        'change:connector': EdgeChangeArgs<Edge.ConnectorData>;
        'change:vertices': EdgeChangeArgs<Point.PointLike[]>;
        'change:labels': EdgeChangeArgs<Edge.Label[]>;
        'change:defaultLabel': EdgeChangeArgs<Edge.Label>;
        'change:toolMarkup': EdgeChangeArgs<Markup>;
        'change:doubleToolMarkup': EdgeChangeArgs<Markup>;
        'change:vertexMarkup': EdgeChangeArgs<Markup>;
        'change:arrowheadMarkup': EdgeChangeArgs<Markup>;
        'vertexs:added': {
            cell: Cell;
            edge: Edge;
            added: Point.PointLike[];
        };
        'vertexs:removed': {
            cell: Cell;
            edge: Edge;
            removed: Point.PointLike[];
        };
        'labels:added': {
            cell: Cell;
            edge: Edge;
            added: Edge.Label[];
        };
        'labels:removed': {
            cell: Cell;
            edge: Edge;
            removed: Edge.Label[];
        };
        'batch:start': {
            name: Model.BatchName;
            data: KeyValue;
            cell: Cell;
        };
        'batch:stop': {
            name: Model.BatchName;
            data: KeyValue;
            cell: Cell;
        };
        changed: {
            cell: Cell;
            options: MutateOptions;
        };
        added: {
            cell: Cell;
            index: number;
            options: Cell.SetOptions;
        };
        removed: {
            cell: Cell;
            index: number;
            options: Cell.RemoveOptions;
        };
    }
    interface ChangeAnyKeyArgs<T extends keyof Properties = keyof Properties> {
        key: T;
        current: Properties[T];
        previous: Properties[T];
        options: MutateOptions;
        cell: Cell;
    }
    export interface ChangeArgs<T> {
        cell: Cell;
        current?: T;
        previous?: T;
        options: MutateOptions;
    }
    interface NodeChangeArgs<T> extends ChangeArgs<T> {
        node: Node;
    }
    interface EdgeChangeArgs<T> extends ChangeArgs<T> {
        edge: Edge;
    }
    export {};
}
export declare namespace Cell {
    const toStringTag: string;
    function isCell(instance: any): instance is Cell;
}
export declare namespace Cell {
    function getCommonAncestor(...cells: (Cell | null | undefined)[]): Cell | null;
    interface GetCellsBBoxOptions {
        deep?: boolean;
    }
    function getCellsBBox(cells: Cell[], options?: GetCellsBBoxOptions): Rectangle | null;
    function deepClone(cell: Cell): KeyValue<Cell<Properties>>;
    function cloneCells(cells: Cell[]): KeyValue<Cell<Properties>>;
}
export declare namespace Cell {
    type Definition = typeof Cell;
    type PropHook<M extends Metadata = Metadata, C extends Cell = Cell> = (this: C, metadata: M) => M;
    type PropHooks<M extends Metadata = Metadata, C extends Cell = Cell> = KeyValue<PropHook<M, C>> | PropHook<M, C> | PropHook<M, C>[];
    interface Config<M extends Metadata = Metadata, C extends Cell = Cell> extends Defaults, KeyValue {
        constructorName?: string;
        overwrite?: boolean;
        propHooks?: PropHooks<M, C>;
        attrHooks?: Attr.Definitions;
    }
}
export declare namespace Cell {
}
