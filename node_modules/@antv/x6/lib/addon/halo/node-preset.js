"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NodePreset = void 0;
var global_1 = require("../../global");
var util_1 = require("../../util");
var geometry_1 = require("../../geometry");
var cell_1 = require("../../model/cell");
var util_2 = require("../transform/util");
var NodePreset = /** @class */ (function () {
    function NodePreset(halo) {
        this.halo = halo;
    }
    Object.defineProperty(NodePreset.prototype, "options", {
        get: function () {
            return this.halo.options;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(NodePreset.prototype, "graph", {
        get: function () {
            return this.halo.graph;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(NodePreset.prototype, "model", {
        get: function () {
            return this.halo.model;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(NodePreset.prototype, "view", {
        get: function () {
            return this.halo.view;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(NodePreset.prototype, "cell", {
        get: function () {
            return this.halo.cell;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(NodePreset.prototype, "node", {
        get: function () {
            return this.cell;
        },
        enumerable: false,
        configurable: true
    });
    NodePreset.prototype.getPresets = function () {
        return {
            className: 'type-node',
            handles: [
                {
                    name: 'remove',
                    position: 'nw',
                    events: {
                        mousedown: this.removeCell.bind(this),
                    },
                    icon: null,
                },
                {
                    name: 'resize',
                    position: 'se',
                    events: {
                        mousedown: this.startResize.bind(this),
                        mousemove: this.doResize.bind(this),
                        mouseup: this.stopResize.bind(this),
                    },
                    icon: null,
                },
                {
                    name: 'clone',
                    position: 'n',
                    events: {
                        mousedown: this.startClone.bind(this),
                        mousemove: this.doClone.bind(this),
                        mouseup: this.stopClone.bind(this),
                    },
                    icon: null,
                },
                {
                    name: 'link',
                    position: 'e',
                    events: {
                        mousedown: this.startLink.bind(this),
                        mousemove: this.doLink.bind(this),
                        mouseup: this.stopLink.bind(this),
                    },
                    icon: null,
                },
                {
                    name: 'fork',
                    position: 'ne',
                    events: {
                        mousedown: this.startFork.bind(this),
                        mousemove: this.doFork.bind(this),
                        mouseup: this.stopFork.bind(this),
                    },
                    icon: null,
                },
                {
                    name: 'unlink',
                    position: 'w',
                    events: {
                        mousedown: this.unlink.bind(this),
                    },
                    icon: null,
                },
                {
                    name: 'rotate',
                    position: 'sw',
                    events: {
                        mousedown: this.startRotate.bind(this),
                        mousemove: this.doRotate.bind(this),
                        mouseup: this.stopRotate.bind(this),
                    },
                    icon: null,
                },
            ],
            bbox: function (view) {
                if (this.options.useCellGeometry) {
                    var node = view.cell;
                    return node.getBBox();
                }
                return view.getBBox();
            },
            content: function (view) {
                var template = util_1.StringExt.template('x: <%= x %>, y: <%= y %>, width: <%= width %>, height: <%= height %>, angle: <%= angle %>');
                var cell = view.cell;
                var bbox = cell.getBBox();
                return template({
                    x: Math.floor(bbox.x),
                    y: Math.floor(bbox.y),
                    width: Math.floor(bbox.width),
                    height: Math.floor(bbox.height),
                    angle: Math.floor(cell.getAngle()),
                });
            },
            magnet: function (view) {
                return view.container;
            },
            tinyThreshold: 40,
            smallThreshold: 80,
            loopEdgePreferredSide: 'top',
            loopEdgeWidth: 40,
            rotateGrid: 15,
            rotateEmbeds: false,
        };
    };
    NodePreset.prototype.removeCell = function () {
        this.model.removeConnectedEdges(this.cell);
        this.cell.remove();
    };
    // #region create edge
    NodePreset.prototype.startLink = function (_a) {
        var x = _a.x, y = _a.y;
        this.halo.startBatch();
        var graph = this.graph;
        var edge = this.createEdgeConnectedToSource();
        edge.setTarget({ x: x, y: y });
        this.model.addEdge(edge, {
            validation: false,
            halo: this.halo.cid,
            async: false,
        });
        graph.view.undelegateEvents();
        this.edgeView = graph.renderer.findViewByCell(edge);
        this.edgeView.prepareArrowheadDragging('target', {
            x: x,
            y: y,
            fallbackAction: 'remove',
        });
    };
    NodePreset.prototype.createEdgeConnectedToSource = function () {
        var magnet = this.getMagnet(this.view, 'source');
        var terminal = this.getEdgeTerminal(this.view, magnet);
        var edge = this.graph.hook.getDefaultEdge(this.view, magnet);
        edge.setSource(terminal);
        return edge;
    };
    NodePreset.prototype.getMagnet = function (view, terminal) {
        var magnet = this.options.magnet;
        if (typeof magnet === 'function') {
            var val = util_1.FunctionExt.call(magnet, this.halo, view, terminal);
            if (val instanceof SVGElement) {
                return val;
            }
        }
        throw new Error('`magnet()` has to return an SVGElement');
    };
    NodePreset.prototype.getEdgeTerminal = function (view, magnet) {
        var terminal = {
            cell: view.cell.id,
        };
        if (magnet !== view.container) {
            var port = magnet.getAttribute('port');
            if (port) {
                terminal.port = port;
            }
            else {
                terminal.selector = view.getSelector(magnet);
            }
        }
        return terminal;
    };
    NodePreset.prototype.doLink = function (_a) {
        var e = _a.e, x = _a.x, y = _a.y;
        if (this.edgeView) {
            this.edgeView.onMouseMove(e, x, y);
        }
    };
    NodePreset.prototype.stopLink = function (_a) {
        var e = _a.e, x = _a.x, y = _a.y;
        var edgeView = this.edgeView;
        if (edgeView) {
            edgeView.onMouseUp(e, x, y);
            var edge = edgeView.cell;
            if (edge.hasLoop()) {
                this.makeLoopEdge(edge);
            }
            this.halo.stopBatch();
            this.halo.trigger('action:edge:addde', { edge: edge });
            this.edgeView = null;
        }
        this.graph.view.delegateEvents();
    };
    NodePreset.prototype.makeLoopEdge = function (edge) {
        var vertex1 = null;
        var vertex2 = null;
        var loopEdgeWidth = this.options.loopEdgeWidth;
        var graphOptions = this.graph.options;
        var graphRect = new geometry_1.Rectangle(0, 0, graphOptions.width, graphOptions.height);
        var bbox = this.graph.graphToLocal(this.view.getBBox());
        var found = [
            this.options.loopEdgePreferredSide,
            'top',
            'bottom',
            'left',
            'right',
        ].some(function (position) {
            var point = null;
            var dx = 0;
            var dy = 0;
            switch (position) {
                case 'top':
                    point = new geometry_1.Point(bbox.x + bbox.width / 2, bbox.y - loopEdgeWidth);
                    dx = loopEdgeWidth / 2;
                    break;
                case 'bottom':
                    point = new geometry_1.Point(bbox.x + bbox.width / 2, bbox.y + bbox.height + loopEdgeWidth);
                    dx = loopEdgeWidth / 2;
                    break;
                case 'left':
                    point = new geometry_1.Point(bbox.x - loopEdgeWidth, bbox.y + bbox.height / 2);
                    dy = loopEdgeWidth / 2;
                    break;
                case 'right':
                    point = new geometry_1.Point(bbox.x + bbox.width + loopEdgeWidth, bbox.y + bbox.height / 2);
                    dy = loopEdgeWidth / 2;
                    break;
                default:
                    break;
            }
            if (point) {
                vertex1 = point.translate(-dx, -dy);
                vertex2 = point.translate(dx, dy);
                return (graphRect.containsPoint(vertex1) && graphRect.containsPoint(vertex2));
            }
            return false;
        });
        if (found && vertex1 && vertex2) {
            edge.setVertices([vertex1, vertex2]);
        }
    };
    // #endregion
    // #region resize
    NodePreset.prototype.startResize = function (_a) {
        var e = _a.e;
        this.halo.startBatch();
        this.flip = [1, 0, 0, 1, 1, 0, 0, 1][Math.floor(geometry_1.Angle.normalize(this.node.getAngle()) / 45)];
        this.view.addClass('node-resizing');
        (0, util_2.notify)('node:resize', e, this.view);
    };
    NodePreset.prototype.doResize = function (_a) {
        var e = _a.e, dx = _a.dx, dy = _a.dy;
        var size = this.node.getSize();
        var width = Math.max(size.width + (this.flip ? dx : dy), 1);
        var height = Math.max(size.height + (this.flip ? dy : dx), 1);
        this.node.resize(width, height, {
            absolute: true,
        });
        (0, util_2.notify)('node:resizing', e, this.view);
    };
    NodePreset.prototype.stopResize = function (_a) {
        var e = _a.e;
        this.view.removeClass('node-resizing');
        (0, util_2.notify)('node:resized', e, this.view);
        this.halo.stopBatch();
    };
    // #endregion
    // #region clone
    NodePreset.prototype.startClone = function (_a) {
        var e = _a.e, x = _a.x, y = _a.y;
        this.halo.startBatch();
        var options = this.options;
        var cloned = options.clone(this.cell, {
            clone: true,
        });
        if (!cell_1.Cell.isCell(cloned)) {
            throw new Error("option 'clone()' has to return a cell");
        }
        this.centerNodeAtCursor(cloned, x, y);
        this.model.addCell(cloned, {
            halo: this.halo.cid,
            async: false,
        });
        var cloneView = this.graph.renderer.findViewByCell(cloned);
        cloneView.onMouseDown(e, x, y);
        this.halo.setEventData(e, { cloneView: cloneView });
    };
    NodePreset.prototype.centerNodeAtCursor = function (cell, x, y) {
        var center = cell.getBBox().getCenter();
        var dx = x - center.x;
        var dy = y - center.y;
        cell.translate(dx, dy);
    };
    NodePreset.prototype.doClone = function (_a) {
        var e = _a.e, x = _a.x, y = _a.y;
        var view = this.halo.getEventData(e).cloneView;
        if (view) {
            view.onMouseMove(e, x, y);
        }
    };
    NodePreset.prototype.stopClone = function (_a) {
        var e = _a.e, x = _a.x, y = _a.y;
        var nodeView = this.halo.getEventData(e).cloneView;
        if (nodeView) {
            nodeView.onMouseUp(e, x, y);
        }
        this.halo.stopBatch();
    };
    // #endregion
    // #region fork
    NodePreset.prototype.startFork = function (_a) {
        var e = _a.e, x = _a.x, y = _a.y;
        this.halo.startBatch();
        var cloned = this.options.clone(this.cell, {
            fork: true,
        });
        if (!cell_1.Cell.isCell(cloned)) {
            throw new Error("option 'clone()' has to return a cell");
        }
        this.centerNodeAtCursor(cloned, x, y);
        this.model.addCell(cloned, {
            halo: this.halo.cid,
            async: false,
        });
        var edge = this.createEdgeConnectedToSource();
        var cloneView = this.graph.renderer.findViewByCell(cloned);
        var magnet = this.getMagnet(cloneView, 'target');
        var terminal = this.getEdgeTerminal(cloneView, magnet);
        edge.setTarget(terminal);
        this.model.addEdge(edge, {
            halo: this.halo.cid,
            async: false,
        });
        cloneView.onMouseDown(e, x, y);
        this.halo.setEventData(e, { cloneView: cloneView });
    };
    NodePreset.prototype.doFork = function (_a) {
        var e = _a.e, x = _a.x, y = _a.y;
        var view = this.halo.getEventData(e).cloneView;
        if (view) {
            view.onMouseMove(e, x, y);
        }
    };
    NodePreset.prototype.stopFork = function (_a) {
        var e = _a.e, x = _a.x, y = _a.y;
        var view = this.halo.getEventData(e).cloneView;
        if (view) {
            view.onMouseUp(e, x, y);
        }
        this.halo.stopBatch();
    };
    // #endregion
    // #region rotate
    NodePreset.prototype.startRotate = function (_a) {
        var _this = this;
        var e = _a.e, x = _a.x, y = _a.y;
        this.halo.startBatch();
        var center = this.node.getBBox().getCenter();
        var nodes = [this.node];
        if (this.options.rotateEmbeds) {
            this.node
                .getDescendants({
                deep: true,
            })
                .reduce(function (memo, cell) {
                if (cell.isNode()) {
                    memo.push(cell);
                }
                return memo;
            }, nodes);
        }
        this.halo.setEventData(e, {
            center: center,
            nodes: nodes,
            rotateStartAngles: nodes.map(function (node) { return node.getAngle(); }),
            clientStartAngle: new geometry_1.Point(x, y).theta(center),
        });
        nodes.forEach(function (node) {
            var view = _this.graph.findViewByCell(node);
            if (view) {
                view.addClass('node-rotating');
                (0, util_2.notify)('node:rotate', e, view);
            }
        });
    };
    NodePreset.prototype.doRotate = function (_a) {
        var _this = this;
        var e = _a.e, x = _a.x, y = _a.y;
        var data = this.halo.getEventData(e);
        var delta = data.clientStartAngle - new geometry_1.Point(x, y).theta(data.center);
        data.nodes.forEach(function (node, index) {
            var startAngle = data.rotateStartAngles[index];
            var targetAngle = global_1.Util.snapToGrid(startAngle + delta, _this.options.rotateGrid);
            node.rotate(targetAngle, {
                absolute: true,
                center: data.center,
                halo: _this.halo.cid,
            });
            (0, util_2.notify)('node:rotating', e, _this.graph.findViewByCell(node));
        });
    };
    NodePreset.prototype.stopRotate = function (_a) {
        var _this = this;
        var e = _a.e;
        var data = this.halo.getEventData(e);
        data.nodes.forEach(function (node) {
            var view = _this.graph.findViewByCell(node);
            view.removeClass('node-rotating');
            (0, util_2.notify)('node:rotated', e, view);
        });
        this.halo.stopBatch();
    };
    // #endregion
    // #region unlink
    NodePreset.prototype.unlink = function () {
        this.halo.startBatch();
        this.model.removeConnectedEdges(this.cell);
        this.halo.stopBatch();
    };
    return NodePreset;
}());
exports.NodePreset = NodePreset;
//# sourceMappingURL=node-preset.js.map