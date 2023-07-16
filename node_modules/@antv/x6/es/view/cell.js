/* eslint-disable @typescript-eslint/no-unused-vars */
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
import { Rectangle, Point } from '../geometry';
import { ArrayExt, ObjectExt, Dom, FunctionExt, Vector } from '../util';
import { Registry } from '../registry/registry';
import { ConnectionStrategy } from '../registry/connection-strategy';
import { View } from './view';
import { Cache } from './cache';
import { Markup } from './markup';
import { ToolsView } from './tool';
import { AttrManager } from './attr';
import { FlagManager } from './flag';
export class CellView extends View {
    constructor(cell, options = {}) {
        super();
        this.cell = cell;
        this.options = this.ensureOptions(options);
        this.graph = this.options.graph;
        this.attr = new AttrManager(this);
        this.flag = new FlagManager(this, this.options.actions, this.options.bootstrap);
        this.cache = new Cache(this);
        this.setContainer(this.ensureContainer());
        this.setup();
        this.$(this.container).data('view', this);
        this.init();
    }
    static getDefaults() {
        return this.defaults;
    }
    static config(options) {
        this.defaults = this.getOptions(options);
    }
    static getOptions(options) {
        const mergeActions = (arr1, arr2) => {
            if (arr2 != null) {
                return ArrayExt.uniq([
                    ...(Array.isArray(arr1) ? arr1 : [arr1]),
                    ...(Array.isArray(arr2) ? arr2 : [arr2]),
                ]);
            }
            return Array.isArray(arr1) ? [...arr1] : [arr1];
        };
        const ret = ObjectExt.cloneDeep(this.getDefaults());
        const { bootstrap, actions, events, documentEvents } = options, others = __rest(options, ["bootstrap", "actions", "events", "documentEvents"]);
        if (bootstrap) {
            ret.bootstrap = mergeActions(ret.bootstrap, bootstrap);
        }
        if (actions) {
            Object.keys(actions).forEach((key) => {
                const val = actions[key];
                const raw = ret.actions[key];
                if (val && raw) {
                    ret.actions[key] = mergeActions(raw, val);
                }
                else if (val) {
                    ret.actions[key] = mergeActions(val);
                }
            });
        }
        if (events) {
            ret.events = Object.assign(Object.assign({}, ret.events), events);
        }
        if (options.documentEvents) {
            ret.documentEvents = Object.assign(Object.assign({}, ret.documentEvents), documentEvents);
        }
        return ObjectExt.merge(ret, others);
    }
    get [Symbol.toStringTag]() {
        return CellView.toStringTag;
    }
    init() { }
    onRemove() {
        this.removeTools();
    }
    get priority() {
        return this.options.priority;
    }
    get rootSelector() {
        return this.options.rootSelector;
    }
    getConstructor() {
        return this.constructor;
    }
    ensureOptions(options) {
        return this.getConstructor().getOptions(options);
    }
    getContainerTagName() {
        return this.options.isSvgElement ? 'g' : 'div';
    }
    getContainerStyle() { }
    getContainerAttrs() {
        return {
            'data-cell-id': this.cell.id,
            'data-shape': this.cell.shape,
        };
    }
    getContainerClassName() {
        return this.prefixClassName('cell');
    }
    ensureContainer() {
        return View.createElement(this.getContainerTagName(), this.options.isSvgElement);
    }
    setContainer(container) {
        if (this.container !== container) {
            this.undelegateEvents();
            this.container = container;
            if (this.options.events != null) {
                this.delegateEvents(this.options.events);
            }
            const attrs = this.getContainerAttrs();
            if (attrs != null) {
                this.setAttrs(attrs, container);
            }
            const style = this.getContainerStyle();
            if (style != null) {
                this.setStyle(style, container);
            }
            const className = this.getContainerClassName();
            if (className != null) {
                this.addClass(className, container);
            }
        }
        return this;
    }
    isNodeView() {
        return false;
    }
    isEdgeView() {
        return false;
    }
    render() {
        return this;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    confirmUpdate(flag, options = {}) {
        return 0;
    }
    getBootstrapFlag() {
        return this.flag.getBootstrapFlag();
    }
    getFlag(actions) {
        return this.flag.getFlag(actions);
    }
    hasAction(flag, actions) {
        return this.flag.hasAction(flag, actions);
    }
    removeAction(flag, actions) {
        return this.flag.removeAction(flag, actions);
    }
    handleAction(flag, action, handle, additionalRemovedActions) {
        if (this.hasAction(flag, action)) {
            handle();
            const removedFlags = [action];
            if (additionalRemovedActions) {
                if (typeof additionalRemovedActions === 'string') {
                    removedFlags.push(additionalRemovedActions);
                }
                else {
                    removedFlags.push(...additionalRemovedActions);
                }
            }
            return this.removeAction(flag, removedFlags);
        }
        return flag;
    }
    setup() {
        this.cell.on('changed', ({ options }) => this.onAttrsChange(options));
    }
    onAttrsChange(options) {
        let flag = this.flag.getChangedFlag();
        if (options.updated || !flag) {
            return;
        }
        if (options.dirty && this.hasAction(flag, 'update')) {
            flag |= this.getFlag('render'); // eslint-disable-line no-bitwise
        }
        // tool changes should be sync render
        if (options.toolId) {
            options.async = false;
        }
        if (this.graph != null) {
            this.graph.renderer.requestViewUpdate(this, flag, this.priority, options);
        }
    }
    parseJSONMarkup(markup, rootElem) {
        const result = Markup.parseJSONMarkup(markup);
        const selectors = result.selectors;
        const rootSelector = this.rootSelector;
        if (rootElem && rootSelector) {
            if (selectors[rootSelector]) {
                throw new Error('Invalid root selector');
            }
            selectors[rootSelector] = rootElem;
        }
        return result;
    }
    can(feature) {
        let interacting = this.graph.options.interacting;
        if (typeof interacting === 'function') {
            interacting = FunctionExt.call(interacting, this.graph, this);
        }
        if (typeof interacting === 'object') {
            let val = interacting[feature];
            if (typeof val === 'function') {
                val = FunctionExt.call(val, this.graph, this);
            }
            return val !== false;
        }
        if (typeof interacting === 'boolean') {
            return interacting;
        }
        return false;
    }
    cleanCache() {
        this.cache.clean();
        return this;
    }
    getCache(elem) {
        return this.cache.get(elem);
    }
    getDataOfElement(elem) {
        return this.cache.getData(elem);
    }
    getMatrixOfElement(elem) {
        return this.cache.getMatrix(elem);
    }
    getShapeOfElement(elem) {
        return this.cache.getShape(elem);
    }
    getScaleOfElement(node, scalableNode) {
        let sx;
        let sy;
        if (scalableNode && scalableNode.contains(node)) {
            const scale = Dom.scale(scalableNode);
            sx = 1 / scale.sx;
            sy = 1 / scale.sy;
        }
        else {
            sx = 1;
            sy = 1;
        }
        return { sx, sy };
    }
    getBoundingRectOfElement(elem) {
        return this.cache.getBoundingRect(elem);
    }
    getBBoxOfElement(elem) {
        const rect = this.getBoundingRectOfElement(elem);
        const matrix = this.getMatrixOfElement(elem);
        const rm = this.getRootRotatedMatrix();
        const tm = this.getRootTranslatedMatrix();
        return Dom.transformRectangle(rect, tm.multiply(rm).multiply(matrix));
    }
    getUnrotatedBBoxOfElement(elem) {
        const rect = this.getBoundingRectOfElement(elem);
        const matrix = this.getMatrixOfElement(elem);
        const tm = this.getRootTranslatedMatrix();
        return Dom.transformRectangle(rect, tm.multiply(matrix));
    }
    getBBox(options = {}) {
        let bbox;
        if (options.useCellGeometry) {
            const cell = this.cell;
            const angle = cell.isNode() ? cell.getAngle() : 0;
            bbox = cell.getBBox().bbox(angle);
        }
        else {
            bbox = this.getBBoxOfElement(this.container);
        }
        return this.graph.localToGraph(bbox);
    }
    getRootTranslatedMatrix() {
        const cell = this.cell;
        const pos = cell.isNode() ? cell.getPosition() : { x: 0, y: 0 };
        return Dom.createSVGMatrix().translate(pos.x, pos.y);
    }
    getRootRotatedMatrix() {
        let matrix = Dom.createSVGMatrix();
        const cell = this.cell;
        const angle = cell.isNode() ? cell.getAngle() : 0;
        if (angle) {
            const bbox = cell.getBBox();
            const cx = bbox.width / 2;
            const cy = bbox.height / 2;
            matrix = matrix.translate(cx, cy).rotate(angle).translate(-cx, -cy);
        }
        return matrix;
    }
    findMagnet(elem = this.container) {
        // If the overall cell has set `magnet === false`, then returns
        // `undefined` to announce there is no magnet found for this cell.
        // This is especially useful to set on cells that have 'ports'.
        // In this case, only the ports have set `magnet === true` and the
        // overall element has `magnet === false`.
        return this.findByAttr('magnet', elem);
    }
    updateAttrs(rootNode, attrs, options = {}) {
        if (options.rootBBox == null) {
            options.rootBBox = new Rectangle();
        }
        if (options.selectors == null) {
            options.selectors = this.selectors;
        }
        this.attr.update(rootNode, attrs, options);
    }
    isEdgeElement(magnet) {
        return this.cell.isEdge() && (magnet == null || magnet === this.container);
    }
    // #region highlight
    prepareHighlight(elem, options = {}) {
        const magnet = (elem && this.$(elem)[0]) || this.container;
        options.partial = magnet === this.container;
        return magnet;
    }
    highlight(elem, options = {}) {
        const magnet = this.prepareHighlight(elem, options);
        this.notify('cell:highlight', {
            magnet,
            options,
            view: this,
            cell: this.cell,
        });
        if (this.isEdgeView()) {
            this.notify('edge:highlight', {
                magnet,
                options,
                view: this,
                edge: this.cell,
                cell: this.cell,
            });
        }
        else if (this.isNodeView()) {
            this.notify('node:highlight', {
                magnet,
                options,
                view: this,
                node: this.cell,
                cell: this.cell,
            });
        }
        return this;
    }
    unhighlight(elem, options = {}) {
        const magnet = this.prepareHighlight(elem, options);
        this.notify('cell:unhighlight', {
            magnet,
            options,
            view: this,
            cell: this.cell,
        });
        if (this.isNodeView()) {
            this.notify('node:unhighlight', {
                magnet,
                options,
                view: this,
                node: this.cell,
                cell: this.cell,
            });
        }
        else if (this.isEdgeView()) {
            this.notify('edge:unhighlight', {
                magnet,
                options,
                view: this,
                edge: this.cell,
                cell: this.cell,
            });
        }
        return this;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    notifyUnhighlight(magnet, options) { }
    // #endregion
    getEdgeTerminal(magnet, x, y, edge, type) {
        const cell = this.cell;
        const portId = this.findAttr('port', magnet);
        const selector = magnet.getAttribute('data-selector');
        const terminal = { cell: cell.id };
        if (selector != null) {
            terminal.magnet = selector;
        }
        if (portId != null) {
            terminal.port = portId;
            if (cell.isNode()) {
                if (!cell.hasPort(portId) && selector == null) {
                    // port created via the `port` attribute (not API)
                    terminal.selector = this.getSelector(magnet);
                }
            }
        }
        else if (selector == null && this.container !== magnet) {
            terminal.selector = this.getSelector(magnet);
        }
        return this.customizeEdgeTerminal(terminal, magnet, x, y, edge, type);
    }
    customizeEdgeTerminal(terminal, magnet, x, y, edge, type) {
        const raw = edge.getStrategy() || this.graph.options.connecting.strategy;
        if (raw) {
            const name = typeof raw === 'string' ? raw : raw.name;
            const args = typeof raw === 'string' ? {} : raw.args || {};
            const registry = ConnectionStrategy.registry;
            if (name) {
                const fn = registry.get(name);
                if (fn == null) {
                    return registry.onNotFound(name);
                }
                const result = FunctionExt.call(fn, this.graph, terminal, this, magnet, new Point(x, y), edge, type, args);
                if (result) {
                    return result;
                }
            }
        }
        return terminal;
    }
    getMagnetFromEdgeTerminal(terminal) {
        const cell = this.cell;
        const root = this.container;
        const portId = terminal.port;
        let selector = terminal.magnet;
        let magnet;
        if (portId != null && cell.isNode() && cell.hasPort(portId)) {
            magnet = this.findPortElem(portId, selector) || root;
        }
        else {
            if (!selector) {
                selector = terminal.selector;
            }
            if (!selector && portId != null) {
                selector = `[port="${portId}"]`;
            }
            magnet = this.findOne(selector, root, this.selectors);
        }
        return magnet;
    }
    // #region animate
    animate(elem, options) {
        const target = typeof elem === 'string' ? this.findOne(elem) : elem;
        if (target == null) {
            throw new Error('Invalid animation element.');
        }
        const parent = target.parentNode;
        const revert = () => {
            if (!parent) {
                Dom.remove(target);
            }
        };
        const vTarget = Vector.create(target);
        if (!parent) {
            vTarget.appendTo(this.graph.view.stage);
        }
        const onComplete = options.complete;
        options.complete = (e) => {
            revert();
            if (onComplete) {
                onComplete(e);
            }
        };
        return vTarget.animate(options);
    }
    animateTransform(elem, options) {
        const target = typeof elem === 'string' ? this.findOne(elem) : elem;
        if (target == null) {
            throw new Error('Invalid animation element.');
        }
        const parent = target.parentNode;
        const revert = () => {
            if (!parent) {
                Dom.remove(target);
            }
        };
        const vTarget = Vector.create(target);
        if (!parent) {
            vTarget.appendTo(this.graph.view.stage);
        }
        const onComplete = options.complete;
        options.complete = (e) => {
            revert();
            if (onComplete) {
                onComplete(e);
            }
        };
        return vTarget.animateTransform(options);
    }
    hasTools(name) {
        const tools = this.tools;
        if (tools == null) {
            return false;
        }
        if (name == null) {
            return true;
        }
        return tools.name === name;
    }
    addTools(config) {
        if (!this.can('toolsAddable')) {
            return this;
        }
        this.removeTools();
        if (config) {
            const tools = ToolsView.isToolsView(config)
                ? config
                : new ToolsView(config);
            this.tools = tools;
            this.graph.on('tools:hide', this.hideTools, this);
            this.graph.on('tools:show', this.showTools, this);
            this.graph.on('tools:remove', this.removeTools, this);
            tools.config({ view: this });
            tools.mount();
        }
        return this;
    }
    updateTools(options = {}) {
        if (this.tools) {
            this.tools.update(options);
        }
        return this;
    }
    removeTools() {
        if (this.tools) {
            this.tools.remove();
            this.graph.off('tools:hide', this.hideTools, this);
            this.graph.off('tools:show', this.showTools, this);
            this.graph.off('tools:remove', this.removeTools, this);
            this.tools = null;
        }
        return this;
    }
    hideTools() {
        if (this.tools) {
            this.tools.hide();
        }
        return this;
    }
    showTools() {
        if (this.tools) {
            this.tools.show();
        }
        return this;
    }
    renderTools() {
        const tools = this.cell.getTools();
        this.addTools(tools);
        return this;
    }
    notify(name, args) {
        this.trigger(name, args);
        this.graph.trigger(name, args);
        return this;
    }
    getEventArgs(e, x, y) {
        const view = this; // eslint-disable-line @typescript-eslint/no-this-alias
        const cell = view.cell;
        if (x == null || y == null) {
            return { e, view, cell };
        }
        return { e, x, y, view, cell };
    }
    onClick(e, x, y) {
        this.notify('cell:click', this.getEventArgs(e, x, y));
    }
    onDblClick(e, x, y) {
        this.notify('cell:dblclick', this.getEventArgs(e, x, y));
    }
    onContextMenu(e, x, y) {
        this.notify('cell:contextmenu', this.getEventArgs(e, x, y));
    }
    onMouseDown(e, x, y) {
        if (this.cell.model) {
            this.cachedModelForMouseEvent = this.cell.model;
            this.cachedModelForMouseEvent.startBatch('mouse');
        }
        this.notify('cell:mousedown', this.getEventArgs(e, x, y));
    }
    onMouseUp(e, x, y) {
        this.notify('cell:mouseup', this.getEventArgs(e, x, y));
        if (this.cachedModelForMouseEvent) {
            this.cachedModelForMouseEvent.stopBatch('mouse', { cell: this.cell });
            this.cachedModelForMouseEvent = null;
        }
    }
    onMouseMove(e, x, y) {
        this.notify('cell:mousemove', this.getEventArgs(e, x, y));
    }
    onMouseOver(e) {
        this.notify('cell:mouseover', this.getEventArgs(e));
    }
    onMouseOut(e) {
        this.notify('cell:mouseout', this.getEventArgs(e));
    }
    onMouseEnter(e) {
        this.notify('cell:mouseenter', this.getEventArgs(e));
    }
    onMouseLeave(e) {
        this.notify('cell:mouseleave', this.getEventArgs(e));
    }
    onMouseWheel(e, x, y, delta) {
        this.notify('cell:mousewheel', Object.assign({ delta }, this.getEventArgs(e, x, y)));
    }
    onCustomEvent(e, name, x, y) {
        this.notify('cell:customevent', Object.assign({ name }, this.getEventArgs(e, x, y)));
        this.notify(name, Object.assign({}, this.getEventArgs(e, x, y)));
    }
    onMagnetMouseDown(e, magnet, x, y) { }
    onMagnetDblClick(e, magnet, x, y) { }
    onMagnetContextMenu(e, magnet, x, y) { }
    onLabelMouseDown(e, x, y) { }
    checkMouseleave(e) {
        const graph = this.graph;
        if (graph.renderer.isAsync()) {
            // Do the updates of the current view synchronously now
            graph.renderer.dumpView(this);
        }
        const target = this.getEventTarget(e, { fromPoint: true });
        const view = graph.renderer.findViewByElem(target);
        if (view === this) {
            return;
        }
        // Leaving the current view
        this.onMouseLeave(e);
        if (!view) {
            return;
        }
        // Entering another view
        view.onMouseEnter(e);
    }
}
CellView.defaults = {
    isSvgElement: true,
    rootSelector: 'root',
    priority: 0,
    bootstrap: [],
    actions: {},
};
(function (CellView) {
    CellView.Flag = FlagManager;
    CellView.Attr = AttrManager;
})(CellView || (CellView = {}));
(function (CellView) {
    CellView.toStringTag = `X6.${CellView.name}`;
    function isCellView(instance) {
        if (instance == null) {
            return false;
        }
        if (instance instanceof CellView) {
            return true;
        }
        const tag = instance[Symbol.toStringTag];
        const view = instance;
        if ((tag == null || tag === CellView.toStringTag) &&
            typeof view.isNodeView === 'function' &&
            typeof view.isEdgeView === 'function' &&
            typeof view.confirmUpdate === 'function') {
            return true;
        }
        return false;
    }
    CellView.isCellView = isCellView;
})(CellView || (CellView = {}));
// decorators
// ----
(function (CellView) {
    function priority(value) {
        return function (ctor) {
            ctor.config({ priority: value });
        };
    }
    CellView.priority = priority;
    function bootstrap(actions) {
        return function (ctor) {
            ctor.config({ bootstrap: actions });
        };
    }
    CellView.bootstrap = bootstrap;
})(CellView || (CellView = {}));
(function (CellView) {
    CellView.registry = Registry.create({
        type: 'view',
    });
})(CellView || (CellView = {}));
//# sourceMappingURL=cell.js.map