var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Util } from '../../global';
import { FunctionExt } from '../../util';
import { Rectangle } from '../../geometry';
import { View } from '../../view/view';
import { Graph } from '../../graph/graph';
export class Dnd extends View {
    constructor(options) {
        super();
        this.options = Object.assign(Object.assign({}, Dnd.defaults), options);
        this.container = document.createElement('div');
        this.$container = this.$(this.container).addClass(this.prefixClassName('widget-dnd'));
        this.draggingGraph = new Graph(Object.assign(Object.assign({}, this.options.delegateGraphOptions), { container: document.createElement('div'), width: 1, height: 1 }));
        this.$container.append(this.draggingGraph.container);
    }
    get targetScroller() {
        const target = this.options.target;
        return Graph.isGraph(target) ? target.scroller.widget : target;
    }
    get targetGraph() {
        const target = this.options.target;
        return Graph.isGraph(target) ? target : target.graph;
    }
    get targetModel() {
        return this.targetGraph.model;
    }
    get snapline() {
        return this.targetGraph.snapline.widget;
    }
    start(node, evt) {
        const e = evt;
        e.preventDefault();
        this.targetModel.startBatch('dnd');
        this.$container
            .addClass('dragging')
            .appendTo(this.options.draggingContainer || document.body);
        this.sourceNode = node;
        this.prepareDragging(node, e.clientX, e.clientY);
        const local = this.updateNodePosition(e.clientX, e.clientY);
        if (this.isSnaplineEnabled()) {
            this.snapline.captureCursorOffset({
                e,
                node,
                cell: node,
                view: this.draggingView,
                x: local.x,
                y: local.y,
            });
            this.draggingNode.on('change:position', this.snap, this);
        }
        this.delegateDocumentEvents(Dnd.documentEvents, e.data);
    }
    isSnaplineEnabled() {
        return this.snapline && !this.snapline.disabled;
    }
    prepareDragging(sourceNode, clientX, clientY) {
        const draggingGraph = this.draggingGraph;
        const draggingModel = draggingGraph.model;
        const draggingNode = this.options.getDragNode(sourceNode, {
            sourceNode,
            draggingGraph,
            targetGraph: this.targetGraph,
        });
        draggingNode.position(0, 0);
        let padding = 5;
        if (this.isSnaplineEnabled()) {
            padding += this.snapline.options.tolerance || 0;
        }
        if (this.isSnaplineEnabled() || this.options.scaled) {
            const scale = this.targetGraph.transform.getScale();
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
        const delegateView = draggingGraph.findViewByCell(draggingNode);
        delegateView.undelegateEvents();
        delegateView.cell.off('changed');
        draggingGraph.fitToContent({
            padding,
            allowNewOrigin: 'any',
        });
        const bbox = delegateView.getBBox();
        this.geometryBBox = delegateView.getBBox({ useCellGeometry: true });
        this.delta = this.geometryBBox.getTopLeft().diff(bbox.getTopLeft());
        this.draggingNode = draggingNode;
        this.draggingView = delegateView;
        this.draggingBBox = draggingNode.getBBox();
        this.padding = padding;
        this.originOffset = this.updateGraphPosition(clientX, clientY);
    }
    updateGraphPosition(clientX, clientY) {
        const scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
        const delta = this.delta;
        const nodeBBox = this.geometryBBox;
        const padding = this.padding || 5;
        const offset = {
            left: clientX - delta.x - nodeBBox.width / 2 - padding,
            top: clientY - delta.y - nodeBBox.height / 2 - padding + scrollTop,
        };
        if (this.draggingGraph) {
            this.$container.offset(offset);
        }
        return offset;
    }
    updateNodePosition(x, y) {
        const local = this.targetGraph.clientToLocal(x, y);
        const bbox = this.draggingBBox;
        local.x -= bbox.width / 2;
        local.y -= bbox.height / 2;
        this.draggingNode.position(local.x, local.y);
        return local;
    }
    snap({ cell, current, options, }) {
        const node = cell;
        if (options.snapped) {
            const bbox = this.draggingBBox;
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
    }
    onDragging(evt) {
        const draggingView = this.draggingView;
        if (draggingView) {
            evt.preventDefault();
            const e = this.normalizeEvent(evt);
            const clientX = e.clientX;
            const clientY = e.clientY;
            this.updateGraphPosition(clientX, clientY);
            const local = this.updateNodePosition(clientX, clientY);
            const embeddingMode = this.targetGraph.options.embedding.enabled;
            const isValidArea = (embeddingMode || this.isSnaplineEnabled()) &&
                this.isInsideValidArea({
                    x: clientX,
                    y: clientY,
                });
            if (embeddingMode) {
                draggingView.setEventData(e, {
                    graph: this.targetGraph,
                    candidateEmbedView: this.candidateEmbedView,
                });
                const data = draggingView.getEventData(e);
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
                        e,
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
    }
    onDragEnd(evt) {
        const draggingNode = this.draggingNode;
        if (draggingNode) {
            const e = this.normalizeEvent(evt);
            const draggingView = this.draggingView;
            const draggingBBox = this.draggingBBox;
            const snapOffset = this.snapOffset;
            let x = draggingBBox.x;
            let y = draggingBBox.y;
            if (snapOffset) {
                x += snapOffset.x;
                y += snapOffset.y;
            }
            draggingNode.position(x, y, { silent: true });
            const ret = this.drop(draggingNode, { x: e.clientX, y: e.clientY });
            const callback = (node) => {
                if (node) {
                    this.onDropped(draggingNode);
                    if (this.targetGraph.options.embedding.enabled && draggingView) {
                        draggingView.setEventData(e, {
                            cell: node,
                            graph: this.targetGraph,
                            candidateEmbedView: this.candidateEmbedView,
                        });
                        draggingView.finalizeEmbedding(e, draggingView.getEventData(e));
                    }
                }
                else {
                    this.onDropInvalid();
                }
                this.candidateEmbedView = null;
                this.targetModel.stopBatch('dnd');
            };
            if (FunctionExt.isAsync(ret)) {
                // stop dragging
                this.undelegateDocumentEvents();
                ret.then(callback); // eslint-disable-line
            }
            else {
                callback(ret);
            }
        }
    }
    clearDragging() {
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
    }
    onDropped(draggingNode) {
        if (this.draggingNode === draggingNode) {
            this.clearDragging();
            this.$container.removeClass('dragging').remove();
        }
    }
    onDropInvalid() {
        const draggingNode = this.draggingNode;
        if (draggingNode) {
            const anim = this.options.animation;
            if (anim) {
                const duration = (typeof anim === 'object' && anim.duration) || 150;
                const easing = (typeof anim === 'object' && anim.easing) || 'swing';
                this.draggingView = null;
                this.$container.animate(this.originOffset, duration, easing, () => this.onDropped(draggingNode));
            }
            else {
                this.onDropped(draggingNode);
            }
        }
    }
    isInsideValidArea(p) {
        let targetRect;
        let dndRect = null;
        const targetGraph = this.targetGraph;
        const targetScroller = this.targetScroller;
        if (this.options.dndContainer) {
            dndRect = this.getDropArea(this.options.dndContainer);
        }
        const isInsideDndRect = dndRect && dndRect.containsPoint(p);
        if (targetScroller) {
            if (targetScroller.options.autoResize) {
                targetRect = this.getDropArea(targetScroller.container);
            }
            else {
                const outter = this.getDropArea(targetScroller.container);
                targetRect = this.getDropArea(targetGraph.container).intersectsWithRect(outter);
            }
        }
        else {
            targetRect = this.getDropArea(targetGraph.container);
        }
        return !isInsideDndRect && targetRect && targetRect.containsPoint(p);
    }
    getDropArea(elem) {
        const $elem = this.$(elem);
        const offset = $elem.offset();
        const scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
        const scrollLeft = document.body.scrollLeft || document.documentElement.scrollLeft;
        return Rectangle.create({
            x: offset.left + parseInt($elem.css('border-left-width'), 10) - scrollLeft,
            y: offset.top + parseInt($elem.css('border-top-width'), 10) - scrollTop,
            width: $elem.innerWidth(),
            height: $elem.innerHeight(),
        });
    }
    drop(draggingNode, pos) {
        if (this.isInsideValidArea(pos)) {
            const targetGraph = this.targetGraph;
            const targetModel = targetGraph.model;
            const local = targetGraph.clientToLocal(pos);
            const sourceNode = this.sourceNode;
            const droppingNode = this.options.getDropNode(draggingNode, {
                sourceNode,
                draggingNode,
                targetGraph: this.targetGraph,
                draggingGraph: this.draggingGraph,
            });
            const bbox = droppingNode.getBBox();
            local.x += bbox.x - bbox.width / 2;
            local.y += bbox.y - bbox.height / 2;
            const gridSize = this.snapOffset ? 1 : targetGraph.getGridSize();
            droppingNode.position(Util.snapToGrid(local.x, gridSize), Util.snapToGrid(local.y, gridSize));
            droppingNode.removeZIndex();
            const validateNode = this.options.validateNode;
            const ret = validateNode
                ? validateNode(droppingNode, {
                    sourceNode,
                    draggingNode,
                    droppingNode,
                    targetGraph,
                    draggingGraph: this.draggingGraph,
                })
                : true;
            if (typeof ret === 'boolean') {
                if (ret) {
                    targetModel.addCell(droppingNode, { stencil: this.cid });
                    return droppingNode;
                }
                return null;
            }
            return FunctionExt.toDeferredBoolean(ret).then((valid) => {
                if (valid) {
                    targetModel.addCell(droppingNode, { stencil: this.cid });
                    return droppingNode;
                }
                return null;
            });
        }
        return null;
    }
    onRemove() {
        if (this.draggingGraph) {
            this.draggingGraph.view.remove();
            this.draggingGraph.dispose();
        }
    }
    dispose() {
        this.remove();
    }
}
__decorate([
    View.dispose()
], Dnd.prototype, "dispose", null);
(function (Dnd) {
    Dnd.defaults = {
        animation: false,
        getDragNode: (sourceNode) => sourceNode.clone(),
        getDropNode: (draggingNode) => draggingNode.clone(),
    };
    Dnd.documentEvents = {
        mousemove: 'onDragging',
        touchmove: 'onDragging',
        mouseup: 'onDragEnd',
        touchend: 'onDragEnd',
        touchcancel: 'onDragEnd',
    };
})(Dnd || (Dnd = {}));
//# sourceMappingURL=index.js.map