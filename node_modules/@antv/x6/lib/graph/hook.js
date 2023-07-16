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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Hook = void 0;
var util_1 = require("../util");
var model_1 = require("../model/model");
var cell_1 = require("../view/cell");
var node_1 = require("../view/node");
var edge_1 = require("../view/edge");
var knob_1 = require("../addon/knob");
var minimap_1 = require("../addon/minimap");
var snapline_1 = require("../addon/snapline");
var scroller_1 = require("../addon/scroller");
var selection_1 = require("../addon/selection");
var clipboard_1 = require("../addon/clipboard");
var transform_1 = require("../addon/transform");
var html_1 = require("../shape/standard/html");
var edge_2 = require("../shape/standard/edge");
var base_1 = require("./base");
var options_1 = require("./options");
var renderer_1 = require("./renderer");
var view_1 = require("./view");
var defs_1 = require("./defs");
var grid_1 = require("./grid");
var coord_1 = require("./coord");
var snapline_2 = require("./snapline");
var scroller_2 = require("./scroller");
var clipboard_2 = require("./clipboard");
var highlight_1 = require("./highlight");
var transform_2 = require("./transform");
var selection_2 = require("./selection");
var background_1 = require("./background");
var history_1 = require("./history");
var minimap_2 = require("./minimap");
var keyboard_1 = require("./keyboard");
var mousewheel_1 = require("./mousewheel");
var print_1 = require("./print");
var format_1 = require("./format");
var knob_2 = require("./knob");
var panning_1 = require("./panning");
var size_1 = require("./size");
var Decorator;
(function (Decorator) {
    function hook(nullable, hookName) {
        return function (target, methodName, descriptor) {
            var raw = descriptor.value;
            var name = hookName || methodName;
            descriptor.value = function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                var hook = this.options[name];
                if (hook != null) {
                    this.getNativeValue = raw.bind.apply(raw, __spreadArray([this], args, false));
                    var ret = util_1.FunctionExt.call.apply(util_1.FunctionExt, __spreadArray([hook, this.graph], args, false));
                    this.getNativeValue = null;
                    if (ret != null || (nullable === true && ret === null)) {
                        return ret;
                    }
                }
                return raw.call.apply(raw, __spreadArray([this], args, false));
            };
        };
    }
    Decorator.hook = hook;
    function after(hookName) {
        return function (target, methodName, descriptor) {
            var raw = descriptor.value;
            var name = hookName || methodName;
            descriptor.value = function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                var ret = raw.call.apply(raw, __spreadArray([this], args, false));
                var hook = this.options[name];
                if (hook != null) {
                    ret = util_1.FunctionExt.call.apply(util_1.FunctionExt, __spreadArray([hook, this.graph], args, false)) && ret;
                }
                return ret;
            };
        };
    }
    Decorator.after = after;
})(Decorator || (Decorator = {}));
var Hook = /** @class */ (function (_super) {
    __extends(Hook, _super);
    function Hook() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Hook.prototype.createModel = function () {
        if (this.options.model) {
            return this.options.model;
        }
        var model = new model_1.Model();
        model.graph = this.graph;
        return model;
    };
    Hook.prototype.createView = function () {
        return new view_1.GraphView(this.graph);
    };
    Hook.prototype.createRenderer = function () {
        return new renderer_1.Renderer(this.graph);
    };
    Hook.prototype.createDefsManager = function () {
        return new defs_1.DefsManager(this.graph);
    };
    Hook.prototype.createGridManager = function () {
        return new grid_1.GridManager(this.graph);
    };
    Hook.prototype.createCoordManager = function () {
        return new coord_1.CoordManager(this.graph);
    };
    Hook.prototype.createKnobManager = function () {
        return new knob_2.KnobManager(this.graph);
    };
    Hook.prototype.createTransform = function (node, widgetOptions) {
        var options = this.getTransformOptions(node);
        if (options.resizable || options.rotatable) {
            return new transform_1.Transform(__assign(__assign({ node: node, graph: this.graph }, options), widgetOptions));
        }
        if (options.clearAll) {
            transform_1.Transform.removeInstances(this.graph);
        }
        return null;
    };
    Hook.prototype.createKnob = function (node, widgetOptions) {
        var _this = this;
        var options = options_1.Options.parseOptionGroup(this.graph, node, this.options.knob);
        var localOptions = __assign(__assign({}, options), widgetOptions);
        if (localOptions.clearAll) {
            knob_1.Knob.removeInstances(this.graph);
        }
        localOptions.clearAll = false;
        var knob = node.prop('knob');
        var widgets = [];
        var meta = Array.isArray(knob) ? knob : [knob];
        meta.forEach(function (knob, index) {
            if (knob) {
                if (knob.enabled === false) {
                    return;
                }
                if (typeof knob.enabled === 'function' &&
                    knob.enabled.call(_this.graph, node) === false) {
                    return;
                }
            }
            else {
                return;
            }
            if (options.enabled) {
                widgets.push(new knob_1.Knob(__assign({ node: node, index: index, graph: _this.graph }, localOptions)));
            }
        });
        return widgets;
    };
    Hook.prototype.getTransformOptions = function (node) {
        var resizing = options_1.Options.parseOptionGroup(this.graph, node, this.options.resizing);
        var rotating = options_1.Options.parseOptionGroup(this.graph, node, this.options.rotating);
        var transforming = options_1.Options.parseOptionGroup(this.graph, node, this.options.transforming);
        var options = __assign(__assign({}, transforming), { resizable: resizing.enabled, minWidth: resizing.minWidth, maxWidth: resizing.maxWidth, minHeight: resizing.minHeight, maxHeight: resizing.maxHeight, orthogonalResizing: resizing.orthogonal, restrictedResizing: resizing.restrict != null ? resizing.restrict : resizing.restricted, autoScrollOnResizing: resizing.autoScroll, preserveAspectRatio: resizing.preserveAspectRatio, allowReverse: resizing.allowReverse, rotatable: rotating.enabled, rotateGrid: rotating.grid });
        return options;
    };
    Hook.prototype.createTransformManager = function () {
        return new transform_2.TransformManager(this.graph);
    };
    Hook.prototype.createHighlightManager = function () {
        return new highlight_1.HighlightManager(this.graph);
    };
    Hook.prototype.createBackgroundManager = function () {
        return new background_1.BackgroundManager(this.graph);
    };
    Hook.prototype.createClipboard = function () {
        return new clipboard_1.Clipboard();
    };
    Hook.prototype.createClipboardManager = function () {
        return new clipboard_2.ClipboardManager(this.graph);
    };
    Hook.prototype.createSnapline = function () {
        return new snapline_1.Snapline(__assign({ graph: this.graph }, this.options.snapline));
    };
    Hook.prototype.createSnaplineManager = function () {
        return new snapline_2.SnaplineManager(this.graph);
    };
    Hook.prototype.createSelection = function () {
        return new selection_1.Selection(__assign({ graph: this.graph }, this.options.selecting));
    };
    Hook.prototype.createSelectionManager = function () {
        return new selection_2.SelectionManager(this.graph);
    };
    // eslint-disable-next-line
    Hook.prototype.allowRubberband = function (e) {
        return true;
    };
    Hook.prototype.createHistoryManager = function () {
        return new history_1.HistoryManager(__assign({ graph: this.graph }, this.options.history));
    };
    Hook.prototype.createScroller = function () {
        if (this.options.scroller.enabled) {
            return new scroller_1.Scroller(__assign({ graph: this.graph }, this.options.scroller));
        }
        return null;
    };
    Hook.prototype.createScrollerManager = function () {
        return new scroller_2.ScrollerManager(this.graph);
    };
    // eslint-disable-next-line
    Hook.prototype.allowPanning = function (e) {
        return true;
    };
    Hook.prototype.createMiniMap = function () {
        var _a = this.options.minimap, enabled = _a.enabled, options = __rest(_a, ["enabled"]);
        if (enabled) {
            return new minimap_1.MiniMap(__assign({ graph: this.graph }, options));
        }
        return null;
    };
    Hook.prototype.createMiniMapManager = function () {
        return new minimap_2.MiniMapManager(this.graph);
    };
    Hook.prototype.createKeyboard = function () {
        return new keyboard_1.Keyboard(__assign({ graph: this.graph }, this.options.keyboard));
    };
    Hook.prototype.createMouseWheel = function () {
        return new mousewheel_1.MouseWheel(__assign({ graph: this.graph }, this.options.mousewheel));
    };
    Hook.prototype.createPrintManager = function () {
        return new print_1.PrintManager(this.graph);
    };
    Hook.prototype.createFormatManager = function () {
        return new format_1.FormatManager(this.graph);
    };
    Hook.prototype.createPanningManager = function () {
        return new panning_1.PanningManager(this.graph);
    };
    Hook.prototype.createSizeManager = function () {
        return new size_1.SizeManager(this.graph);
    };
    Hook.prototype.allowConnectToBlank = function (edge) {
        var options = this.options.connecting;
        var allowBlank = options.allowBlank != null ? options.allowBlank : options.dangling;
        if (typeof allowBlank !== 'function') {
            return !!allowBlank;
        }
        var edgeView = this.graph.findViewByCell(edge);
        var sourceCell = edge.getSourceCell();
        var targetCell = edge.getTargetCell();
        var sourceView = this.graph.findViewByCell(sourceCell);
        var targetView = this.graph.findViewByCell(targetCell);
        return util_1.FunctionExt.call(allowBlank, this.graph, {
            edge: edge,
            edgeView: edgeView,
            sourceCell: sourceCell,
            targetCell: targetCell,
            sourceView: sourceView,
            targetView: targetView,
            sourcePort: edge.getSourcePortId(),
            targetPort: edge.getTargetPortId(),
            sourceMagnet: edgeView.sourceMagnet,
            targetMagnet: edgeView.targetMagnet,
        });
    };
    Hook.prototype.validateEdge = function (edge, type, initialTerminal) {
        if (!this.allowConnectToBlank(edge)) {
            var sourceId = edge.getSourceCellId();
            var targetId = edge.getTargetCellId();
            if (!(sourceId && targetId)) {
                return false;
            }
        }
        var validate = this.options.connecting.validateEdge;
        if (validate) {
            return util_1.FunctionExt.call(validate, this.graph, {
                edge: edge,
                type: type,
                previous: initialTerminal,
            });
        }
        return true;
    };
    Hook.prototype.validateMagnet = function (cellView, magnet, e) {
        if (magnet.getAttribute('magnet') !== 'passive') {
            var validate = this.options.connecting.validateMagnet;
            if (validate) {
                return util_1.FunctionExt.call(validate, this.graph, {
                    e: e,
                    magnet: magnet,
                    view: cellView,
                    cell: cellView.cell,
                });
            }
            return true;
        }
        return false;
    };
    Hook.prototype.getDefaultEdge = function (sourceView, sourceMagnet) {
        var edge;
        var create = this.options.connecting.createEdge;
        if (create) {
            edge = util_1.FunctionExt.call(create, this.graph, {
                sourceMagnet: sourceMagnet,
                sourceView: sourceView,
                sourceCell: sourceView.cell,
            });
        }
        if (edge == null) {
            edge = new edge_2.Edge();
        }
        return edge;
    };
    Hook.prototype.validateConnection = function (sourceView, sourceMagnet, targetView, targetMagnet, terminalType, edgeView, candidateTerminal) {
        var _this = this;
        var options = this.options.connecting;
        var allowLoop = options.allowLoop;
        var allowNode = options.allowNode;
        var allowEdge = options.allowEdge;
        var allowPort = options.allowPort;
        var allowMulti = options.allowMulti != null ? options.allowMulti : options.multi;
        var validate = options.validateConnection;
        var edge = edgeView ? edgeView.cell : null;
        var terminalView = terminalType === 'target' ? targetView : sourceView;
        var terminalMagnet = terminalType === 'target' ? targetMagnet : sourceMagnet;
        var valid = true;
        var doValidate = function (validate) {
            var sourcePort = terminalType === 'source'
                ? candidateTerminal
                    ? candidateTerminal.port
                    : null
                : edge
                    ? edge.getSourcePortId()
                    : null;
            var targetPort = terminalType === 'target'
                ? candidateTerminal
                    ? candidateTerminal.port
                    : null
                : edge
                    ? edge.getTargetPortId()
                    : null;
            return util_1.FunctionExt.call(validate, _this.graph, {
                edge: edge,
                edgeView: edgeView,
                sourceView: sourceView,
                targetView: targetView,
                sourcePort: sourcePort,
                targetPort: targetPort,
                sourceMagnet: sourceMagnet,
                targetMagnet: targetMagnet,
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
                if (!allowEdge && edge_1.EdgeView.isEdgeView(terminalView)) {
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
                if (!allowNode && node_1.NodeView.isNodeView(terminalView)) {
                    valid = false;
                }
            }
            else {
                valid = doValidate(allowNode);
            }
        }
        if (valid && allowMulti != null && edgeView) {
            var edge_3 = edgeView.cell;
            var source_1 = terminalType === 'source'
                ? candidateTerminal
                : edge_3.getSource();
            var target_1 = terminalType === 'target'
                ? candidateTerminal
                : edge_3.getTarget();
            var terminalCell = candidateTerminal
                ? this.graph.getCellById(candidateTerminal.cell)
                : null;
            if (source_1 && target_1 && source_1.cell && target_1.cell && terminalCell) {
                if (typeof allowMulti === 'function') {
                    valid = doValidate(allowMulti);
                }
                else {
                    var connectedEdges = this.model.getConnectedEdges(terminalCell, {
                        outgoing: terminalType === 'source',
                        incoming: terminalType === 'target',
                    });
                    if (connectedEdges.length) {
                        if (allowMulti === 'withPort') {
                            var exist = connectedEdges.some(function (link) {
                                var s = link.getSource();
                                var t = link.getTarget();
                                return (s &&
                                    t &&
                                    s.cell === source_1.cell &&
                                    t.cell === target_1.cell &&
                                    s.port != null &&
                                    s.port === source_1.port &&
                                    t.port != null &&
                                    t.port === target_1.port);
                            });
                            if (exist) {
                                valid = false;
                            }
                        }
                        else if (!allowMulti) {
                            var exist = connectedEdges.some(function (link) {
                                var s = link.getSource();
                                var t = link.getTarget();
                                return (s && t && s.cell === source_1.cell && t.cell === target_1.cell);
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
    };
    Hook.prototype.getRestrictArea = function (view) {
        var restrict = this.options.translating.restrict;
        var area = typeof restrict === 'function'
            ? util_1.FunctionExt.call(restrict, this.graph, view)
            : restrict;
        if (typeof area === 'number') {
            return this.graph.transform.getGraphArea().inflate(area);
        }
        if (area === true) {
            return this.graph.transform.getGraphArea();
        }
        return area || null;
    };
    Hook.prototype.onViewUpdated = function (view, flag, options) {
        if (flag & renderer_1.Renderer.FLAG_INSERT || options.mounting) {
            return;
        }
        this.graph.renderer.requestConnectedEdgesUpdate(view, options);
    };
    Hook.prototype.onViewPostponed = function (view, flag, options) {
        return this.graph.renderer.forcePostponedViewUpdate(view, flag);
    };
    Hook.prototype.getCellView = function (cell) {
        return null;
    };
    Hook.prototype.createCellView = function (cell) {
        var options = { graph: this.graph };
        var ctor = this.getCellView(cell);
        if (ctor) {
            return new ctor(cell, options); // eslint-disable-line new-cap
        }
        var view = cell.view;
        if (view != null && typeof view === 'string') {
            var def = cell_1.CellView.registry.get(view);
            if (def) {
                return new def(cell, options); // eslint-disable-line new-cap
            }
            return cell_1.CellView.registry.onNotFound(view);
        }
        if (cell.isNode()) {
            return new node_1.NodeView(cell, options);
        }
        if (cell.isEdge()) {
            return new edge_1.EdgeView(cell, options);
        }
        return null;
    };
    Hook.prototype.getHTMLComponent = function (node) {
        var ret = node.getHTML();
        if (typeof ret === 'string') {
            ret = html_1.HTML.componentRegistry.get(ret) || ret;
        }
        if (util_1.ObjectExt.isPlainObject(ret)) {
            ret = ret.render;
        }
        if (typeof ret === 'function') {
            return util_1.FunctionExt.call(ret, this.graph, node);
        }
        return ret;
    };
    Hook.prototype.shouldUpdateHTMLComponent = function (node) {
        var html = node.getHTML();
        if (typeof html === 'string') {
            html = html_1.HTML.componentRegistry.get(html) || html;
        }
        if (util_1.ObjectExt.isPlainObject(html)) {
            var shouldUpdate = html
                .shouldComponentUpdate;
            if (typeof shouldUpdate === 'function') {
                return util_1.FunctionExt.call(shouldUpdate, this.graph, node);
            }
            return !!shouldUpdate;
        }
        return false;
    };
    Hook.prototype.onEdgeLabelRendered = function (args) { }; // eslint-disable-line
    Hook.prototype.onPortRendered = function (args) { }; // eslint-disable-line
    Hook.prototype.onToolItemCreated = function (args) { }; // eslint-disable-line
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
    return Hook;
}(base_1.Base));
exports.Hook = Hook;
//# sourceMappingURL=hook.js.map