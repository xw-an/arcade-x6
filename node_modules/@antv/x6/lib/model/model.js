"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Model = void 0;
var util_1 = require("../util");
var common_1 = require("../common");
var geometry_1 = require("../geometry");
var cell_1 = require("./cell");
var edge_1 = require("./edge");
var node_1 = require("./node");
var collection_1 = require("./collection");
var Model = /** @class */ (function (_super) {
    __extends(Model, _super);
    function Model(cells) {
        if (cells === void 0) { cells = []; }
        var _this = _super.call(this) || this;
        _this.batches = {};
        _this.addings = new WeakMap();
        _this.nodes = {};
        _this.edges = {};
        _this.outgoings = {};
        _this.incomings = {};
        _this.collection = new collection_1.Collection(cells);
        _this.setup();
        return _this;
    }
    Object.defineProperty(Model.prototype, Symbol.toStringTag, {
        get: function () {
            return Model.toStringTag;
        },
        enumerable: false,
        configurable: true
    });
    Model.prototype.notify = function (name, args) {
        this.trigger(name, args);
        var graph = this.graph;
        if (graph) {
            if (name === 'sorted' || name === 'reseted' || name === 'updated') {
                graph.trigger("model:" + name, args);
            }
            else {
                graph.trigger(name, args);
            }
        }
        return this;
    };
    Model.prototype.setup = function () {
        var _this = this;
        var collection = this.collection;
        collection.on('sorted', function () { return _this.notify('sorted', null); });
        collection.on('updated', function (args) { return _this.notify('updated', args); });
        collection.on('cell:change:zIndex', function () { return _this.sortOnChangeZ(); });
        collection.on('added', function (_a) {
            var cell = _a.cell;
            _this.onCellAdded(cell);
        });
        collection.on('removed', function (args) {
            var cell = args.cell;
            _this.onCellRemoved(cell, args.options);
            // Should trigger remove-event manually after cell was removed.
            _this.notify('cell:removed', args);
            if (cell.isNode()) {
                _this.notify('node:removed', __assign(__assign({}, args), { node: cell }));
            }
            else if (cell.isEdge()) {
                _this.notify('edge:removed', __assign(__assign({}, args), { edge: cell }));
            }
        });
        collection.on('reseted', function (args) {
            _this.onReset(args.current);
            _this.notify('reseted', args);
        });
        collection.on('edge:change:source', function (_a) {
            var edge = _a.edge;
            return _this.onEdgeTerminalChanged(edge, 'source');
        });
        collection.on('edge:change:target', function (_a) {
            var edge = _a.edge;
            _this.onEdgeTerminalChanged(edge, 'target');
        });
    };
    Model.prototype.sortOnChangeZ = function () {
        this.collection.sort();
    };
    Model.prototype.onCellAdded = function (cell) {
        var cellId = cell.id;
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
    };
    Model.prototype.onCellRemoved = function (cell, options) {
        var cellId = cell.id;
        if (cell.isEdge()) {
            delete this.edges[cellId];
            var source = cell.getSource();
            var target = cell.getTarget();
            if (source && source.cell) {
                var cache = this.outgoings[source.cell];
                var index = cache ? cache.indexOf(cellId) : -1;
                if (index >= 0) {
                    cache.splice(index, 1);
                    if (cache.length === 0) {
                        delete this.outgoings[source.cell];
                    }
                }
            }
            if (target && target.cell) {
                var cache = this.incomings[target.cell];
                var index = cache ? cache.indexOf(cellId) : -1;
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
    };
    Model.prototype.onReset = function (cells) {
        var _this = this;
        this.nodes = {};
        this.edges = {};
        this.outgoings = {};
        this.incomings = {};
        cells.forEach(function (cell) { return _this.onCellAdded(cell); });
    };
    Model.prototype.onEdgeTerminalChanged = function (edge, type) {
        var ref = type === 'source' ? this.outgoings : this.incomings;
        var prev = edge.previous(type);
        if (prev && prev.cell) {
            var cellId = cell_1.Cell.isCell(prev.cell) ? prev.cell.id : prev.cell;
            var cache = ref[cellId];
            var index = cache ? cache.indexOf(edge.id) : -1;
            if (index >= 0) {
                cache.splice(index, 1);
                if (cache.length === 0) {
                    delete ref[cellId];
                }
            }
        }
        var terminal = edge.getTerminal(type);
        if (terminal && terminal.cell) {
            var terminalId = cell_1.Cell.isCell(terminal.cell)
                ? terminal.cell.id
                : terminal.cell;
            var cache = ref[terminalId] || [];
            var index = cache.indexOf(edge.id);
            if (index === -1) {
                cache.push(edge.id);
            }
            ref[terminalId] = cache;
        }
    };
    Model.prototype.prepareCell = function (cell, options) {
        if (!cell.model && (!options || !options.dryrun)) {
            cell.model = this;
        }
        if (cell.zIndex == null) {
            cell.setZIndex(this.getMaxZIndex() + 1, { silent: true });
        }
        return cell;
    };
    Model.prototype.resetCells = function (cells, options) {
        var _this = this;
        if (options === void 0) { options = {}; }
        // Do not update model at this time. Because if we just update the graph
        // with the same json-data, the edge will reference to the old nodes.
        cells.map(function (cell) { return _this.prepareCell(cell, __assign(__assign({}, options), { dryrun: true })); });
        this.collection.reset(cells, options);
        // Update model and trigger edge update it's references
        cells.map(function (cell) { return _this.prepareCell(cell, { options: options }); });
        return this;
    };
    Model.prototype.clear = function (options) {
        if (options === void 0) { options = {}; }
        var raw = this.getCells();
        if (raw.length === 0) {
            return this;
        }
        var localOptions = __assign(__assign({}, options), { clear: true });
        this.batchUpdate('clear', function () {
            // The nodes come after the edges.
            var cells = raw.sort(function (a, b) {
                var v1 = a.isEdge() ? 1 : 2;
                var v2 = b.isEdge() ? 1 : 2;
                return v1 - v2;
            });
            while (cells.length > 0) {
                // Note that all the edges are removed first, so it's safe to
                // remove the nodes without removing the connected edges first.
                var cell = cells.shift();
                if (cell) {
                    cell.remove(localOptions);
                }
            }
        }, localOptions);
        return this;
    };
    Model.prototype.addNode = function (metadata, options) {
        if (options === void 0) { options = {}; }
        var node = node_1.Node.isNode(metadata) ? metadata : this.createNode(metadata);
        this.addCell(node, options);
        return node;
    };
    Model.prototype.createNode = function (metadata) {
        return node_1.Node.create(metadata);
    };
    Model.prototype.addEdge = function (metadata, options) {
        if (options === void 0) { options = {}; }
        var edge = edge_1.Edge.isEdge(metadata) ? metadata : this.createEdge(metadata);
        this.addCell(edge, options);
        return edge;
    };
    Model.prototype.createEdge = function (metadata) {
        return edge_1.Edge.create(metadata);
    };
    Model.prototype.addCell = function (cell, options) {
        var _this = this;
        if (options === void 0) { options = {}; }
        if (Array.isArray(cell)) {
            return this.addCells(cell, options);
        }
        if (!this.collection.has(cell) && !this.addings.has(cell)) {
            this.addings.set(cell, true);
            this.collection.add(this.prepareCell(cell, options), options);
            cell.eachChild(function (child) { return _this.addCell(child, options); });
            this.addings.delete(cell);
        }
        return this;
    };
    Model.prototype.addCells = function (cells, options) {
        var _this = this;
        if (options === void 0) { options = {}; }
        var count = cells.length;
        if (count === 0) {
            return this;
        }
        var localOptions = __assign(__assign({}, options), { position: count - 1, maxPosition: count - 1 });
        this.startBatch('add', __assign(__assign({}, localOptions), { cells: cells }));
        cells.forEach(function (cell) {
            _this.addCell(cell, localOptions);
            localOptions.position -= 1;
        });
        this.stopBatch('add', __assign(__assign({}, localOptions), { cells: cells }));
        return this;
    };
    Model.prototype.removeCell = function (obj, options) {
        if (options === void 0) { options = {}; }
        var cell = typeof obj === 'string' ? this.getCell(obj) : obj;
        if (cell && this.has(cell)) {
            return this.collection.remove(cell, options);
        }
        return null;
    };
    Model.prototype.updateCellId = function (cell, newId) {
        this.startBatch('update', { id: newId });
        cell.prop('id', newId);
        var newCell = cell.clone({ keepId: true });
        this.addCell(newCell);
        // update connected edge terminal
        var edges = this.getConnectedEdges(cell);
        edges.forEach(function (edge) {
            var sourceCell = edge.getSourceCell();
            var targetCell = edge.getTargetCell();
            if (sourceCell === cell) {
                edge.setSource(__assign(__assign({}, edge.getSource()), { cell: newId }));
            }
            if (targetCell === cell) {
                edge.setTarget(__assign(__assign({}, edge.getTarget()), { cell: newId }));
            }
        });
        this.removeCell(cell);
        this.stopBatch('update', { id: newId });
        return newCell;
    };
    Model.prototype.removeCells = function (cells, options) {
        var _this = this;
        if (options === void 0) { options = {}; }
        if (cells.length) {
            return this.batchUpdate('remove', function () {
                return cells.map(function (cell) { return _this.removeCell(cell, options); });
            });
        }
        return [];
    };
    Model.prototype.removeConnectedEdges = function (cell, options) {
        if (options === void 0) { options = {}; }
        var edges = this.getConnectedEdges(cell);
        edges.forEach(function (edge) {
            edge.remove(options);
        });
        return edges;
    };
    Model.prototype.disconnectConnectedEdges = function (cell, options) {
        if (options === void 0) { options = {}; }
        var cellId = typeof cell === 'string' ? cell : cell.id;
        this.getConnectedEdges(cell).forEach(function (edge) {
            var sourceCell = edge.getSourceCell();
            var targetCell = edge.getTargetCell();
            if (sourceCell && sourceCell.id === cellId) {
                edge.setSource({ x: 0, y: 0 }, options);
            }
            if (targetCell && targetCell.id === cellId) {
                edge.setTarget({ x: 0, y: 0 }, options);
            }
        });
    };
    Model.prototype.has = function (obj) {
        return this.collection.has(obj);
    };
    Model.prototype.total = function () {
        return this.collection.length;
    };
    Model.prototype.indexOf = function (cell) {
        return this.collection.indexOf(cell);
    };
    /**
     * Returns a cell from the graph by its id.
     */
    Model.prototype.getCell = function (id) {
        return this.collection.get(id);
    };
    /**
     * Returns all the nodes and edges in the graph.
     */
    Model.prototype.getCells = function () {
        return this.collection.toArray();
    };
    /**
     * Returns the first cell (node or edge) in the graph. The first cell is
     * defined as the cell with the lowest `zIndex`.
     */
    Model.prototype.getFirstCell = function () {
        return this.collection.first();
    };
    /**
     * Returns the last cell (node or edge) in the graph. The last cell is
     * defined as the cell with the highest `zIndex`.
     */
    Model.prototype.getLastCell = function () {
        return this.collection.last();
    };
    /**
     * Returns the lowest `zIndex` value in the graph.
     */
    Model.prototype.getMinZIndex = function () {
        var first = this.collection.first();
        return first ? first.getZIndex() || 0 : 0;
    };
    /**
     * Returns the highest `zIndex` value in the graph.
     */
    Model.prototype.getMaxZIndex = function () {
        var last = this.collection.last();
        return last ? last.getZIndex() || 0 : 0;
    };
    Model.prototype.getCellsFromCache = function (cache) {
        var _this = this;
        return cache
            ? Object.keys(cache)
                .map(function (id) { return _this.getCell(id); })
                .filter(function (cell) { return cell != null; })
            : [];
    };
    /**
     * Returns all the nodes in the graph.
     */
    Model.prototype.getNodes = function () {
        return this.getCellsFromCache(this.nodes);
    };
    /**
     * Returns all the edges in the graph.
     */
    Model.prototype.getEdges = function () {
        return this.getCellsFromCache(this.edges);
    };
    /**
     * Returns all outgoing edges for the node.
     */
    Model.prototype.getOutgoingEdges = function (cell) {
        var _this = this;
        var cellId = typeof cell === 'string' ? cell : cell.id;
        var cellIds = this.outgoings[cellId];
        return cellIds
            ? cellIds
                .map(function (id) { return _this.getCell(id); })
                .filter(function (cell) { return cell && cell.isEdge(); })
            : null;
    };
    /**
     * Returns all incoming edges for the node.
     */
    Model.prototype.getIncomingEdges = function (cell) {
        var _this = this;
        var cellId = typeof cell === 'string' ? cell : cell.id;
        var cellIds = this.incomings[cellId];
        return cellIds
            ? cellIds
                .map(function (id) { return _this.getCell(id); })
                .filter(function (cell) { return cell && cell.isEdge(); })
            : null;
    };
    /**
     * Returns edges connected with cell.
     */
    Model.prototype.getConnectedEdges = function (cell, options) {
        var _this = this;
        if (options === void 0) { options = {}; }
        var result = [];
        var node = typeof cell === 'string' ? this.getCell(cell) : cell;
        if (node == null) {
            return result;
        }
        var cache = {};
        var indirect = options.indirect;
        var incoming = options.incoming;
        var outgoing = options.outgoing;
        if (incoming == null && outgoing == null) {
            incoming = outgoing = true;
        }
        var collect = function (cell, isOutgoing) {
            var edges = isOutgoing
                ? _this.getOutgoingEdges(cell)
                : _this.getIncomingEdges(cell);
            if (edges != null) {
                edges.forEach(function (edge) {
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
                var terminal = isOutgoing
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
            var descendants = node.getDescendants({ deep: true });
            var embedsCache_1 = {};
            descendants.forEach(function (cell) {
                if (cell.isNode()) {
                    embedsCache_1[cell.id] = true;
                }
            });
            var collectSub_1 = function (cell, isOutgoing) {
                var edges = isOutgoing
                    ? _this.getOutgoingEdges(cell.id)
                    : _this.getIncomingEdges(cell.id);
                if (edges != null) {
                    edges.forEach(function (edge) {
                        if (!cache[edge.id]) {
                            var sourceCell = edge.getSourceCell();
                            var targetCell = edge.getTargetCell();
                            if (!options.enclosed &&
                                sourceCell &&
                                embedsCache_1[sourceCell.id] &&
                                targetCell &&
                                embedsCache_1[targetCell.id]) {
                                return;
                            }
                            result.push(edge);
                            cache[edge.id] = true;
                        }
                    });
                }
            };
            descendants.forEach(function (cell) {
                if (cell.isEdge()) {
                    return;
                }
                if (outgoing) {
                    collectSub_1(cell, true);
                }
                if (incoming) {
                    collectSub_1(cell, false);
                }
            });
        }
        return result;
    };
    Model.prototype.isBoundary = function (cell, isOrigin) {
        var node = typeof cell === 'string' ? this.getCell(cell) : cell;
        var arr = isOrigin
            ? this.getIncomingEdges(node)
            : this.getOutgoingEdges(node);
        return arr == null || arr.length === 0;
    };
    Model.prototype.getBoundaryNodes = function (isOrigin) {
        var _this = this;
        var result = [];
        Object.keys(this.nodes).forEach(function (nodeId) {
            if (_this.isBoundary(nodeId, isOrigin)) {
                var node = _this.getCell(nodeId);
                if (node) {
                    result.push(node);
                }
            }
        });
        return result;
    };
    /**
     * Returns an array of all the roots of the graph.
     */
    Model.prototype.getRoots = function () {
        return this.getBoundaryNodes(true);
    };
    /**
     * Returns an array of all the leafs of the graph.
     */
    Model.prototype.getLeafs = function () {
        return this.getBoundaryNodes(false);
    };
    /**
     * Returns `true` if the node is a root node, i.e. there is no edges
     * coming to the node.
     */
    Model.prototype.isRoot = function (cell) {
        return this.isBoundary(cell, true);
    };
    /**
     * Returns `true` if the node is a leaf node, i.e. there is no edges
     * going out from the node.
     */
    Model.prototype.isLeaf = function (cell) {
        return this.isBoundary(cell, false);
    };
    /**
     * Returns all the neighbors of node in the graph. Neighbors are all
     * the nodes connected to node via either incoming or outgoing edge.
     */
    Model.prototype.getNeighbors = function (cell, options) {
        if (options === void 0) { options = {}; }
        var incoming = options.incoming;
        var outgoing = options.outgoing;
        if (incoming == null && outgoing == null) {
            incoming = outgoing = true;
        }
        var edges = this.getConnectedEdges(cell, options);
        var map = edges.reduce(function (memo, edge) {
            var hasLoop = edge.hasLoop(options);
            var sourceCell = edge.getSourceCell();
            var targetCell = edge.getTargetCell();
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
                var sourceCell = cell.getSourceCell();
                if (sourceCell && sourceCell.isNode() && !map[sourceCell.id]) {
                    map[sourceCell.id] = sourceCell;
                }
            }
            if (outgoing) {
                var targetCell = cell.getTargetCell();
                if (targetCell && targetCell.isNode() && !map[targetCell.id]) {
                    map[targetCell.id] = targetCell;
                }
            }
        }
        return Object.keys(map).map(function (id) { return map[id]; });
    };
    /**
     * Returns `true` if `cell2` is a neighbor of `cell1`.
     */
    Model.prototype.isNeighbor = function (cell1, cell2, options) {
        if (options === void 0) { options = {}; }
        var incoming = options.incoming;
        var outgoing = options.outgoing;
        if (incoming == null && outgoing == null) {
            incoming = outgoing = true;
        }
        return this.getConnectedEdges(cell1, options).some(function (edge) {
            var sourceCell = edge.getSourceCell();
            var targetCell = edge.getTargetCell();
            if (incoming && sourceCell && sourceCell.id === cell2.id) {
                return true;
            }
            if (outgoing && targetCell && targetCell.id === cell2.id) {
                return true;
            }
            return false;
        });
    };
    Model.prototype.getSuccessors = function (cell, options) {
        var _this = this;
        if (options === void 0) { options = {}; }
        var successors = [];
        this.search(cell, function (curr, distance) {
            if (curr !== cell && _this.matchDistance(distance, options.distance)) {
                successors.push(curr);
            }
        }, __assign(__assign({}, options), { outgoing: true }));
        return successors;
    };
    /**
     * Returns `true` if `cell2` is a successor of `cell1`.
     */
    Model.prototype.isSuccessor = function (cell1, cell2, options) {
        var _this = this;
        if (options === void 0) { options = {}; }
        var result = false;
        this.search(cell1, function (curr, distance) {
            if (curr === cell2 &&
                curr !== cell1 &&
                _this.matchDistance(distance, options.distance)) {
                result = true;
                return false;
            }
        }, __assign(__assign({}, options), { outgoing: true }));
        return result;
    };
    Model.prototype.getPredecessors = function (cell, options) {
        var _this = this;
        if (options === void 0) { options = {}; }
        var predecessors = [];
        this.search(cell, function (curr, distance) {
            if (curr !== cell && _this.matchDistance(distance, options.distance)) {
                predecessors.push(curr);
            }
        }, __assign(__assign({}, options), { incoming: true }));
        return predecessors;
    };
    /**
     * Returns `true` if `cell2` is a predecessor of `cell1`.
     */
    Model.prototype.isPredecessor = function (cell1, cell2, options) {
        var _this = this;
        if (options === void 0) { options = {}; }
        var result = false;
        this.search(cell1, function (curr, distance) {
            if (curr === cell2 &&
                curr !== cell1 &&
                _this.matchDistance(distance, options.distance)) {
                result = true;
                return false;
            }
        }, __assign(__assign({}, options), { incoming: true }));
        return result;
    };
    Model.prototype.matchDistance = function (distance, preset) {
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
    };
    /**
     * Returns the common ancestor of the passed cells.
     */
    Model.prototype.getCommonAncestor = function () {
        var cells = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            cells[_i] = arguments[_i];
        }
        var arr = [];
        cells.forEach(function (item) {
            if (item) {
                if (Array.isArray(item)) {
                    arr.push.apply(arr, item);
                }
                else {
                    arr.push(item);
                }
            }
        });
        return cell_1.Cell.getCommonAncestor.apply(cell_1.Cell, arr);
    };
    /**
     * Returns an array of cells that result from finding nodes/edges that
     * are connected to any of the cells in the cells array. This function
     * loops over cells and if the current cell is a edge, it collects its
     * source/target nodes; if it is an node, it collects its incoming and
     * outgoing edges if both the edge terminal (source/target) are in the
     * cells array.
     */
    Model.prototype.getSubGraph = function (cells, options) {
        var _this = this;
        if (options === void 0) { options = {}; }
        var subgraph = [];
        var cache = {};
        var nodes = [];
        var edges = [];
        var collect = function (cell) {
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
        cells.forEach(function (cell) {
            collect(cell);
            if (options.deep) {
                var descendants = cell.getDescendants({ deep: true });
                descendants.forEach(function (descendant) { return collect(descendant); });
            }
        });
        edges.forEach(function (edge) {
            // For edges, include their source & target
            var sourceCell = edge.getSourceCell();
            var targetCell = edge.getTargetCell();
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
        nodes.forEach(function (node) {
            // For nodes, include their connected edges if their source/target
            // is in the subgraph.
            var edges = _this.getConnectedEdges(node, options);
            edges.forEach(function (edge) {
                var sourceCell = edge.getSourceCell();
                var targetCell = edge.getTargetCell();
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
    };
    /**
     * Clones the whole subgraph (including all the connected links whose
     * source/target is in the subgraph). If `options.deep` is `true`, also
     * take into account all the embedded cells of all the subgraph cells.
     *
     * Returns a map of the form: { [original cell ID]: [clone] }.
     */
    Model.prototype.cloneSubGraph = function (cells, options) {
        if (options === void 0) { options = {}; }
        var subgraph = this.getSubGraph(cells, options);
        return this.cloneCells(subgraph);
    };
    Model.prototype.cloneCells = function (cells) {
        return cell_1.Cell.cloneCells(cells);
    };
    Model.prototype.getNodesFromPoint = function (x, y) {
        var p = typeof x === 'number' ? { x: x, y: y || 0 } : x;
        return this.getNodes().filter(function (node) {
            return node.getBBox().containsPoint(p);
        });
    };
    Model.prototype.getNodesInArea = function (x, y, w, h, options) {
        var rect = typeof x === 'number'
            ? new geometry_1.Rectangle(x, y, w, h)
            : geometry_1.Rectangle.create(x);
        var opts = typeof x === 'number' ? options : y;
        var strict = opts && opts.strict;
        return this.getNodes().filter(function (node) {
            var bbox = node.getBBox();
            return strict ? rect.containsRect(bbox) : rect.isIntersectWithRect(bbox);
        });
    };
    Model.prototype.getEdgesInArea = function (x, y, w, h, options) {
        var rect = typeof x === 'number'
            ? new geometry_1.Rectangle(x, y, w, h)
            : geometry_1.Rectangle.create(x);
        var opts = typeof x === 'number' ? options : y;
        var strict = opts && opts.strict;
        return this.getEdges().filter(function (edge) {
            var bbox = edge.getBBox();
            if (bbox.width === 0) {
                bbox.inflate(1, 0);
            }
            else if (bbox.height === 0) {
                bbox.inflate(0, 1);
            }
            return strict ? rect.containsRect(bbox) : rect.isIntersectWithRect(bbox);
        });
    };
    Model.prototype.getNodesUnderNode = function (node, options) {
        if (options === void 0) { options = {}; }
        var bbox = node.getBBox();
        var nodes = options.by == null || options.by === 'bbox'
            ? this.getNodesInArea(bbox)
            : this.getNodesFromPoint(bbox[options.by]);
        return nodes.filter(function (curr) { return node.id !== curr.id && !curr.isDescendantOf(node); });
    };
    /**
     * Returns the bounding box that surrounds all cells in the graph.
     */
    Model.prototype.getAllCellsBBox = function () {
        return this.getCellsBBox(this.getCells());
    };
    /**
     * Returns the bounding box that surrounds all the given cells.
     */
    Model.prototype.getCellsBBox = function (cells, options) {
        if (options === void 0) { options = {}; }
        return cell_1.Cell.getCellsBBox(cells, options);
    };
    // #region search
    Model.prototype.search = function (cell, iterator, options) {
        if (options === void 0) { options = {}; }
        if (options.breadthFirst) {
            this.breadthFirstSearch(cell, iterator, options);
        }
        else {
            this.depthFirstSearch(cell, iterator, options);
        }
    };
    Model.prototype.breadthFirstSearch = function (cell, iterator, options) {
        if (options === void 0) { options = {}; }
        var queue = [];
        var visited = {};
        var distance = {};
        queue.push(cell);
        distance[cell.id] = 0;
        var _loop_1 = function () {
            var next = queue.shift();
            if (next == null || visited[next.id]) {
                return "continue";
            }
            visited[next.id] = true;
            if (util_1.FunctionExt.call(iterator, this_1, next, distance[next.id]) === false) {
                return "continue";
            }
            var neighbors = this_1.getNeighbors(next, options);
            neighbors.forEach(function (neighbor) {
                distance[neighbor.id] = distance[next.id] + 1;
                queue.push(neighbor);
            });
        };
        var this_1 = this;
        while (queue.length > 0) {
            _loop_1();
        }
    };
    Model.prototype.depthFirstSearch = function (cell, iterator, options) {
        if (options === void 0) { options = {}; }
        var queue = [];
        var visited = {};
        var distance = {};
        queue.push(cell);
        distance[cell.id] = 0;
        var _loop_2 = function () {
            var next = queue.pop();
            if (next == null || visited[next.id]) {
                return "continue";
            }
            visited[next.id] = true;
            if (util_1.FunctionExt.call(iterator, this_2, next, distance[next.id]) === false) {
                return "continue";
            }
            var neighbors = this_2.getNeighbors(next, options);
            var lastIndex = queue.length;
            neighbors.forEach(function (neighbor) {
                distance[neighbor.id] = distance[next.id] + 1;
                queue.splice(lastIndex, 0, neighbor);
            });
        };
        var this_2 = this;
        while (queue.length > 0) {
            _loop_2();
        }
    };
    // #endregion
    // #region shortest path
    /** *
     * Returns an array of IDs of nodes on the shortest
     * path between source and target.
     */
    Model.prototype.getShortestPath = function (source, target, options) {
        if (options === void 0) { options = {}; }
        var adjacencyList = {};
        this.getEdges().forEach(function (edge) {
            var sourceId = edge.getSourceCellId();
            var targetId = edge.getTargetCellId();
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
        var sourceId = typeof source === 'string' ? source : source.id;
        var previous = common_1.Dijkstra.run(adjacencyList, sourceId, options.weight);
        var path = [];
        var targetId = typeof target === 'string' ? target : target.id;
        if (previous[targetId]) {
            path.push(targetId);
        }
        while ((targetId = previous[targetId])) {
            path.unshift(targetId);
        }
        return path;
    };
    // #endregion
    // #region transform
    /**
     * Translate all cells in the graph by `tx` and `ty` pixels.
     */
    Model.prototype.translate = function (tx, ty, options) {
        this.getCells()
            .filter(function (cell) { return !cell.hasParent(); })
            .forEach(function (cell) { return cell.translate(tx, ty, options); });
        return this;
    };
    Model.prototype.resize = function (width, height, options) {
        return this.resizeCells(width, height, this.getCells(), options);
    };
    Model.prototype.resizeCells = function (width, height, cells, options) {
        if (options === void 0) { options = {}; }
        var bbox = this.getCellsBBox(cells);
        if (bbox) {
            var sx_1 = Math.max(width / bbox.width, 0);
            var sy_1 = Math.max(height / bbox.height, 0);
            var origin_1 = bbox.getOrigin();
            cells.forEach(function (cell) { return cell.scale(sx_1, sy_1, origin_1, options); });
        }
        return this;
    };
    // #endregion
    // #region serialize/deserialize
    Model.prototype.toJSON = function (options) {
        if (options === void 0) { options = {}; }
        return Model.toJSON(this.getCells(), options);
    };
    Model.prototype.parseJSON = function (data) {
        return Model.fromJSON(data);
    };
    Model.prototype.fromJSON = function (data, options) {
        if (options === void 0) { options = {}; }
        var cells = this.parseJSON(data);
        this.resetCells(cells, options);
        return this;
    };
    // #endregion
    // #region batch
    Model.prototype.startBatch = function (name, data) {
        if (data === void 0) { data = {}; }
        this.batches[name] = (this.batches[name] || 0) + 1;
        this.notify('batch:start', { name: name, data: data });
        return this;
    };
    Model.prototype.stopBatch = function (name, data) {
        if (data === void 0) { data = {}; }
        this.batches[name] = (this.batches[name] || 0) - 1;
        this.notify('batch:stop', { name: name, data: data });
        return this;
    };
    Model.prototype.batchUpdate = function (name, execute, data) {
        if (data === void 0) { data = {}; }
        this.startBatch(name, data);
        var result = execute();
        this.stopBatch(name, data);
        return result;
    };
    Model.prototype.hasActiveBatch = function (name) {
        var _this = this;
        if (name === void 0) { name = Object.keys(this.batches); }
        var names = Array.isArray(name) ? name : [name];
        return names.some(function (batch) { return _this.batches[batch] > 0; });
    };
    return Model;
}(common_1.Basecoat));
exports.Model = Model;
(function (Model) {
    Model.toStringTag = "X6." + Model.name;
    function isModel(instance) {
        if (instance == null) {
            return false;
        }
        if (instance instanceof Model) {
            return true;
        }
        var tag = instance[Symbol.toStringTag];
        var model = instance;
        if ((tag == null || tag === Model.toStringTag) &&
            typeof model.addNode === 'function' &&
            typeof model.addEdge === 'function' &&
            model.collection != null) {
            return true;
        }
        return false;
    }
    Model.isModel = isModel;
})(Model = exports.Model || (exports.Model = {}));
exports.Model = Model;
(function (Model) {
    function toJSON(cells, options) {
        if (options === void 0) { options = {}; }
        return {
            cells: cells.map(function (cell) { return cell.toJSON(options); }),
        };
    }
    Model.toJSON = toJSON;
    function fromJSON(data) {
        var cells = [];
        if (Array.isArray(data)) {
            cells.push.apply(cells, data);
        }
        else {
            if (data.cells) {
                cells.push.apply(cells, data.cells);
            }
            if (data.nodes) {
                data.nodes.forEach(function (node) {
                    if (node.shape == null) {
                        node.shape = 'rect';
                    }
                    cells.push(node);
                });
            }
            if (data.edges) {
                data.edges.forEach(function (edge) {
                    if (edge.shape == null) {
                        edge.shape = 'edge';
                    }
                    cells.push(edge);
                });
            }
        }
        return cells.map(function (cell) {
            var type = cell.shape;
            if (type) {
                if (node_1.Node.registry.exist(type)) {
                    return node_1.Node.create(cell);
                }
                if (edge_1.Edge.registry.exist(type)) {
                    return edge_1.Edge.create(cell);
                }
            }
            throw new Error('The `shape` should be specified when creating a node/edge instance');
        });
    }
    Model.fromJSON = fromJSON;
})(Model = exports.Model || (exports.Model = {}));
exports.Model = Model;
//# sourceMappingURL=model.js.map