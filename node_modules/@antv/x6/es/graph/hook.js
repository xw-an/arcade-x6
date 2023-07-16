var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
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
import { FunctionExt, ObjectExt } from '../util';
import { Model } from '../model/model';
import { CellView } from '../view/cell';
import { NodeView } from '../view/node';
import { EdgeView } from '../view/edge';
import { Knob } from '../addon/knob';
import { MiniMap } from '../addon/minimap';
import { Snapline } from '../addon/snapline';
import { Scroller } from '../addon/scroller';
import { Selection } from '../addon/selection';
import { Clipboard } from '../addon/clipboard';
import { Transform } from '../addon/transform';
import { HTML } from '../shape/standard/html';
import { Edge as StandardEdge } from '../shape/standard/edge';
import { Base } from './base';
import { Options } from './options';
import { Renderer } from './renderer';
import { GraphView } from './view';
import { DefsManager } from './defs';
import { GridManager } from './grid';
import { CoordManager } from './coord';
import { SnaplineManager } from './snapline';
import { ScrollerManager } from './scroller';
import { ClipboardManager } from './clipboard';
import { HighlightManager } from './highlight';
import { TransformManager } from './transform';
import { SelectionManager } from './selection';
import { BackgroundManager } from './background';
import { HistoryManager } from './history';
import { MiniMapManager } from './minimap';
import { Keyboard } from './keyboard';
import { MouseWheel } from './mousewheel';
import { PrintManager } from './print';
import { FormatManager } from './format';
import { KnobManager } from './knob';
import { PanningManager } from './panning';
import { SizeManager } from './size';
var Decorator;
(function (Decorator) {
    function hook(nullable, hookName) {
        return (target, methodName, descriptor) => {
            const raw = descriptor.value;
            const name = hookName || methodName;
            descriptor.value = function (...args) {
                const hook = this.options[name];
                if (hook != null) {
                    this.getNativeValue = raw.bind(this, ...args);
                    const ret = FunctionExt.call(hook, this.graph, ...args);
                    this.getNativeValue = null;
                    if (ret != null || (nullable === true && ret === null)) {
                        return ret;
                    }
                }
                return raw.call(this, ...args);
            };
        };
    }
    Decorator.hook = hook;
    function after(hookName) {
        return (target, methodName, descriptor) => {
            const raw = descriptor.value;
            const name = hookName || methodName;
            descriptor.value = function (...args) {
                let ret = raw.call(this, ...args);
                const hook = this.options[name];
                if (hook != null) {
                    ret = FunctionExt.call(hook, this.graph, ...args) && ret;
                }
                return ret;
            };
        };
    }
    Decorator.after = after;
})(Decorator || (Decorator = {}));
export class Hook extends Base {
    createModel() {
        if (this.options.model) {
            return this.options.model;
        }
        const model = new Model();
        model.graph = this.graph;
        return model;
    }
    createView() {
        return new GraphView(this.graph);
    }
    createRenderer() {
        return new Renderer(this.graph);
    }
    createDefsManager() {
        return new DefsManager(this.graph);
    }
    createGridManager() {
        return new GridManager(this.graph);
    }
    createCoordManager() {
        return new CoordManager(this.graph);
    }
    createKnobManager() {
        return new KnobManager(this.graph);
    }
    createTransform(node, widgetOptions) {
        const options = this.getTransformOptions(node);
        if (options.resizable || options.rotatable) {
            return new Transform(Object.assign(Object.assign({ node, graph: this.graph }, options), widgetOptions));
        }
        if (options.clearAll) {
            Transform.removeInstances(this.graph);
        }
        return null;
    }
    createKnob(node, widgetOptions) {
        const options = Options.parseOptionGroup(this.graph, node, this.options.knob);
        const localOptions = Object.assign(Object.assign({}, options), widgetOptions);
        if (localOptions.clearAll) {
            Knob.removeInstances(this.graph);
        }
        localOptions.clearAll = false;
        const knob = node.prop('knob');
        const widgets = [];
        const meta = Array.isArray(knob) ? knob : [knob];
        meta.forEach((knob, index) => {
            if (knob) {
                if (knob.enabled === false) {
                    return;
                }
                if (typeof knob.enabled === 'function' &&
                    knob.enabled.call(this.graph, node) === false) {
                    return;
                }
            }
            else {
                return;
            }
            if (options.enabled) {
                widgets.push(new Knob(Object.assign({ node,
                    index, graph: this.graph }, localOptions)));
            }
        });
        return widgets;
    }
    getTransformOptions(node) {
        const resizing = Options.parseOptionGroup(this.graph, node, this.options.resizing);
        const rotating = Options.parseOptionGroup(this.graph, node, this.options.rotating);
        const transforming = Options.parseOptionGroup(this.graph, node, this.options.transforming);
        const options = Object.assign(Object.assign({}, transforming), { resizable: resizing.enabled, minWidth: resizing.minWidth, maxWidth: resizing.maxWidth, minHeight: resizing.minHeight, maxHeight: resizing.maxHeight, orthogonalResizing: resizing.orthogonal, restrictedResizing: resizing.restrict != null ? resizing.restrict : resizing.restricted, autoScrollOnResizing: resizing.autoScroll, preserveAspectRatio: resizing.preserveAspectRatio, allowReverse: resizing.allowReverse, rotatable: rotating.enabled, rotateGrid: rotating.grid });
        return options;
    }
    createTransformManager() {
        return new TransformManager(this.graph);
    }
    createHighlightManager() {
        return new HighlightManager(this.graph);
    }
    createBackgroundManager() {
        return new BackgroundManager(this.graph);
    }
    createClipboard() {
        return new Clipboard();
    }
    createClipboardManager() {
        return new ClipboardManager(this.graph);
    }
    createSnapline() {
        return new Snapline(Object.assign({ graph: this.graph }, this.options.snapline));
    }
    createSnaplineManager() {
        return new SnaplineManager(this.graph);
    }
    createSelection() {
        return new Selection(Object.assign({ graph: this.graph }, this.options.selecting));
    }
    createSelectionManager() {
        return new SelectionManager(this.graph);
    }
    // eslint-disable-next-line
    allowRubberband(e) {
        return true;
    }
    createHistoryManager() {
        return new HistoryManager(Object.assign({ graph: this.graph }, this.options.history));
    }
    createScroller() {
        if (this.options.scroller.enabled) {
            return new Scroller(Object.assign({ graph: this.graph }, this.options.scroller));
        }
        return null;
    }
    createScrollerManager() {
        return new ScrollerManager(this.graph);
    }
    // eslint-disable-next-line
    allowPanning(e) {
        return true;
    }
    createMiniMap() {
        const _a = this.options.minimap, { enabled } = _a, options = __rest(_a, ["enabled"]);
        if (enabled) {
            return new MiniMap(Object.assign({ graph: this.graph }, options));
        }
        return null;
    }
    createMiniMapManager() {
        return new MiniMapManager(this.graph);
    }
    createKeyboard() {
        return new Keyboard(Object.assign({ graph: this.graph }, this.options.keyboard));
    }
    createMouseWheel() {
        return new MouseWheel(Object.assign({ graph: this.graph }, this.options.mousewheel));
    }
    createPrintManager() {
        return new PrintManager(this.graph);
    }
    createFormatManager() {
        return new FormatManager(this.graph);
    }
    createPanningManager() {
        return new PanningManager(this.graph);
    }
    createSizeManager() {
        return new SizeManager(this.graph);
    }
    allowConnectToBlank(edge) {
        const options = this.options.connecting;
        const allowBlank = options.allowBlank != null ? options.allowBlank : options.dangling;
        if (typeof allowBlank !== 'function') {
            return !!allowBlank;
        }
        const edgeView = this.graph.findViewByCell(edge);
        const sourceCell = edge.getSourceCell();
        const targetCell = edge.getTargetCell();
        const sourceView = this.graph.findViewByCell(sourceCell);
        const targetView = this.graph.findViewByCell(targetCell);
        return FunctionExt.call(allowBlank, this.graph, {
            edge,
            edgeView,
            sourceCell,
            targetCell,
            sourceView,
            targetView,
            sourcePort: edge.getSourcePortId(),
            targetPort: edge.getTargetPortId(),
            sourceMagnet: edgeView.sourceMagnet,
            targetMagnet: edgeView.targetMagnet,
        });
    }
    validateEdge(edge, type, initialTerminal) {
        if (!this.allowConnectToBlank(edge)) {
            const sourceId = edge.getSourceCellId();
            const targetId = edge.getTargetCellId();
            if (!(sourceId && targetId)) {
                return false;
            }
        }
        const validate = this.options.connecting.validateEdge;
        if (validate) {
            return FunctionExt.call(validate, this.graph, {
                edge,
                type,
                previous: initialTerminal,
            });
        }
        return true;
    }
    validateMagnet(cellView, magnet, e) {
        if (magnet.getAttribute('magnet') !== 'passive') {
            const validate = this.options.connecting.validateMagnet;
            if (validate) {
                return FunctionExt.call(validate, this.graph, {
                    e,
                    magnet,
                    view: cellView,
                    cell: cellView.cell,
                });
            }
            return true;
        }
        return false;
    }
    getDefaultEdge(sourceView, sourceMagnet) {
        let edge;
        const create = this.options.connecting.createEdge;
        if (create) {
            edge = FunctionExt.call(create, this.graph, {
                sourceMagnet,
                sourceView,
                sourceCell: sourceView.cell,
            });
        }
        if (edge == null) {
            edge = new StandardEdge();
        }
        return edge;
    }
    validateConnection(sourceView, sourceMagnet, targetView, targetMagnet, terminalType, edgeView, candidateTerminal) {
        const options = this.options.connecting;
        const allowLoop = options.allowLoop;
        const allowNode = options.allowNode;
        const allowEdge = options.allowEdge;
        const allowPort = options.allowPort;
        const allowMulti = options.allowMulti != null ? options.allowMulti : options.multi;
        const validate = options.validateConnection;
        const edge = edgeView ? edgeView.cell : null;
        const terminalView = terminalType === 'target' ? targetView : sourceView;
        const terminalMagnet = terminalType === 'target' ? targetMagnet : sourceMagnet;
        let valid = true;
        const doValidate = (validate) => {
            const sourcePort = terminalType === 'source'
                ? candidateTerminal
                    ? candidateTerminal.port
                    : null
                : edge
                    ? edge.getSourcePortId()
                    : null;
            const targetPort = terminalType === 'target'
                ? candidateTerminal
                    ? candidateTerminal.port
                    : null
                : edge
                    ? edge.getTargetPortId()
                    : null;
            return FunctionExt.call(validate, this.graph, {
                edge,
                edgeView,
                sourceView,
                targetView,
                sourcePort,
                targetPort,
                sourceMagnet,
                targetMagnet,
                sourceCell: sourceView ? sourceView.cell : null,
                targetCell: targetView ? targetView.cell : null,
                type: terminalType,
            });
        };
        if (allowLoop != null) {
            if (typeof allowLoop === 'boolean') {
                if (!allowLoop && sourceView === targetView) {
                    valid = false;
                }
            }
            else {
                valid = doValidate(allowLoop);
            }
        }
        if (valid && allowPort != null) {
            if (typeof allowPort === 'boolean') {
                if (!allowPort && terminalMagnet) {
                    valid = false;
                }
            }
            else {
                valid = doValidate(allowPort);
            }
        }
        if (valid && allowEdge != null) {
            if (typeof allowEdge === 'boolean') {
                if (!allowEdge && EdgeView.isEdgeView(terminalView)) {
                    valid = false;
                }
            }
            else {
                valid = doValidate(allowEdge);
            }
        }
        // When judging nodes, the influence of the ports should be excluded,
        // because the ports and nodes have the same terminalView
        if (valid && allowNode != null && terminalMagnet == null) {
            if (typeof allowNode === 'boolean') {
                if (!allowNode && NodeView.isNodeView(terminalView)) {
                    valid = false;
                }
            }
            else {
                valid = doValidate(allowNode);
            }
        }
        if (valid && allowMulti != null && edgeView) {
            const edge = edgeView.cell;
            const source = terminalType === 'source'
                ? candidateTerminal
                : edge.getSource();
            const target = terminalType === 'target'
                ? candidateTerminal
                : edge.getTarget();
            const terminalCell = candidateTerminal
                ? this.graph.getCellById(candidateTerminal.cell)
                : null;
            if (source && target && source.cell && target.cell && terminalCell) {
                if (typeof allowMulti === 'function') {
                    valid = doValidate(allowMulti);
                }
                else {
                    const connectedEdges = this.model.getConnectedEdges(terminalCell, {
                        outgoing: terminalType === 'source',
                        incoming: terminalType === 'target',
                    });
                    if (connectedEdges.length) {
                        if (allowMulti === 'withPort') {
                            const exist = connectedEdges.some((link) => {
                                const s = link.getSource();
                                const t = link.getTarget();
                                return (s &&
                                    t &&
                                    s.cell === source.cell &&
                                    t.cell === target.cell &&
                                    s.port != null &&
                                    s.port === source.port &&
                                    t.port != null &&
                                    t.port === target.port);
                            });
                            if (exist) {
                                valid = false;
                            }
                        }
                        else if (!allowMulti) {
                            const exist = connectedEdges.some((link) => {
                                const s = link.getSource();
                                const t = link.getTarget();
                                return (s && t && s.cell === source.cell && t.cell === target.cell);
                            });
                            if (exist) {
                                valid = false;
                            }
                        }
                    }
                }
            }
        }
        if (valid && validate != null) {
            valid = doValidate(validate);
        }
        return valid;
    }
    getRestrictArea(view) {
        const restrict = this.options.translating.restrict;
        const area = typeof restrict === 'function'
            ? FunctionExt.call(restrict, this.graph, view)
            : restrict;
        if (typeof area === 'number') {
            return this.graph.transform.getGraphArea().inflate(area);
        }
        if (area === true) {
            return this.graph.transform.getGraphArea();
        }
        return area || null;
    }
    onViewUpdated(view, flag, options) {
        if (flag & Renderer.FLAG_INSERT || options.mounting) {
            return;
        }
        this.graph.renderer.requestConnectedEdgesUpdate(view, options);
    }
    onViewPostponed(view, flag, options) {
        return this.graph.renderer.forcePostponedViewUpdate(view, flag);
    }
    getCellView(cell) {
        return null;
    }
    createCellView(cell) {
        const options = { graph: this.graph };
        const ctor = this.getCellView(cell);
        if (ctor) {
            return new ctor(cell, options); // eslint-disable-line new-cap
        }
        const view = cell.view;
        if (view != null && typeof view === 'string') {
            const def = CellView.registry.get(view);
            if (def) {
                return new def(cell, options); // eslint-disable-line new-cap
            }
            return CellView.registry.onNotFound(view);
        }
        if (cell.isNode()) {
            return new NodeView(cell, options);
        }
        if (cell.isEdge()) {
            return new EdgeView(cell, options);
        }
        return null;
    }
    getHTMLComponent(node) {
        let ret = node.getHTML();
        if (typeof ret === 'string') {
            ret = HTML.componentRegistry.get(ret) || ret;
        }
        if (ObjectExt.isPlainObject(ret)) {
            ret = ret.render;
        }
        if (typeof ret === 'function') {
            return FunctionExt.call(ret, this.graph, node);
        }
        return ret;
    }
    shouldUpdateHTMLComponent(node) {
        let html = node.getHTML();
        if (typeof html === 'string') {
            html = HTML.componentRegistry.get(html) || html;
        }
        if (ObjectExt.isPlainObject(html)) {
            const shouldUpdate = html
                .shouldComponentUpdate;
            if (typeof shouldUpdate === 'function') {
                return FunctionExt.call(shouldUpdate, this.graph, node);
            }
            return !!shouldUpdate;
        }
        return false;
    }
    onEdgeLabelRendered(args) { } // eslint-disable-line
    onPortRendered(args) { } // eslint-disable-line
    onToolItemCreated(args) { } // eslint-disable-line
}
__decorate([
    Decorator.hook()
], Hook.prototype, "createModel", null);
__decorate([
    Decorator.hook()
], Hook.prototype, "createView", null);
__decorate([
    Decorator.hook()
], Hook.prototype, "createRenderer", null);
__decorate([
    Decorator.hook()
], Hook.prototype, "createDefsManager", null);
__decorate([
    Decorator.hook()
], Hook.prototype, "createGridManager", null);
__decorate([
    Decorator.hook()
], Hook.prototype, "createCoordManager", null);
__decorate([
    Decorator.hook()
], Hook.prototype, "createKnobManager", null);
__decorate([
    Decorator.hook()
], Hook.prototype, "createTransform", null);
__decorate([
    Decorator.hook()
], Hook.prototype, "createKnob", null);
__decorate([
    Decorator.hook()
], Hook.prototype, "createTransformManager", null);
__decorate([
    Decorator.hook()
], Hook.prototype, "createHighlightManager", null);
__decorate([
    Decorator.hook()
], Hook.prototype, "createBackgroundManager", null);
__decorate([
    Decorator.hook()
], Hook.prototype, "createClipboard", null);
__decorate([
    Decorator.hook()
], Hook.prototype, "createClipboardManager", null);
__decorate([
    Decorator.hook()
], Hook.prototype, "createSnapline", null);
__decorate([
    Decorator.hook()
], Hook.prototype, "createSnaplineManager", null);
__decorate([
    Decorator.hook()
], Hook.prototype, "createSelection", null);
__decorate([
    Decorator.hook()
], Hook.prototype, "createSelectionManager", null);
__decorate([
    Decorator.hook()
], Hook.prototype, "allowRubberband", null);
__decorate([
    Decorator.hook()
], Hook.prototype, "createHistoryManager", null);
__decorate([
    Decorator.hook()
], Hook.prototype, "createScroller", null);
__decorate([
    Decorator.hook()
], Hook.prototype, "createScrollerManager", null);
__decorate([
    Decorator.hook()
], Hook.prototype, "allowPanning", null);
__decorate([
    Decorator.hook()
], Hook.prototype, "createMiniMap", null);
__decorate([
    Decorator.hook()
], Hook.prototype, "createMiniMapManager", null);
__decorate([
    Decorator.hook()
], Hook.prototype, "createKeyboard", null);
__decorate([
    Decorator.hook()
], Hook.prototype, "createMouseWheel", null);
__decorate([
    Decorator.hook()
], Hook.prototype, "createPrintManager", null);
__decorate([
    Decorator.hook()
], Hook.prototype, "createFormatManager", null);
__decorate([
    Decorator.hook()
], Hook.prototype, "createPanningManager", null);
__decorate([
    Decorator.hook()
], Hook.prototype, "createSizeManager", null);
__decorate([
    Decorator.after()
], Hook.prototype, "onViewUpdated", null);
__decorate([
    Decorator.after()
], Hook.prototype, "onViewPostponed", null);
__decorate([
    Decorator.hook()
], Hook.prototype, "getCellView", null);
__decorate([
    Decorator.hook(true)
], Hook.prototype, "createCellView", null);
__decorate([
    Decorator.hook()
], Hook.prototype, "getHTMLComponent", null);
__decorate([
    Decorator.hook()
], Hook.prototype, "shouldUpdateHTMLComponent", null);
__decorate([
    Decorator.hook()
], Hook.prototype, "onEdgeLabelRendered", null);
__decorate([
    Decorator.hook()
], Hook.prototype, "onPortRendered", null);
__decorate([
    Decorator.hook()
], Hook.prototype, "onToolItemCreated", null);
//# sourceMappingURL=hook.js.map