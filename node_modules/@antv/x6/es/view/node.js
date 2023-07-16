import JQuery from 'jquery';
import { Util, Config } from '../global';
import { ArrayExt, FunctionExt, Dom, Vector } from '../util';
import { Rectangle, Point } from '../geometry';
import { Cell } from '../model/cell';
import { CellView } from './cell';
import { Markup } from './markup';
export class NodeView extends CellView {
    constructor() {
        super(...arguments);
        this.scalableNode = null;
        this.rotatableNode = null;
        this.scalableSelector = 'scalable';
        this.rotatableSelector = 'rotatable';
        this.defaultPortMarkup = Markup.getPortMarkup();
        this.defaultPortLabelMarkup = Markup.getPortLabelMarkup();
        this.defaultPortContainerMarkup = Markup.getPortContainerMarkup();
        this.portsCache = {};
        // #endregion
    }
    get [Symbol.toStringTag]() {
        return NodeView.toStringTag;
    }
    getContainerClassName() {
        const classList = [
            super.getContainerClassName(),
            this.prefixClassName('node'),
        ];
        if (!this.can('nodeMovable')) {
            classList.push(this.prefixClassName('node-immovable'));
        }
        return classList.join(' ');
    }
    updateClassName(e) {
        const target = e.target;
        if (target.hasAttribute('magnet')) {
            // port
            const className = this.prefixClassName('port-unconnectable');
            if (this.can('magnetConnectable')) {
                Dom.removeClass(target, className);
            }
            else {
                Dom.addClass(target, className);
            }
        }
        else {
            // node
            const className = this.prefixClassName('node-immovable');
            if (this.can('nodeMovable')) {
                this.removeClass(className);
            }
            else {
                this.addClass(className);
            }
        }
    }
    isNodeView() {
        return true;
    }
    confirmUpdate(flag, options = {}) {
        let ret = flag;
        if (this.hasAction(ret, 'ports')) {
            this.removePorts();
            this.cleanPortsCache();
        }
        if (this.hasAction(ret, 'render')) {
            this.render();
            ret = this.removeAction(ret, [
                'render',
                'update',
                'resize',
                'translate',
                'rotate',
                'ports',
                'tools',
            ]);
        }
        else {
            ret = this.handleAction(ret, 'resize', () => this.resize(options), 'update');
            ret = this.handleAction(ret, 'update', () => this.update(), 
            // `update()` will render ports when useCSSSelectors are enabled
            Config.useCSSSelector ? 'ports' : null);
            ret = this.handleAction(ret, 'translate', () => this.translate());
            ret = this.handleAction(ret, 'rotate', () => this.rotate());
            ret = this.handleAction(ret, 'ports', () => this.renderPorts());
            ret = this.handleAction(ret, 'tools', () => this.renderTools());
        }
        return ret;
    }
    update(partialAttrs) {
        this.cleanCache();
        // When CSS selector strings are used, make sure no rule matches port nodes.
        if (Config.useCSSSelector) {
            this.removePorts();
        }
        const node = this.cell;
        const size = node.getSize();
        const attrs = node.getAttrs();
        this.updateAttrs(this.container, attrs, {
            attrs: partialAttrs === attrs ? null : partialAttrs,
            rootBBox: new Rectangle(0, 0, size.width, size.height),
            selectors: this.selectors,
            scalableNode: this.scalableNode,
            rotatableNode: this.rotatableNode,
        });
        if (Config.useCSSSelector) {
            this.renderPorts();
        }
    }
    renderMarkup() {
        const markup = this.cell.markup;
        if (markup) {
            if (typeof markup === 'string') {
                return this.renderStringMarkup(markup);
            }
            return this.renderJSONMarkup(markup);
        }
        throw new TypeError('Invalid node markup.');
    }
    renderJSONMarkup(markup) {
        const ret = this.parseJSONMarkup(markup, this.container);
        const one = (elems) => Array.isArray(elems) ? elems[0] : elems;
        this.selectors = ret.selectors;
        this.rotatableNode = one(this.selectors[this.rotatableSelector]);
        this.scalableNode = one(this.selectors[this.scalableSelector]);
        this.container.appendChild(ret.fragment);
    }
    renderStringMarkup(markup) {
        Dom.append(this.container, Vector.toNodes(Vector.createVectors(markup)));
        this.rotatableNode = Dom.findOne(this.container, `.${this.rotatableSelector}`);
        this.scalableNode = Dom.findOne(this.container, `.${this.scalableSelector}`);
        this.selectors = {};
        if (this.rootSelector) {
            this.selectors[this.rootSelector] = this.container;
        }
    }
    render() {
        this.empty();
        this.renderMarkup();
        if (this.scalableNode) {
            // Double update is necessary for elements with the scalable group only
            // Note the `resize()` triggers the other `update`.
            this.update();
        }
        this.resize();
        if (this.rotatableNode) {
            this.rotate();
            this.translate();
        }
        else {
            this.updateTransform();
        }
        if (!Config.useCSSSelector) {
            this.renderPorts();
        }
        this.renderTools();
        return this;
    }
    resize(opt = {}) {
        if (this.scalableNode) {
            return this.updateSize(opt);
        }
        if (this.cell.getAngle()) {
            this.rotate();
        }
        this.update();
    }
    translate() {
        if (this.rotatableNode) {
            return this.updateTranslation();
        }
        this.updateTransform();
    }
    rotate() {
        if (this.rotatableNode) {
            this.updateRotation();
            // It's necessary to call the update for the nodes outside
            // the rotatable group referencing nodes inside the group
            this.update();
            return;
        }
        this.updateTransform();
    }
    getTranslationString() {
        const position = this.cell.getPosition();
        return `translate(${position.x},${position.y})`;
    }
    getRotationString() {
        const angle = this.cell.getAngle();
        if (angle) {
            const size = this.cell.getSize();
            return `rotate(${angle},${size.width / 2},${size.height / 2})`;
        }
    }
    updateTransform() {
        let transform = this.getTranslationString();
        const rot = this.getRotationString();
        if (rot) {
            transform += ` ${rot}`;
        }
        this.container.setAttribute('transform', transform);
    }
    updateRotation() {
        if (this.rotatableNode != null) {
            const transform = this.getRotationString();
            if (transform != null) {
                this.rotatableNode.setAttribute('transform', transform);
            }
            else {
                this.rotatableNode.removeAttribute('transform');
            }
        }
    }
    updateTranslation() {
        this.container.setAttribute('transform', this.getTranslationString());
    }
    updateSize(opt = {}) {
        const cell = this.cell;
        const size = cell.getSize();
        const angle = cell.getAngle();
        const scalableNode = this.scalableNode;
        // Getting scalable group's bbox.
        // Due to a bug in webkit's native SVG .getBBox implementation, the
        // bbox of groups with path children includes the paths' control points.
        // To work around the issue, we need to check whether there are any path
        // elements inside the scalable group.
        let recursive = false;
        if (scalableNode.getElementsByTagName('path').length > 0) {
            // If scalable has at least one descendant that is a path, we need
            // toswitch to recursive bbox calculation. Otherwise, group bbox
            // calculation works and so we can use the (faster) native function.
            recursive = true;
        }
        const scalableBBox = Dom.getBBox(scalableNode, { recursive });
        // Make sure `scalableBbox.width` and `scalableBbox.height` are not zero
        // which can happen if the element does not have any content.
        const sx = size.width / (scalableBBox.width || 1);
        const sy = size.height / (scalableBBox.height || 1);
        scalableNode.setAttribute('transform', `scale(${sx},${sy})`);
        // Now the interesting part. The goal is to be able to store the object geometry via just `x`, `y`, `angle`, `width` and `height`
        // Order of transformations is significant but we want to reconstruct the object always in the order:
        // resize(), rotate(), translate() no matter of how the object was transformed. For that to work,
        // we must adjust the `x` and `y` coordinates of the object whenever we resize it (because the origin of the
        // rotation changes). The new `x` and `y` coordinates are computed by canceling the previous rotation
        // around the center of the resized object (which is a different origin then the origin of the previous rotation)
        // and getting the top-left corner of the resulting object. Then we clean up the rotation back to what it originally was.
        // Cancel the rotation but now around a different origin, which is the center of the scaled object.
        const rotatableNode = this.rotatableNode;
        if (rotatableNode != null) {
            const transform = rotatableNode.getAttribute('transform');
            if (transform) {
                rotatableNode.setAttribute('transform', `${transform} rotate(${-angle},${size.width / 2},${size.height / 2})`);
                const rotatableBBox = Dom.getBBox(scalableNode, {
                    target: this.graph.view.stage,
                });
                // Store new x, y and perform rotate() again against the new rotation origin.
                cell.prop('position', { x: rotatableBBox.x, y: rotatableBBox.y }, Object.assign({ updated: true }, opt));
                this.translate();
                this.rotate();
            }
        }
        // Update must always be called on non-rotated element. Otherwise,
        // relative positioning would work with wrong (rotated) bounding boxes.
        this.update();
    }
    // #region ports
    findPortElem(portId, selector) {
        const cache = portId ? this.portsCache[portId] : null;
        if (!cache) {
            return null;
        }
        const portRoot = cache.portContentElement;
        const portSelectors = cache.portContentSelectors || {};
        return this.findOne(selector, portRoot, portSelectors);
    }
    initializePorts() {
        this.cleanPortsCache();
    }
    refreshPorts() {
        this.removePorts();
        this.cleanPortsCache();
        this.renderPorts();
    }
    cleanPortsCache() {
        this.portsCache = {};
    }
    removePorts() {
        Object.keys(this.portsCache).forEach((portId) => {
            const cached = this.portsCache[portId];
            Dom.remove(cached.portElement);
        });
    }
    renderPorts() {
        const container = this.getPortsContainer();
        // References to rendered elements without z-index
        const references = [];
        container.childNodes.forEach((child) => {
            references.push(child);
        });
        const portsGropsByZ = ArrayExt.groupBy(this.cell.getParsedPorts(), 'zIndex');
        const autoZIndexKey = 'auto';
        // render non-z first
        if (portsGropsByZ[autoZIndexKey]) {
            portsGropsByZ[autoZIndexKey].forEach((port) => {
                const portElement = this.getPortElement(port);
                container.append(portElement);
                references.push(portElement);
            });
        }
        Object.keys(portsGropsByZ).forEach((key) => {
            if (key !== autoZIndexKey) {
                const zIndex = parseInt(key, 10);
                this.appendPorts(portsGropsByZ[key], zIndex, references);
            }
        });
        this.updatePorts();
    }
    getPortsContainer() {
        return this.rotatableNode || this.container;
    }
    appendPorts(ports, zIndex, refs) {
        const elems = ports.map((p) => this.getPortElement(p));
        if (refs[zIndex] || zIndex < 0) {
            Dom.before(refs[Math.max(zIndex, 0)], elems);
        }
        else {
            Dom.append(this.getPortsContainer(), elems);
        }
    }
    getPortElement(port) {
        const cached = this.portsCache[port.id];
        if (cached) {
            return cached.portElement;
        }
        return this.createPortElement(port);
    }
    createPortElement(port) {
        let renderResult = Markup.renderMarkup(this.getPortContainerMarkup());
        const portElement = renderResult.elem;
        if (portElement == null) {
            throw new Error('Invalid port container markup.');
        }
        renderResult = Markup.renderMarkup(this.getPortMarkup(port));
        const portContentElement = renderResult.elem;
        const portContentSelectors = renderResult.selectors;
        if (portContentElement == null) {
            throw new Error('Invalid port markup.');
        }
        this.setAttrs({
            port: port.id,
            'port-group': port.group,
        }, portContentElement);
        renderResult = Markup.renderMarkup(this.getPortLabelMarkup(port.label));
        const portLabelElement = renderResult.elem;
        const portLabelSelectors = renderResult.selectors;
        if (portLabelElement == null) {
            throw new Error('Invalid port label markup.');
        }
        let portSelectors;
        if (portContentSelectors && portLabelSelectors) {
            // eslint-disable-next-line
            for (const key in portLabelSelectors) {
                if (portContentSelectors[key] && key !== this.rootSelector) {
                    throw new Error('Selectors within port must be unique.');
                }
            }
            portSelectors = Object.assign(Object.assign({}, portContentSelectors), portLabelSelectors);
        }
        else {
            portSelectors = portContentSelectors || portLabelSelectors;
        }
        let portClass = 'x6-port';
        if (port.group) {
            portClass += ` x6-port-${port.group}`;
        }
        Dom.addClass(portElement, portClass);
        Dom.addClass(portContentElement, 'x6-port-body');
        Dom.addClass(portLabelElement, 'x6-port-label');
        portElement.appendChild(portContentElement);
        portElement.appendChild(portLabelElement);
        this.portsCache[port.id] = {
            portElement,
            portSelectors,
            portLabelElement,
            portLabelSelectors,
            portContentElement,
            portContentSelectors,
        };
        this.graph.hook.onPortRendered({
            port,
            node: this.cell,
            container: portElement,
            selectors: portSelectors,
            labelContainer: portLabelElement,
            labelSelectors: portLabelSelectors,
            contentContainer: portContentElement,
            contentSelectors: portContentSelectors,
        });
        return portElement;
    }
    updatePorts() {
        // Layout ports without group
        this.updatePortGroup();
        // Layout ports with explicit group
        const groups = this.cell.getParsedGroups();
        Object.keys(groups).forEach((groupName) => this.updatePortGroup(groupName));
    }
    updatePortGroup(groupName) {
        const bbox = Rectangle.fromSize(this.cell.getSize());
        const metrics = this.cell.getPortsLayoutByGroup(groupName, bbox);
        for (let i = 0, n = metrics.length; i < n; i += 1) {
            const metric = metrics[i];
            const portId = metric.portId;
            const cached = this.portsCache[portId] || {};
            const portLayout = metric.portLayout;
            this.applyPortTransform(cached.portElement, portLayout);
            if (metric.portAttrs != null) {
                const options = {
                    selectors: cached.portSelectors || {},
                };
                if (metric.portSize) {
                    options.rootBBox = Rectangle.fromSize(metric.portSize);
                }
                this.updateAttrs(cached.portElement, metric.portAttrs, options);
            }
            const labelLayout = metric.labelLayout;
            if (labelLayout) {
                this.applyPortTransform(cached.portLabelElement, labelLayout, -(portLayout.angle || 0));
                if (labelLayout.attrs) {
                    const options = {
                        selectors: cached.portLabelSelectors || {},
                    };
                    if (metric.labelSize) {
                        options.rootBBox = Rectangle.fromSize(metric.labelSize);
                    }
                    this.updateAttrs(cached.portLabelElement, labelLayout.attrs, options);
                }
            }
        }
    }
    applyPortTransform(element, layout, initialAngle = 0) {
        const angle = layout.angle;
        const position = layout.position;
        const matrix = Dom.createSVGMatrix()
            .rotate(initialAngle)
            .translate(position.x || 0, position.y || 0)
            .rotate(angle || 0);
        Dom.transform(element, matrix, { absolute: true });
    }
    getPortContainerMarkup() {
        return this.cell.getPortContainerMarkup() || this.defaultPortContainerMarkup;
    }
    getPortMarkup(port) {
        return port.markup || this.cell.portMarkup || this.defaultPortMarkup;
    }
    getPortLabelMarkup(label) {
        return (label.markup || this.cell.portLabelMarkup || this.defaultPortLabelMarkup);
    }
    getEventArgs(e, x, y) {
        const view = this; // eslint-disable-line
        const node = view.cell;
        const cell = node;
        if (x == null || y == null) {
            return { e, view, node, cell };
        }
        return { e, x, y, view, node, cell };
    }
    notifyMouseDown(e, x, y) {
        super.onMouseDown(e, x, y);
        this.notify('node:mousedown', this.getEventArgs(e, x, y));
    }
    notifyMouseMove(e, x, y) {
        super.onMouseMove(e, x, y);
        this.notify('node:mousemove', this.getEventArgs(e, x, y));
    }
    notifyMouseUp(e, x, y) {
        // Problem: super will call stopBatch before event listeners
        // attached to this **node** run. Those events will not count
        // towards this batch, despite being triggered by the same UI event.
        //
        // This complicates a lot of stuff e.g. history recording.
        //
        // See https://github.com/antvis/X6/issues/2421 for background.
        super.onMouseUp(e, x, y);
        this.notify('node:mouseup', this.getEventArgs(e, x, y));
    }
    onClick(e, x, y) {
        super.onClick(e, x, y);
        this.notify('node:click', this.getEventArgs(e, x, y));
    }
    onDblClick(e, x, y) {
        super.onDblClick(e, x, y);
        this.notify('node:dblclick', this.getEventArgs(e, x, y));
    }
    onContextMenu(e, x, y) {
        super.onContextMenu(e, x, y);
        this.notify('node:contextmenu', this.getEventArgs(e, x, y));
    }
    onMouseDown(e, x, y) {
        if (this.isPropagationStopped(e)) {
            return;
        }
        // 避免处于foreignObject内部元素触发onMouseDown导致节点被拖拽
        // 拖拽的时候是以onMouseDown启动的
        const target = e.target;
        if (Dom.clickable(target) || Dom.isInputElement(target)) {
            return;
        }
        this.notifyMouseDown(e, x, y);
        this.startNodeDragging(e, x, y);
    }
    onMouseMove(e, x, y) {
        const data = this.getEventData(e);
        const action = data.action;
        if (action === 'magnet') {
            this.dragMagnet(e, x, y);
        }
        else {
            if (action === 'move') {
                const meta = data;
                const view = meta.targetView || this;
                view.dragNode(e, x, y);
                view.notify('node:moving', {
                    e,
                    x,
                    y,
                    view,
                    cell: view.cell,
                    node: view.cell,
                });
            }
            this.notifyMouseMove(e, x, y);
        }
        this.setEventData(e, data);
    }
    onMouseUp(e, x, y) {
        const data = this.getEventData(e);
        const action = data.action;
        if (action === 'magnet') {
            this.stopMagnetDragging(e, x, y);
        }
        else {
            // 避免处于foreignObject内部元素触发onMouseUp导致节点被选中
            // 选中的时候是以onMouseUp启动的
            const target = e.target;
            if (Dom.clickable(target) || Dom.isInputElement(target)) {
                return;
            }
            this.notifyMouseUp(e, x, y);
            if (action === 'move') {
                const meta = data;
                const view = meta.targetView || this;
                view.stopNodeDragging(e, x, y);
            }
        }
        const magnet = data.targetMagnet;
        if (magnet) {
            this.onMagnetClick(e, magnet, x, y);
        }
        this.checkMouseleave(e);
    }
    onMouseOver(e) {
        super.onMouseOver(e);
        this.notify('node:mouseover', this.getEventArgs(e));
    }
    onMouseOut(e) {
        super.onMouseOut(e);
        this.notify('node:mouseout', this.getEventArgs(e));
    }
    onMouseEnter(e) {
        this.updateClassName(e);
        super.onMouseEnter(e);
        this.notify('node:mouseenter', this.getEventArgs(e));
    }
    onMouseLeave(e) {
        super.onMouseLeave(e);
        this.notify('node:mouseleave', this.getEventArgs(e));
    }
    onMouseWheel(e, x, y, delta) {
        super.onMouseWheel(e, x, y, delta);
        this.notify('node:mousewheel', Object.assign({ delta }, this.getEventArgs(e, x, y)));
    }
    onMagnetClick(e, magnet, x, y) {
        const count = this.graph.view.getMouseMovedCount(e);
        if (count > this.graph.options.clickThreshold) {
            return;
        }
        this.notify('node:magnet:click', Object.assign({ magnet }, this.getEventArgs(e, x, y)));
    }
    onMagnetDblClick(e, magnet, x, y) {
        this.notify('node:magnet:dblclick', Object.assign({ magnet }, this.getEventArgs(e, x, y)));
    }
    onMagnetContextMenu(e, magnet, x, y) {
        this.notify('node:magnet:contextmenu', Object.assign({ magnet }, this.getEventArgs(e, x, y)));
    }
    onMagnetMouseDown(e, magnet, x, y) {
        this.startMagnetDragging(e, x, y);
    }
    onCustomEvent(e, name, x, y) {
        this.notify('node:customevent', Object.assign({ name }, this.getEventArgs(e, x, y)));
        super.onCustomEvent(e, name, x, y);
    }
    prepareEmbedding(e) {
        // const cell = data.cell || this.cell
        // const graph = data.graph || this.graph
        // const model = graph.model
        // model.startBatch('to-front')
        // // Bring the model to the front with all his embeds.
        // cell.toFront({ deep: true, ui: true })
        // const maxZ = model
        //   .getNodes()
        //   .reduce((max, cell) => Math.max(max, cell.getZIndex() || 0), 0)
        // const connectedEdges = model.getConnectedEdges(cell, {
        //   deep: true,
        //   enclosed: true,
        // })
        // connectedEdges.forEach((edge) => {
        //   const zIndex = edge.getZIndex() || 0
        //   if (zIndex <= maxZ) {
        //     edge.setZIndex(maxZ + 1, { ui: true })
        //   }
        // })
        // model.stopBatch('to-front')
        // Before we start looking for suitable parent we remove the current one.
        // const parent = cell.getParent()
        // if (parent) {
        //   parent.unembed(cell, { ui: true })
        // }
        const data = this.getEventData(e);
        const node = data.cell || this.cell;
        const view = this.graph.findViewByCell(node);
        const localPoint = this.graph.snapToGrid(e.clientX, e.clientY);
        this.notify('node:embed', {
            e,
            node,
            view,
            cell: node,
            x: localPoint.x,
            y: localPoint.y,
            currentParent: node.getParent(),
        });
    }
    processEmbedding(e, data) {
        const cell = data.cell || this.cell;
        const graph = data.graph || this.graph;
        const options = graph.options.embedding;
        const findParent = options.findParent;
        let candidates = typeof findParent === 'function'
            ? FunctionExt.call(findParent, graph, {
                view: this,
                node: this.cell,
            }).filter((c) => {
                return (Cell.isCell(c) &&
                    this.cell.id !== c.id &&
                    !c.isDescendantOf(this.cell));
            })
            : graph.model.getNodesUnderNode(cell, {
                by: findParent,
            });
        // Picks the node with the highest `z` index
        if (options.frontOnly) {
            if (candidates.length > 0) {
                const zIndexMap = ArrayExt.groupBy(candidates, 'zIndex');
                const maxZIndex = ArrayExt.max(Object.keys(zIndexMap).map((z) => parseInt(z, 10)));
                if (maxZIndex) {
                    candidates = zIndexMap[maxZIndex];
                }
            }
        }
        // Filter the nodes which is invisiable
        candidates = candidates.filter((candidate) => candidate.visible);
        let newCandidateView = null;
        const prevCandidateView = data.candidateEmbedView;
        const validateEmbeding = options.validate;
        for (let i = candidates.length - 1; i >= 0; i -= 1) {
            const candidate = candidates[i];
            if (prevCandidateView && prevCandidateView.cell.id === candidate.id) {
                // candidate remains the same
                newCandidateView = prevCandidateView;
                break;
            }
            else {
                const view = candidate.findView(graph);
                if (FunctionExt.call(validateEmbeding, graph, {
                    child: this.cell,
                    parent: view.cell,
                    childView: this,
                    parentView: view,
                })) {
                    // flip to the new candidate
                    newCandidateView = view;
                    break;
                }
            }
        }
        this.clearEmbedding(data);
        if (newCandidateView) {
            newCandidateView.highlight(null, { type: 'embedding' });
        }
        data.candidateEmbedView = newCandidateView;
        const localPoint = graph.snapToGrid(e.clientX, e.clientY);
        this.notify('node:embedding', {
            e,
            cell,
            node: cell,
            view: graph.findViewByCell(cell),
            x: localPoint.x,
            y: localPoint.y,
            currentParent: cell.getParent(),
            candidateParent: newCandidateView ? newCandidateView.cell : null,
        });
    }
    clearEmbedding(data) {
        const candidateView = data.candidateEmbedView;
        if (candidateView) {
            candidateView.unhighlight(null, { type: 'embedding' });
            data.candidateEmbedView = null;
        }
    }
    finalizeEmbedding(e, data) {
        this.graph.startBatch('embedding');
        const cell = data.cell || this.cell;
        const graph = data.graph || this.graph;
        const view = graph.findViewByCell(cell);
        const parent = cell.getParent();
        const candidateView = data.candidateEmbedView;
        if (candidateView) {
            // Candidate view is chosen to become the parent of the node.
            candidateView.unhighlight(null, { type: 'embedding' });
            data.candidateEmbedView = null;
            if (parent == null || parent.id !== candidateView.cell.id) {
                candidateView.cell.insertChild(cell, undefined, { ui: true });
            }
        }
        else if (parent) {
            parent.unembed(cell, { ui: true });
        }
        graph.model.getConnectedEdges(cell, { deep: true }).forEach((edge) => {
            edge.updateParent({ ui: true });
        });
        if (view && candidateView) {
            const localPoint = graph.snapToGrid(e.clientX, e.clientY);
            view.notify('node:embedded', {
                e,
                cell,
                x: localPoint.x,
                y: localPoint.y,
                node: cell,
                view: graph.findViewByCell(cell),
                previousParent: parent,
                currentParent: cell.getParent(),
            });
        }
        this.graph.stopBatch('embedding');
    }
    getDelegatedView() {
        let cell = this.cell;
        let view = this; // eslint-disable-line
        while (view) {
            if (cell.isEdge()) {
                break;
            }
            if (!cell.hasParent() || view.can('stopDelegateOnDragging')) {
                return view;
            }
            cell = cell.getParent();
            view = this.graph.renderer.findViewByCell(cell);
        }
        return null;
    }
    startMagnetDragging(e, x, y) {
        if (!this.can('magnetConnectable')) {
            return;
        }
        e.stopPropagation();
        const magnet = e.currentTarget;
        const graph = this.graph;
        this.setEventData(e, {
            targetMagnet: magnet,
        });
        if (graph.hook.validateMagnet(this, magnet, e)) {
            if (graph.options.magnetThreshold <= 0) {
                this.startConnectting(e, magnet, x, y);
            }
            this.setEventData(e, {
                action: 'magnet',
            });
            this.stopPropagation(e);
        }
        else {
            // 只需要阻止port的冒泡 #2258
            if (Dom.hasClass(magnet, 'x6-port-body') ||
                JQuery(magnet).closest('.x6-port-body').length > 0) {
                this.stopPropagation(e);
            }
            this.onMouseDown(e, x, y);
        }
        graph.view.delegateDragEvents(e, this);
    }
    startConnectting(e, magnet, x, y) {
        this.graph.model.startBatch('add-edge');
        const edgeView = this.createEdgeFromMagnet(magnet, x, y);
        edgeView.notifyMouseDown(e, x, y); // backwards compatibility events
        edgeView.setEventData(e, edgeView.prepareArrowheadDragging('target', {
            x,
            y,
            isNewEdge: true,
            fallbackAction: 'remove',
        }));
        this.setEventData(e, { edgeView });
    }
    createEdgeFromMagnet(magnet, x, y) {
        const graph = this.graph;
        const model = graph.model;
        const edge = graph.hook.getDefaultEdge(this, magnet);
        edge.setSource(Object.assign(Object.assign({}, edge.getSource()), this.getEdgeTerminal(magnet, x, y, edge, 'source')));
        edge.setTarget(Object.assign(Object.assign({}, edge.getTarget()), { x, y }));
        edge.addTo(model, { async: false, ui: true });
        return edge.findView(graph);
    }
    dragMagnet(e, x, y) {
        const data = this.getEventData(e);
        const edgeView = data.edgeView;
        if (edgeView) {
            edgeView.onMouseMove(e, x, y);
            this.autoScrollGraph(e.clientX, e.clientY);
        }
        else {
            const graph = this.graph;
            const magnetThreshold = graph.options.magnetThreshold;
            const currentTarget = this.getEventTarget(e);
            const targetMagnet = data.targetMagnet;
            // magnetThreshold when the pointer leaves the magnet
            if (magnetThreshold === 'onleave') {
                if (targetMagnet === currentTarget ||
                    targetMagnet.contains(currentTarget)) {
                    return;
                }
                // eslint-disable-next-line no-lonely-if
            }
            else {
                // magnetThreshold defined as a number of movements
                if (graph.view.getMouseMovedCount(e) <= magnetThreshold) {
                    return;
                }
            }
            this.startConnectting(e, targetMagnet, x, y);
        }
    }
    stopMagnetDragging(e, x, y) {
        const data = this.eventData(e);
        const edgeView = data.edgeView;
        if (edgeView) {
            edgeView.onMouseUp(e, x, y);
            this.graph.model.stopBatch('add-edge');
        }
    }
    notifyUnhandledMouseDown(e, x, y) {
        this.notify('node:unhandled:mousedown', {
            e,
            x,
            y,
            view: this,
            cell: this.cell,
            node: this.cell,
        });
    }
    notifyNodeMove(name, e, x, y, cell) {
        let cells = [cell];
        const selection = this.graph.selection.widget;
        if (selection && selection.options.movable) {
            const selectedCells = this.graph.getSelectedCells();
            if (selectedCells.includes(cell)) {
                cells = selectedCells.filter((c) => c.isNode());
            }
        }
        cells.forEach((c) => {
            this.notify(name, {
                e,
                x,
                y,
                cell: c,
                node: c,
                view: c.findView(this.graph),
            });
        });
    }
    startNodeDragging(e, x, y) {
        const targetView = this.getDelegatedView();
        if (targetView == null || !targetView.can('nodeMovable')) {
            return this.notifyUnhandledMouseDown(e, x, y);
        }
        this.setEventData(e, {
            targetView,
            action: 'move',
        });
        const position = Point.create(targetView.cell.getPosition());
        targetView.setEventData(e, {
            moving: false,
            offset: position.diff(x, y),
            restrict: this.graph.hook.getRestrictArea(targetView),
        });
    }
    dragNode(e, x, y) {
        const node = this.cell;
        const graph = this.graph;
        const gridSize = graph.getGridSize();
        const data = this.getEventData(e);
        const offset = data.offset;
        const restrict = data.restrict;
        if (!data.moving) {
            data.moving = true;
            this.addClass('node-moving');
            this.notifyNodeMove('node:move', e, x, y, this.cell);
        }
        this.autoScrollGraph(e.clientX, e.clientY);
        const posX = Util.snapToGrid(x + offset.x, gridSize);
        const posY = Util.snapToGrid(y + offset.y, gridSize);
        node.setPosition(posX, posY, {
            restrict,
            deep: true,
            ui: true,
        });
        if (graph.options.embedding.enabled) {
            if (!data.embedding) {
                this.prepareEmbedding(e);
                data.embedding = true;
            }
            this.processEmbedding(e, data);
        }
    }
    stopNodeDragging(e, x, y) {
        const data = this.getEventData(e);
        if (data.embedding) {
            this.finalizeEmbedding(e, data);
        }
        if (data.moving) {
            this.removeClass('node-moving');
            this.notifyNodeMove('node:moved', e, x, y, this.cell);
        }
        data.moving = false;
        data.embedding = false;
    }
    autoScrollGraph(x, y) {
        const scroller = this.graph.scroller.widget;
        if (scroller) {
            scroller.autoScroll(x, y);
        }
    }
}
(function (NodeView) {
    NodeView.toStringTag = `X6.${NodeView.name}`;
    function isNodeView(instance) {
        if (instance == null) {
            return false;
        }
        if (instance instanceof NodeView) {
            return true;
        }
        const tag = instance[Symbol.toStringTag];
        const view = instance;
        if ((tag == null || tag === NodeView.toStringTag) &&
            typeof view.isNodeView === 'function' &&
            typeof view.isEdgeView === 'function' &&
            typeof view.confirmUpdate === 'function' &&
            typeof view.update === 'function' &&
            typeof view.findPortElem === 'function' &&
            typeof view.resize === 'function' &&
            typeof view.rotate === 'function' &&
            typeof view.translate === 'function') {
            return true;
        }
        return false;
    }
    NodeView.isNodeView = isNodeView;
})(NodeView || (NodeView = {}));
NodeView.config({
    isSvgElement: true,
    priority: 0,
    bootstrap: ['render'],
    actions: {
        view: ['render'],
        markup: ['render'],
        attrs: ['update'],
        size: ['resize', 'ports', 'tools'],
        angle: ['rotate', 'tools'],
        position: ['translate', 'tools'],
        ports: ['ports'],
        tools: ['tools'],
    },
});
NodeView.registry.register('node', NodeView, true);
//# sourceMappingURL=node.js.map