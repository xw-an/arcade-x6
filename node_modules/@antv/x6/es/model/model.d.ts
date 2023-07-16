import { KeyValue } from '../types';
import { Basecoat, Dijkstra } from '../common';
import { Point, Rectangle } from '../geometry';
import { Graph } from '../graph';
import { Cell } from './cell';
import { Edge } from './edge';
import { Node } from './node';
import { Collection } from './collection';
export declare class Model extends Basecoat<Model.EventArgs> {
    readonly collection: Collection;
    protected readonly batches: KeyValue<number>;
    protected readonly addings: WeakMap<Cell, boolean>;
    graph: Graph | null;
    protected nodes: KeyValue<boolean>;
    protected edges: KeyValue<boolean>;
    protected outgoings: KeyValue<string[]>;
    protected incomings: KeyValue<string[]>;
    protected get [Symbol.toStringTag](): string;
    constructor(cells?: Cell[]);
    notify<Key extends keyof Model.EventArgs>(name: Key, args: Model.EventArgs[Key]): this;
    notify(name: Exclude<string, keyof Model.EventArgs>, args: any): this;
    protected setup(): void;
    protected sortOnChangeZ(): void;
    protected onCellAdded(cell: Cell): void;
    protected onCellRemoved(cell: Cell, options: Collection.RemoveOptions): void;
    protected onReset(cells: Cell[]): void;
    protected onEdgeTerminalChanged(edge: Edge, type: Edge.TerminalType): void;
    protected prepareCell(cell: Cell, options: Collection.AddOptions): Cell<Cell.Properties>;
    resetCells(cells: Cell[], options?: Collection.SetOptions): this;
    clear(options?: Cell.SetOptions): this;
    addNode(metadata: Node | Node.Metadata, options?: Model.AddOptions): Node<Node.Properties>;
    createNode(metadata: Node.Metadata): Node<Node.Properties>;
    addEdge(metadata: Edge.Metadata | Edge, options?: Model.AddOptions): Edge<Edge.Properties>;
    createEdge(metadata: Edge.Metadata): Edge<Edge.Properties>;
    addCell(cell: Cell | Cell[], options?: Model.AddOptions): this;
    addCells(cells: Cell[], options?: Model.AddOptions): this;
    removeCell(cellId: string, options?: Collection.RemoveOptions): Cell | null;
    removeCell(cell: Cell, options?: Collection.RemoveOptions): Cell | null;
    updateCellId(cell: Cell, newId: string): Cell<Cell.Properties>;
    removeCells(cells: (Cell | string)[], options?: Cell.RemoveOptions): (Cell<Cell.Properties> | null)[];
    removeConnectedEdges(cell: Cell | string, options?: Cell.RemoveOptions): Edge<Edge.Properties>[];
    disconnectConnectedEdges(cell: Cell | string, options?: Edge.SetOptions): void;
    has(id: string): boolean;
    has(cell: Cell): boolean;
    total(): number;
    indexOf(cell: Cell): number;
    /**
     * Returns a cell from the graph by its id.
     */
    getCell<T extends Cell = Cell>(id: string): T;
    /**
     * Returns all the nodes and edges in the graph.
     */
    getCells(): Cell<Cell.Properties>[];
    /**
     * Returns the first cell (node or edge) in the graph. The first cell is
     * defined as the cell with the lowest `zIndex`.
     */
    getFirstCell(): Cell<Cell.Properties> | null;
    /**
     * Returns the last cell (node or edge) in the graph. The last cell is
     * defined as the cell with the highest `zIndex`.
     */
    getLastCell(): Cell<Cell.Properties> | null;
    /**
     * Returns the lowest `zIndex` value in the graph.
     */
    getMinZIndex(): number;
    /**
     * Returns the highest `zIndex` value in the graph.
     */
    getMaxZIndex(): number;
    protected getCellsFromCache<T extends Cell = Cell>(cache: {
        [key: string]: boolean;
    }): T[];
    /**
     * Returns all the nodes in the graph.
     */
    getNodes(): Node<Node.Properties>[];
    /**
     * Returns all the edges in the graph.
     */
    getEdges(): Edge<Edge.Properties>[];
    /**
     * Returns all outgoing edges for the node.
     */
    getOutgoingEdges(cell: Cell | string): Edge<Edge.Properties>[] | null;
    /**
     * Returns all incoming edges for the node.
     */
    getIncomingEdges(cell: Cell | string): Edge<Edge.Properties>[] | null;
    /**
     * Returns edges connected with cell.
     */
    getConnectedEdges(cell: Cell | string, options?: Model.GetConnectedEdgesOptions): Edge<Edge.Properties>[];
    protected isBoundary(cell: Cell | string, isOrigin: boolean): boolean;
    protected getBoundaryNodes(isOrigin: boolean): Node<Node.Properties>[];
    /**
     * Returns an array of all the roots of the graph.
     */
    getRoots(): Node<Node.Properties>[];
    /**
     * Returns an array of all the leafs of the graph.
     */
    getLeafs(): Node<Node.Properties>[];
    /**
     * Returns `true` if the node is a root node, i.e. there is no edges
     * coming to the node.
     */
    isRoot(cell: Cell | string): boolean;
    /**
     * Returns `true` if the node is a leaf node, i.e. there is no edges
     * going out from the node.
     */
    isLeaf(cell: Cell | string): boolean;
    /**
     * Returns all the neighbors of node in the graph. Neighbors are all
     * the nodes connected to node via either incoming or outgoing edge.
     */
    getNeighbors(cell: Cell, options?: Model.GetNeighborsOptions): Cell<Cell.Properties>[];
    /**
     * Returns `true` if `cell2` is a neighbor of `cell1`.
     */
    isNeighbor(cell1: Cell, cell2: Cell, options?: Model.GetNeighborsOptions): boolean;
    getSuccessors(cell: Cell, options?: Model.GetPredecessorsOptions): Cell<Cell.Properties>[];
    /**
     * Returns `true` if `cell2` is a successor of `cell1`.
     */
    isSuccessor(cell1: Cell, cell2: Cell, options?: Model.GetPredecessorsOptions): boolean;
    getPredecessors(cell: Cell, options?: Model.GetPredecessorsOptions): Cell<Cell.Properties>[];
    /**
     * Returns `true` if `cell2` is a predecessor of `cell1`.
     */
    isPredecessor(cell1: Cell, cell2: Cell, options?: Model.GetPredecessorsOptions): boolean;
    protected matchDistance(distance: number, preset?: number | number[] | ((d: number) => boolean)): boolean;
    /**
     * Returns the common ancestor of the passed cells.
     */
    getCommonAncestor(...cells: (Cell | Cell[] | null | undefined)[]): Cell<Cell.Properties> | null;
    /**
     * Returns an array of cells that result from finding nodes/edges that
     * are connected to any of the cells in the cells array. This function
     * loops over cells and if the current cell is a edge, it collects its
     * source/target nodes; if it is an node, it collects its incoming and
     * outgoing edges if both the edge terminal (source/target) are in the
     * cells array.
     */
    getSubGraph(cells: Cell[], options?: Model.GetSubgraphOptions): Cell<Cell.Properties>[];
    /**
     * Clones the whole subgraph (including all the connected links whose
     * source/target is in the subgraph). If `options.deep` is `true`, also
     * take into account all the embedded cells of all the subgraph cells.
     *
     * Returns a map of the form: { [original cell ID]: [clone] }.
     */
    cloneSubGraph(cells: Cell[], options?: Model.GetSubgraphOptions): KeyValue<Cell<Cell.Properties>>;
    cloneCells(cells: Cell[]): KeyValue<Cell<Cell.Properties>>;
    /**
     * Returns an array of nodes whose bounding box contains point.
     * Note that there can be more then one node as nodes might overlap.
     */
    getNodesFromPoint(x: number, y: number): Node[];
    getNodesFromPoint(p: Point.PointLike): Node[];
    /**
     * Returns an array of nodes whose bounding box top/left coordinate
     * falls into the rectangle.
     */
    getNodesInArea(x: number, y: number, w: number, h: number, options?: Model.GetCellsInAreaOptions): Node[];
    getNodesInArea(rect: Rectangle.RectangleLike, options?: Model.GetCellsInAreaOptions): Node[];
    /**
     * Returns an array of edges whose bounding box top/left coordinate
     * falls into the rectangle.
     */
    getEdgesInArea(x: number, y: number, w: number, h: number, options?: Model.GetCellsInAreaOptions): Edge[];
    getEdgesInArea(rect: Rectangle.RectangleLike, options?: Model.GetCellsInAreaOptions): Edge[];
    getNodesUnderNode(node: Node, options?: {
        by?: 'bbox' | Rectangle.KeyPoint;
    }): Node<Node.Properties>[];
    /**
     * Returns the bounding box that surrounds all cells in the graph.
     */
    getAllCellsBBox(): Rectangle | null;
    /**
     * Returns the bounding box that surrounds all the given cells.
     */
    getCellsBBox(cells: Cell[], options?: Cell.GetCellsBBoxOptions): Rectangle | null;
    search(cell: Cell, iterator: Model.SearchIterator, options?: Model.SearchOptions): void;
    breadthFirstSearch(cell: Cell, iterator: Model.SearchIterator, options?: Model.GetNeighborsOptions): void;
    depthFirstSearch(cell: Cell, iterator: Model.SearchIterator, options?: Model.GetNeighborsOptions): void;
    /** *
     * Returns an array of IDs of nodes on the shortest
     * path between source and target.
     */
    getShortestPath(source: Cell | string, target: Cell | string, options?: Model.GetShortestPathOptions): string[];
    /**
     * Translate all cells in the graph by `tx` and `ty` pixels.
     */
    translate(tx: number, ty: number, options: Cell.TranslateOptions): this;
    resize(width: number, height: number, options: Cell.SetOptions): this;
    resizeCells(width: number, height: number, cells: Cell[], options?: Cell.SetOptions): this;
    toJSON(options?: Model.ToJSONOptions): {
        cells: Cell.Properties[];
    };
    parseJSON(data: Model.FromJSONData): (Edge<Edge.Properties> | Node<Node.Properties>)[];
    fromJSON(data: Model.FromJSONData, options?: Model.FromJSONOptions): this;
    startBatch(name: Model.BatchName, data?: KeyValue): this;
    stopBatch(name: Model.BatchName, data?: KeyValue): this;
    batchUpdate<T>(name: Model.BatchName, execute: () => T, data?: KeyValue): T;
    hasActiveBatch(name?: Model.BatchName | Model.BatchName[]): boolean;
}
export declare namespace Model {
    const toStringTag: string;
    function isModel(instance: any): instance is Model;
}
export declare namespace Model {
    interface SetOptions extends Collection.SetOptions {
    }
    interface AddOptions extends Collection.AddOptions {
    }
    interface RemoveOptions extends Collection.RemoveOptions {
    }
    interface FromJSONOptions extends Collection.SetOptions {
    }
    type FromJSONData = (Node.Metadata | Edge.Metadata)[] | (Partial<ReturnType<typeof toJSON>> & {
        nodes?: Node.Metadata[];
        edges?: Edge.Metadata[];
    });
    type ToJSONData = {
        cells: Cell.Properties[];
    };
    interface GetCellsInAreaOptions {
        strict?: boolean;
    }
    interface SearchOptions extends GetNeighborsOptions {
        breadthFirst?: boolean;
    }
    type SearchIterator = (this: Model, cell: Cell, distance: number) => any;
    interface GetNeighborsOptions {
        deep?: boolean;
        incoming?: boolean;
        outgoing?: boolean;
        indirect?: boolean;
    }
    interface GetConnectedEdgesOptions extends GetNeighborsOptions {
        enclosed?: boolean;
    }
    interface GetSubgraphOptions {
        deep?: boolean;
    }
    interface GetShortestPathOptions {
        directed?: boolean;
        weight?: Dijkstra.Weight;
    }
    interface GetPredecessorsOptions extends Cell.GetDescendantsOptions {
        distance?: number | number[] | ((distance: number) => boolean);
    }
}
export declare namespace Model {
    interface EventArgs extends Collection.CellEventArgs, Collection.NodeEventArgs, Collection.EdgeEventArgs {
        'batch:start': {
            name: BatchName | string;
            data: KeyValue;
        };
        'batch:stop': {
            name: BatchName | string;
            data: KeyValue;
        };
        sorted: null;
        reseted: {
            current: Cell[];
            previous: Cell[];
            options: Collection.SetOptions;
        };
        updated: {
            added: Cell[];
            merged: Cell[];
            removed: Cell[];
            options: Collection.SetOptions;
        };
    }
    type BatchName = 'update' | 'add' | 'remove' | 'clear' | 'to-back' | 'to-front' | 'scale' | 'resize' | 'rotate' | 'translate' | 'mouse' | 'layout' | 'add-edge' | 'fit-embeds' | 'dnd' | 'halo' | 'cut' | 'paste' | 'knob' | 'add-vertex' | 'move-anchor' | 'move-vertex' | 'move-segment' | 'move-arrowhead' | 'move-selection';
}
export declare namespace Model {
    interface ToJSONOptions extends Cell.ToJSONOptions {
    }
    function toJSON(cells: Cell[], options?: ToJSONOptions): {
        cells: Cell.Properties[];
    };
    function fromJSON(data: FromJSONData): (Edge<Edge.Properties> | Node<Node.Properties>)[];
}
