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
import { Rectangle, Polyline, Point, Angle, Path, Line } from '../geometry';
import { StringExt, ObjectExt, NumberExt, FunctionExt, Dom, Vector, } from '../util';
import { Router, Connector, NodeAnchor, EdgeAnchor, ConnectionPoint, } from '../registry';
import { Edge } from '../model/edge';
import { Markup } from './markup';
import { CellView } from './cell';
export class EdgeView extends CellView {
    constructor() {
        super(...arguments);
        this.POINT_ROUNDING = 2;
        this.markerCache = {};
        // #endregion
        // #endregion
    }
    get [Symbol.toStringTag]() {
        return EdgeView.toStringTag;
    }
    getContainerClassName() {
        return [super.getContainerClassName(), this.prefixClassName('edge')].join(' ');
    }
    get sourceBBox() {
        const sourceView = this.sourceView;
        if (!sourceView) {
            const sourceDef = this.cell.getSource();
            return new Rectangle(sourceDef.x, sourceDef.y);
        }
        const sourceMagnet = this.sourceMagnet;
        if (sourceView.isEdgeElement(sourceMagnet)) {
            return new Rectangle(this.sourceAnchor.x, this.sourceAnchor.y);
        }
        return sourceView.getBBoxOfElement(sourceMagnet || sourceView.container);
    }
    get targetBBox() {
        const targetView = this.targetView;
        if (!targetView) {
            const targetDef = this.cell.getTarget();
            return new Rectangle(targetDef.x, targetDef.y);
        }
        const targetMagnet = this.targetMagnet;
        if (targetView.isEdgeElement(targetMagnet)) {
            return new Rectangle(this.targetAnchor.x, this.targetAnchor.y);
        }
        return targetView.getBBoxOfElement(targetMagnet || targetView.container);
    }
    isEdgeView() {
        return true;
    }
    confirmUpdate(flag, options = {}) {
        let ref = flag;
        if (this.hasAction(ref, 'source')) {
            if (!this.updateTerminalProperties('source')) {
                return ref;
            }
            ref = this.removeAction(ref, 'source');
        }
        if (this.hasAction(ref, 'target')) {
            if (!this.updateTerminalProperties('target')) {
                return ref;
            }
            ref = this.removeAction(ref, 'target');
        }
        const graph = this.graph;
        const sourceView = this.sourceView;
        const targetView = this.targetView;
        if (graph &&
            ((sourceView && !graph.renderer.isViewMounted(sourceView)) ||
                (targetView && !graph.renderer.isViewMounted(targetView)))) {
            // Wait for the sourceView and targetView to be rendered.
            return ref;
        }
        if (this.hasAction(ref, 'render')) {
            this.render();
            ref = this.removeAction(ref, [
                'render',
                'update',
                'vertices',
                'labels',
                'tools',
                'widget',
            ]);
            return ref;
        }
        ref = this.handleAction(ref, 'vertices', () => this.renderVertexMarkers());
        ref = this.handleAction(ref, 'update', () => this.update(null, options));
        ref = this.handleAction(ref, 'labels', () => this.onLabelsChange(options));
        ref = this.handleAction(ref, 'tools', () => {
            this.renderTools();
            this.updateToolsPosition();
        });
        ref = this.handleAction(ref, 'widget', () => this.renderExternalTools());
        return ref;
    }
    onLabelsChange(options = {}) {
        // Note: this optimization works in async=false mode only
        if (this.shouldRerenderLabels(options)) {
            this.renderLabels();
        }
        else {
            this.updateLabels();
        }
        this.updateLabelPositions();
    }
    shouldRerenderLabels(options = {}) {
        const previousLabels = this.cell.previous('labels');
        if (previousLabels == null) {
            return true;
        }
        // Here is an optimization for cases when we know, that change does
        // not require re-rendering of all labels.
        if ('propertyPathArray' in options && 'propertyValue' in options) {
            // The label is setting by `prop()` method
            const pathArray = options.propertyPathArray || [];
            const pathLength = pathArray.length;
            if (pathLength > 1) {
                // We are changing a single label here e.g. 'labels/0/position'
                const index = pathArray[1];
                if (previousLabels[index]) {
                    if (pathLength === 2) {
                        // We are changing the entire label. Need to check if the
                        // markup is also being changed.
                        return (typeof options.propertyValue === 'object' &&
                            ObjectExt.has(options.propertyValue, 'markup'));
                    }
                    // We are changing a label property but not the markup
                    if (pathArray[2] !== 'markup') {
                        return false;
                    }
                }
            }
        }
        return true;
    }
    render() {
        this.empty();
        this.containers = {};
        this.renderMarkup();
        this.renderLabels();
        this.update();
        this.renderExternalTools();
        return this;
    }
    renderMarkup() {
        const markup = this.cell.markup;
        if (markup) {
            if (typeof markup === 'string') {
                return this.renderStringMarkup(markup);
            }
            return this.renderJSONMarkup(markup);
        }
        throw new TypeError('Invalid edge markup.');
    }
    renderJSONMarkup(markup) {
        const ret = this.parseJSONMarkup(markup, this.container);
        this.selectors = ret.selectors;
        this.container.append(ret.fragment);
    }
    renderStringMarkup(markup) {
        const cache = this.containers;
        const children = Vector.createVectors(markup);
        // Cache children elements for quicker access.
        children.forEach((child) => {
            const className = child.attr('class');
            if (className) {
                cache[StringExt.camelCase(className)] =
                    child.node;
            }
        });
        this.renderTools();
        this.renderVertexMarkers();
        this.renderArrowheadMarkers();
        Dom.append(this.container, children.map((child) => child.node));
    }
    renderLabels() {
        const edge = this.cell;
        const labels = edge.getLabels();
        const count = labels.length;
        let container = this.containers.labels;
        this.labelCache = {};
        this.labelSelectors = {};
        if (count <= 0) {
            if (container && container.parentNode) {
                container.parentNode.removeChild(container);
            }
            return this;
        }
        if (container) {
            this.empty(container);
        }
        else {
            container = Dom.createSvgElement('g');
            this.addClass(this.prefixClassName('edge-labels'), container);
            this.containers.labels = container;
        }
        for (let i = 0, ii = labels.length; i < ii; i += 1) {
            const label = labels[i];
            const normalized = this.normalizeLabelMarkup(this.parseLabelMarkup(label.markup));
            let labelNode;
            let selectors;
            if (normalized) {
                labelNode = normalized.node;
                selectors = normalized.selectors;
            }
            else {
                const defaultLabel = edge.getDefaultLabel();
                const normalized = this.normalizeLabelMarkup(this.parseLabelMarkup(defaultLabel.markup));
                labelNode = normalized.node;
                selectors = normalized.selectors;
            }
            labelNode.setAttribute('data-index', `${i}`);
            container.appendChild(labelNode);
            const rootSelector = this.rootSelector;
            if (selectors[rootSelector]) {
                throw new Error('Ambiguous label root selector.');
            }
            selectors[rootSelector] = labelNode;
            this.labelCache[i] = labelNode;
            this.labelSelectors[i] = selectors;
        }
        if (container.parentNode == null) {
            this.container.appendChild(container);
        }
        this.updateLabels();
        this.customizeLabels();
        return this;
    }
    parseLabelMarkup(markup) {
        if (markup) {
            if (typeof markup === 'string') {
                return this.parseLabelStringMarkup(markup);
            }
            return this.parseJSONMarkup(markup);
        }
        return null;
    }
    parseLabelStringMarkup(labelMarkup) {
        const children = Vector.createVectors(labelMarkup);
        const fragment = document.createDocumentFragment();
        for (let i = 0, n = children.length; i < n; i += 1) {
            const currentChild = children[i].node;
            fragment.appendChild(currentChild);
        }
        return { fragment, selectors: {} };
    }
    normalizeLabelMarkup(markup) {
        if (markup == null) {
            return;
        }
        const fragment = markup.fragment;
        if (!(fragment instanceof DocumentFragment) || !fragment.hasChildNodes()) {
            throw new Error('Invalid label markup.');
        }
        let vel;
        const childNodes = fragment.childNodes;
        if (childNodes.length > 1 || childNodes[0].nodeName.toUpperCase() !== 'G') {
            // default markup fragment is not wrapped in `<g/>`
            // add a `<g/>` container
            vel = Vector.create('g').append(fragment);
        }
        else {
            vel = Vector.create(childNodes[0]);
        }
        vel.addClass(this.prefixClassName('edge-label'));
        return {
            node: vel.node,
            selectors: markup.selectors,
        };
    }
    updateLabels() {
        if (this.containers.labels) {
            const edge = this.cell;
            const labels = edge.labels;
            const canLabelMove = this.can('edgeLabelMovable');
            const defaultLabel = edge.getDefaultLabel();
            for (let i = 0, n = labels.length; i < n; i += 1) {
                const elem = this.labelCache[i];
                const selectors = this.labelSelectors[i];
                elem.setAttribute('cursor', canLabelMove ? 'move' : 'default');
                const label = labels[i];
                const attrs = ObjectExt.merge({}, defaultLabel.attrs, label.attrs);
                this.updateAttrs(elem, attrs, {
                    selectors,
                    rootBBox: label.size ? Rectangle.fromSize(label.size) : undefined,
                });
            }
        }
    }
    mergeLabelAttrs(hasCustomMarkup, labelAttrs, defaultLabelAttrs) {
        if (labelAttrs === null) {
            return null;
        }
        if (labelAttrs === undefined) {
            if (defaultLabelAttrs === null) {
                return null;
            }
            if (defaultLabelAttrs === undefined) {
                return undefined;
            }
            if (hasCustomMarkup) {
                return defaultLabelAttrs;
            }
            return ObjectExt.merge({}, defaultLabelAttrs);
        }
        if (hasCustomMarkup) {
            return ObjectExt.merge({}, defaultLabelAttrs, labelAttrs);
        }
    }
    customizeLabels() {
        if (this.containers.labels) {
            const edge = this.cell;
            const labels = edge.labels;
            for (let i = 0, n = labels.length; i < n; i += 1) {
                const label = labels[i];
                const container = this.labelCache[i];
                const selectors = this.labelSelectors[i];
                this.graph.hook.onEdgeLabelRendered({
                    edge,
                    label,
                    container,
                    selectors,
                });
            }
        }
    }
    renderTools() {
        const container = this.containers.tools;
        if (container == null) {
            return this;
        }
        const markup = this.cell.toolMarkup;
        const $container = this.$(container).empty();
        if (Markup.isStringMarkup(markup)) {
            let template = StringExt.template(markup);
            const tool = Vector.create(template());
            $container.append(tool.node);
            this.toolCache = tool.node;
            // If `doubleTools` is enabled, we render copy of the tools on the
            // other side of the edge as well but only if the edge is longer
            // than `longLength`.
            if (this.options.doubleTools) {
                let tool2;
                const doubleToolMarkup = this.cell.doubleToolMarkup;
                if (Markup.isStringMarkup(doubleToolMarkup)) {
                    template = StringExt.template(doubleToolMarkup);
                    tool2 = Vector.create(template());
                }
                else {
                    tool2 = tool.clone();
                }
                $container.append(tool2.node);
                this.tool2Cache = tool2.node;
            }
        }
        return this;
    }
    renderExternalTools() {
        const tools = this.cell.getTools();
        this.addTools(tools);
        return this;
    }
    renderVertexMarkers() {
        const container = this.containers.vertices;
        if (container == null) {
            return this;
        }
        const markup = this.cell.vertexMarkup;
        const $container = this.$(container).empty();
        if (Markup.isStringMarkup(markup)) {
            const template = StringExt.template(markup);
            this.cell.getVertices().forEach((vertex, index) => {
                $container.append(Vector.create(template(Object.assign({ index }, vertex))).node);
            });
        }
        return this;
    }
    renderArrowheadMarkers() {
        const container = this.containers.arrowheads;
        if (container == null) {
            return this;
        }
        const markup = this.cell.arrowheadMarkup;
        const $container = this.$(container).empty();
        if (Markup.isStringMarkup(markup)) {
            const template = StringExt.template(markup);
            const sourceArrowhead = Vector.create(template({ end: 'source' })).node;
            const targetArrowhead = Vector.create(template({ end: 'target' })).node;
            this.containers.sourceArrowhead = sourceArrowhead;
            this.containers.targetArrowhead = targetArrowhead;
            $container.append(sourceArrowhead, targetArrowhead);
        }
        return this;
    }
    // #endregion
    // #region updating
    update(partialAttrs, options = {}) {
        this.cleanCache();
        this.updateConnection(options);
        const attrs = this.cell.getAttrs();
        if (attrs != null) {
            this.updateAttrs(this.container, attrs, {
                attrs: partialAttrs === attrs ? null : partialAttrs,
                selectors: this.selectors,
            });
        }
        this.updateConnectionPath();
        this.updateLabelPositions();
        this.updateToolsPosition();
        this.updateArrowheadMarkers();
        this.updateTools(options);
        return this;
    }
    removeRedundantLinearVertices(options = {}) {
        const edge = this.cell;
        const vertices = edge.getVertices();
        const routePoints = [this.sourceAnchor, ...vertices, this.targetAnchor];
        const rawCount = routePoints.length;
        // Puts the route points into a polyline and try to simplify.
        const polyline = new Polyline(routePoints);
        polyline.simplify({ threshold: 0.01 });
        const simplifiedPoints = polyline.points.map((point) => point.toJSON());
        const simplifiedCount = simplifiedPoints.length;
        // If simplification did not remove any redundant vertices.
        if (rawCount === simplifiedCount) {
            return 0;
        }
        // Sets simplified polyline points as edge vertices.
        // Removes first and last polyline points again (source/target anchors).
        edge.setVertices(simplifiedPoints.slice(1, simplifiedCount - 1), options);
        return rawCount - simplifiedCount;
    }
    updateConnectionPath() {
        const containers = this.containers;
        if (containers.connection) {
            const pathData = this.getConnectionPathData();
            containers.connection.setAttribute('d', pathData);
        }
        if (containers.connectionWrap) {
            const pathData = this.getConnectionPathData();
            containers.connectionWrap.setAttribute('d', pathData);
        }
        if (containers.sourceMarker && containers.targetMarker) {
            this.translateAndAutoOrientArrows(containers.sourceMarker, containers.targetMarker);
        }
    }
    getTerminalView(type) {
        switch (type) {
            case 'source':
                return this.sourceView || null;
            case 'target':
                return this.targetView || null;
            default:
                throw new Error(`Unknown terminal type '${type}'`);
        }
    }
    getTerminalAnchor(type) {
        switch (type) {
            case 'source':
                return Point.create(this.sourceAnchor);
            case 'target':
                return Point.create(this.targetAnchor);
            default:
                throw new Error(`Unknown terminal type '${type}'`);
        }
    }
    getTerminalConnectionPoint(type) {
        switch (type) {
            case 'source':
                return Point.create(this.sourcePoint);
            case 'target':
                return Point.create(this.targetPoint);
            default:
                throw new Error(`Unknown terminal type '${type}'`);
        }
    }
    getTerminalMagnet(type, options = {}) {
        switch (type) {
            case 'source': {
                if (options.raw) {
                    return this.sourceMagnet;
                }
                const sourceView = this.sourceView;
                if (!sourceView) {
                    return null;
                }
                return this.sourceMagnet || sourceView.container;
            }
            case 'target': {
                if (options.raw) {
                    return this.targetMagnet;
                }
                const targetView = this.targetView;
                if (!targetView) {
                    return null;
                }
                return this.targetMagnet || targetView.container;
            }
            default: {
                throw new Error(`Unknown terminal type '${type}'`);
            }
        }
    }
    updateConnection(options = {}) {
        const edge = this.cell;
        // The edge is being translated by an ancestor that will shift
        // source, target and vertices by an equal distance.
        if (options.translateBy &&
            edge.isFragmentDescendantOf(options.translateBy)) {
            const tx = options.tx || 0;
            const ty = options.ty || 0;
            this.routePoints = new Polyline(this.routePoints).translate(tx, ty).points;
            this.translateConnectionPoints(tx, ty);
            this.path.translate(tx, ty);
        }
        else {
            const vertices = edge.getVertices();
            // 1. Find anchor points
            const anchors = this.findAnchors(vertices);
            this.sourceAnchor = anchors.source;
            this.targetAnchor = anchors.target;
            // 2. Find route points
            this.routePoints = this.findRoutePoints(vertices);
            // 3. Find connection points
            const connectionPoints = this.findConnectionPoints(this.routePoints, this.sourceAnchor, this.targetAnchor);
            this.sourcePoint = connectionPoints.source;
            this.targetPoint = connectionPoints.target;
            // 4. Find Marker Connection Point
            const markerPoints = this.findMarkerPoints(this.routePoints, this.sourcePoint, this.targetPoint);
            // 5. Make path
            this.path = this.findPath(this.routePoints, markerPoints.source || this.sourcePoint, markerPoints.target || this.targetPoint);
        }
        this.cleanCache();
    }
    findAnchors(vertices) {
        const edge = this.cell;
        const source = edge.source;
        const target = edge.target;
        const firstVertex = vertices[0];
        const lastVertex = vertices[vertices.length - 1];
        if (target.priority && !source.priority) {
            // Reversed order
            return this.findAnchorsOrdered('target', lastVertex, 'source', firstVertex);
        }
        // Usual order
        return this.findAnchorsOrdered('source', firstVertex, 'target', lastVertex);
    }
    findAnchorsOrdered(firstType, firstPoint, secondType, secondPoint) {
        let firstAnchor;
        let secondAnchor;
        const edge = this.cell;
        const firstTerminal = edge[firstType];
        const secondTerminal = edge[secondType];
        const firstView = this.getTerminalView(firstType);
        const secondView = this.getTerminalView(secondType);
        const firstMagnet = this.getTerminalMagnet(firstType);
        const secondMagnet = this.getTerminalMagnet(secondType);
        if (firstView) {
            let firstRef;
            if (firstPoint) {
                firstRef = Point.create(firstPoint);
            }
            else if (secondView) {
                firstRef = secondMagnet;
            }
            else {
                firstRef = Point.create(secondTerminal);
            }
            firstAnchor = this.getAnchor(firstTerminal.anchor, firstView, firstMagnet, firstRef, firstType);
        }
        else {
            firstAnchor = Point.create(firstTerminal);
        }
        if (secondView) {
            const secondRef = Point.create(secondPoint || firstAnchor);
            secondAnchor = this.getAnchor(secondTerminal.anchor, secondView, secondMagnet, secondRef, secondType);
        }
        else {
            secondAnchor = Point.isPointLike(secondTerminal)
                ? Point.create(secondTerminal)
                : new Point();
        }
        return {
            [firstType]: firstAnchor,
            [secondType]: secondAnchor,
        };
    }
    getAnchor(def, cellView, magnet, ref, terminalType) {
        const isEdge = cellView.isEdgeElement(magnet);
        const connecting = this.graph.options.connecting;
        let config = typeof def === 'string' ? { name: def } : def;
        if (!config) {
            const defaults = isEdge
                ? (terminalType === 'source'
                    ? connecting.sourceEdgeAnchor
                    : connecting.targetEdgeAnchor) || connecting.edgeAnchor
                : (terminalType === 'source'
                    ? connecting.sourceAnchor
                    : connecting.targetAnchor) || connecting.anchor;
            config = typeof defaults === 'string' ? { name: defaults } : defaults;
        }
        if (!config) {
            throw new Error(`Anchor should be specified.`);
        }
        let anchor;
        const name = config.name;
        if (isEdge) {
            const fn = EdgeAnchor.registry.get(name);
            if (typeof fn !== 'function') {
                return EdgeAnchor.registry.onNotFound(name);
            }
            anchor = FunctionExt.call(fn, this, cellView, magnet, ref, config.args || {}, terminalType);
        }
        else {
            const fn = NodeAnchor.registry.get(name);
            if (typeof fn !== 'function') {
                return NodeAnchor.registry.onNotFound(name);
            }
            anchor = FunctionExt.call(fn, this, cellView, magnet, ref, config.args || {}, terminalType);
        }
        return anchor ? anchor.round(this.POINT_ROUNDING) : new Point();
    }
    findRoutePoints(vertices = []) {
        const defaultRouter = this.graph.options.connecting.router || Router.presets.normal;
        const router = this.cell.getRouter() || defaultRouter;
        let routePoints;
        if (typeof router === 'function') {
            routePoints = FunctionExt.call(router, this, vertices, {}, this);
        }
        else {
            const name = typeof router === 'string' ? router : router.name;
            const args = typeof router === 'string' ? {} : router.args || {};
            const fn = name ? Router.registry.get(name) : Router.presets.normal;
            if (typeof fn !== 'function') {
                return Router.registry.onNotFound(name);
            }
            routePoints = FunctionExt.call(fn, this, vertices, args, this);
        }
        return routePoints == null
            ? vertices.map((p) => Point.create(p))
            : routePoints.map((p) => Point.create(p));
    }
    findConnectionPoints(routePoints, sourceAnchor, targetAnchor) {
        const edge = this.cell;
        const connecting = this.graph.options.connecting;
        const sourceTerminal = edge.getSource();
        const targetTerminal = edge.getTarget();
        const sourceView = this.sourceView;
        const targetView = this.targetView;
        const firstRoutePoint = routePoints[0];
        const lastRoutePoint = routePoints[routePoints.length - 1];
        // source
        let sourcePoint;
        if (sourceView && !sourceView.isEdgeElement(this.sourceMagnet)) {
            const sourceMagnet = this.sourceMagnet || sourceView.container;
            const sourcePointRef = firstRoutePoint || targetAnchor;
            const sourceLine = new Line(sourcePointRef, sourceAnchor);
            const connectionPointDef = sourceTerminal.connectionPoint ||
                connecting.sourceConnectionPoint ||
                connecting.connectionPoint;
            sourcePoint = this.getConnectionPoint(connectionPointDef, sourceView, sourceMagnet, sourceLine, 'source');
        }
        else {
            sourcePoint = sourceAnchor;
        }
        // target
        let targetPoint;
        if (targetView && !targetView.isEdgeElement(this.targetMagnet)) {
            const targetMagnet = this.targetMagnet || targetView.container;
            const targetConnectionPointDef = targetTerminal.connectionPoint ||
                connecting.targetConnectionPoint ||
                connecting.connectionPoint;
            const targetPointRef = lastRoutePoint || sourceAnchor;
            const targetLine = new Line(targetPointRef, targetAnchor);
            targetPoint = this.getConnectionPoint(targetConnectionPointDef, targetView, targetMagnet, targetLine, 'target');
        }
        else {
            targetPoint = targetAnchor;
        }
        return {
            source: sourcePoint,
            target: targetPoint,
        };
    }
    getConnectionPoint(def, view, magnet, line, endType) {
        const anchor = line.end;
        if (def == null) {
            return anchor;
        }
        const name = typeof def === 'string' ? def : def.name;
        const args = typeof def === 'string' ? {} : def.args;
        const fn = ConnectionPoint.registry.get(name);
        if (typeof fn !== 'function') {
            return ConnectionPoint.registry.onNotFound(name);
        }
        const connectionPoint = FunctionExt.call(fn, this, line, view, magnet, args || {}, endType);
        return connectionPoint ? connectionPoint.round(this.POINT_ROUNDING) : anchor;
    }
    updateMarkerAttr(type) {
        const attrs = this.cell.getAttrs();
        const key = `.${type}-marker`;
        const partial = attrs && attrs[key];
        if (partial) {
            this.updateAttrs(this.container, {}, {
                attrs: { [key]: partial },
                selectors: this.selectors,
            });
        }
    }
    findMarkerPoints(routePoints, sourcePoint, targetPoint) {
        const getLineWidth = (type) => {
            const attrs = this.cell.getAttrs();
            const keys = Object.keys(attrs);
            for (let i = 0, l = keys.length; i < l; i += 1) {
                const attr = attrs[keys[i]];
                if (attr[`${type}Marker`] || attr[`${type}-marker`]) {
                    const strokeWidth = attr.strokeWidth || attr['stroke-width'];
                    if (strokeWidth) {
                        return parseFloat(strokeWidth);
                    }
                    break;
                }
            }
            return null;
        };
        const firstRoutePoint = routePoints[0];
        const lastRoutePoint = routePoints[routePoints.length - 1];
        const sourceMarkerElem = this.containers.sourceMarker;
        const targetMarkerElem = this.containers.targetMarker;
        const cache = this.markerCache;
        let sourceMarkerPoint;
        let targetMarkerPoint;
        // Move the source point by the width of the marker taking into
        // account its scale around x-axis. Note that scale is the only
        // transform that makes sense to be set in `.marker-source`
        // attributes object as all other transforms (translate/rotate)
        // will be replaced by the `translateAndAutoOrient()` function.
        if (sourceMarkerElem) {
            this.updateMarkerAttr('source');
            // support marker connection point registry???
            cache.sourceBBox = cache.sourceBBox || Dom.getBBox(sourceMarkerElem);
            if (cache.sourceBBox.width > 0) {
                const scale = Dom.scale(sourceMarkerElem);
                sourceMarkerPoint = sourcePoint
                    .clone()
                    .move(firstRoutePoint || targetPoint, cache.sourceBBox.width * scale.sx * -1);
            }
        }
        else {
            const strokeWidth = getLineWidth('source');
            if (strokeWidth) {
                sourceMarkerPoint = sourcePoint
                    .clone()
                    .move(firstRoutePoint || targetPoint, -strokeWidth);
            }
        }
        if (targetMarkerElem) {
            this.updateMarkerAttr('target');
            cache.targetBBox = cache.targetBBox || Dom.getBBox(targetMarkerElem);
            if (cache.targetBBox.width > 0) {
                const scale = Dom.scale(targetMarkerElem);
                targetMarkerPoint = targetPoint
                    .clone()
                    .move(lastRoutePoint || sourcePoint, cache.targetBBox.width * scale.sx * -1);
            }
        }
        else {
            const strokeWidth = getLineWidth('target');
            if (strokeWidth) {
                targetMarkerPoint = targetPoint
                    .clone()
                    .move(lastRoutePoint || sourcePoint, -strokeWidth);
            }
        }
        // If there was no markup for the marker, use the connection point.
        cache.sourcePoint = sourceMarkerPoint || sourcePoint.clone();
        cache.targetPoint = targetMarkerPoint || targetPoint.clone();
        return {
            source: sourceMarkerPoint,
            target: targetMarkerPoint,
        };
    }
    findPath(routePoints, sourcePoint, targetPoint) {
        const def = this.cell.getConnector() || this.graph.options.connecting.connector;
        let name;
        let args;
        let fn;
        if (typeof def === 'string') {
            name = def;
        }
        else {
            name = def.name;
            args = def.args;
        }
        if (name) {
            const method = Connector.registry.get(name);
            if (typeof method !== 'function') {
                return Connector.registry.onNotFound(name);
            }
            fn = method;
        }
        else {
            fn = Connector.presets.normal;
        }
        const path = FunctionExt.call(fn, this, sourcePoint, targetPoint, routePoints, Object.assign(Object.assign({}, args), { raw: true }), this);
        return typeof path === 'string' ? Path.parse(path) : path;
    }
    translateConnectionPoints(tx, ty) {
        const cache = this.markerCache;
        if (cache.sourcePoint) {
            cache.sourcePoint.translate(tx, ty);
        }
        if (cache.targetPoint) {
            cache.targetPoint.translate(tx, ty);
        }
        this.sourcePoint.translate(tx, ty);
        this.targetPoint.translate(tx, ty);
        this.sourceAnchor.translate(tx, ty);
        this.targetAnchor.translate(tx, ty);
    }
    updateLabelPositions() {
        if (this.containers.labels == null) {
            return this;
        }
        const path = this.path;
        if (!path) {
            return this;
        }
        const edge = this.cell;
        const labels = edge.getLabels();
        if (labels.length === 0) {
            return this;
        }
        const defaultLabel = edge.getDefaultLabel();
        const defaultPosition = this.normalizeLabelPosition(defaultLabel.position);
        for (let i = 0, ii = labels.length; i < ii; i += 1) {
            const label = labels[i];
            const labelPosition = this.normalizeLabelPosition(label.position);
            const pos = ObjectExt.merge({}, defaultPosition, labelPosition);
            const matrix = this.getLabelTransformationMatrix(pos);
            this.labelCache[i].setAttribute('transform', Dom.matrixToTransformString(matrix));
        }
        return this;
    }
    updateToolsPosition() {
        if (this.containers.tools == null) {
            return this;
        }
        // Move the tools a bit to the target position but don't cover the
        // `sourceArrowhead` marker. Note that the offset is hardcoded here.
        // The offset should be always more than the
        // `this.$('.marker-arrowhead[end="source"]')[0].bbox().width` but looking
        // this up all the time would be slow.
        let scale = '';
        let offset = this.options.toolsOffset;
        const connectionLength = this.getConnectionLength();
        // Firefox returns `connectionLength=NaN` in odd cases (for bezier curves).
        // In that case we won't update tools position at all.
        if (connectionLength != null) {
            // If the edge is too short, make the tools half the
            // size and the offset twice as low.
            if (connectionLength < this.options.shortLength) {
                scale = 'scale(.5)';
                offset /= 2;
            }
            let pos = this.getPointAtLength(offset);
            if (pos != null) {
                Dom.attr(this.toolCache, 'transform', `translate(${pos.x},${pos.y}) ${scale}`);
            }
            if (this.options.doubleTools &&
                connectionLength >= this.options.longLength) {
                const doubleToolsOffset = this.options.doubleToolsOffset || offset;
                pos = this.getPointAtLength(connectionLength - doubleToolsOffset);
                if (pos != null) {
                    Dom.attr(this.tool2Cache, 'transform', `translate(${pos.x},${pos.y}) ${scale}`);
                }
                Dom.attr(this.tool2Cache, 'visibility', 'visible');
            }
            else if (this.options.doubleTools) {
                Dom.attr(this.tool2Cache, 'visibility', 'hidden');
            }
        }
        return this;
    }
    updateArrowheadMarkers() {
        const container = this.containers.arrowheads;
        if (container == null) {
            return this;
        }
        if (container.style.display === 'none') {
            return this;
        }
        const sourceArrowhead = this.containers.sourceArrowhead;
        const targetArrowhead = this.containers.targetArrowhead;
        if (sourceArrowhead && targetArrowhead) {
            const len = this.getConnectionLength() || 0;
            const sx = len < this.options.shortLength ? 0.5 : 1;
            Dom.scale(sourceArrowhead, sx);
            Dom.scale(targetArrowhead, sx);
            this.translateAndAutoOrientArrows(sourceArrowhead, targetArrowhead);
        }
        return this;
    }
    updateTerminalProperties(type) {
        const edge = this.cell;
        const graph = this.graph;
        const terminal = edge[type];
        const nodeId = terminal && terminal.cell;
        const viewKey = `${type}View`;
        // terminal is a point
        if (!nodeId) {
            this[viewKey] = null;
            this.updateTerminalMagnet(type);
            return true;
        }
        const terminalCell = graph.getCellById(nodeId);
        if (!terminalCell) {
            throw new Error(`Edge's ${type} node with id "${nodeId}" not exists`);
        }
        const endView = terminalCell.findView(graph);
        if (!endView) {
            return false;
        }
        this[viewKey] = endView;
        this.updateTerminalMagnet(type);
        return true;
    }
    updateTerminalMagnet(type) {
        const propName = `${type}Magnet`;
        const terminalView = this.getTerminalView(type);
        if (terminalView) {
            let magnet = terminalView.getMagnetFromEdgeTerminal(this.cell[type]);
            if (magnet === terminalView.container) {
                magnet = null;
            }
            this[propName] = magnet;
        }
        else {
            this[propName] = null;
        }
    }
    translateAndAutoOrientArrows(sourceArrow, targetArrow) {
        const route = this.routePoints;
        if (sourceArrow) {
            Dom.translateAndAutoOrient(sourceArrow, this.sourcePoint, route[0] || this.targetPoint, this.graph.view.stage);
        }
        if (targetArrow) {
            Dom.translateAndAutoOrient(targetArrow, this.targetPoint, route[route.length - 1] || this.sourcePoint, this.graph.view.stage);
        }
    }
    getLabelPositionAngle(idx) {
        const label = this.cell.getLabelAt(idx);
        if (label && label.position && typeof label.position === 'object') {
            return label.position.angle || 0;
        }
        return 0;
    }
    getLabelPositionArgs(idx) {
        const label = this.cell.getLabelAt(idx);
        if (label && label.position && typeof label.position === 'object') {
            return label.position.options;
        }
    }
    getDefaultLabelPositionArgs() {
        const defaultLabel = this.cell.getDefaultLabel();
        if (defaultLabel &&
            defaultLabel.position &&
            typeof defaultLabel.position === 'object') {
            return defaultLabel.position.options;
        }
    }
    // merge default label position args into label position args
    // keep `undefined` or `null` because `{}` means something else
    mergeLabelPositionArgs(labelPositionArgs, defaultLabelPositionArgs) {
        if (labelPositionArgs === null) {
            return null;
        }
        if (labelPositionArgs === undefined) {
            if (defaultLabelPositionArgs === null) {
                return null;
            }
            return defaultLabelPositionArgs;
        }
        return ObjectExt.merge({}, defaultLabelPositionArgs, labelPositionArgs);
    }
    addLabel(p1, p2, p3, options) {
        let localX;
        let localY;
        let localAngle = 0;
        let localOptions;
        if (typeof p1 !== 'number') {
            localX = p1.x;
            localY = p1.y;
            if (typeof p2 === 'number') {
                localAngle = p2;
                localOptions = p3;
            }
            else {
                localOptions = p2;
            }
        }
        else {
            localX = p1;
            localY = p2;
            if (typeof p3 === 'number') {
                localAngle = p3;
                localOptions = options;
            }
            else {
                localOptions = p3;
            }
        }
        // merge label position arguments
        const defaultLabelPositionArgs = this.getDefaultLabelPositionArgs();
        const labelPositionArgs = localOptions;
        const positionArgs = this.mergeLabelPositionArgs(labelPositionArgs, defaultLabelPositionArgs);
        // append label to labels array
        const label = {
            position: this.getLabelPosition(localX, localY, localAngle, positionArgs),
        };
        const index = -1;
        this.cell.insertLabel(label, index, localOptions);
        return index;
    }
    addVertex(x, y, options) {
        const isPoint = typeof x !== 'number';
        const localX = isPoint ? x.x : x;
        const localY = isPoint ? x.y : y;
        const localOptions = isPoint ? y : options;
        const vertex = { x: localX, y: localY };
        const index = this.getVertexIndex(localX, localY);
        this.cell.insertVertex(vertex, index, localOptions);
        return index;
    }
    sendToken(token, options, callback) {
        let duration;
        let reversed;
        let selector;
        let rorate;
        let timing = 'linear';
        if (typeof options === 'object') {
            duration = options.duration;
            reversed = options.reversed === true;
            selector = options.selector;
            if (options.rotate === false) {
                rorate = '';
            }
            else if (options.rotate === true) {
                rorate = 'auto';
            }
            else if (options.rotate != null) {
                rorate = `${options.rotate}`;
            }
            if (options.timing) {
                timing = options.timing;
            }
        }
        else {
            duration = options;
            reversed = false;
            selector = null;
        }
        duration = duration || 1000;
        const attrs = {
            dur: `${duration}ms`,
            repeatCount: '1',
            calcMode: timing,
            fill: 'freeze',
        };
        if (rorate) {
            attrs.rotate = rorate;
        }
        if (reversed) {
            attrs.keyPoints = '1;0';
            attrs.keyTimes = '0;1';
        }
        if (typeof options === 'object') {
            const { duration, reversed, selector, rotate, timing } = options, others = __rest(options, ["duration", "reversed", "selector", "rotate", "timing"]);
            Object.keys(others).forEach((key) => {
                attrs[key] = others[key];
            });
        }
        let path;
        if (typeof selector === 'string') {
            path = this.findOne(selector, this.container, this.selectors);
        }
        else {
            // Select connection path automatically.
            path = this.containers.connection
                ? this.containers.connection
                : this.container.querySelector('path');
        }
        if (!(path instanceof SVGPathElement)) {
            throw new Error('Token animation requires a valid connection path.');
        }
        const target = typeof token === 'string' ? this.findOne(token) : token;
        if (target == null) {
            throw new Error('Token animation requires a valid token element.');
        }
        const parent = target.parentNode;
        const revert = () => {
            if (!parent) {
                Dom.remove(target);
            }
        };
        const vToken = Vector.create(target);
        if (!parent) {
            vToken.appendTo(this.graph.view.stage);
        }
        const onComplete = attrs.complete;
        attrs.complete = (e) => {
            revert();
            if (callback) {
                callback();
            }
            if (onComplete) {
                onComplete(e);
            }
        };
        const stop = vToken.animateAlongPath(attrs, path);
        return () => {
            revert();
            stop();
        };
    }
    // #endregion
    getConnection() {
        return this.path != null ? this.path.clone() : null;
    }
    getConnectionPathData() {
        if (this.path == null) {
            return '';
        }
        const cache = this.cache.pathCache;
        if (!ObjectExt.has(cache, 'data')) {
            cache.data = this.path.serialize();
        }
        return cache.data || '';
    }
    getConnectionSubdivisions() {
        if (this.path == null) {
            return null;
        }
        const cache = this.cache.pathCache;
        if (!ObjectExt.has(cache, 'segmentSubdivisions')) {
            cache.segmentSubdivisions = this.path.getSegmentSubdivisions();
        }
        return cache.segmentSubdivisions;
    }
    getConnectionLength() {
        if (this.path == null) {
            return 0;
        }
        const cache = this.cache.pathCache;
        if (!ObjectExt.has(cache, 'length')) {
            cache.length = this.path.length({
                segmentSubdivisions: this.getConnectionSubdivisions(),
            });
        }
        return cache.length;
    }
    getPointAtLength(length) {
        if (this.path == null) {
            return null;
        }
        return this.path.pointAtLength(length, {
            segmentSubdivisions: this.getConnectionSubdivisions(),
        });
    }
    getPointAtRatio(ratio) {
        if (this.path == null) {
            return null;
        }
        if (NumberExt.isPercentage(ratio)) {
            // eslint-disable-next-line
            ratio = parseFloat(ratio) / 100;
        }
        return this.path.pointAt(ratio, {
            segmentSubdivisions: this.getConnectionSubdivisions(),
        });
    }
    getTangentAtLength(length) {
        if (this.path == null) {
            return null;
        }
        return this.path.tangentAtLength(length, {
            segmentSubdivisions: this.getConnectionSubdivisions(),
        });
    }
    getTangentAtRatio(ratio) {
        if (this.path == null) {
            return null;
        }
        return this.path.tangentAt(ratio, {
            segmentSubdivisions: this.getConnectionSubdivisions(),
        });
    }
    getClosestPoint(point) {
        if (this.path == null) {
            return null;
        }
        return this.path.closestPoint(point, {
            segmentSubdivisions: this.getConnectionSubdivisions(),
        });
    }
    getClosestPointLength(point) {
        if (this.path == null) {
            return null;
        }
        return this.path.closestPointLength(point, {
            segmentSubdivisions: this.getConnectionSubdivisions(),
        });
    }
    getClosestPointRatio(point) {
        if (this.path == null) {
            return null;
        }
        return this.path.closestPointNormalizedLength(point, {
            segmentSubdivisions: this.getConnectionSubdivisions(),
        });
    }
    getLabelPosition(x, y, p3, p4) {
        const pos = { distance: 0 };
        // normalize data from the two possible signatures
        let angle = 0;
        let options;
        if (typeof p3 === 'number') {
            angle = p3;
            options = p4;
        }
        else {
            options = p3;
        }
        if (options != null) {
            pos.options = options;
        }
        // identify distance/offset settings
        const isOffsetAbsolute = options && options.absoluteOffset;
        const isDistanceRelative = !(options && options.absoluteDistance);
        const isDistanceAbsoluteReverse = options && options.absoluteDistance && options.reverseDistance;
        // find closest point t
        const path = this.path;
        const pathOptions = {
            segmentSubdivisions: this.getConnectionSubdivisions(),
        };
        const labelPoint = new Point(x, y);
        const t = path.closestPointT(labelPoint, pathOptions);
        // distance
        const totalLength = this.getConnectionLength() || 0;
        let labelDistance = path.lengthAtT(t, pathOptions);
        if (isDistanceRelative) {
            labelDistance = totalLength > 0 ? labelDistance / totalLength : 0;
        }
        if (isDistanceAbsoluteReverse) {
            // fix for end point (-0 => 1)
            labelDistance = -1 * (totalLength - labelDistance) || 1;
        }
        pos.distance = labelDistance;
        // offset
        // use absolute offset if:
        // - options.absoluteOffset is true,
        // - options.absoluteOffset is not true but there is no tangent
        let tangent;
        if (!isOffsetAbsolute)
            tangent = path.tangentAtT(t);
        let labelOffset;
        if (tangent) {
            labelOffset = tangent.pointOffset(labelPoint);
        }
        else {
            const closestPoint = path.pointAtT(t);
            const labelOffsetDiff = labelPoint.diff(closestPoint);
            labelOffset = { x: labelOffsetDiff.x, y: labelOffsetDiff.y };
        }
        pos.offset = labelOffset;
        pos.angle = angle;
        return pos;
    }
    normalizeLabelPosition(pos) {
        if (typeof pos === 'number') {
            return { distance: pos };
        }
        return pos;
    }
    getLabelTransformationMatrix(labelPosition) {
        const pos = this.normalizeLabelPosition(labelPosition);
        const options = pos.options || {};
        const labelAngle = pos.angle || 0;
        const labelDistance = pos.distance;
        const isDistanceRelative = labelDistance > 0 && labelDistance <= 1;
        let labelOffset = 0;
        const offsetCoord = { x: 0, y: 0 };
        const offset = pos.offset;
        if (offset) {
            if (typeof offset === 'number') {
                labelOffset = offset;
            }
            else {
                if (offset.x != null) {
                    offsetCoord.x = offset.x;
                }
                if (offset.y != null) {
                    offsetCoord.y = offset.y;
                }
            }
        }
        const isOffsetAbsolute = offsetCoord.x !== 0 || offsetCoord.y !== 0 || labelOffset === 0;
        const isKeepGradient = options.keepGradient;
        const isEnsureLegibility = options.ensureLegibility;
        const path = this.path;
        const pathOpt = { segmentSubdivisions: this.getConnectionSubdivisions() };
        const distance = isDistanceRelative
            ? labelDistance * this.getConnectionLength()
            : labelDistance;
        const tangent = path.tangentAtLength(distance, pathOpt);
        let translation;
        let angle = labelAngle;
        if (tangent) {
            if (isOffsetAbsolute) {
                translation = tangent.start;
                translation.translate(offsetCoord);
            }
            else {
                const normal = tangent.clone();
                normal.rotate(-90, tangent.start);
                normal.setLength(labelOffset);
                translation = normal.end;
            }
            if (isKeepGradient) {
                angle = tangent.angle() + labelAngle;
                if (isEnsureLegibility) {
                    angle = Angle.normalize(((angle + 90) % 180) - 90);
                }
            }
        }
        else {
            // fallback - the connection has zero length
            translation = path.start;
            if (isOffsetAbsolute) {
                translation.translate(offsetCoord);
            }
        }
        return Dom.createSVGMatrix()
            .translate(translation.x, translation.y)
            .rotate(angle);
    }
    getLabelCoordinates(pos) {
        const matrix = this.getLabelTransformationMatrix(pos);
        return new Point(matrix.e, matrix.f);
    }
    getVertexIndex(x, y) {
        const edge = this.cell;
        const vertices = edge.getVertices();
        const vertexLength = this.getClosestPointLength(new Point(x, y));
        let index = 0;
        if (vertexLength != null) {
            for (const ii = vertices.length; index < ii; index += 1) {
                const currentVertex = vertices[index];
                const currentLength = this.getClosestPointLength(currentVertex);
                if (currentLength != null && vertexLength < currentLength) {
                    break;
                }
            }
        }
        return index;
    }
    getEventArgs(e, x, y) {
        const view = this; // eslint-disable-line
        const edge = view.cell;
        const cell = edge;
        if (x == null || y == null) {
            return { e, view, edge, cell };
        }
        return { e, x, y, view, edge, cell };
    }
    notifyUnhandledMouseDown(e, x, y) {
        this.notify('edge:unhandled:mousedown', {
            e,
            x,
            y,
            view: this,
            cell: this.cell,
            edge: this.cell,
        });
    }
    notifyMouseDown(e, x, y) {
        super.onMouseDown(e, x, y);
        this.notify('edge:mousedown', this.getEventArgs(e, x, y));
    }
    notifyMouseMove(e, x, y) {
        super.onMouseMove(e, x, y);
        this.notify('edge:mousemove', this.getEventArgs(e, x, y));
    }
    notifyMouseUp(e, x, y) {
        super.onMouseUp(e, x, y);
        this.notify('edge:mouseup', this.getEventArgs(e, x, y));
    }
    onClick(e, x, y) {
        super.onClick(e, x, y);
        this.notify('edge:click', this.getEventArgs(e, x, y));
    }
    onDblClick(e, x, y) {
        super.onDblClick(e, x, y);
        this.notify('edge:dblclick', this.getEventArgs(e, x, y));
    }
    onContextMenu(e, x, y) {
        super.onContextMenu(e, x, y);
        this.notify('edge:contextmenu', this.getEventArgs(e, x, y));
    }
    onMouseDown(e, x, y) {
        this.notifyMouseDown(e, x, y);
        const className = e.target.getAttribute('class');
        switch (className) {
            case 'vertex': {
                this.startVertexDragging(e, x, y);
                return;
            }
            case 'vertex-remove':
            case 'vertex-remove-area': {
                this.handleVertexRemoving(e, x, y);
                return;
            }
            case 'connection':
            case 'connection-wrap': {
                this.handleVertexAdding(e, x, y);
                return;
            }
            case 'arrowhead': {
                this.startArrowheadDragging(e, x, y);
                return;
            }
            case 'source-marker':
            case 'target-marker': {
                this.notifyUnhandledMouseDown(e, x, y);
                return;
            }
            default:
                break;
        }
        this.startEdgeDragging(e, x, y);
    }
    onMouseMove(e, x, y) {
        const data = this.getEventData(e);
        switch (data.action) {
            case 'drag-vertex': {
                this.dragVertex(e, x, y);
                break;
            }
            case 'drag-label': {
                this.dragLabel(e, x, y);
                break;
            }
            case 'drag-arrowhead': {
                this.dragArrowhead(e, x, y);
                break;
            }
            case 'drag-edge': {
                this.dragEdge(e, x, y);
                break;
            }
            default:
                break;
        }
        this.notifyMouseMove(e, x, y);
        return data;
    }
    onMouseUp(e, x, y) {
        const data = this.getEventData(e);
        switch (data.action) {
            case 'drag-vertex': {
                this.stopVertexDragging(e, x, y);
                break;
            }
            case 'drag-label': {
                this.stopLabelDragging(e, x, y);
                break;
            }
            case 'drag-arrowhead': {
                this.stopArrowheadDragging(e, x, y);
                break;
            }
            case 'drag-edge': {
                this.stopEdgeDragging(e, x, y);
                break;
            }
            default:
                break;
        }
        this.notifyMouseUp(e, x, y);
        this.checkMouseleave(e);
        return data;
    }
    onMouseOver(e) {
        super.onMouseOver(e);
        this.notify('edge:mouseover', this.getEventArgs(e));
    }
    onMouseOut(e) {
        super.onMouseOut(e);
        this.notify('edge:mouseout', this.getEventArgs(e));
    }
    onMouseEnter(e) {
        super.onMouseEnter(e);
        this.notify('edge:mouseenter', this.getEventArgs(e));
    }
    onMouseLeave(e) {
        super.onMouseLeave(e);
        this.notify('edge:mouseleave', this.getEventArgs(e));
    }
    onMouseWheel(e, x, y, delta) {
        super.onMouseWheel(e, x, y, delta);
        this.notify('edge:mousewheel', Object.assign({ delta }, this.getEventArgs(e, x, y)));
    }
    onCustomEvent(e, name, x, y) {
        // For default edge tool
        const tool = Dom.findParentByClass(e.target, 'edge-tool', this.container);
        if (tool) {
            e.stopPropagation(); // no further action to be executed
            if (this.can('useEdgeTools')) {
                if (name === 'edge:remove') {
                    this.cell.remove({ ui: true });
                    return;
                }
                this.notify('edge:customevent', Object.assign({ name }, this.getEventArgs(e, x, y)));
            }
            this.notifyMouseDown(e, x, y);
        }
        else {
            this.notify('edge:customevent', Object.assign({ name }, this.getEventArgs(e, x, y)));
            super.onCustomEvent(e, name, x, y);
        }
    }
    onLabelMouseDown(e, x, y) {
        this.notifyMouseDown(e, x, y);
        this.startLabelDragging(e, x, y);
        const stopPropagation = this.getEventData(e).stopPropagation;
        if (stopPropagation) {
            e.stopPropagation();
        }
    }
    // #region drag edge
    startEdgeDragging(e, x, y) {
        if (!this.can('edgeMovable')) {
            this.notifyUnhandledMouseDown(e, x, y);
            return;
        }
        this.setEventData(e, {
            x,
            y,
            moving: false,
            action: 'drag-edge',
        });
    }
    dragEdge(e, x, y) {
        const data = this.getEventData(e);
        if (!data.moving) {
            data.moving = true;
            this.addClass('edge-moving');
            this.notify('edge:move', {
                e,
                x,
                y,
                view: this,
                cell: this.cell,
                edge: this.cell,
            });
        }
        this.cell.translate(x - data.x, y - data.y, { ui: true });
        this.setEventData(e, { x, y });
        this.notify('edge:moving', {
            e,
            x,
            y,
            view: this,
            cell: this.cell,
            edge: this.cell,
        });
    }
    stopEdgeDragging(e, x, y) {
        const data = this.getEventData(e);
        if (data.moving) {
            this.removeClass('edge-moving');
            this.notify('edge:moved', {
                e,
                x,
                y,
                view: this,
                cell: this.cell,
                edge: this.cell,
            });
        }
        data.moving = false;
    }
    // #endregion
    // #region drag arrowhead
    prepareArrowheadDragging(type, options) {
        const magnet = this.getTerminalMagnet(type);
        const data = {
            action: 'drag-arrowhead',
            x: options.x,
            y: options.y,
            isNewEdge: options.isNewEdge === true,
            terminalType: type,
            initialMagnet: magnet,
            initialTerminal: ObjectExt.clone(this.cell[type]),
            fallbackAction: options.fallbackAction || 'revert',
            getValidateConnectionArgs: this.createValidateConnectionArgs(type),
            options: options.options,
        };
        this.beforeArrowheadDragging(data);
        return data;
    }
    createValidateConnectionArgs(type) {
        const args = [];
        args[4] = type;
        args[5] = this;
        let opposite;
        let i = 0;
        let j = 0;
        if (type === 'source') {
            i = 2;
            opposite = 'target';
        }
        else {
            j = 2;
            opposite = 'source';
        }
        const terminal = this.cell[opposite];
        const cellId = terminal.cell;
        if (cellId) {
            let magnet;
            const view = (args[i] = this.graph.renderer.findViewByCell(cellId));
            if (view) {
                magnet = view.getMagnetFromEdgeTerminal(terminal);
                if (magnet === view.container) {
                    magnet = undefined;
                }
            }
            args[i + 1] = magnet;
        }
        return (cellView, magnet) => {
            args[j] = cellView;
            args[j + 1] = cellView.container === magnet ? undefined : magnet;
            return args;
        };
    }
    beforeArrowheadDragging(data) {
        data.zIndex = this.cell.zIndex;
        this.cell.toFront();
        const style = this.container.style;
        data.pointerEvents = style.pointerEvents;
        style.pointerEvents = 'none';
        if (this.graph.options.connecting.highlight) {
            this.highlightAvailableMagnets(data);
        }
    }
    afterArrowheadDragging(data) {
        if (data.zIndex != null) {
            this.cell.setZIndex(data.zIndex, { ui: true });
            data.zIndex = null;
        }
        const container = this.container;
        container.style.pointerEvents = data.pointerEvents || '';
        if (this.graph.options.connecting.highlight) {
            this.unhighlightAvailableMagnets(data);
        }
    }
    arrowheadDragging(target, x, y, data) {
        data.x = x;
        data.y = y;
        // Checking views right under the pointer
        if (data.currentTarget !== target) {
            // Unhighlight the previous view under pointer if there was one.
            if (data.currentMagnet && data.currentView) {
                data.currentView.unhighlight(data.currentMagnet, {
                    type: 'magnetAdsorbed',
                });
            }
            data.currentView = this.graph.renderer.findViewByElem(target);
            if (data.currentView) {
                // If we found a view that is under the pointer, we need to find
                // the closest magnet based on the real target element of the event.
                data.currentMagnet = data.currentView.findMagnet(target);
                if (data.currentMagnet &&
                    this.graph.hook.validateConnection(...data.getValidateConnectionArgs(data.currentView, data.currentMagnet), data.currentView.getEdgeTerminal(data.currentMagnet, x, y, this.cell, data.terminalType))) {
                    data.currentView.highlight(data.currentMagnet, {
                        type: 'magnetAdsorbed',
                    });
                }
                else {
                    // This type of connection is not valid. Disregard this magnet.
                    data.currentMagnet = null;
                }
            }
            else {
                // Make sure we'll unset previous magnet.
                data.currentMagnet = null;
            }
        }
        data.currentTarget = target;
        this.cell.prop(data.terminalType, { x, y }, Object.assign(Object.assign({}, data.options), { ui: true }));
    }
    arrowheadDragged(data, x, y) {
        const view = data.currentView;
        const magnet = data.currentMagnet;
        if (!magnet || !view) {
            return;
        }
        view.unhighlight(magnet, { type: 'magnetAdsorbed' });
        const type = data.terminalType;
        const terminal = view.getEdgeTerminal(magnet, x, y, this.cell, type);
        this.cell.setTerminal(type, terminal, { ui: true });
    }
    snapArrowhead(x, y, data) {
        const graph = this.graph;
        const { snap, allowEdge } = graph.options.connecting;
        const radius = (typeof snap === 'object' && snap.radius) || 50;
        const findViewsOption = {
            x: x - radius,
            y: y - radius,
            width: 2 * radius,
            height: 2 * radius,
        };
        const views = graph.renderer.findViewsInArea(findViewsOption);
        if (allowEdge) {
            const edgeViews = graph.renderer
                .findEdgeViewsInArea(findViewsOption)
                .filter((view) => {
                return view !== this;
            });
            views.push(...edgeViews);
        }
        const prevView = data.closestView || null;
        const prevMagnet = data.closestMagnet || null;
        data.closestView = null;
        data.closestMagnet = null;
        let distance;
        let minDistance = Number.MAX_SAFE_INTEGER;
        const pos = new Point(x, y);
        views.forEach((view) => {
            if (view.container.getAttribute('magnet') !== 'false') {
                // Find distance from the center of the cell to pointer coordinates
                distance = view.cell.getBBox().getCenter().distance(pos);
                // the connection is looked up in a circle area by `distance < r`
                if (distance < radius && distance < minDistance) {
                    if (prevMagnet === view.container ||
                        graph.hook.validateConnection(...data.getValidateConnectionArgs(view, null), view.getEdgeTerminal(view.container, x, y, this.cell, data.terminalType))) {
                        minDistance = distance;
                        data.closestView = view;
                        data.closestMagnet = view.container;
                    }
                }
            }
            view.container.querySelectorAll('[magnet]').forEach((magnet) => {
                if (magnet.getAttribute('magnet') !== 'false') {
                    const bbox = view.getBBoxOfElement(magnet);
                    distance = pos.distance(bbox.getCenter());
                    if (distance < radius && distance < minDistance) {
                        if (prevMagnet === magnet ||
                            graph.hook.validateConnection(...data.getValidateConnectionArgs(view, magnet), view.getEdgeTerminal(magnet, x, y, this.cell, data.terminalType))) {
                            minDistance = distance;
                            data.closestView = view;
                            data.closestMagnet = magnet;
                        }
                    }
                }
            });
        });
        let terminal;
        const type = data.terminalType;
        const closestView = data.closestView;
        const closestMagnet = data.closestMagnet;
        const changed = prevMagnet !== closestMagnet;
        if (prevView && changed) {
            prevView.unhighlight(prevMagnet, {
                type: 'magnetAdsorbed',
            });
        }
        if (closestView) {
            if (!changed) {
                return;
            }
            closestView.highlight(closestMagnet, {
                type: 'magnetAdsorbed',
            });
            terminal = closestView.getEdgeTerminal(closestMagnet, x, y, this.cell, type);
        }
        else {
            terminal = { x, y };
        }
        this.cell.setTerminal(type, terminal, {}, Object.assign(Object.assign({}, data.options), { ui: true }));
    }
    snapArrowheadEnd(data) {
        // Finish off link snapping.
        // Everything except view unhighlighting was already done on pointermove.
        const closestView = data.closestView;
        const closestMagnet = data.closestMagnet;
        if (closestView && closestMagnet) {
            closestView.unhighlight(closestMagnet, {
                type: 'magnetAdsorbed',
            });
            data.currentMagnet = closestView.findMagnet(closestMagnet);
        }
        data.closestView = null;
        data.closestMagnet = null;
    }
    finishEmbedding(data) {
        // Resets parent of the edge if embedding is enabled
        if (this.graph.options.embedding.enabled && this.cell.updateParent()) {
            // Make sure we don't reverse to the original 'z' index
            data.zIndex = null;
        }
    }
    fallbackConnection(data) {
        switch (data.fallbackAction) {
            case 'remove':
                this.cell.remove({ ui: true });
                break;
            case 'revert':
            default:
                this.cell.prop(data.terminalType, data.initialTerminal, {
                    ui: true,
                });
                break;
        }
    }
    notifyConnectionEvent(data, e) {
        const terminalType = data.terminalType;
        const initialTerminal = data.initialTerminal;
        const currentTerminal = this.cell[terminalType];
        const changed = currentTerminal && !Edge.equalTerminals(initialTerminal, currentTerminal);
        if (changed) {
            const graph = this.graph;
            const previous = initialTerminal;
            const previousCell = previous.cell
                ? graph.getCellById(previous.cell)
                : null;
            const previousPort = previous.port;
            const previousView = previousCell
                ? graph.findViewByCell(previousCell)
                : null;
            const previousPoint = previousCell || data.isNewEdge
                ? null
                : Point.create(initialTerminal).toJSON();
            const current = currentTerminal;
            const currentCell = current.cell ? graph.getCellById(current.cell) : null;
            const currentPort = current.port;
            const currentView = currentCell ? graph.findViewByCell(currentCell) : null;
            const currentPoint = currentCell
                ? null
                : Point.create(currentTerminal).toJSON();
            this.notify('edge:connected', {
                e,
                previousCell,
                previousPort,
                previousView,
                previousPoint,
                currentCell,
                currentView,
                currentPort,
                currentPoint,
                previousMagnet: data.initialMagnet,
                currentMagnet: data.currentMagnet,
                edge: this.cell,
                view: this,
                type: terminalType,
                isNew: data.isNewEdge,
            });
        }
    }
    highlightAvailableMagnets(data) {
        const graph = this.graph;
        const cells = graph.model.getCells();
        data.marked = {};
        for (let i = 0, ii = cells.length; i < ii; i += 1) {
            const view = graph.renderer.findViewByCell(cells[i]);
            if (!view) {
                continue;
            }
            const magnets = Array.prototype.slice.call(view.container.querySelectorAll('[magnet]'));
            if (view.container.getAttribute('magnet') !== 'false') {
                magnets.push(view.container);
            }
            const availableMagnets = magnets.filter((magnet) => graph.hook.validateConnection(...data.getValidateConnectionArgs(view, magnet), view.getEdgeTerminal(magnet, data.x, data.y, this.cell, data.terminalType)));
            if (availableMagnets.length > 0) {
                // highlight all available magnets
                for (let j = 0, jj = availableMagnets.length; j < jj; j += 1) {
                    view.highlight(availableMagnets[j], { type: 'magnetAvailable' });
                }
                // highlight the entire view
                view.highlight(null, { type: 'nodeAvailable' });
                data.marked[view.cell.id] = availableMagnets;
            }
        }
    }
    unhighlightAvailableMagnets(data) {
        const marked = data.marked || {};
        Object.keys(marked).forEach((id) => {
            const view = this.graph.renderer.findViewByCell(id);
            if (view) {
                const magnets = marked[id];
                magnets.forEach((magnet) => {
                    view.unhighlight(magnet, { type: 'magnetAvailable' });
                });
                view.unhighlight(null, { type: 'nodeAvailable' });
            }
        });
        data.marked = null;
    }
    startArrowheadDragging(e, x, y) {
        if (!this.can('arrowheadMovable')) {
            this.notifyUnhandledMouseDown(e, x, y);
            return;
        }
        const elem = e.target;
        const type = elem.getAttribute('data-terminal');
        const data = this.prepareArrowheadDragging(type, { x, y });
        this.setEventData(e, data);
    }
    dragArrowhead(e, x, y) {
        const data = this.getEventData(e);
        if (this.graph.options.connecting.snap) {
            this.snapArrowhead(x, y, data);
        }
        else {
            this.arrowheadDragging(this.getEventTarget(e), x, y, data);
        }
    }
    stopArrowheadDragging(e, x, y) {
        const graph = this.graph;
        const data = this.getEventData(e);
        if (graph.options.connecting.snap) {
            this.snapArrowheadEnd(data);
        }
        else {
            this.arrowheadDragged(data, x, y);
        }
        const valid = graph.hook.validateEdge(this.cell, data.terminalType, data.initialTerminal);
        if (valid) {
            this.finishEmbedding(data);
            this.notifyConnectionEvent(data, e);
        }
        else {
            // If the changed edge is not allowed, revert to its previous state.
            this.fallbackConnection(data);
        }
        this.afterArrowheadDragging(data);
    }
    // #endregion
    // #region drag lable
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    startLabelDragging(e, x, y) {
        if (this.can('edgeLabelMovable')) {
            const target = e.currentTarget;
            const index = parseInt(target.getAttribute('data-index'), 10);
            const positionAngle = this.getLabelPositionAngle(index);
            const labelPositionArgs = this.getLabelPositionArgs(index);
            const defaultLabelPositionArgs = this.getDefaultLabelPositionArgs();
            const positionArgs = this.mergeLabelPositionArgs(labelPositionArgs, defaultLabelPositionArgs);
            this.setEventData(e, {
                index,
                positionAngle,
                positionArgs,
                stopPropagation: true,
                action: 'drag-label',
            });
        }
        else {
            // If labels can't be dragged no default action is triggered.
            this.setEventData(e, { stopPropagation: true });
        }
        this.graph.view.delegateDragEvents(e, this);
    }
    dragLabel(e, x, y) {
        const data = this.getEventData(e);
        const originLabel = this.cell.getLabelAt(data.index);
        const label = ObjectExt.merge({}, originLabel, {
            position: this.getLabelPosition(x, y, data.positionAngle, data.positionArgs),
        });
        this.cell.setLabelAt(data.index, label);
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    stopLabelDragging(e, x, y) { }
    // #endregion
    // #region drag vertex
    handleVertexAdding(e, x, y) {
        if (!this.can('vertexAddable')) {
            this.notifyUnhandledMouseDown(e, x, y);
            return;
        }
        // Store the index at which the new vertex has just been placed.
        // We'll be update the very same vertex position in `pointermove()`.
        const index = this.addVertex({ x, y }, { ui: true });
        this.setEventData(e, {
            index,
            action: 'drag-vertex',
        });
    }
    handleVertexRemoving(e, x, y) {
        if (!this.can('vertexDeletable')) {
            this.notifyUnhandledMouseDown(e, x, y);
            return;
        }
        const target = e.target;
        const index = parseInt(target.getAttribute('idx'), 10);
        this.cell.removeVertexAt(index);
    }
    startVertexDragging(e, x, y) {
        if (!this.can('vertexMovable')) {
            this.notifyUnhandledMouseDown(e, x, y);
            return;
        }
        const target = e.target;
        const index = parseInt(target.getAttribute('idx'), 10);
        this.setEventData(e, {
            index,
            action: 'drag-vertex',
        });
    }
    dragVertex(e, x, y) {
        const data = this.getEventData(e);
        this.cell.setVertexAt(data.index, { x, y }, { ui: true });
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    stopVertexDragging(e, x, y) { }
}
(function (EdgeView) {
    EdgeView.toStringTag = `X6.${EdgeView.name}`;
    function isEdgeView(instance) {
        if (instance == null) {
            return false;
        }
        if (instance instanceof EdgeView) {
            return true;
        }
        const tag = instance[Symbol.toStringTag];
        const view = instance;
        if ((tag == null || tag === EdgeView.toStringTag) &&
            typeof view.isNodeView === 'function' &&
            typeof view.isEdgeView === 'function' &&
            typeof view.confirmUpdate === 'function' &&
            typeof view.update === 'function' &&
            typeof view.getConnection === 'function') {
            return true;
        }
        return false;
    }
    EdgeView.isEdgeView = isEdgeView;
})(EdgeView || (EdgeView = {}));
EdgeView.config({
    isSvgElement: true,
    priority: 1,
    bootstrap: ['render', 'source', 'target'],
    actions: {
        view: ['render'],
        markup: ['render'],
        attrs: ['update'],
        source: ['source', 'update'],
        target: ['target', 'update'],
        router: ['update'],
        connector: ['update'],
        labels: ['labels'],
        defaultLabel: ['labels'],
        vertices: ['vertices', 'update'],
        vertexMarkup: ['vertices'],
        toolMarkup: ['tools'],
        tools: ['widget'],
    },
    shortLength: 105,
    longLength: 155,
    toolsOffset: 40,
    doubleTools: false,
    doubleToolsOffset: 65,
    sampleInterval: 50,
});
EdgeView.registry.register('edge', EdgeView, true);
//# sourceMappingURL=edge.js.map