var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { FunctionExt } from '../../util';
import { View } from '../../view/view';
import { Graph } from '../../graph/graph';
var ClassName;
(function (ClassName) {
    ClassName.root = 'widget-minimap';
    ClassName.viewport = `${ClassName.root}-viewport`;
    ClassName.zoom = `${ClassName.viewport}-zoom`;
})(ClassName || (ClassName = {}));
export class MiniMap extends View {
    constructor(options) {
        super();
        this.options = Object.assign(Object.assign({}, Util.defaultOptions), options);
        this.updateViewport = FunctionExt.debounce(this.updateViewport.bind(this), 0);
        this.container = document.createElement('div');
        this.$container = this.$(this.container).addClass(this.prefixClassName(ClassName.root));
        const graphContainer = document.createElement('div');
        this.container.appendChild(graphContainer);
        this.$viewport = this.$('<div>').addClass(this.prefixClassName(ClassName.viewport));
        if (this.options.scalable) {
            this.zoomHandle = this.$('<div>')
                .addClass(this.prefixClassName(ClassName.zoom))
                .appendTo(this.$viewport)
                .get(0);
        }
        this.$container.append(this.$viewport).css({
            width: this.options.width,
            height: this.options.height,
            padding: this.options.padding,
        });
        if (this.options.container) {
            this.options.container.appendChild(this.container);
        }
        this.sourceGraph = this.graph;
        const targetGraphOptions = Object.assign(Object.assign({}, this.options.graphOptions), { container: graphContainer, model: this.sourceGraph.model, frozen: true, async: this.sourceGraph.isAsync(), interacting: false, grid: false, background: false, rotating: false, resizing: false, embedding: false, selecting: false, snapline: false, clipboard: false, history: false, scroller: false });
        this.targetGraph = this.options.createGraph
            ? this.options.createGraph(targetGraphOptions)
            : new Graph(targetGraphOptions);
        this.targetGraph.renderer.unfreeze();
        this.updatePaper(this.sourceGraph.options.width, this.sourceGraph.options.height);
        this.startListening();
    }
    get graph() {
        return this.options.graph;
    }
    get scroller() {
        return this.graph.scroller.widget;
    }
    get graphContainer() {
        if (this.scroller) {
            return this.scroller.container;
        }
        return this.graph.container;
    }
    get $graphContainer() {
        if (this.scroller) {
            return this.scroller.$container;
        }
        return this.$(this.graph.container);
    }
    startListening() {
        if (this.scroller) {
            this.$graphContainer.on(`scroll${this.getEventNamespace()}`, this.updateViewport);
        }
        else {
            this.sourceGraph.on('translate', this.onTransform, this);
            this.sourceGraph.on('scale', this.onTransform, this);
            this.sourceGraph.on('model:updated', this.onModelUpdated, this);
        }
        this.sourceGraph.on('resize', this.updatePaper, this);
        this.delegateEvents({
            mousedown: 'startAction',
            touchstart: 'startAction',
            [`mousedown .${this.prefixClassName('graph')}`]: 'scrollTo',
            [`touchstart .${this.prefixClassName('graph')}`]: 'scrollTo',
        });
    }
    stopListening() {
        if (this.scroller) {
            this.$graphContainer.off(this.getEventNamespace());
        }
        else {
            this.sourceGraph.off('translate', this.onTransform, this);
            this.sourceGraph.off('scale', this.onTransform, this);
            this.sourceGraph.off('model:updated', this.onModelUpdated, this);
        }
        this.sourceGraph.off('resize', this.updatePaper, this);
        this.undelegateEvents();
    }
    onRemove() {
        this.targetGraph.view.remove();
        this.stopListening();
        this.targetGraph.dispose();
    }
    onTransform(options) {
        if (options.ui || this.targetGraphTransforming) {
            this.updateViewport();
        }
    }
    onModelUpdated() {
        this.targetGraph.zoomToFit();
    }
    updatePaper(w, h) {
        let width;
        let height;
        if (typeof w === 'object') {
            width = w.width;
            height = w.height;
        }
        else {
            width = w;
            height = h;
        }
        const origin = this.sourceGraph.options;
        const scale = this.sourceGraph.transform.getScale();
        const maxWidth = this.options.width - 2 * this.options.padding;
        const maxHeight = this.options.height - 2 * this.options.padding;
        width /= scale.sx; // eslint-disable-line
        height /= scale.sy; // eslint-disable-line
        this.ratio = Math.min(maxWidth / width, maxHeight / height);
        const ratio = this.ratio;
        const x = (origin.x * ratio) / scale.sx;
        const y = (origin.y * ratio) / scale.sy;
        width *= ratio; // eslint-disable-line
        height *= ratio; // eslint-disable-line
        this.targetGraph.resizeGraph(width, height);
        this.targetGraph.translate(x, y);
        if (this.scroller) {
            this.targetGraph.scale(ratio, ratio);
        }
        else {
            this.targetGraph.zoomToFit();
        }
        this.updateViewport();
        return this;
    }
    updateViewport() {
        const sourceGraphScale = this.sourceGraph.transform.getScale();
        const targetGraphScale = this.targetGraph.transform.getScale();
        let origin = null;
        if (this.scroller) {
            origin = this.scroller.clientToLocalPoint(0, 0);
        }
        else {
            origin = this.graph.graphToLocal(0, 0);
        }
        const position = this.$(this.targetGraph.container).position();
        const translation = this.targetGraph.translate();
        translation.ty = translation.ty || 0;
        this.geometry = {
            top: position.top + origin.y * targetGraphScale.sy + translation.ty,
            left: position.left + origin.x * targetGraphScale.sx + translation.tx,
            width: (this.$graphContainer.innerWidth() * targetGraphScale.sx) /
                sourceGraphScale.sx,
            height: (this.$graphContainer.innerHeight() * targetGraphScale.sy) /
                sourceGraphScale.sy,
        };
        this.$viewport.css(this.geometry);
    }
    startAction(evt) {
        const e = this.normalizeEvent(evt);
        const action = e.target === this.zoomHandle ? 'zooming' : 'panning';
        const { tx, ty } = this.sourceGraph.translate();
        const eventData = {
            action,
            clientX: e.clientX,
            clientY: e.clientY,
            scrollLeft: this.graphContainer.scrollLeft,
            scrollTop: this.graphContainer.scrollTop,
            zoom: this.sourceGraph.zoom(),
            scale: this.sourceGraph.transform.getScale(),
            geometry: this.geometry,
            translateX: tx,
            translateY: ty,
        };
        this.targetGraphTransforming = true;
        this.delegateDocumentEvents(Util.documentEvents, eventData);
    }
    doAction(evt) {
        const e = this.normalizeEvent(evt);
        const clientX = e.clientX;
        const clientY = e.clientY;
        const data = e.data;
        switch (data.action) {
            case 'panning': {
                const scale = this.sourceGraph.transform.getScale();
                const rx = (clientX - data.clientX) * scale.sx;
                const ry = (clientY - data.clientY) * scale.sy;
                if (this.scroller) {
                    this.graphContainer.scrollLeft = data.scrollLeft + rx / this.ratio;
                    this.graphContainer.scrollTop = data.scrollTop + ry / this.ratio;
                }
                else {
                    this.sourceGraph.translate(data.translateX - rx / this.ratio, data.translateY - ry / this.ratio);
                }
                break;
            }
            case 'zooming': {
                const startScale = data.scale;
                const startGeometry = data.geometry;
                const delta = 1 + (data.clientX - clientX) / startGeometry.width / startScale.sx;
                if (data.frameId) {
                    cancelAnimationFrame(data.frameId);
                }
                data.frameId = requestAnimationFrame(() => {
                    this.sourceGraph.zoom(delta * data.zoom, {
                        absolute: true,
                        minScale: this.options.minScale,
                        maxScale: this.options.maxScale,
                    });
                });
                break;
            }
            default:
                break;
        }
    }
    stopAction() {
        this.undelegateDocumentEvents();
        this.targetGraphTransforming = false;
    }
    scrollTo(evt) {
        const e = this.normalizeEvent(evt);
        let x;
        let y;
        const ts = this.targetGraph.translate();
        ts.ty = ts.ty || 0;
        if (e.offsetX == null) {
            const offset = this.$(this.targetGraph.container).offset();
            x = e.pageX - offset.left;
            y = e.pageY - offset.top;
        }
        else {
            x = e.offsetX;
            y = e.offsetY;
        }
        const cx = (x - ts.tx) / this.ratio;
        const cy = (y - ts.ty) / this.ratio;
        this.sourceGraph.centerPoint(cx, cy);
    }
    dispose() {
        this.remove();
    }
}
__decorate([
    View.dispose()
], MiniMap.prototype, "dispose", null);
var Util;
(function (Util) {
    Util.defaultOptions = {
        width: 300,
        height: 200,
        padding: 10,
        scalable: true,
        minScale: 0.01,
        maxScale: 16,
        graphOptions: {},
        createGraph: (options) => new Graph(options),
    };
    Util.documentEvents = {
        mousemove: 'doAction',
        touchmove: 'doAction',
        mouseup: 'stopAction',
        touchend: 'stopAction',
    };
})(Util || (Util = {}));
//# sourceMappingURL=index.js.map