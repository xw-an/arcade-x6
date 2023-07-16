import { Util } from '../../global/util';
import { Point } from '../../geometry';
import { View } from '../../view/view';
import { ToolsView } from '../../view/tool';
export class Vertices extends ToolsView.ToolItem {
    constructor() {
        super(...arguments);
        this.handles = [];
    }
    get vertices() {
        return this.cellView.cell.getVertices();
    }
    onRender() {
        this.addClass(this.prefixClassName('edge-tool-vertices'));
        if (this.options.addable) {
            this.updatePath();
        }
        this.resetHandles();
        this.renderHandles();
        return this;
    }
    update() {
        const vertices = this.vertices;
        if (vertices.length === this.handles.length) {
            this.updateHandles();
        }
        else {
            this.resetHandles();
            this.renderHandles();
        }
        if (this.options.addable) {
            this.updatePath();
        }
        return this;
    }
    resetHandles() {
        const handles = this.handles;
        this.handles = [];
        if (handles) {
            handles.forEach((handle) => {
                this.stopHandleListening(handle);
                handle.remove();
            });
        }
    }
    renderHandles() {
        const vertices = this.vertices;
        for (let i = 0, l = vertices.length; i < l; i += 1) {
            const vertex = vertices[i];
            const createHandle = this.options.createHandle;
            const processHandle = this.options.processHandle;
            const handle = createHandle({
                index: i,
                graph: this.graph,
                guard: (evt) => this.guard(evt),
                attrs: this.options.attrs || {},
            });
            if (processHandle) {
                processHandle(handle);
            }
            this.graph.hook.onToolItemCreated({
                name: 'vertices',
                cell: this.cell,
                view: this.cellView,
                tool: handle,
            });
            handle.updatePosition(vertex.x, vertex.y);
            this.stamp(handle.container);
            this.container.appendChild(handle.container);
            this.handles.push(handle);
            this.startHandleListening(handle);
        }
    }
    updateHandles() {
        const vertices = this.vertices;
        for (let i = 0, l = vertices.length; i < l; i += 1) {
            const vertex = vertices[i];
            const handle = this.handles[i];
            if (handle) {
                handle.updatePosition(vertex.x, vertex.y);
            }
        }
    }
    updatePath() {
        const connection = this.childNodes.connection;
        if (connection) {
            connection.setAttribute('d', this.cellView.getConnectionPathData());
        }
    }
    startHandleListening(handle) {
        const edgeView = this.cellView;
        if (edgeView.can('vertexMovable')) {
            handle.on('change', this.onHandleChange, this);
            handle.on('changing', this.onHandleChanging, this);
            handle.on('changed', this.onHandleChanged, this);
        }
        if (edgeView.can('vertexDeletable')) {
            handle.on('remove', this.onHandleRemove, this);
        }
    }
    stopHandleListening(handle) {
        const edgeView = this.cellView;
        if (edgeView.can('vertexMovable')) {
            handle.off('change', this.onHandleChange, this);
            handle.off('changing', this.onHandleChanging, this);
            handle.off('changed', this.onHandleChanged, this);
        }
        if (edgeView.can('vertexDeletable')) {
            handle.off('remove', this.onHandleRemove, this);
        }
    }
    getNeighborPoints(index) {
        const edgeView = this.cellView;
        const vertices = this.vertices;
        const prev = index > 0 ? vertices[index - 1] : edgeView.sourceAnchor;
        const next = index < vertices.length - 1 ? vertices[index + 1] : edgeView.targetAnchor;
        return {
            prev: Point.create(prev),
            next: Point.create(next),
        };
    }
    getMouseEventArgs(evt) {
        const e = this.normalizeEvent(evt);
        const { x, y } = this.graph.snapToGrid(e.clientX, e.clientY);
        return { e, x, y };
    }
    onHandleChange({ e }) {
        this.focus();
        const edgeView = this.cellView;
        edgeView.cell.startBatch('move-vertex', { ui: true, toolId: this.cid });
        if (!this.options.stopPropagation) {
            const { e: evt, x, y } = this.getMouseEventArgs(e);
            edgeView.notifyMouseDown(evt, x, y);
        }
    }
    onHandleChanging({ handle, e, }) {
        const edgeView = this.cellView;
        const index = handle.options.index;
        const { e: evt, x, y } = this.getMouseEventArgs(e);
        const vertex = { x, y };
        this.snapVertex(vertex, index);
        edgeView.cell.setVertexAt(index, vertex, { ui: true, toolId: this.cid });
        handle.updatePosition(vertex.x, vertex.y);
        if (!this.options.stopPropagation) {
            edgeView.notifyMouseMove(evt, x, y);
        }
    }
    onHandleChanged({ e }) {
        const options = this.options;
        const edgeView = this.cellView;
        if (options.addable) {
            this.updatePath();
        }
        if (!options.removeRedundancies) {
            return;
        }
        const verticesRemoved = edgeView.removeRedundantLinearVertices({
            ui: true,
            toolId: this.cid,
        });
        if (verticesRemoved) {
            this.render();
        }
        this.blur();
        edgeView.cell.stopBatch('move-vertex', { ui: true, toolId: this.cid });
        if (this.eventData(e).vertexAdded) {
            edgeView.cell.stopBatch('add-vertex', { ui: true, toolId: this.cid });
        }
        const { e: evt, x, y } = this.getMouseEventArgs(e);
        if (!this.options.stopPropagation) {
            edgeView.notifyMouseUp(evt, x, y);
        }
        edgeView.checkMouseleave(evt);
        options.onChanged && options.onChanged({ edge: edgeView.cell, edgeView });
    }
    snapVertex(vertex, index) {
        const snapRadius = this.options.snapRadius || 0;
        if (snapRadius > 0) {
            const neighbors = this.getNeighborPoints(index);
            const prev = neighbors.prev;
            const next = neighbors.next;
            if (Math.abs(vertex.x - prev.x) < snapRadius) {
                vertex.x = prev.x;
            }
            else if (Math.abs(vertex.x - next.x) < snapRadius) {
                vertex.x = next.x;
            }
            if (Math.abs(vertex.y - prev.y) < snapRadius) {
                vertex.y = neighbors.prev.y;
            }
            else if (Math.abs(vertex.y - next.y) < snapRadius) {
                vertex.y = next.y;
            }
        }
    }
    onHandleRemove({ handle, e }) {
        if (this.options.removable) {
            const index = handle.options.index;
            const edgeView = this.cellView;
            edgeView.cell.removeVertexAt(index, { ui: true });
            if (this.options.addable) {
                this.updatePath();
            }
            edgeView.checkMouseleave(this.normalizeEvent(e));
        }
    }
    onPathMouseDown(evt) {
        const edgeView = this.cellView;
        if (this.guard(evt) ||
            !this.options.addable ||
            !edgeView.can('vertexAddable')) {
            return;
        }
        evt.stopPropagation();
        evt.preventDefault();
        const e = this.normalizeEvent(evt);
        const vertex = this.graph.snapToGrid(e.clientX, e.clientY).toJSON();
        edgeView.cell.startBatch('add-vertex', { ui: true, toolId: this.cid });
        const index = edgeView.getVertexIndex(vertex.x, vertex.y);
        this.snapVertex(vertex, index);
        edgeView.cell.insertVertex(vertex, index, {
            ui: true,
            toolId: this.cid,
        });
        this.render();
        const handle = this.handles[index];
        this.eventData(e, { vertexAdded: true });
        handle.onMouseDown(e);
    }
    onRemove() {
        this.resetHandles();
    }
}
(function (Vertices) {
    class Handle extends View {
        constructor(options) {
            super();
            this.options = options;
            this.render();
            this.delegateEvents({
                mousedown: 'onMouseDown',
                touchstart: 'onMouseDown',
                dblclick: 'onDoubleClick',
            });
        }
        get graph() {
            return this.options.graph;
        }
        render() {
            this.container = View.createElement('circle', true);
            const attrs = this.options.attrs;
            if (typeof attrs === 'function') {
                const defaults = Vertices.getDefaults();
                this.setAttrs(Object.assign(Object.assign({}, defaults.attrs), attrs(this)));
            }
            else {
                this.setAttrs(attrs);
            }
            this.addClass(this.prefixClassName('edge-tool-vertex'));
        }
        updatePosition(x, y) {
            this.setAttrs({ cx: x, cy: y });
        }
        onMouseDown(evt) {
            if (this.options.guard(evt)) {
                return;
            }
            evt.stopPropagation();
            evt.preventDefault();
            this.graph.view.undelegateEvents();
            this.delegateDocumentEvents({
                mousemove: 'onMouseMove',
                touchmove: 'onMouseMove',
                mouseup: 'onMouseUp',
                touchend: 'onMouseUp',
                touchcancel: 'onMouseUp',
            }, evt.data);
            this.emit('change', { e: evt, handle: this });
        }
        onMouseMove(evt) {
            this.emit('changing', { e: evt, handle: this });
        }
        onMouseUp(evt) {
            this.emit('changed', { e: evt, handle: this });
            this.undelegateDocumentEvents();
            this.graph.view.delegateEvents();
        }
        onDoubleClick(evt) {
            this.emit('remove', { e: evt, handle: this });
        }
    }
    Vertices.Handle = Handle;
})(Vertices || (Vertices = {}));
(function (Vertices) {
    const pathClassName = Util.prefix('edge-tool-vertex-path');
    Vertices.config({
        name: 'vertices',
        snapRadius: 20,
        addable: true,
        removable: true,
        removeRedundancies: true,
        stopPropagation: true,
        attrs: {
            r: 6,
            fill: '#333',
            stroke: '#fff',
            cursor: 'move',
            'stroke-width': 2,
        },
        createHandle: (options) => new Vertices.Handle(options),
        markup: [
            {
                tagName: 'path',
                selector: 'connection',
                className: pathClassName,
                attrs: {
                    fill: 'none',
                    stroke: 'transparent',
                    'stroke-width': 10,
                    cursor: 'pointer',
                },
            },
        ],
        events: {
            [`mousedown .${pathClassName}`]: 'onPathMouseDown',
            [`touchstart .${pathClassName}`]: 'onPathMouseDown',
        },
    });
})(Vertices || (Vertices = {}));
//# sourceMappingURL=vertices.js.map