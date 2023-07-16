/// <reference types="jquery" />
/// <reference types="jquery-mousewheel" />
import { Cell } from '../../model/cell';
import { Node } from '../../model/node';
import { Model } from '../../model/model';
import { View } from '../../view/view';
import { Graph } from '../../graph/graph';
import { EventArgs } from '../../graph/events';
import { Dnd } from '../dnd';
export declare class Stencil extends View {
    readonly options: Stencil.Options;
    readonly dnd: Dnd;
    protected readonly graphs: {
        [groupName: string]: Graph;
    };
    protected readonly $groups: {
        [groupName: string]: JQuery<HTMLElement>;
    };
    protected readonly $container: JQuery<HTMLDivElement>;
    protected readonly $content: JQuery<HTMLDivElement>;
    protected get targetScroller(): import("..").Scroller | null;
    protected get targetGraph(): Graph;
    protected get targetModel(): Model;
    constructor(options: Partial<Stencil.Options>);
    protected renderSearch(): JQuery<any>;
    protected startListening(): void;
    protected stopListening(): void;
    load(groups: {
        [groupName: string]: (Node | Node.Metadata)[];
    }): this;
    load(nodes: (Node | Node.Metadata)[], groupName?: string): this;
    protected loadGroup(cells: (Node | Node.Metadata)[], groupName?: string): this;
    protected onDragStart(args: EventArgs['node:mousedown']): void;
    protected filter(keyword: string, filter?: Stencil.Filter): void;
    protected isCellMatched(cell: Cell, keyword: string, filters: Stencil.Filters | undefined, ignoreCase: boolean): boolean;
    protected onSearch(evt: JQuery.TriggeredEvent): void;
    protected onSearchFocusIn(): void;
    protected onSearchFocusOut(): void;
    protected onTitleClick(): void;
    protected onGroupTitleClick(evt: JQuery.TriggeredEvent): void;
    protected getModel(groupName?: string): Model | null;
    protected getGraph(groupName?: string): Graph;
    protected getGroup(groupName?: string): Stencil.Group | null | undefined;
    toggleGroup(groupName: string): this;
    collapseGroup(groupName: string): this;
    expandGroup(groupName: string): this;
    isGroupCollapsable(groupName: string): boolean;
    isGroupCollapsed(groupName: string): boolean;
    collapseGroups(): this;
    expandGroups(): this;
    resizeGroup(groupName: string, size: {
        width: number;
        height: number;
    }): this;
    onRemove(): void;
}
export declare namespace Stencil {
    interface Options extends Dnd.Options {
        title: string;
        groups?: Group[];
        search?: Filter;
        placeholder?: string;
        notFoundText?: string;
        collapsable?: boolean;
        stencilGraphWidth: number;
        stencilGraphHeight: number;
        stencilGraphOptions?: Graph.Options;
        stencilGraphPadding?: number;
        layout?: (this: Stencil, model: Model, group?: Group | null) => any;
        layoutOptions?: any;
    }
    type Filter = Filters | FilterFn | boolean;
    type Filters = {
        [shape: string]: string | string[] | boolean;
    };
    type FilterFn = (this: Stencil, cell: Node, keyword: string, groupName: string | null, stencil: Stencil) => boolean;
    interface Group {
        name: string;
        title?: string;
        collapsed?: boolean;
        collapsable?: boolean;
        graphWidth?: number;
        graphHeight?: number;
        graphPadding?: number;
        graphOptions?: Graph.Options;
        layout?: (this: Stencil, model: Model, group?: Group | null) => any;
        layoutOptions?: any;
    }
    const defaultOptions: Partial<Options>;
}
