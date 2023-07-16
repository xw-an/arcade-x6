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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NodeView = void 0;
var jquery_1 = __importDefault(require("jquery"));
var global_1 = require("../global");
var util_1 = require("../util");
var geometry_1 = require("../geometry");
var cell_1 = require("../model/cell");
var cell_2 = require("./cell");
var markup_1 = require("./markup");
var NodeView = /** @class */ (function (_super) {
    __extends(NodeView, _super);
    function NodeView() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.scalableNode = null;
        _this.rotatableNode = null;
        _this.scalableSelector = 'scalable';
        _this.rotatableSelector = 'rotatable';
        _this.defaultPortMarkup = markup_1.Markup.getPortMarkup();
        _this.defaultPortLabelMarkup = markup_1.Markup.getPortLabelMarkup();
        _this.defaultPortContainerMarkup = markup_1.Markup.getPortContainerMarkup();
        _this.portsCache = {};
        return _this;
        // #endregion
    }
    Object.defineProperty(NodeView.prototype, Symbol.toStringTag, {
        get: function () {
            return NodeView.toStringTag;
        },
        enumerable: false,
        configurable: true
    });
    NodeView.prototype.getContainerClassName = function () {
        var classList = [
            _super.prototype.getContainerClassName.call(this),
            this.prefixClassName('node'),
        ];
        if (!this.can('nodeMovable')) {
            classList.push(this.prefixClassName('node-immovable'));
        }
        return classList.join(' ');
    };
    NodeView.prototype.updateClassName = function (e) {
        var target = e.target;
        if (target.hasAttribute('magnet')) {
            // port
            var className = this.prefixClassName('port-unconnectable');
            if (this.can('magnetConnectable')) {
                util_1.Dom.removeClass(target, className);
            }
            else {
                util_1.Dom.addClass(target, className);
            }
        }
        else {
            // node
            var className = this.prefixClassName('node-immovable');
            if (this.can('nodeMovable')) {
                this.removeClass(className);
            }
            else {
                this.addClass(className);
            }
        }
    };
    NodeView.prototype.isNodeView = function () {
        return true;
    };
    NodeView.prototype.confirmUpdate = function (flag, options) {
        var _this = this;
        if (options === void 0) { options = {}; }
        var ret = flag;
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
            ret = this.handleAction(ret, 'resize', function () { return _this.resize(options); }, 'update');
            ret = this.handleAction(ret, 'update', function () { return _this.update(); }, 
            // `update()` will render ports when useCSSSelectors are enabled
            global_1.Config.useCSSSelector ? 'ports' : null);
            ret = this.handleAction(ret, 'translate', function () { return _this.translate(); });
            ret = this.handleAction(ret, 'rotate', function () { return _this.rotate(); });
            ret = this.handleAction(ret, 'ports', function () { return _this.renderPorts(); });
            ret = this.handleAction(ret, 'tools', function () { return _this.renderTools(); });
        }
        return ret;
    };
    NodeView.prototype.update = function (partialAttrs) {
        this.cleanCache();
        // When CSS selector strings are used, make sure no rule matches port nodes.
        if (global_1.Config.useCSSSelector) {
            this.removePorts();
        }
        var node = this.cell;
        var size = node.getSize();
        var attrs = node.getAttrs();
        this.updateAttrs(this.container, attrs, {
            attrs: partialAttrs === attrs ? null : partialAttrs,
            rootBBox: new geometry_1.Rectangle(0, 0, size.width, size.height),
            selectors: this.selectors,
            scalableNode: this.scalableNode,
            rotatableNode: this.rotatableNode,
        });
        if (global_1.Config.useCSSSelector) {
            this.renderPorts();
        }
    };
    NodeView.prototype.renderMarkup = function () {
        var markup = this.cell.markup;
        if (markup) {
            if (typeof markup === 'string') {
                return this.renderStringMarkup(markup);
            }
            return this.renderJSONMarkup(markup);
        }
        throw new TypeError('Invalid node markup.');
    };
    NodeView.prototype.renderJSONMarkup = function (markup) {
        var ret = this.parseJSONMarkup(markup, this.container);
        var one = function (elems) {
            return Array.isArray(elems) ? elems[0] : elems;
        };
        this.selectors = ret.selectors;
        this.rotatableNode = one(this.selectors[this.rotatableSelector]);
        this.scalableNode = one(this.selectors[this.scalableSelector]);
        this.container.appendChild(ret.fragment);
    };
    NodeView.prototype.renderStringMarkup = function (markup) {
        util_1.Dom.append(this.container, util_1.Vector.toNodes(util_1.Vector.createVectors(markup)));
        this.rotatableNode = util_1.Dom.findOne(this.container, "." + this.rotatableSelector);
        this.scalableNode = util_1.Dom.findOne(this.container, "." + this.scalableSelector);
        this.selectors = {};
        if (this.rootSelector) {
            this.selectors[this.rootSelector] = this.container;
        }
    };
    NodeView.prototype.render = function () {
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
        if (!global_1.Config.useCSSSelector) {
            this.renderPorts();
        }
        this.renderTools();
        return this;
    };
    NodeView.prototype.resize = function (opt) {
        if (opt === void 0) { opt = {}; }
        if (this.scalableNode) {
            return this.updateSize(opt);
        }
        if (this.cell.getAngle()) {
            this.rotate();
        }
        this.update();
    };
    NodeView.prototype.translate = function () {
        if (this.rotatableNode) {
            return this.updateTranslation();
        }
        this.updateTransform();
    };
    NodeView.prototype.rotate = function () {
        if (this.rotatableNode) {
            this.updateRotation();
            // It's necessary to call the update for the nodes outside
            // the rotatable group referencing nodes inside the group
            this.update();
            return;
        }
        this.updateTransform();
    };
    NodeView.prototype.getTranslationString = function () {
        var position = this.cell.getPosition();
        return "translate(" + position.x + "," + position.y + ")";
    };
    NodeView.prototype.getRotationString = function () {
        var angle = this.cell.getAngle();
        if (angle) {
            var size = this.cell.getSize();
            return "rotate(" + angle + "," + size.width / 2 + "," + size.height / 2 + ")";
        }
    };
    NodeView.prototype.updateTransform = function () {
        var transform = this.getTranslationString();
        var rot = this.getRotationString();
        if (rot) {
            transform += " " + rot;
        }
        this.container.setAttribute('transform', transform);
    };
    NodeView.prototype.updateRotation = function () {
        if (this.rotatableNode != null) {
            var transform = this.getRotationString();
            if (transform != null) {
                this.rotatableNode.setAttribute('transform', transform);
            }
            else {
                this.rotatableNode.removeAttribute('transform');
            }
        }
    };
    NodeView.prototype.updateTranslation = function () {
        this.container.setAttribute('transform', this.getTranslationString());
    };
    NodeView.prototype.updateSize = function (opt) {
        if (opt === void 0) { opt = {}; }
        var cell = this.cell;
        var size = cell.getSize();
        var angle = cell.getAngle();
        var scalableNode = this.scalableNode;
        // Getting scalable group's bbox.
        // Due to a bug in webkit's native SVG .getBBox implementation, the
        // bbox of groups with path children includes the paths' control points.
        // To work around the issue, we need to check whether there are any path
        // elements inside the scalable group.
        var recursive = false;
        if (scalableNode.getElementsByTagName('path').length > 0) {
            // If scalable has at least one descendant that is a path, we need
            // toswitch to recursive bbox calculation. Otherwise, group bbox
            // calculation works and so we can use the (faster) native function.
            recursive = true;
        }
        var scalableBBox = util_1.Dom.getBBox(scalableNode, { recursive: recursive });
        // Make sure `scalableBbox.width` and `scalableBbox.height` are not zero
        // which can happen if the element does not have any content.
        var sx = size.width / (scalableBBox.width || 1);
        var sy = size.height / (scalableBBox.height || 1);
        scalableNode.setAttribute('transform', "scale(" + sx + "," + sy + ")");
        // Now the interesting part. The goal is to be able to store the object geometry via just `x`, `y`, `angle`, `width` and `height`
        // Order of transformations is significant but we want to reconstruct the object always in the order:
        // resize(), rotate(), translate() no matter of how the object was transformed. For that to work,
        // we must adjust the `x` and `y` coordinates of the object whenever we resize it (because the origin of the
        // rotation changes). The new `x` and `y` coordinates are computed by canceling the previous rotation
        // around the center of the resized object (which is a different origin then the origin of the previous rotation)
        // and getting the top-left corner of the resulting object. Then we clean up the rotation back to what it originally was.
        // Cancel the rotation but now around a different origin, which is the center of the scaled object.
        var rotatableNode = this.rotatableNode;
        if (rotatableNode != null) {
            var transform = rotatableNode.getAttribute('transform');
            if (transform) {
                rotatableNode.setAttribute('transform', transform + " rotate(" + -angle + "," + size.width / 2 + "," + size.height / 2 + ")");
                var rotatableBBox = util_1.Dom.getBBox(scalableNode, {
                    target: this.graph.view.stage,
                });
                // Store new x, y and perform rotate() again against the new rotation origin.
                cell.prop('position', { x: rotatableBBox.x, y: rotatableBBox.y }, __assign({ updated: true }, opt));
                this.translate();
                this.rotate();
            }
        }
        // Update must always be called on non-rotated element. Otherwise,
        // relative positioning would work with wrong (rotated) bounding boxes.
        this.update();
    };
    // #region ports
    NodeView.prototype.findPortElem = function (portId, selector) {
        var cache = portId ? this.portsCache[portId] : null;
        if (!cache) {
            return null;
        }
        var portRoot = cache.portContentElement;
        var portSelectors = cache.portContentSelectors || {};
        return this.findOne(selector, portRoot, portSelectors);
    };
    NodeView.prototype.initializePorts = function () {
        this.cleanPortsCache();
    };
    NodeView.prototype.refreshPorts = function () {
        this.removePorts();
        this.cleanPortsCache();
        this.renderPorts();
    };
    NodeView.prototype.cleanPortsCache = function () {
        this.portsCache = {};
    };
    NodeView.prototype.removePorts = function () {
        var _this = this;
        Object.keys(this.portsCache).forEach(function (portId) {
            var cached = _this.portsCache[portId];
            util_1.Dom.remove(cached.portElement);
        });
    };
    NodeView.prototype.renderPorts = function () {
        var _this = this;
        var container = this.getPortsContainer();
        // References to rendered elements without z-index
        var references = [];
        container.childNodes.forEach(function (child) {
            references.push(child);
        });
        var portsGropsByZ = util_1.ArrayExt.groupBy(this.cell.getParsedPorts(), 'zIndex');
        var autoZIndexKey = 'auto';
        // render non-z first
        if (portsGropsByZ[autoZIndexKey]) {
            portsGropsByZ[autoZIndexKey].forEach(function (port) {
                var portElement = _this.getPortElement(port);
                container.append(portElement);
                references.push(portElement);
            });
        }
        Object.keys(portsGropsByZ).forEach(function (key) {
            if (key !== autoZIndexKey) {
                var zIndex = parseInt(key, 10);
                _this.appendPorts(portsGropsByZ[key], zIndex, references);
            }
        });
        this.updatePorts();
    };
    NodeView.prototype.getPortsContainer = function () {
        return this.rotatableNode || this.container;
    };
    NodeView.prototype.appendPorts = function (ports, zIndex, refs) {
        var _this = this;
        var elems = ports.map(function (p) { return _this.getPortElement(p); });
        if (refs[zIndex] || zIndex < 0) {
            util_1.Dom.before(refs[Math.max(zIndex, 0)], elems);
        }
        else {
            util_1.Dom.append(this.getPortsContainer(), elems);
        }
    };
    NodeView.prototype.getPortElement = function (port) {
        var cached = this.portsCache[port.id];
        if (cached) {
            return cached.portElement;
        }
        return this.createPortElement(port);
    };
    NodeView.prototype.createPortElement = function (port) {
        var renderResult = markup_1.Markup.renderMarkup(this.getPortContainerMarkup());
        var portElement = renderResult.elem;
        if (portElement == null) {
            throw new Error('Invalid port container markup.');
        }
        renderResult = markup_1.Markup.renderMarkup(this.getPortMarkup(port));
        var portContentElement = renderResult.elem;
        var portContentSelectors = renderResult.selectors;
        if (portContentElement == null) {
            throw new Error('Invalid port markup.');
        }
        this.setAttrs({
            port: port.id,
            'port-group': port.group,
        }, portContentElement);
        renderResult = markup_1.Markup.renderMarkup(this.getPortLabelMarkup(port.label));
        var portLabelElement = renderResult.elem;
        var portLabelSelectors = renderResult.selectors;
        if (portLabelElement == null) {
            throw new Error('Invalid port label markup.');
        }
        var portSelectors;
        if (portContentSelectors && portLabelSelectors) {
            // eslint-disable-next-line
            for (var key in portLabelSelectors) {
                if (portContentSelectors[key] && key !== this.rootSelector) {
                    throw new Error('Selectors within port must be unique.');
                }
            }
            portSelectors = __assign(__assign({}, portContentSelectors), portLabelSelectors);
        }
        else {
            portSelectors = portContentSelectors || portLabelSelectors;
        }
        var portClass = 'x6-port';
        if (port.group) {
            portClass += " x6-port-" + port.group;
        }
        util_1.Dom.addClass(portElement, portClass);
        util_1.Dom.addClass(portContentElement, 'x6-port-body');
        util_1.Dom.addClass(portLabelElement, 'x6-port-label');
        portElement.appendChild(portContentElement);
        portElement.appendChild(portLabelElement);
        this.portsCache[port.id] = {
            portElement: portElement,
            portSelectors: portSelectors,
            portLabelElement: portLabelElement,
            portLabelSelectors: portLabelSelectors,
            portContentElement: portContentElement,
            portContentSelectors: portContentSelectors,
        };
        this.graph.hook.onPortRendered({
            port: port,
            node: this.cell,
            container: portElement,
            selectors: portSelectors,
            labelContainer: portLabelElement,
            labelSelectors: portLabelSelectors,
            contentContainer: portContentElement,
            contentSelectors: portContentSelectors,
        });
        return portElement;
    };
    NodeView.prototype.updatePorts = function () {
        var _this = this;
        // Layout ports without group
        this.updatePortGroup();
        // Layout ports with explicit group
        var groups = this.cell.getParsedGroups();
        Object.keys(groups).forEach(function (groupName) { return _this.updatePortGroup(groupName); });
    };
    NodeView.prototype.updatePortGroup = function (groupName) {
        var bbox = geometry_1.Rectangle.fromSize(this.cell.getSize());
        var metrics = this.cell.getPortsLayoutByGroup(groupName, bbox);
        for (var i = 0, n = metrics.length; i < n; i += 1) {
            var metric = metrics[i];
            var portId = metric.portId;
            var cached = this.portsCache[portId] || {};
            var portLayout = metric.portLayout;
            this.applyPortTransform(cached.portElement, portLayout);
            if (metric.portAttrs != null) {
                var options = {
                    selectors: cached.portSelectors || {},
                };
                if (metric.portSize) {
                    options.rootBBox = geometry_1.Rectangle.fromSize(metric.portSize);
                }
                this.updateAttrs(cached.portElement, metric.portAttrs, options);
            }
            var labelLayout = metric.labelLayout;
            if (labelLayout) {
                this.applyPortTransform(cached.portLabelElement, labelLayout, -(portLayout.angle || 0));
                if (labelLayout.attrs) {
                    var options = {
                        selectors: cached.portLabelSelectors || {},
                    };
                    if (metric.labelSize) {
                        options.rootBBox = geometry_1.Rectangle.fromSize(metric.labelSize);
                    }
                    this.updateAttrs(cached.portLabelElement, labelLayout.attrs, options);
                }
            }
        }
    };
    NodeView.prototype.applyPortTransform = function (element, layout, initialAngle) {
        if (initialAngle === void 0) { initialAngle = 0; }
        var angle = layout.angle;
        var position = layout.position;
        var matrix = util_1.Dom.createSVGMatrix()
            .rotate(initialAngle)
            .translate(position.x || 0, position.y || 0)
            .rotate(angle || 0);
        util_1.Dom.transform(element, matrix, { absolute: true });
    };
    NodeView.prototype.getPortContainerMarkup = function () {
        return this.cell.getPortContainerMarkup() || this.defaultPortContainerMarkup;
    };
    NodeView.prototype.getPortMarkup = function (port) {
        return port.markup || this.cell.portMarkup || this.defaultPortMarkup;
    };
    NodeView.prototype.getPortLabelMarkup = function (label) {
        return (label.markup || this.cell.portLabelMarkup || this.defaultPortLabelMarkup);
    };
    NodeView.prototype.getEventArgs = function (e, x, y) {
        var view = this; // eslint-disable-line
        var node = view.cell;
        var cell = node;
        if (x == null || y == null) {
            return { e: e, view: view, node: node, cell: cell };
        }
        return { e: e, x: x, y: y, view: view, node: node, cell: cell };
    };
    NodeView.prototype.notifyMouseDown = function (e, x, y) {
        _super.prototype.onMouseDown.call(this, e, x, y);
        this.notify('node:mousedown', this.getEventArgs(e, x, y));
    };
    NodeView.prototype.notifyMouseMove = function (e, x, y) {
        _super.prototype.onMouseMove.call(this, e, x, y);
        this.notify('node:mousemove', this.getEventArgs(e, x, y));
    };
    NodeView.prototype.notifyMouseUp = function (e, x, y) {
        // Problem: super will call stopBatch before event listeners
        // attached to this **node** run. Those events will not count
        // towards this batch, despite being triggered by the same UI event.
        //
        // This complicates a lot of stuff e.g. history recording.
        //
        // See https://github.com/antvis/X6/issues/2421 for background.
        _super.prototype.onMouseUp.call(this, e, x, y);
        this.notify('node:mouseup', this.getEventArgs(e, x, y));
    };
    NodeView.prototype.onClick = function (e, x, y) {
        _super.prototype.onClick.call(this, e, x, y);
        this.notify('node:click', this.getEventArgs(e, x, y));
    };
    NodeView.prototype.onDblClick = function (e, x, y) {
        _super.prototype.onDblClick.call(this, e, x, y);
        this.notify('node:dblclick', this.getEventArgs(e, x, y));
    };
    NodeView.prototype.onContextMenu = function (e, x, y) {
        _super.prototype.onContextMenu.call(this, e, x, y);
        this.notify('node:contextmenu', this.getEventArgs(e, x, y));
    };
    NodeView.prototype.onMouseDown = function (e, x, y) {
        if (this.isPropagationStopped(e)) {
            return;
        }
        // 避免处于foreignObject内部元素触发onMouseDown导致节点被拖拽
        // 拖拽的时候是以onMouseDown启动的
        var target = e.target;
        if (util_1.Dom.clickable(target) || util_1.Dom.isInputElement(target)) {
            return;
        }
        this.notifyMouseDown(e, x, y);
        this.startNodeDragging(e, x, y);
    };
    NodeView.prototype.onMouseMove = function (e, x, y) {
        var data = this.getEventData(e);
        var action = data.action;
        if (action === 'magnet') {
            this.dragMagnet(e, x, y);
        }
        else {
            if (action === 'move') {
                var meta = data;
                var view = meta.targetView || this;
                view.dragNode(e, x, y);
                view.notify('node:moving', {
                    e: e,
                    x: x,
                    y: y,
                    view: view,
                    cell: view.cell,
                    node: view.cell,
                });
            }
            this.notifyMouseMove(e, x, y);
        }
        this.setEventData(e, data);
    };
    NodeView.prototype.onMouseUp = function (e, x, y) {
        var data = this.getEventData(e);
        var action = data.action;
        if (action === 'magnet') {
            this.stopMagnetDragging(e, x, y);
        }
        else {
            // 避免处于foreignObject内部元素触发onMouseUp导致节点被选中
            // 选中的时候是以onMouseUp启动的
            var target = e.target;
            if (util_1.Dom.clickable(target) || util_1.Dom.isInputElement(target)) {
                return;
            }
            this.notifyMouseUp(e, x, y);
            if (action === 'move') {
                var meta = data;
                var view = meta.targetView || this;
                view.stopNodeDragging(e, x, y);
            }
        }
        var magnet = data.targetMagnet;
        if (magnet) {
            this.onMagnetClick(e, magnet, x, y);
        }
        this.checkMouseleave(e);
    };
    NodeView.prototype.onMouseOver = function (e) {
        _super.prototype.onMouseOver.call(this, e);
        this.notify('node:mouseover', this.getEventArgs(e));
    };
    NodeView.prototype.onMouseOut = function (e) {
        _super.prototype.onMouseOut.call(this, e);
        this.notify('node:mouseout', this.getEventArgs(e));
    };
    NodeView.prototype.onMouseEnter = function (e) {
        this.updateClassName(e);
        _super.prototype.onMouseEnter.call(this, e);
        this.notify('node:mouseenter', this.getEventArgs(e));
    };
    NodeView.prototype.onMouseLeave = function (e) {
        _super.prototype.onMouseLeave.call(this, e);
        this.notify('node:mouseleave', this.getEventArgs(e));
    };
    NodeView.prototype.onMouseWheel = function (e, x, y, delta) {
        _super.prototype.onMouseWheel.call(this, e, x, y, delta);
        this.notify('node:mousewheel', __assign({ delta: delta }, this.getEventArgs(e, x, y)));
    };
    NodeView.prototype.onMagnetClick = function (e, magnet, x, y) {
        var count = this.graph.view.getMouseMovedCount(e);
        if (count > this.graph.options.clickThreshold) {
            return;
        }
        this.notify('node:magnet:click', __assign({ magnet: magnet }, this.getEventArgs(e, x, y)));
    };
    NodeView.prototype.onMagnetDblClick = function (e, magnet, x, y) {
        this.notify('node:magnet:dblclick', __assign({ magnet: magnet }, this.getEventArgs(e, x, y)));
    };
    NodeView.prototype.onMagnetContextMenu = function (e, magnet, x, y) {
        this.notify('node:magnet:contextmenu', __assign({ magnet: magnet }, this.getEventArgs(e, x, y)));
    };
    NodeView.prototype.onMagnetMouseDown = function (e, magnet, x, y) {
        this.startMagnetDragging(e, x, y);
    };
    NodeView.prototype.onCustomEvent = function (e, name, x, y) {
        this.notify('node:customevent', __assign({ name: name }, this.getEventArgs(e, x, y)));
        _super.prototype.onCustomEvent.call(this, e, name, x, y);
    };
    NodeView.prototype.prepareEmbedding = function (e) {
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
        var data = this.getEventData(e);
        var node = data.cell || this.cell;
        var view = this.graph.findViewByCell(node);
        var localPoint = this.graph.snapToGrid(e.clientX, e.clientY);
        this.notify('node:embed', {
            e: e,
            node: node,
            view: view,
            cell: node,
            x: localPoint.x,
            y: localPoint.y,
            currentParent: node.getParent(),
        });
    };
    NodeView.prototype.processEmbedding = function (e, data) {
        var _this = this;
        var cell = data.cell || this.cell;
        var graph = data.graph || this.graph;
        var options = graph.options.embedding;
        var findParent = options.findParent;
        var candidates = typeof findParent === 'function'
            ? util_1.FunctionExt.call(findParent, graph, {
                view: this,
                node: this.cell,
            }).filter(function (c) {
                return (cell_1.Cell.isCell(c) &&
                    _this.cell.id !== c.id &&
                    !c.isDescendantOf(_this.cell));
            })
            : graph.model.getNodesUnderNode(cell, {
                by: findParent,
            });
        // Picks the node with the highest `z` index
        if (options.frontOnly) {
            if (candidates.length > 0) {
                var zIndexMap = util_1.ArrayExt.groupBy(candidates, 'zIndex');
                var maxZIndex = util_1.ArrayExt.max(Object.keys(zIndexMap).map(function (z) { return parseInt(z, 10); }));
                if (maxZIndex) {
                    candidates = zIndexMap[maxZIndex];
                }
            }
        }
        // Filter the nodes which is invisiable
        candidates = candidates.filter(function (candidate) { return candidate.visible; });
        var newCandidateView = null;
        var prevCandidateView = data.candidateEmbedView;
        var validateEmbeding = options.validate;
        for (var i = candidates.length - 1; i >= 0; i -= 1) {
            var candidate = candidates[i];
            if (prevCandidateView && prevCandidateView.cell.id === candidate.id) {
                // candidate remains the same
                newCandidateView = prevCandidateView;
                break;
            }
            else {
                var view = candidate.findView(graph);
                if (util_1.FunctionExt.call(validateEmbeding, graph, {
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
        var localPoint = graph.snapToGrid(e.clientX, e.clientY);
        this.notify('node:embedding', {
            e: e,
            cell: cell,
            node: cell,
            view: graph.findViewByCell(cell),
            x: localPoint.x,
            y: localPoint.y,
            currentParent: cell.getParent(),
            candidateParent: newCandidateView ? newCandidateView.cell : null,
        });
    };
    NodeView.prototype.clearEmbedding = function (data) {
        var candidateView = data.candidateEmbedView;
        if (candidateView) {
            candidateView.unhighlight(null, { type: 'embedding' });
            data.candidateEmbedView = null;
        }
    };
    NodeView.prototype.finalizeEmbedding = function (e, data) {
        this.graph.startBatch('embedding');
        var cell = data.cell || this.cell;
        var graph = data.graph || this.graph;
        var view = graph.findViewByCell(cell);
        var parent = cell.getParent();
        var candidateView = data.candidateEmbedView;
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
        graph.model.getConnectedEdges(cell, { deep: true }).forEach(function (edge) {
            edge.updateParent({ ui: true });
        });
        if (view && candidateView) {
            var localPoint = graph.snapToGrid(e.clientX, e.clientY);
            view.notify('node:embedded', {
                e: e,
                cell: cell,
                x: localPoint.x,
                y: localPoint.y,
                node: cell,
                view: graph.findViewByCell(cell),
                previousParent: parent,
                currentParent: cell.getParent(),
            });
        }
        this.graph.stopBatch('embedding');
    };
    NodeView.prototype.getDelegatedView = function () {
        var cell = this.cell;
        var view = this; // eslint-disable-line
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
    };
    NodeView.prototype.startMagnetDragging = function (e, x, y) {
        if (!this.can('magnetConnectable')) {
            return;
        }
        e.stopPropagation();
        var magnet = e.currentTarget;
        var graph = this.graph;
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
            if (util_1.Dom.hasClass(magnet, 'x6-port-body') ||
                (0, jquery_1.default)(magnet).closest('.x6-port-body').length > 0) {
                this.stopPropagation(e);
            }
            this.onMouseDown(e, x, y);
        }
        graph.view.delegateDragEvents(e, this);
    };
    NodeView.prototype.startConnectting = function (e, magnet, x, y) {
        this.graph.model.startBatch('add-edge');
        var edgeView = this.createEdgeFromMagnet(magnet, x, y);
        edgeView.notifyMouseDown(e, x, y); // backwards compatibility events
        edgeView.setEventData(e, edgeView.prepareArrowheadDragging('target', {
            x: x,
            y: y,
            isNewEdge: true,
            fallbackAction: 'remove',
        }));
        this.setEventData(e, { edgeView: edgeView });
    };
    NodeView.prototype.createEdgeFromMagnet = function (magnet, x, y) {
        var graph = this.graph;
        var model = graph.model;
        var edge = graph.hook.getDefaultEdge(this, magnet);
        edge.setSource(__assign(__assign({}, edge.getSource()), this.getEdgeTerminal(magnet, x, y, edge, 'source')));
        edge.setTarget(__assign(__assign({}, edge.getTarget()), { x: x, y: y }));
        edge.addTo(model, { async: false, ui: true });
        return edge.findView(graph);
    };
    NodeView.prototype.dragMagnet = function (e, x, y) {
        var data = this.getEventData(e);
        var edgeView = data.edgeView;
        if (edgeView) {
            edgeView.onMouseMove(e, x, y);
            this.autoScrollGraph(e.clientX, e.clientY);
        }
        else {
            var graph = this.graph;
            var magnetThreshold = graph.options.magnetThreshold;
            var currentTarget = this.getEventTarget(e);
            var targetMagnet = data.targetMagnet;
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
    };
    NodeView.prototype.stopMagnetDragging = function (e, x, y) {
        var data = this.eventData(e);
        var edgeView = data.edgeView;
        if (edgeView) {
            edgeView.onMouseUp(e, x, y);
            this.graph.model.stopBatch('add-edge');
        }
    };
    NodeView.prototype.notifyUnhandledMouseDown = function (e, x, y) {
        this.notify('node:unhandled:mousedown', {
            e: e,
            x: x,
            y: y,
            view: this,
            cell: this.cell,
            node: this.cell,
        });
    };
    NodeView.prototype.notifyNodeMove = function (name, e, x, y, cell) {
        var _this = this;
        var cells = [cell];
        var selection = this.graph.selection.widget;
        if (selection && selection.options.movable) {
            var selectedCells = this.graph.getSelectedCells();
            if (selectedCells.includes(cell)) {
                cells = selectedCells.filter(function (c) { return c.isNode(); });
            }
        }
        cells.forEach(function (c) {
            _this.notify(name, {
                e: e,
                x: x,
                y: y,
                cell: c,
                node: c,
                view: c.findView(_this.graph),
            });
        });
    };
    NodeView.prototype.startNodeDragging = function (e, x, y) {
        var targetView = this.getDelegatedView();
        if (targetView == null || !targetView.can('nodeMovable')) {
            return this.notifyUnhandledMouseDown(e, x, y);
        }
        this.setEventData(e, {
            targetView: targetView,
            action: 'move',
        });
        var position = geometry_1.Point.create(targetView.cell.getPosition());
        targetView.setEventData(e, {
            moving: false,
            offset: position.diff(x, y),
            restrict: this.graph.hook.getRestrictArea(targetView),
        });
    };
    NodeView.prototype.dragNode = function (e, x, y) {
        var node = this.cell;
        var graph = this.graph;
        var gridSize = graph.getGridSize();
        var data = this.getEventData(e);
        var offset = data.offset;
        var restrict = data.restrict;
        if (!data.moving) {
            data.moving = true;
            this.addClass('node-moving');
            this.notifyNodeMove('node:move', e, x, y, this.cell);
        }
        this.autoScrollGraph(e.clientX, e.clientY);
        var posX = global_1.Util.snapToGrid(x + offset.x, gridSize);
        var posY = global_1.Util.snapToGrid(y + offset.y, gridSize);
        node.setPosition(posX, posY, {
            restrict: restrict,
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
    };
    NodeView.prototype.stopNodeDragging = function (e, x, y) {
        var data = this.getEventData(e);
        if (data.embedding) {
            this.finalizeEmbedding(e, data);
        }
        if (data.moving) {
            this.removeClass('node-moving');
            this.notifyNodeMove('node:moved', e, x, y, this.cell);
        }
        data.moving = false;
        data.embedding = false;
    };
    NodeView.prototype.autoScrollGraph = function (x, y) {
        var scroller = this.graph.scroller.widget;
        if (scroller) {
            scroller.autoScroll(x, y);
        }
    };
    return NodeView;
}(cell_2.CellView));
exports.NodeView = NodeView;
(function (NodeView) {
    NodeView.toStringTag = "X6." + NodeView.name;
    function isNodeView(instance) {
        if (instance == null) {
            return false;
        }
        if (instance instanceof NodeView) {
            return true;
        }
        var tag = instance[Symbol.toStringTag];
        var view = instance;
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
})(NodeView = exports.NodeView || (exports.NodeView = {}));
exports.NodeView = NodeView;
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