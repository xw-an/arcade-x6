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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Dnd = void 0;
var global_1 = require("../../global");
var util_1 = require("../../util");
var geometry_1 = require("../../geometry");
var view_1 = require("../../view/view");
var graph_1 = require("../../graph/graph");
var Dnd = /** @class */ (function (_super) {
    __extends(Dnd, _super);
    function Dnd(options) {
        var _this = _super.call(this) || this;
        _this.options = __assign(__assign({}, Dnd.defaults), options);
        _this.container = document.createElement('div');
        _this.$container = _this.$(_this.container).addClass(_this.prefixClassName('widget-dnd'));
        _this.draggingGraph = new graph_1.Graph(__assign(__assign({}, _this.options.delegateGraphOptions), { container: document.createElement('div'), width: 1, height: 1 }));
        _this.$container.append(_this.draggingGraph.container);
        return _this;
    }
    Object.defineProperty(Dnd.prototype, "targetScroller", {
        get: function () {
            var target = this.options.target;
            return graph_1.Graph.isGraph(target) ? target.scroller.widget : target;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Dnd.prototype, "targetGraph", {
        get: function () {
            var target = this.options.target;
            return graph_1.Graph.isGraph(target) ? target : target.graph;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Dnd.prototype, "targetModel", {
        get: function () {
            return this.targetGraph.model;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Dnd.prototype, "snapline", {
        get: function () {
            return this.targetGraph.snapline.widget;
        },
        enumerable: false,
        configurable: true
    });
    Dnd.prototype.start = function (node, evt) {
        var e = evt;
        e.preventDefault();
        this.targetModel.startBatch('dnd');
        this.$container
            .addClass('dragging')
            .appendTo(this.options.draggingContainer || document.body);
        this.sourceNode = node;
        this.prepareDragging(node, e.clientX, e.clientY);
        var local = this.updateNodePosition(e.clientX, e.clientY);
        if (this.isSnaplineEnabled()) {
            this.snapline.captureCursorOffset({
                e: e,
                node: node,
                cell: node,
                view: this.draggingView,
                x: local.x,
                y: local.y,
            });
            this.draggingNode.on('change:position', this.snap, this);
        }
        this.delegateDocumentEvents(Dnd.documentEvents, e.data);
    };
    Dnd.prototype.isSnaplineEnabled = function () {
        return this.snapline && !this.snapline.disabled;
    };
    Dnd.prototype.prepareDragging = function (sourceNode, clientX, clientY) {
        var draggingGraph = this.draggingGraph;
        var draggingModel = draggingGraph.model;
        var draggingNode = this.options.getDragNode(sourceNode, {
            sourceNode: sourceNode,
            draggingGraph: draggingGraph,
            targetGraph: this.targetGraph,
        });
        draggingNode.position(0, 0);
        var padding = 5;
        if (this.isSnaplineEnabled()) {
            padding += this.snapline.options.tolerance || 0;
        }
        if (this.isSnaplineEnabled() || this.options.scaled) {
            var scale = this.targetGraph.transform.getScale();
            draggingGraph.scale(scale.sx, scale.sy);
            padding *= Math.max(scale.sx, scale.sy);
        }
        else {
            draggingGraph.scale(1, 1);
        }
        this.clearDragging();
        if (this.options.animation) {
            this.$container.stop(true, true);
        }
        draggingModel.resetCells([draggingNode]);
        var delegateView = draggingGraph.findViewByCell(draggingNode);
        delegateView.undelegateEvents();
        delegateView.cell.off('changed');
        draggingGraph.fitToContent({
            padding: padding,
            allowNewOrigin: 'any',
        });
        var bbox = delegateView.getBBox();
        this.geometryBBox = delegateView.getBBox({ useCellGeometry: true });
        this.delta = this.geometryBBox.getTopLeft().diff(bbox.getTopLeft());
        this.draggingNode = draggingNode;
        this.draggingView = delegateView;
        this.draggingBBox = draggingNode.getBBox();
        this.padding = padding;
        this.originOffset = this.updateGraphPosition(clientX, clientY);
    };
    Dnd.prototype.updateGraphPosition = function (clientX, clientY) {
        var scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
        var delta = this.delta;
        var nodeBBox = this.geometryBBox;
        var padding = this.padding || 5;
        var offset = {
            left: clientX - delta.x - nodeBBox.width / 2 - padding,
            top: clientY - delta.y - nodeBBox.height / 2 - padding + scrollTop,
        };
        if (this.draggingGraph) {
            this.$container.offset(offset);
        }
        return offset;
    };
    Dnd.prototype.updateNodePosition = function (x, y) {
        var local = this.targetGraph.clientToLocal(x, y);
        var bbox = this.draggingBBox;
        local.x -= bbox.width / 2;
        local.y -= bbox.height / 2;
        this.draggingNode.position(local.x, local.y);
        return local;
    };
    Dnd.prototype.snap = function (_a) {
        var cell = _a.cell, current = _a.current, options = _a.options;
        var node = cell;
        if (options.snapped) {
            var bbox = this.draggingBBox;
            node.position(bbox.x + options.tx, bbox.y + options.ty, { silent: true });
            this.draggingView.translate();
            node.position(current.x, current.y, { silent: true });
            this.snapOffset = {
                x: options.tx,
                y: options.ty,
            };
        }
        else {
            this.snapOffset = null;
        }
    };
    Dnd.prototype.onDragging = function (evt) {
        var draggingView = this.draggingView;
        if (draggingView) {
            evt.preventDefault();
            var e = this.normalizeEvent(evt);
            var clientX = e.clientX;
            var clientY = e.clientY;
            this.updateGraphPosition(clientX, clientY);
            var local = this.updateNodePosition(clientX, clientY);
            var embeddingMode = this.targetGraph.options.embedding.enabled;
            var isValidArea = (embeddingMode || this.isSnaplineEnabled()) &&
                this.isInsideValidArea({
                    x: clientX,
                    y: clientY,
                });
            if (embeddingMode) {
                draggingView.setEventData(e, {
                    graph: this.targetGraph,
                    candidateEmbedView: this.candidateEmbedView,
                });
                var data = draggingView.getEventData(e);
                if (isValidArea) {
                    draggingView.processEmbedding(e, data);
                }
                else {
                    draggingView.clearEmbedding(data);
                }
                this.candidateEmbedView = data.candidateEmbedView;
            }
            // update snapline
            if (this.isSnaplineEnabled()) {
                if (isValidArea) {
                    this.snapline.snapOnMoving({
                        e: e,
                        view: draggingView,
                        x: local.x,
                        y: local.y,
                    });
                }
                else {
                    this.snapline.hide();
                }
            }
        }
    };
    Dnd.prototype.onDragEnd = function (evt) {
        var _this = this;
        var draggingNode = this.draggingNode;
        if (draggingNode) {
            var e_1 = this.normalizeEvent(evt);
            var draggingView_1 = this.draggingView;
            var draggingBBox = this.draggingBBox;
            var snapOffset = this.snapOffset;
            var x = draggingBBox.x;
            var y = draggingBBox.y;
            if (snapOffset) {
                x += snapOffset.x;
                y += snapOffset.y;
            }
            draggingNode.position(x, y, { silent: true });
            var ret = this.drop(draggingNode, { x: e_1.clientX, y: e_1.clientY });
            var callback = function (node) {
                if (node) {
                    _this.onDropped(draggingNode);
                    if (_this.targetGraph.options.embedding.enabled && draggingView_1) {
                        draggingView_1.setEventData(e_1, {
                            cell: node,
                            graph: _this.targetGraph,
                            candidateEmbedView: _this.candidateEmbedView,
                        });
                        draggingView_1.finalizeEmbedding(e_1, draggingView_1.getEventData(e_1));
                    }
                }
                else {
                    _this.onDropInvalid();
                }
                _this.candidateEmbedView = null;
                _this.targetModel.stopBatch('dnd');
            };
            if (util_1.FunctionExt.isAsync(ret)) {
                // stop dragging
                this.undelegateDocumentEvents();
                ret.then(callback); // eslint-disable-line
            }
            else {
                callback(ret);
            }
        }
    };
    Dnd.prototype.clearDragging = function () {
        if (this.draggingNode) {
            this.sourceNode = null;
            this.draggingNode.remove();
            this.draggingNode = null;
            this.draggingView = null;
            this.delta = null;
            this.padding = null;
            this.snapOffset = null;
            this.originOffset = null;
            this.undelegateDocumentEvents();
        }
    };
    Dnd.prototype.onDropped = function (draggingNode) {
        if (this.draggingNode === draggingNode) {
            this.clearDragging();
            this.$container.removeClass('dragging').remove();
        }
    };
    Dnd.prototype.onDropInvalid = function () {
        var _this = this;
        var draggingNode = this.draggingNode;
        if (draggingNode) {
            var anim = this.options.animation;
            if (anim) {
                var duration = (typeof anim === 'object' && anim.duration) || 150;
                var easing = (typeof anim === 'object' && anim.easing) || 'swing';
                this.draggingView = null;
                this.$container.animate(this.originOffset, duration, easing, function () {
                    return _this.onDropped(draggingNode);
                });
            }
            else {
                this.onDropped(draggingNode);
            }
        }
    };
    Dnd.prototype.isInsideValidArea = function (p) {
        var targetRect;
        var dndRect = null;
        var targetGraph = this.targetGraph;
        var targetScroller = this.targetScroller;
        if (this.options.dndContainer) {
            dndRect = this.getDropArea(this.options.dndContainer);
        }
        var isInsideDndRect = dndRect && dndRect.containsPoint(p);
        if (targetScroller) {
            if (targetScroller.options.autoResize) {
                targetRect = this.getDropArea(targetScroller.container);
            }
            else {
                var outter = this.getDropArea(targetScroller.container);
                targetRect = this.getDropArea(targetGraph.container).intersectsWithRect(outter);
            }
        }
        else {
            targetRect = this.getDropArea(targetGraph.container);
        }
        return !isInsideDndRect && targetRect && targetRect.containsPoint(p);
    };
    Dnd.prototype.getDropArea = function (elem) {
        var $elem = this.$(elem);
        var offset = $elem.offset();
        var scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
        var scrollLeft = document.body.scrollLeft || document.documentElement.scrollLeft;
        return geometry_1.Rectangle.create({
            x: offset.left + parseInt($elem.css('border-left-width'), 10) - scrollLeft,
            y: offset.top + parseInt($elem.css('border-top-width'), 10) - scrollTop,
            width: $elem.innerWidth(),
            height: $elem.innerHeight(),
        });
    };
    Dnd.prototype.drop = function (draggingNode, pos) {
        var _this = this;
        if (this.isInsideValidArea(pos)) {
            var targetGraph = this.targetGraph;
            var targetModel_1 = targetGraph.model;
            var local = targetGraph.clientToLocal(pos);
            var sourceNode = this.sourceNode;
            var droppingNode_1 = this.options.getDropNode(draggingNode, {
                sourceNode: sourceNode,
                draggingNode: draggingNode,
                targetGraph: this.targetGraph,
                draggingGraph: this.draggingGraph,
            });
            var bbox = droppingNode_1.getBBox();
            local.x += bbox.x - bbox.width / 2;
            local.y += bbox.y - bbox.height / 2;
            var gridSize = this.snapOffset ? 1 : targetGraph.getGridSize();
            droppingNode_1.position(global_1.Util.snapToGrid(local.x, gridSize), global_1.Util.snapToGrid(local.y, gridSize));
            droppingNode_1.removeZIndex();
            var validateNode = this.options.validateNode;
            var ret = validateNode
                ? validateNode(droppingNode_1, {
                    sourceNode: sourceNode,
                    draggingNode: draggingNode,
                    droppingNode: droppingNode_1,
                    targetGraph: targetGraph,
                    draggingGraph: this.draggingGraph,
                })
                : true;
            if (typeof ret === 'boolean') {
                if (ret) {
                    targetModel_1.addCell(droppingNode_1, { stencil: this.cid });
                    return droppingNode_1;
                }
                return null;
            }
            return util_1.FunctionExt.toDeferredBoolean(ret).then(function (valid) {
                if (valid) {
                    targetModel_1.addCell(droppingNode_1, { stencil: _this.cid });
                    return droppingNode_1;
                }
                return null;
            });
        }
        return null;
    };
    Dnd.prototype.onRemove = function () {
        if (this.draggingGraph) {
            this.draggingGraph.view.remove();
            this.draggingGraph.dispose();
        }
    };
    Dnd.prototype.dispose = function () {
        this.remove();
    };
    __decorate([
        view_1.View.dispose()
    ], Dnd.prototype, "dispose", null);
    return Dnd;
}(view_1.View));
exports.Dnd = Dnd;
(function (Dnd) {
    Dnd.defaults = {
        animation: false,
        getDragNode: function (sourceNode) { return sourceNode.clone(); },
        getDropNode: function (draggingNode) { return draggingNode.clone(); },
    };
    Dnd.documentEvents = {
        mousemove: 'onDragging',
        touchmove: 'onDragging',
        mouseup: 'onDragEnd',
        touchend: 'onDragEnd',
        touchcancel: 'onDragEnd',
    };
})(Dnd = exports.Dnd || (exports.Dnd = {}));
exports.Dnd = Dnd;
//# sourceMappingURL=index.js.map