import { FunctionExt } from '../util';
import { Basecoat, Dijkstra } from '../common';
import { Rectangle } from '../geometry';
import { Cell } from './cell';
import { Edge } from './edge';
import { Node } from './node';
import { Collection } from './collection';
export class Model extends Basecoat {
    constructor(cells = []) {
        super();
        this.batches = {};
        this.addings = new WeakMap();
        this.nodes = {};
        this.edges = {};
        this.outgoings = {};
        this.incomings = {};
        this.collection = new Collection(cells);
        this.setup();
    }
    get [Symbol.toStringTag]() {
        return Model.toStringTag;
    }
    notify(name, args) {
        this.trigger(name, args);
        const graph = this.graph;
        if (graph) {
            if (name === 'sorted' || name === 'reseted' || name === 'updated') {
                graph.trigger(`model:${name}`, args);
            }
            else {
                graph.trigger(name, args);
            }
        }
        return this;
    }
    setup() {
        const collection = this.collection;
        collection.on('sorted', () => this.notify('sorted', null));
        collection.on('updated', (args) => this.notify('updated', args));
        collection.on('cell:change:zIndex', () => this.sortOnChangeZ());
        collection.on('added', ({ cell }) => {
            this.onCellAdded(cell);
        });
        collection.on('removed', (args) => {
            const cell = args.cell;
            this.onCellRemoved(cell, args.options);
            // Should trigger remove-event manually after cell was removed.
            this.notify('cell:removed', args);
            if (cell.isNode()) {
                this.notify('node:removed', Object.assign(Object.assign({}, args), { node: cell }));
            }
            else if (cell.isEdge()) {
                this.notify('edge:removed', Object.assign(Object.assign({}, args), { edge: cell }));
            }
        });
        collection.on('reseted', (args) => {
            this.onReset(args.current);
            this.notify('reseted', args);
        });
        collection.on('edge:change:source', ({ edge }) => this.onEdgeTerminalChanged(edge, 'source'));
        collection.on('edge:change:target', ({ edge }) => {
            this.onEdgeTerminalChanged(edge, 'target');
        });
    }
    sortOnChangeZ() {
        this.collection.sort();
    }
    onCellAdded(cell) {
        const cellId = cell.id;
        if (cell.isEdge()) {
            // Auto update edge's parent
            cell.updateParent();
            this.edges[cellId] = true;
            this.onEdgeTerminalChanged(cell, 'source');
            this.onEdgeTerminalChanged(cell, 'target');
        }
        else {
            this.nodes[cellId] = true;
        }
    }
    onCellRemoved(cell, options) {
        const cellId = cell.id;
        if (cell.isEdge()) {
            delete this.edges[cellId];
            const source = cell.getSource();
            const target = cell.getTarget();
            if (source && source.cell) {
                const cache = this.outgoings[source.cell];
                const index = cache ? cache.indexOf(cellId) : -1;
                if (index >= 0) {
                    cache.splice(index, 1);
                    if (cache.length === 0) {
                        delete this.outgoings[source.cell];
                    }
                }
            }
            if (target && target.cell) {
                const cache = this.incomings[target.cell];
                const index = cache ? cache.indexOf(cellId) : -1;
                if (index >= 0) {
                    cache.splice(index, 1);
                    if (cache.length === 0) {
                        delete this.incomings[target.cell];
                    }
                }
            }
        }
        else {
            delete this.nodes[cellId];
        }
        if (!options.clear) {
            if (options.disconnectEdges) {
                this.disconnectConnectedEdges(cell, options);
            }
            else {
                this.removeConnectedEdges(cell, options);
            }
        }
        if (cell.model === this) {
            cell.model = null;
        }
    }
    onReset(cells) {
        this.nodes = {};
        this.edges = {};
        this.outgoings = {};
        this.incomings = {};
        cells.forEach((cell) => this.onCellAdded(cell));
    }
    onEdgeTerminalChanged(edge, type) {
        const ref = type === 'source' ? this.outgoings : this.incomings;
        const prev = edge.previous(type);
        if (prev && prev.cell) {
            const cellId = Cell.isCell(prev.cell) ? prev.cell.id : prev.cell;
            const cache = ref[cellId];
            const index = cache ? cache.indexOf(edge.id) : -1;
            if (index >= 0) {
                cache.splice(index, 1);
                if (cache.length === 0) {
                    delete ref[cellId];
                }
            }
        }
        const terminal = edge.getTerminal(type);
        if (terminal && terminal.cell) {
            const terminalId = Cell.isCell(terminal.cell)
                ? terminal.cell.id
                : terminal.cell;
            const cache = ref[terminalId] || [];
            const index = cache.indexOf(edge.id);
            if (index === -1) {
                cache.push(edge.id);
            }
            ref[terminalId] = cache;
        }
    }
    prepareCell(cell, options) {
        if (!cell.model && (!options || !options.dryrun)) {
            cell.model = this;
        }
        if (cell.zIndex == null) {
            cell.setZIndex(this.getMaxZIndex() + 1, { silent: true });
        }
        return cell;
    }
    resetCells(cells, options = {}) {
        // Do not update model at this time. Because if we just update the graph
        // with the same json-data, the edge will reference to the old nodes.
        cells.map((cell) => this.prepareCell(cell, Object.assign(Object.assign({}, options), { dryrun: true })));
        this.collection.reset(cells, options);
        // Update model and trigger edge update it's references
        cells.map((cell) => this.prepareCell(cell, { options }));
        return this;
    }
    clear(options = {}) {
        const raw = this.getCells();
        if (raw.length === 0) {
            return this;
        }
        const localOptions = Object.assign(Object.assign({}, options), { clear: true });
        this.batchUpdate('clear', () => {
            // The nodes come after the edges.
            const cells = raw.sort((a, b) => {
                const v1 = a.isEdge() ? 1 : 2;
                const v2 = b.isEdge() ? 1 : 2;
                return v1 - v2;
            });
            while (cells.length > 0) {
                // Note that all the edges are removed first, so it's safe to
                // remove the nodes without removing the connected edges first.
                const cell = cells.shift();
                if (cell) {
                    cell.remove(localOptions);
                }
            }
        }, localOptions);
        return this;
    }
    addNode(metadata, options = {}) {
        const node = Node.isNode(metadata) ? metadata : this.createNode(metadata);
        this.addCell(node, options);
        return node;
    }
    createNode(metadata) {
        return Node.create(metadata);
    }
    addEdge(metadata, options = {}) {
        const edge = Edge.isEdge(metadata) ? metadata : this.createEdge(metadata);
        this.addCell(edge, options);
        return edge;
    }
    createEdge(metadata) {
        return Edge.create(metadata);
    }
    addCell(cell, options = {}) {
        if (Array.isArray(cell)) {
            return this.addCells(cell, options);
        }
        if (!this.collection.has(cell) && !this.addings.has(cell)) {
            this.addings.set(cell, true);
            this.collection.add(this.prepareCell(cell, options), options);
            cell.eachChild((child) => this.addCell(child, options));
            this.addings.delete(cell);
        }
        return this;
    }
    addCells(cells, options = {}) {
        const count = cells.length;
        if (count === 0) {
            return this;
        }
        const localOptions = Object.assign(Object.assign({}, options), { position: count - 1, maxPosition: count - 1 });
        this.startBatch('add', Object.assign(Object.assign({}, localOptions), { cells }));
        cells.forEach((cell) => {
            this.addCell(cell, localOptions);
            localOptions.position -= 1;
        });
        this.stopBatch('add', Object.assign(Object.assign({}, localOptions), { cells }));
        return this;
    }
    removeCell(obj, options = {}) {
        const cell = typeof obj === 'string' ? this.getCell(obj) : obj;
        if (cell && this.has(cell)) {
            return this.collection.remove(cell, options);
        }
        return null;
    }
    updateCellId(cell, newId) {
        this.startBatch('update', { id: newId });
        cell.prop('id', newId);
        const newCell = cell.clone({ keepId: true });
        this.addCell(newCell);
        // update connected edge terminal
        const edges = this.getConnectedEdges(cell);
        edges.forEach((edge) => {
            const sourceCell = edge.getSourceCell();
            const targetCell = edge.getTargetCell();
            if (sourceCell === cell) {
                edge.setSource(Object.assign(Object.assign({}, edge.getSource()), { cell: newId }));
            }
            if (targetCell === cell) {
                edge.setTarget(Object.assign(Object.assign({}, edge.getTarget()), { cell: newId }));
            }
        });
        this.removeCell(cell);
        this.stopBatch('update', { id: newId });
        return newCell;
    }
    removeCells(cells, options = {}) {
        if (cells.length) {
            return this.batchUpdate('remove', () => {
                return cells.map((cell) => this.removeCell(cell, options));
            });
        }
        return [];
    }
    removeConnectedEdges(cell, options = {}) {
        const edges = this.getConnectedEdges(cell);
        edges.forEach((edge) => {
            edge.remove(options);
        });
        return edges;
    }
    disconnectConnectedEdges(cell, options = {}) {
        const cellId = typeof cell === 'string' ? cell : cell.id;
        this.getConnectedEdges(cell).forEach((edge) => {
            const sourceCell = edge.getSourceCell();
            const targetCell = edge.getTargetCell();
            if (sourceCell && sourceCell.id === cellId) {
                edge.setSource({ x: 0, y: 0 }, options);
            }
            if (targetCell && targetCell.id === cellId) {
                edge.setTarget({ x: 0, y: 0 }, options);
            }
        });
    }
    has(obj) {
        return this.collection.has(obj);
    }
    total() {
        return this.collection.length;
    }
    indexOf(cell) {
        return this.collection.indexOf(cell);
    }
    /**
     * Returns a cell from the graph by its id.
     */
    getCell(id) {
        return this.collection.get(id);
    }
    /**
     * Returns all the nodes and edges in the graph.
     */
    getCells() {
        return this.collection.toArray();
    }
    /**
     * Returns the first cell (node or edge) in the graph. The first cell is
     * defined as the cell with the lowest `zIndex`.
     */
    getFirstCell() {
        return this.collection.first();
    }
    /**
     * Returns the last cell (node or edge) in the graph. The last cell is
     * defined as the cell with the highest `zIndex`.
     */
    getLastCell() {
        return this.collection.last();
    }
    /**
     * Returns the lowest `zIndex` value in the graph.
     */
    getMinZIndex() {
        const first = this.collection.first();
        return first ? first.getZIndex() || 0 : 0;
    }
    /**
     * Returns the highest `zIndex` value in the graph.
     */
    getMaxZIndex() {
        const last = this.collection.last();
        return last ? last.getZIndex() || 0 : 0;
    }
    getCellsFromCache(cache) {
        return cache
            ? Object.keys(cache)
                .map((id) => this.getCell(id))
                .filter((cell) => cell != null)
            : [];
    }
    /**
     * Returns all the nodes in the graph.
     */
    getNodes() {
        return this.getCellsFromCache(this.nodes);
    }
    /**
     * Returns all the edges in the graph.
     */
    getEdges() {
        return this.getCellsFromCache(this.edges);
    }
    /**
     * Returns all outgoing edges for the node.
     */
    getOutgoingEdges(cell) {
        const cellId = typeof cell === 'string' ? cell : cell.id;
        const cellIds = this.outgoings[cellId];
        return cellIds
            ? cellIds
                .map((id) => this.getCell(id))
                .filter((cell) => cell && cell.isEdge())
            : null;
    }
    /**
     * Returns all incoming edges for the node.
     */
    getIncomingEdges(cell) {
        const cellId = typeof cell === 'string' ? cell : cell.id;
        const cellIds = this.incomings[cellId];
        return cellIds
            ? cellIds
                .map((id) => this.getCell(id))
                .filter((cell) => cell && cell.isEdge())
            : null;
    }
    /**
     * Returns edges connected with cell.
     */
    getConnectedEdges(cell, options = {}) {
        const result = [];
        const node = typeof cell === 'string' ? this.getCell(cell) : cell;
        if (node == null) {
            return result;
        }
        const cache = {};
        const indirect = options.indirect;
        let incoming = options.incoming;
        let outgoing = options.outgoing;
        if (incoming == null && outgoing == null) {
            incoming = outgoing = true;
        }
        const collect = (cell, isOutgoing) => {
            const edges = isOutgoing
                ? this.getOutgoingEdges(cell)
                : this.getIncomingEdges(cell);
            if (edges != null) {
                edges.forEach((edge) => {
                    if (cache[edge.id]) {
                        return;
                    }
                    result.push(edge);
                    cache[edge.id] = true;
                    if (indirect) {
                        if (incoming) {
                            collect(edge, false);
                        }
                        if (outgoing) {
                            collect(edge, true);
                        }
                    }
                });
            }
            if (indirect && cell.isEdge()) {
                const terminal = isOutgoing
                    ? cell.getTargetCell()
                    : cell.getSourceCell();
                if (terminal && terminal.isEdge()) {
                    if (!cache[terminal.id]) {
                        result.push(terminal);
                        collect(terminal, isOutgoing);
                    }
                }
            }
        };
        if (outgoing) {
            collect(node, true);
        }
        if (incoming) {
            collect(node, false);
        }
        if (options.deep) {
            const descendants = node.getDescendants({ deep: true });
            const embedsCache = {};
            descendants.forEach((cell) => {
                if (cell.isNode()) {
                    embedsCache[cell.id] = true;
                }
            });
            const collectSub = (cell, isOutgoing) => {
                const edges = isOutgoing
                    ? this.getOutgoingEdges(cell.id)
                    : this.getIncomingEdges(cell.id);
                if (edges != null) {
                    edges.forEach((edge) => {
                        if (!cache[edge.id]) {
                            const sourceCell = edge.getSourceCell();
                            const targetCell = edge.getTargetCell();
                            if (!options.enclosed &&
                                sourceCell &&
                                embedsCache[sourceCell.id] &&
                                targetCell &&
                                embedsCache[targetCell.id]) {
                                return;
                            }
                            result.push(edge);
                            cache[edge.id] = true;
                        }
                    });
                }
            };
            descendants.forEach((cell) => {
                if (cell.isEdge()) {
                    return;
                }
                if (outgoing) {
                    collectSub(cell, true);
                }
                if (incoming) {
                    collectSub(cell, false);
                }
            });
        }
        return result;
    }
    isBoundary(cell, isOrigin) {
        const node = typeof cell === 'string' ? this.getCell(cell) : cell;
        const arr = isOrigin
            ? this.getIncomingEdges(node)
            : this.getOutgoingEdges(node);
        return arr == null || arr.length === 0;
    }
    getBoundaryNodes(isOrigin) {
        const result = [];
        Object.keys(this.nodes).forEach((nodeId) => {
            if (this.isBoundary(nodeId, isOrigin)) {
                const node = this.getCell(nodeId);
                if (node) {
                    result.push(node);
                }
            }
        });
        return result;
    }
    /**
     * Returns an array of all the roots of the graph.
     */
    getRoots() {
        return this.getBoundaryNodes(true);
    }
    /**
     * Returns an array of all the leafs of the graph.
     */
    getLeafs() {
        return this.getBoundaryNodes(false);
    }
    /**
     * Returns `true` if the node is a root node, i.e. there is no edges
     * coming to the node.
     */
    isRoot(cell) {
        return this.isBoundary(cell, true);
    }
    /**
     * Returns `true` if the node is a leaf node, i.e. there is no edges
     * going out from the node.
     */
    isLeaf(cell) {
        return this.isBoundary(cell, false);
    }
    /**
     * Returns all the neighbors of node in the graph. Neighbors are all
     * the nodes connected to node via either incoming or outgoing edge.
     */
    getNeighbors(cell, options = {}) {
        let incoming = options.incoming;
        let outgoing = options.outgoing;
        if (incoming == null && outgoing == null) {
            incoming = outgoing = true;
        }
        const edges = this.getConnectedEdges(cell, options);
        const map = edges.reduce((memo, edge) => {
            const hasLoop = edge.hasLoop(options);
            const sourceCell = edge.getSourceCell();
            const targetCell = edge.getTargetCell();
            if (incoming &&
                sourceCell &&
                sourceCell.isNode() &&
                !memo[sourceCell.id]) {
                if (hasLoop ||
                    (sourceCell !== cell &&
                        (!options.deep || !sourceCell.isDescendantOf(cell)))) {
                    memo[sourceCell.id] = sourceCell;
                }
            }
            if (outgoing &&
                targetCell &&
                targetCell.isNode() &&
                !memo[targetCell.id]) {
                if (hasLoop ||
                    (targetCell !== cell &&
                        (!options.deep || !targetCell.isDescendantOf(cell)))) {
                    memo[targetCell.id] = targetCell;
                }
            }
            return memo;
        }, {});
        if (cell.isEdge()) {
            if (incoming) {
                const sourceCell = cell.getSourceCell();
                if (sourceCell && sourceCell.isNode() && !map[sourceCell.id]) {
                    map[sourceCell.id] = sourceCell;
                }
            }
            if (outgoing) {
                const targetCell = cell.getTargetCell();
                if (targetCell && targetCell.isNode() && !map[targetCell.id]) {
                    map[targetCell.id] = targetCell;
                }
            }
        }
        return Object.keys(map).map((id) => map[id]);
    }
    /**
     * Returns `true` if `cell2` is a neighbor of `cell1`.
     */
    isNeighbor(cell1, cell2, options = {}) {
        let incoming = options.incoming;
        let outgoing = options.outgoing;
        if (incoming == null && outgoing == null) {
            incoming = outgoing = true;
        }
        return this.getConnectedEdges(cell1, options).some((edge) => {
            const sourceCell = edge.getSourceCell();
            const targetCell = edge.getTargetCell();
            if (incoming && sourceCell && sourceCell.id === cell2.id) {
                return true;
            }
            if (outgoing && targetCell && targetCell.id === cell2.id) {
                return true;
            }
            return false;
        });
    }
    getSuccessors(cell, options = {}) {
        const successors = [];
        this.search(cell, (curr, distance) => {
            if (curr !== cell && this.matchDistance(distance, options.distance)) {
                successors.push(curr);
            }
        }, Object.assign(Object.assign({}, options), { outgoing: true }));
        return successors;
    }
    /**
     * Returns `true` if `cell2` is a successor of `cell1`.
     */
    isSuccessor(cell1, cell2, options = {}) {
        let result = false;
        this.search(cell1, (curr, distance) => {
            if (curr === cell2 &&
                curr !== cell1 &&
                this.matchDistance(distance, options.distance)) {
                result = true;
                return false;
            }
        }, Object.assign(Object.assign({}, options), { outgoing: true }));
        return result;
    }
    getPredecessors(cell, options = {}) {
        const predecessors = [];
        this.search(cell, (curr, distance) => {
            if (curr !== cell && this.matchDistance(distance, options.distance)) {
                predecessors.push(curr);
            }
        }, Object.assign(Object.assign({}, options), { incoming: true }));
        return predecessors;
    }
    /**
     * Returns `true` if `cell2` is a predecessor of `cell1`.
     */
    isPredecessor(cell1, cell2, options = {}) {
        let result = false;
        this.search(cell1, (curr, distance) => {
            if (curr === cell2 &&
                curr !== cell1 &&
                this.matchDistance(distance, options.distance)) {
                result = true;
                return false;
            }
        }, Object.assign(Object.assign({}, options), { incoming: true }));
        return result;
    }
    matchDistance(distance, preset) {
        if (preset == null) {
            return true;
        }
        if (typeof preset === 'function') {
            return preset(distance);
        }
        if (Array.isArray(preset) && preset.includes(distance)) {
            return true;
        }
        return distance === preset;
    }
    /**
     * Returns the common ancestor of the passed cells.
     */
    getCommonAncestor(...cells) {
        const arr = [];
        cells.forEach((item) => {
            if (item) {
                if (Array.isArray(item)) {
                    arr.push(...item);
                }
                else {
                    arr.push(item);
                }
            }
        });
        return Cell.getCommonAncestor(...arr);
    }
    /**
     * Returns an array of cells that result from finding nodes/edges that
     * are connected to any of the cells in the cells array. This function
     * loops over cells and if the current cell is a edge, it collects its
     * source/target nodes; if it is an node, it collects its incoming and
     * outgoing edges if both the edge terminal (source/target) are in the
     * cells array.
     */
    getSubGraph(cells, options = {}) {
        const subgraph = [];
        const cache = {};
        const nodes = [];
        const edges = [];
        const collect = (cell) => {
            if (!cache[cell.id]) {
                subgraph.push(cell);
                cache[cell.id] = cell;
                if (cell.isEdge()) {
                    edges.push(cell);
                }
                if (cell.isNode()) {
                    nodes.push(cell);
                }
            }
        };
        cells.forEach((cell) => {
            collect(cell);
            if (options.deep) {
                const descendants = cell.getDescendants({ deep: true });
                descendants.forEach((descendant) => collect(descendant));
            }
        });
        edges.forEach((edge) => {
            // For edges, include their source & target
            const sourceCell = edge.getSourceCell();
            const targetCell = edge.getTargetCell();
            if (sourceCell && !cache[sourceCell.id]) {
                subgraph.push(sourceCell);
                cache[sourceCell.id] = sourceCell;
                if (sourceCell.isNode()) {
                    nodes.push(sourceCell);
                }
            }
            if (targetCell && !cache[targetCell.id]) {
                subgraph.push(targetCell);
                cache[targetCell.id] = targetCell;
                if (targetCell.isNode()) {
                    nodes.push(targetCell);
                }
            }
        });
        nodes.forEach((node) => {
            // For nodes, include their connected edges if their source/target
            // is in the subgraph.
            const edges = this.getConnectedEdges(node, options);
            edges.forEach((edge) => {
                const sourceCell = edge.getSourceCell();
                const targetCell = edge.getTargetCell();
                if (!cache[edge.id] &&
                    sourceCell &&
                    cache[sourceCell.id] &&
                    targetCell &&
                    cache[targetCell.id]) {
                    subgraph.push(edge);
                    cache[edge.id] = edge;
                }
            });
        });
        return subgraph;
    }
    /**
     * Clones the whole subgraph (including all the connected links whose
     * source/target is in the subgraph). If `options.deep` is `true`, also
     * take into account all the embedded cells of all the subgraph cells.
     *
     * Returns a map of the form: { [original cell ID]: [clone] }.
     */
    cloneSubGraph(cells, options = {}) {
        const subgraph = this.getSubGraph(cells, options);
        return this.cloneCells(subgraph);
    }
    cloneCells(cells) {
        return Cell.cloneCells(cells);
    }
    getNodesFromPoint(x, y) {
        const p = typeof x === 'number' ? { x, y: y || 0 } : x;
        return this.getNodes().filter((node) => {
            return node.getBBox().containsPoint(p);
        });
    }
    getNodesInArea(x, y, w, h, options) {
        const rect = typeof x === 'number'
            ? new Rectangle(x, y, w, h)
            : Rectangle.create(x);
        const opts = typeof x === 'number' ? options : y;
        const strict = opts && opts.strict;
        return this.getNodes().filter((node) => {
            const bbox = node.getBBox();
            return strict ? rect.containsRect(bbox) : rect.isIntersectWithRect(bbox);
        });
    }
    getEdgesInArea(x, y, w, h, options) {
        const rect = typeof x === 'number'
            ? new Rectangle(x, y, w, h)
            : Rectangle.create(x);
        const opts = typeof x === 'number' ? options : y;
        const strict = opts && opts.strict;
        return this.getEdges().filter((edge) => {
            const bbox = edge.getBBox();
            if (bbox.width === 0) {
                bbox.inflate(1, 0);
            }
            else if (bbox.height === 0) {
                bbox.inflate(0, 1);
            }
            return strict ? rect.containsRect(bbox) : rect.isIntersectWithRect(bbox);
        });
    }
    getNodesUnderNode(node, options = {}) {
        const bbox = node.getBBox();
        const nodes = options.by == null || options.by === 'bbox'
            ? this.getNodesInArea(bbox)
            : this.getNodesFromPoint(bbox[options.by]);
        return nodes.filter((curr) => node.id !== curr.id && !curr.isDescendantOf(node));
    }
    /**
     * Returns the bounding box that surrounds all cells in the graph.
     */
    getAllCellsBBox() {
        return this.getCellsBBox(this.getCells());
    }
    /**
     * Returns the bounding box that surrounds all the given cells.
     */
    getCellsBBox(cells, options = {}) {
        return Cell.getCellsBBox(cells, options);
    }
    // #region search
    search(cell, iterator, options = {}) {
        if (options.breadthFirst) {
            this.breadthFirstSearch(cell, iterator, options);
        }
        else {
            this.depthFirstSearch(cell, iterator, options);
        }
    }
    breadthFirstSearch(cell, iterator, options = {}) {
        const queue = [];
        const visited = {};
        const distance = {};
        queue.push(cell);
        distance[cell.id] = 0;
        while (queue.length > 0) {
            const next = queue.shift();
            if (next == null || visited[next.id]) {
                continue;
            }
            visited[next.id] = true;
            if (FunctionExt.call(iterator, this, next, distance[next.id]) === false) {
                continue;
            }
            const neighbors = this.getNeighbors(next, options);
            neighbors.forEach((neighbor) => {
                distance[neighbor.id] = distance[next.id] + 1;
                queue.push(neighbor);
            });
        }
    }
    depthFirstSearch(cell, iterator, options = {}) {
        const queue = [];
        const visited = {};
        const distance = {};
        queue.push(cell);
        distance[cell.id] = 0;
        while (queue.length > 0) {
            const next = queue.pop();
            if (next == null || visited[next.id]) {
                continue;
            }
            visited[next.id] = true;
            if (FunctionExt.call(iterator, this, next, distance[next.id]) === false) {
                continue;
            }
            const neighbors = this.getNeighbors(next, options);
            const lastIndex = queue.length;
            neighbors.forEach((neighbor) => {
                distance[neighbor.id] = distance[next.id] + 1;
                queue.splice(lastIndex, 0, neighbor);
            });
        }
    }
    // #endregion
    // #region shortest path
    /** *
     * Returns an array of IDs of nodes on the shortest
     * path between source and target.
     */
    getShortestPath(source, target, options = {}) {
        const adjacencyList = {};
        this.getEdges().forEach((edge) => {
            const sourceId = edge.getSourceCellId();
            const targetId = edge.getTargetCellId();
            if (sourceId && targetId) {
                if (!adjacencyList[sourceId]) {
                    adjacencyList[sourceId] = [];
                }
                if (!adjacencyList[targetId]) {
                    adjacencyList[targetId] = [];
                }
                adjacencyList[sourceId].push(targetId);
                if (!options.directed) {
                    adjacencyList[targetId].push(sourceId);
                }
            }
        });
        const sourceId = typeof source === 'string' ? source : source.id;
        const previous = Dijkstra.run(adjacencyList, sourceId, options.weight);
        const path = [];
        let targetId = typeof target === 'string' ? target : target.id;
        if (previous[targetId]) {
            path.push(targetId);
        }
        while ((targetId = previous[targetId])) {
            path.unshift(targetId);
        }
        return path;
    }
    // #endregion
    // #region transform
    /**
     * Translate all cells in the graph by `tx` and `ty` pixels.
     */
    translate(tx, ty, options) {
        this.getCells()
            .filter((cell) => !cell.hasParent())
            .forEach((cell) => cell.translate(tx, ty, options));
        return this;
    }
    resize(width, height, options) {
        return this.resizeCells(width, height, this.getCells(), options);
    }
    resizeCells(width, height, cells, options = {}) {
        const bbox = this.getCellsBBox(cells);
        if (bbox) {
            const sx = Math.max(width / bbox.width, 0);
            const sy = Math.max(height / bbox.height, 0);
            const origin = bbox.getOrigin();
            cells.forEach((cell) => cell.scale(sx, sy, origin, options));
        }
        return this;
    }
    // #endregion
    // #region serialize/deserialize
    toJSON(options = {}) {
        return Model.toJSON(this.getCells(), options);
    }
    parseJSON(data) {
        return Model.fromJSON(data);
    }
    fromJSON(data, options = {}) {
        const cells = this.parseJSON(data);
        this.resetCells(cells, options);
        return this;
    }
    // #endregion
    // #region batch
    startBatch(name, data = {}) {
        this.batches[name] = (this.batches[name] || 0) + 1;
        this.notify('batch:start', { name, data });
        return this;
    }
    stopBatch(name, data = {}) {
        this.batches[name] = (this.batches[name] || 0) - 1;
        this.notify('batch:stop', { name, data });
        return this;
    }
    batchUpdate(name, execute, data = {}) {
        this.startBatch(name, data);
        const result = execute();
        this.stopBatch(name, data);
        return result;
    }
    hasActiveBatch(name = Object.keys(this.batches)) {
        const names = Array.isArray(name) ? name : [name];
        return names.some((batch) => this.batches[batch] > 0);
    }
}
(function (Model) {
    Model.toStringTag = `X6.${Model.name}`;
    function isModel(instance) {
        if (instance == null) {
            return false;
        }
        if (instance instanceof Model) {
            return true;
        }
        const tag = instance[Symbol.toStringTag];
        const model = instance;
        if ((tag == null || tag === Model.toStringTag) &&
            typeof model.addNode === 'function' &&
            typeof model.addEdge === 'function' &&
            model.collection != null) {
            return true;
        }
        return false;
    }
    Model.isModel = isModel;
})(Model || (Model = {}));
(function (Model) {
    function toJSON(cells, options = {}) {
        return {
            cells: cells.map((cell) => cell.toJSON(options)),
        };
    }
    Model.toJSON = toJSON;
    function fromJSON(data) {
        const cells = [];
        if (Array.isArray(data)) {
            cells.push(...data);
        }
        else {
            if (data.cells) {
                cells.push(...data.cells);
            }
            if (data.nodes) {
                data.nodes.forEach((node) => {
                    if (node.shape == null) {
                        node.shape = 'rect';
                    }
                    cells.push(node);
                });
            }
            if (data.edges) {
                data.edges.forEach((edge) => {
                    if (edge.shape == null) {
                        edge.shape = 'edge';
                    }
                    cells.push(edge);
                });
            }
        }
        return cells.map((cell) => {
            const type = cell.shape;
            if (type) {
                if (Node.registry.exist(type)) {
                    return Node.create(cell);
                }
                if (Edge.registry.exist(type)) {
                    return Edge.create(cell);
                }
            }
            throw new Error('The `shape` should be specified when creating a node/edge instance');
        });
    }
    Model.fromJSON = fromJSON;
})(Model || (Model = {}));
//# sourceMappingURL=model.js.map