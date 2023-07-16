/// <reference types="jquery" />
/// <reference types="jquery-mousewheel" />
import { KeyValue } from '../../types';
import { Rectangle, Point } from '../../geometry';
import { Cell } from '../../model/cell';
import { Node } from '../../model/node';
import { Edge } from '../../model/edge';
import { Model } from '../../model/model';
import { Collection } from '../../model/collection';
import { View } from '../../view/view';
import { CellView } from '../../view/cell';
import { Graph } from '../../graph/graph';
import { Renderer } from '../../graph/renderer';
import { Handle } from '../common';
export declare class Selection extends View<Selection.EventArgs> {
    readonly options: Selection.Options;
    protected readonly collection: Collection;
    protected $container: JQuery<HTMLElement>;
    protected $selectionContainer: JQuery<HTMLElement>;
    protected $selectionContent: JQuery<HTMLElement>;
    protected boxCount: number;
    protected boxesUpdated: boolean;
    get graph(): Graph;
    protected get boxClassName(): string;
    protected get $boxes(): JQuery<HTMLElement>;
    protected get handleOptions(): Selection.Options;
    constructor(options: Selection.Options);
    protected startListening(): void;
    protected stopListening(): void;
    protected onRemove(): void;
    protected onGraphTransformed(): void;
    protected onCellChanged(): void;
    protected translating: boolean;
    protected onNodePositionChanged({ node, options, }: Collection.EventArgs['node:change:position']): void;
    protected onModelUpdated({ removed }: Collection.EventArgs['updated']): void;
    isEmpty(): boolean;
    isSelected(cell: Cell | string): boolean;
    get length(): number;
    get cells(): Cell<Cell.Properties>[];
    select(cells: Cell | Cell[], options?: Selection.AddOptions): this;
    unselect(cells: Cell | Cell[], options?: Selection.RemoveOptions): this;
    reset(cells?: Cell | Cell[], options?: Selection.SetOptions): this;
    clean(options?: Selection.SetOptions): this;
    setFilter(filter?: Selection.Filter): void;
    setContent(content?: Selection.Content): void;
    startSelecting(evt: JQuery.MouseDownEvent): void;
    filter(cells: Cell[]): Cell<Cell.Properties>[];
    protected stopSelecting(evt: JQuery.MouseUpEvent): void;
    protected onMouseUp(evt: JQuery.MouseUpEvent): void;
    protected onSelectionBoxMouseDown(evt: JQuery.MouseDownEvent): void;
    protected startTranslating(evt: JQuery.MouseDownEvent): void;
    protected getSelectionOffset(client: Point, data: EventData.Translating): {
        dx: number;
        dy: number;
    };
    protected updateSelectedNodesPosition(offset: {
        dx: number;
        dy: number;
    }): void;
    protected autoScrollGraph(x: number, y: number): {
        scrollerX: number;
        scrollerY: number;
    };
    protected adjustSelection(evt: JQuery.MouseMoveEvent): void;
    protected translateSelectedNodes(dx: number, dy: number, exclude?: Cell, otherOptions?: KeyValue): void;
    protected getCellViewsInArea(rect: Rectangle): CellView<Cell<Cell.Properties>, CellView.Options>[];
    protected notifyBoxEvent<K extends keyof Selection.BoxEventArgs, T extends JQuery.TriggeredEvent>(name: K, e: T, x: number, y: number): void;
    protected getSelectedClassName(cell: Cell): string;
    protected addCellSelectedClassName(cell: Cell): void;
    protected removeCellUnSelectedClassName(cell: Cell): void;
    protected destroySelectionBox(cell: Cell): void;
    protected destroyAllSelectionBoxes(cells: Cell[]): void;
    hide(): void;
    protected showRubberband(): void;
    protected hideRubberband(): void;
    protected showSelected(): void;
    protected createContainer(): void;
    protected updateContainerPosition(offset: {
        dx: number;
        dy: number;
    }): void;
    protected updateContainer(): void;
    protected canShowSelectionBox(cell: Cell): boolean;
    protected createSelectionBox(cell: Cell): void;
    protected updateSelectionBoxes(options?: Renderer.RequestViewUpdateOptions): void;
    confirmUpdate(): number;
    protected getCellViewFromElem(elem: Element): CellView<Cell<Cell.Properties>, CellView.Options> | null;
    protected onCellRemoved({ cell }: Collection.EventArgs['removed']): void;
    protected onReseted({ previous, current }: Collection.EventArgs['reseted']): void;
    protected onCellAdded({ cell }: Collection.EventArgs['added']): void;
    protected listenCellRemoveEvent(cell: Cell): void;
    protected onCollectionUpdated({ added, removed, options, }: Collection.EventArgs['updated']): void;
    protected deleteSelectedCells(): void;
    protected startRotate({ e }: Handle.EventArgs): void;
    protected doRotate({ e }: Handle.EventArgs): void;
    protected stopRotate({ e }: Handle.EventArgs): void;
    protected startResize({ e }: Handle.EventArgs): void;
    protected doResize({ e, dx, dy }: Handle.EventArgs): void;
    protected stopResize({ e }: Handle.EventArgs): void;
    dispose(): void;
}
export declare namespace Selection {
    interface CommonOptions extends Handle.Options {
        model?: Model;
        collection?: Collection;
        className?: string;
        strict?: boolean;
        filter?: Filter;
        showEdgeSelectionBox?: boolean;
        showNodeSelectionBox?: boolean;
        movable?: boolean;
        following?: boolean;
        useCellGeometry?: boolean;
        content?: Content;
        rubberNode?: boolean;
        rubberEdge?: boolean;
        pointerEvents?: 'none' | 'auto';
    }
    interface Options extends CommonOptions {
        graph: Graph;
    }
    type Content = null | false | string | ((this: Graph, selection: Selection, contentElement: HTMLElement) => string);
    type Filter = null | (string | {
        id: string;
    })[] | ((this: Graph, cell: Cell) => boolean);
    interface SetOptions extends Collection.SetOptions {
        batch?: boolean;
    }
    interface AddOptions extends Collection.AddOptions {
    }
    interface RemoveOptions extends Collection.RemoveOptions {
    }
}
export declare namespace Selection {
    interface SelectionBoxEventArgs<T> {
        e: T;
        view: CellView;
        cell: Cell;
        x: number;
        y: number;
    }
    export interface BoxEventArgs {
        'box:mousedown': SelectionBoxEventArgs<JQuery.MouseDownEvent>;
        'box:mousemove': SelectionBoxEventArgs<JQuery.MouseMoveEvent>;
        'box:mouseup': SelectionBoxEventArgs<JQuery.MouseUpEvent>;
    }
    export interface SelectionEventArgs {
        'cell:selected': {
            cell: Cell;
            options: Model.SetOptions;
        };
        'node:selected': {
            cell: Cell;
            node: Node;
            options: Model.SetOptions;
        };
        'edge:selected': {
            cell: Cell;
            edge: Edge;
            options: Model.SetOptions;
        };
        'cell:unselected': {
            cell: Cell;
            options: Model.SetOptions;
        };
        'node:unselected': {
            cell: Cell;
            node: Node;
            options: Model.SetOptions;
        };
        'edge:unselected': {
            cell: Cell;
            edge: Edge;
            options: Model.SetOptions;
        };
        'selection:changed': {
            added: Cell[];
            removed: Cell[];
            selected: Cell[];
            options: Model.SetOptions;
        };
    }
    export interface EventArgs extends BoxEventArgs, SelectionEventArgs {
    }
    export {};
}
export interface Selection extends Handle {
}
declare namespace EventData {
    interface Common {
        action: 'selecting' | 'translating';
    }
    interface Selecting extends Common {
        action: 'selecting';
        moving?: boolean;
        clientX: number;
        clientY: number;
        offsetX: number;
        offsetY: number;
        scrollerX: number;
        scrollerY: number;
    }
    interface Translating extends Common {
        action: 'translating';
        clientX: number;
        clientY: number;
        originX: number;
        originY: number;
    }
    interface SelectionBox {
        activeView: CellView;
    }
    interface Rotation {
        rotated?: boolean;
        center: Point.PointLike;
        start: number;
        angles: {
            [id: string]: number;
        };
    }
    interface Resizing {
        resized?: boolean;
        bbox: Rectangle;
        cells: Cell[];
        minWidth: number;
        minHeight: number;
    }
}
export {};
