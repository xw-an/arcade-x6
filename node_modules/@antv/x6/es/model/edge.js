var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import { ObjectExt, StringExt } from '../util';
import { Point, Polyline } from '../geometry';
import { Registry, } from '../registry';
import { Markup } from '../view/markup';
import { ShareRegistry } from './registry';
import { Cell } from './cell';
export class Edge extends Cell {
    constructor(metadata = {}) {
        super(metadata);
    }
    get [Symbol.toStringTag]() {
        return Edge.toStringTag;
    }
    preprocess(metadata, ignoreIdCheck) {
        const { source, sourceCell, sourcePort, sourcePoint, target, targetCell, targetPort, targetPoint } = metadata, others = __rest(metadata, ["source", "sourceCell", "sourcePort", "sourcePoint", "target", "targetCell", "targetPort", "targetPoint"]);
        const data = others;
        const isValidId = (val) => typeof val === 'string' || typeof val === 'number';
        if (source != null) {
            if (Cell.isCell(source)) {
                data.source = { cell: source.id };
            }
            else if (isValidId(source)) {
                data.source = { cell: source };
            }
            else if (Point.isPoint(source)) {
                data.source = source.toJSON();
            }
            else if (Array.isArray(source)) {
                data.source = { x: source[0], y: source[1] };
            }
            else {
                const cell = source.cell;
                if (Cell.isCell(cell)) {
                    data.source = Object.assign(Object.assign({}, source), { cell: cell.id });
                }
                else {
                    data.source = source;
                }
            }
        }
        if (sourceCell != null || sourcePort != null) {
            let terminal = data.source;
            if (sourceCell != null) {
                const id = isValidId(sourceCell) ? sourceCell : sourceCell.id;
                if (terminal) {
                    terminal.cell = id;
                }
                else {
                    terminal = data.source = { cell: id };
                }
            }
            if (sourcePort != null && terminal) {
                terminal.port = sourcePort;
            }
        }
        else if (sourcePoint != null) {
            data.source = Point.create(sourcePoint).toJSON();
        }
        if (target != null) {
            if (Cell.isCell(target)) {
                data.target = { cell: target.id };
            }
            else if (isValidId(target)) {
                data.target = { cell: target };
            }
            else if (Point.isPoint(target)) {
                data.target = target.toJSON();
            }
            else if (Array.isArray(target)) {
                data.target = { x: target[0], y: target[1] };
            }
            else {
                const cell = target.cell;
                if (Cell.isCell(cell)) {
                    data.target = Object.assign(Object.assign({}, target), { cell: cell.id });
                }
                else {
                    data.target = target;
                }
            }
        }
        if (targetCell != null || targetPort != null) {
            let terminal = data.target;
            if (targetCell != null) {
                const id = isValidId(targetCell) ? targetCell : targetCell.id;
                if (terminal) {
                    terminal.cell = id;
                }
                else {
                    terminal = data.target = { cell: id };
                }
            }
            if (targetPort != null && terminal) {
                terminal.port = targetPort;
            }
        }
        else if (targetPoint != null) {
            data.target = Point.create(targetPoint).toJSON();
        }
        return super.preprocess(data, ignoreIdCheck);
    }
    setup() {
        super.setup();
        this.on('change:labels', (args) => this.onLabelsChanged(args));
        this.on('change:vertices', (args) => this.onVertexsChanged(args));
    }
    isEdge() {
        return true;
    }
    // #region terminal
    disconnect(options = {}) {
        this.store.set({
            source: { x: 0, y: 0 },
            target: { x: 0, y: 0 },
        }, options);
        return this;
    }
    get source() {
        return this.getSource();
    }
    set source(data) {
        this.setSource(data);
    }
    getSource() {
        return this.getTerminal('source');
    }
    getSourceCellId() {
        return this.source.cell;
    }
    getSourcePortId() {
        return this.source.port;
    }
    setSource(source, args, options = {}) {
        return this.setTerminal('source', source, args, options);
    }
    get target() {
        return this.getTarget();
    }
    set target(data) {
        this.setTarget(data);
    }
    getTarget() {
        return this.getTerminal('target');
    }
    getTargetCellId() {
        return this.target.cell;
    }
    getTargetPortId() {
        return this.target.port;
    }
    setTarget(target, args, options = {}) {
        return this.setTerminal('target', target, args, options);
    }
    getTerminal(type) {
        return Object.assign({}, this.store.get(type));
    }
    setTerminal(type, terminal, args, options = {}) {
        // `terminal` is a cell
        if (Cell.isCell(terminal)) {
            this.store.set(type, ObjectExt.merge({}, args, { cell: terminal.id }), options);
            return this;
        }
        // `terminal` is a point-like object
        const p = terminal;
        if (Point.isPoint(terminal) || (p.x != null && p.y != null)) {
            this.store.set(type, ObjectExt.merge({}, args, { x: p.x, y: p.y }), options);
            return this;
        }
        // `terminal` is an object
        this.store.set(type, ObjectExt.cloneDeep(terminal), options);
        return this;
    }
    getSourcePoint() {
        return this.getTerminalPoint('source');
    }
    getTargetPoint() {
        return this.getTerminalPoint('target');
    }
    getTerminalPoint(type) {
        const terminal = this[type];
        if (Point.isPointLike(terminal)) {
            return Point.create(terminal);
        }
        const cell = this.getTerminalCell(type);
        if (cell) {
            return cell.getConnectionPoint(this, type);
        }
        return new Point();
    }
    getSourceCell() {
        return this.getTerminalCell('source');
    }
    getTargetCell() {
        return this.getTerminalCell('target');
    }
    getTerminalCell(type) {
        if (this.model) {
            const cellId = type === 'source' ? this.getSourceCellId() : this.getTargetCellId();
            if (cellId) {
                return this.model.getCell(cellId);
            }
        }
        return null;
    }
    getSourceNode() {
        return this.getTerminalNode('source');
    }
    getTargetNode() {
        return this.getTerminalNode('target');
    }
    getTerminalNode(type) {
        let cell = this; // eslint-disable-line
        const visited = {};
        while (cell && cell.isEdge()) {
            if (visited[cell.id]) {
                return null;
            }
            visited[cell.id] = true;
            cell = cell.getTerminalCell(type);
        }
        return cell && cell.isNode() ? cell : null;
    }
    // #endregion
    // #region router
    get router() {
        return this.getRouter();
    }
    set router(data) {
        if (data == null) {
            this.removeRouter();
        }
        else {
            this.setRouter(data);
        }
    }
    getRouter() {
        return this.store.get('router');
    }
    setRouter(name, args, options) {
        if (typeof name === 'object') {
            this.store.set('router', name, args);
        }
        else {
            this.store.set('router', { name, args }, options);
        }
        return this;
    }
    removeRouter(options = {}) {
        this.store.remove('router', options);
        return this;
    }
    // #endregion
    // #region connector
    get connector() {
        return this.getConnector();
    }
    set connector(data) {
        if (data == null) {
            this.removeConnector();
        }
        else {
            this.setConnector(data);
        }
    }
    getConnector() {
        return this.store.get('connector');
    }
    setConnector(name, args, options) {
        if (typeof name === 'object') {
            this.store.set('connector', name, args);
        }
        else {
            this.store.set('connector', { name, args }, options);
        }
        return this;
    }
    removeConnector(options = {}) {
        return this.store.remove('connector', options);
    }
    // #endregion
    // #region strategy
    get strategy() {
        return this.getStrategy();
    }
    set strategy(data) {
        if (data == null) {
            this.removeStrategy();
        }
        else {
            this.setStrategy(data);
        }
    }
    getStrategy() {
        return this.store.get('strategy');
    }
    setStrategy(name, args, options) {
        if (typeof name === 'object') {
            this.store.set('strategy', name, args);
        }
        else {
            this.store.set('strategy', { name, args }, options);
        }
        return this;
    }
    removeStrategy(options = {}) {
        return this.store.remove('strategy', options);
    }
    // #endregion
    // #region labels
    getDefaultLabel() {
        const ctor = this.constructor;
        const defaults = this.store.get('defaultLabel') || ctor.defaultLabel || {};
        return ObjectExt.cloneDeep(defaults);
    }
    get labels() {
        return this.getLabels();
    }
    set labels(labels) {
        this.setLabels(labels);
    }
    getLabels() {
        return [...this.store.get('labels', [])].map((item) => this.parseLabel(item));
    }
    setLabels(labels, options = {}) {
        this.store.set('labels', Array.isArray(labels) ? labels : [labels], options);
        return this;
    }
    insertLabel(label, index, options = {}) {
        const labels = this.getLabels();
        const len = labels.length;
        let idx = index != null && Number.isFinite(index) ? index : len;
        if (idx < 0) {
            idx = len + idx + 1;
        }
        labels.splice(idx, 0, this.parseLabel(label));
        return this.setLabels(labels, options);
    }
    appendLabel(label, options = {}) {
        return this.insertLabel(label, -1, options);
    }
    getLabelAt(index) {
        const labels = this.getLabels();
        if (index != null && Number.isFinite(index)) {
            return this.parseLabel(labels[index]);
        }
        return null;
    }
    setLabelAt(index, label, options = {}) {
        if (index != null && Number.isFinite(index)) {
            const labels = this.getLabels();
            labels[index] = this.parseLabel(label);
            this.setLabels(labels, options);
        }
        return this;
    }
    removeLabelAt(index, options = {}) {
        const labels = this.getLabels();
        const idx = index != null && Number.isFinite(index) ? index : -1;
        const removed = labels.splice(idx, 1);
        this.setLabels(labels, options);
        return removed.length ? removed[0] : null;
    }
    parseLabel(label) {
        if (typeof label === 'string') {
            const ctor = this.constructor;
            return ctor.parseStringLabel(label);
        }
        return label;
    }
    onLabelsChanged({ previous, current, }) {
        const added = previous && current
            ? current.filter((label1) => {
                if (!previous.find((label2) => label1 === label2 || ObjectExt.isEqual(label1, label2))) {
                    return label1;
                }
                return null;
            })
            : current
                ? [...current]
                : [];
        const removed = previous && current
            ? previous.filter((label1) => {
                if (!current.find((label2) => label1 === label2 || ObjectExt.isEqual(label1, label2))) {
                    return label1;
                }
                return null;
            })
            : previous
                ? [...previous]
                : [];
        if (added.length > 0) {
            this.notify('labels:added', { added, cell: this, edge: this });
        }
        if (removed.length > 0) {
            this.notify('labels:removed', { removed, cell: this, edge: this });
        }
    }
    // #endregion
    // #region vertices
    get vertexMarkup() {
        return this.getVertexMarkup();
    }
    set vertexMarkup(markup) {
        this.setVertexMarkup(markup);
    }
    getDefaultVertexMarkup() {
        return this.store.get('defaultVertexMarkup') || Markup.getEdgeVertexMarkup();
    }
    getVertexMarkup() {
        return this.store.get('vertexMarkup') || this.getDefaultVertexMarkup();
    }
    setVertexMarkup(markup, options = {}) {
        this.store.set('vertexMarkup', Markup.clone(markup), options);
        return this;
    }
    get vertices() {
        return this.getVertices();
    }
    set vertices(vertices) {
        this.setVertices(vertices);
    }
    getVertices() {
        return [...this.store.get('vertices', [])];
    }
    setVertices(vertices, options = {}) {
        const points = Array.isArray(vertices) ? vertices : [vertices];
        this.store.set('vertices', points.map((p) => Point.toJSON(p)), options);
        return this;
    }
    insertVertex(vertice, index, options = {}) {
        const vertices = this.getVertices();
        const len = vertices.length;
        let idx = index != null && Number.isFinite(index) ? index : len;
        if (idx < 0) {
            idx = len + idx + 1;
        }
        vertices.splice(idx, 0, Point.toJSON(vertice));
        return this.setVertices(vertices, options);
    }
    appendVertex(vertex, options = {}) {
        return this.insertVertex(vertex, -1, options);
    }
    getVertexAt(index) {
        if (index != null && Number.isFinite(index)) {
            const vertices = this.getVertices();
            return vertices[index];
        }
        return null;
    }
    setVertexAt(index, vertice, options = {}) {
        if (index != null && Number.isFinite(index)) {
            const vertices = this.getVertices();
            vertices[index] = vertice;
            this.setVertices(vertices, options);
        }
        return this;
    }
    removeVertexAt(index, options = {}) {
        const vertices = this.getVertices();
        const idx = index != null && Number.isFinite(index) ? index : -1;
        vertices.splice(idx, 1);
        return this.setVertices(vertices, options);
    }
    onVertexsChanged({ previous, current, }) {
        const added = previous && current
            ? current.filter((p1) => {
                if (!previous.find((p2) => Point.equals(p1, p2))) {
                    return p1;
                }
                return null;
            })
            : current
                ? [...current]
                : [];
        const removed = previous && current
            ? previous.filter((p1) => {
                if (!current.find((p2) => Point.equals(p1, p2))) {
                    return p1;
                }
                return null;
            })
            : previous
                ? [...previous]
                : [];
        if (added.length > 0) {
            this.notify('vertexs:added', { added, cell: this, edge: this });
        }
        if (removed.length > 0) {
            this.notify('vertexs:removed', { removed, cell: this, edge: this });
        }
    }
    // #endregion
    // #region markup
    getDefaultMarkup() {
        return this.store.get('defaultMarkup') || Markup.getEdgeMarkup();
    }
    getMarkup() {
        return super.getMarkup() || this.getDefaultMarkup();
    }
    // #endregion
    // #region toolMarkup
    get toolMarkup() {
        return this.getToolMarkup();
    }
    set toolMarkup(markup) {
        this.setToolMarkup(markup);
    }
    getDefaultToolMarkup() {
        return this.store.get('defaultToolMarkup') || Markup.getEdgeToolMarkup();
    }
    getToolMarkup() {
        return this.store.get('toolMarkup') || this.getDefaultToolMarkup();
    }
    setToolMarkup(markup, options = {}) {
        this.store.set('toolMarkup', markup, options);
        return this;
    }
    get doubleToolMarkup() {
        return this.getDoubleToolMarkup();
    }
    set doubleToolMarkup(markup) {
        this.setDoubleToolMarkup(markup);
    }
    getDefaultDoubleToolMarkup() {
        return this.store.get('defaultDoubleToolMarkup');
    }
    getDoubleToolMarkup() {
        return (this.store.get('doubleToolMarkup') || this.getDefaultDoubleToolMarkup());
    }
    setDoubleToolMarkup(markup, options = {}) {
        this.store.set('doubleToolMarkup', markup, options);
        return this;
    }
    // #endregion
    // #region arrowheadMarkup
    get arrowheadMarkup() {
        return this.getArrowheadMarkup();
    }
    set arrowheadMarkup(markup) {
        this.setArrowheadMarkup(markup);
    }
    getDefaultArrowheadMarkup() {
        return (this.store.get('defaultArrowheadMarkup') ||
            Markup.getEdgeArrowheadMarkup());
    }
    getArrowheadMarkup() {
        return this.store.get('arrowheadMarkup') || this.getDefaultArrowheadMarkup();
    }
    setArrowheadMarkup(markup, options = {}) {
        this.store.set('arrowheadMarkup', markup, options);
        return this;
    }
    // #endregion
    // #region transform
    /**
     * Translate the edge vertices (and source and target if they are points)
     * by `tx` pixels in the x-axis and `ty` pixels in the y-axis.
     */
    translate(tx, ty, options = {}) {
        options.translateBy = options.translateBy || this.id;
        options.tx = tx;
        options.ty = ty;
        return this.applyToPoints((p) => ({
            x: (p.x || 0) + tx,
            y: (p.y || 0) + ty,
        }), options);
    }
    /**
     * Scales the edge's points (vertices) relative to the given origin.
     */
    scale(sx, sy, origin, options = {}) {
        return this.applyToPoints((p) => {
            return Point.create(p).scale(sx, sy, origin).toJSON();
        }, options);
    }
    applyToPoints(worker, options = {}) {
        const attrs = {};
        const source = this.getSource();
        const target = this.getTarget();
        if (Point.isPointLike(source)) {
            attrs.source = worker(source);
        }
        if (Point.isPointLike(target)) {
            attrs.target = worker(target);
        }
        const vertices = this.getVertices();
        if (vertices.length > 0) {
            attrs.vertices = vertices.map(worker);
        }
        this.store.set(attrs, options);
        return this;
    }
    // #endregion
    // #region common
    getBBox() {
        return this.getPolyline().bbox();
    }
    getConnectionPoint() {
        return this.getPolyline().pointAt(0.5);
    }
    getPolyline() {
        const points = [
            this.getSourcePoint(),
            ...this.getVertices().map((vertice) => Point.create(vertice)),
            this.getTargetPoint(),
        ];
        return new Polyline(points);
    }
    updateParent(options) {
        let newParent = null;
        const source = this.getSourceCell();
        const target = this.getTargetCell();
        const prevParent = this.getParent();
        if (source && target) {
            if (source === target || source.isDescendantOf(target)) {
                newParent = target;
            }
            else if (target.isDescendantOf(source)) {
                newParent = source;
            }
            else {
                newParent = Cell.getCommonAncestor(source, target);
            }
        }
        // Unembeds the edge if source and target has no common
        // ancestor or common ancestor changed
        if (prevParent && (!newParent || newParent.id !== prevParent.id)) {
            prevParent.unembed(this, options);
        }
        if (newParent) {
            newParent.embed(this, options);
        }
        return newParent;
    }
    hasLoop(options = {}) {
        const source = this.getSource();
        const target = this.getTarget();
        const sourceId = source.cell;
        const targetId = target.cell;
        if (!sourceId || !targetId) {
            return false;
        }
        let loop = sourceId === targetId;
        // Note that there in the deep mode a edge can have a loop,
        // even if it connects only a parent and its embed.
        // A loop "target equals source" is valid in both shallow and deep mode.
        // eslint-disable-next-line
        if (!loop && options.deep && this._model) {
            const sourceCell = this.getSourceCell();
            const targetCell = this.getTargetCell();
            if (sourceCell && targetCell) {
                loop =
                    sourceCell.isAncestorOf(targetCell, options) ||
                        targetCell.isAncestorOf(sourceCell, options);
            }
        }
        return loop;
    }
    getFragmentAncestor() {
        const cells = [this, this.getSourceNode(), this.getTargetNode()].filter((item) => item != null);
        return this.getCommonAncestor(...cells);
    }
    isFragmentDescendantOf(cell) {
        const ancestor = this.getFragmentAncestor();
        return (!!ancestor && (ancestor.id === cell.id || ancestor.isDescendantOf(cell)));
    }
}
Edge.defaults = {};
(function (Edge) {
    function equalTerminals(a, b) {
        const a1 = a;
        const b1 = b;
        if (a1.cell === b1.cell) {
            return a1.port === b1.port || (a1.port == null && b1.port == null);
        }
        return false;
    }
    Edge.equalTerminals = equalTerminals;
})(Edge || (Edge = {}));
(function (Edge) {
    Edge.defaultLabel = {
        markup: [
            {
                tagName: 'rect',
                selector: 'body',
            },
            {
                tagName: 'text',
                selector: 'label',
            },
        ],
        attrs: {
            text: {
                fill: '#000',
                fontSize: 14,
                textAnchor: 'middle',
                textVerticalAnchor: 'middle',
                pointerEvents: 'none',
            },
            rect: {
                ref: 'label',
                fill: '#fff',
                rx: 3,
                ry: 3,
                refWidth: 1,
                refHeight: 1,
                refX: 0,
                refY: 0,
            },
        },
        position: {
            distance: 0.5,
        },
    };
    function parseStringLabel(text) {
        return {
            attrs: { label: { text } },
        };
    }
    Edge.parseStringLabel = parseStringLabel;
})(Edge || (Edge = {}));
(function (Edge) {
    Edge.toStringTag = `X6.${Edge.name}`;
    function isEdge(instance) {
        if (instance == null) {
            return false;
        }
        if (instance instanceof Edge) {
            return true;
        }
        const tag = instance[Symbol.toStringTag];
        const edge = instance;
        if ((tag == null || tag === Edge.toStringTag) &&
            typeof edge.isNode === 'function' &&
            typeof edge.isEdge === 'function' &&
            typeof edge.prop === 'function' &&
            typeof edge.attr === 'function' &&
            typeof edge.disconnect === 'function' &&
            typeof edge.getSource === 'function' &&
            typeof edge.getTarget === 'function') {
            return true;
        }
        return false;
    }
    Edge.isEdge = isEdge;
})(Edge || (Edge = {}));
(function (Edge) {
    Edge.registry = Registry.create({
        type: 'edge',
        process(shape, options) {
            if (ShareRegistry.exist(shape, false)) {
                throw new Error(`Edge with name '${shape}' was registered by anthor Node`);
            }
            if (typeof options === 'function') {
                options.config({ shape });
                return options;
            }
            let parent = Edge;
            // default inherit from 'dege'
            const { inherit = 'edge' } = options, others = __rest(options, ["inherit"]);
            if (typeof inherit === 'string') {
                const base = this.get(inherit || 'edge');
                if (base == null && inherit) {
                    this.onNotFound(inherit, 'inherited');
                }
                else {
                    parent = base;
                }
            }
            else {
                parent = inherit;
            }
            if (others.constructorName == null) {
                others.constructorName = shape;
            }
            const ctor = parent.define.call(parent, others);
            ctor.config({ shape });
            return ctor;
        },
    });
    ShareRegistry.setEdgeRegistry(Edge.registry);
})(Edge || (Edge = {}));
(function (Edge) {
    let counter = 0;
    function getClassName(name) {
        if (name) {
            return StringExt.pascalCase(name);
        }
        counter += 1;
        return `CustomEdge${counter}`;
    }
    function define(config) {
        const { constructorName, overwrite } = config, others = __rest(config, ["constructorName", "overwrite"]);
        const ctor = ObjectExt.createClass(getClassName(constructorName || others.shape), this);
        ctor.config(others);
        if (others.shape) {
            Edge.registry.register(others.shape, ctor, overwrite);
        }
        return ctor;
    }
    Edge.define = define;
    function create(options) {
        const shape = options.shape || 'edge';
        const Ctor = Edge.registry.get(shape);
        if (Ctor) {
            return new Ctor(options);
        }
        return Edge.registry.onNotFound(shape);
    }
    Edge.create = create;
})(Edge || (Edge = {}));
(function (Edge) {
    const shape = 'basic.edge';
    Edge.config({
        shape,
        propHooks(metadata) {
            const { label, vertices } = metadata, others = __rest(metadata, ["label", "vertices"]);
            if (label) {
                if (others.labels == null) {
                    others.labels = [];
                }
                const formated = typeof label === 'string' ? Edge.parseStringLabel(label) : label;
                others.labels.push(formated);
            }
            if (vertices) {
                if (Array.isArray(vertices)) {
                    others.vertices = vertices.map((item) => Point.create(item).toJSON());
                }
            }
            return others;
        },
    });
    Edge.registry.register(shape, Edge);
})(Edge || (Edge = {}));
//# sourceMappingURL=edge.js.map