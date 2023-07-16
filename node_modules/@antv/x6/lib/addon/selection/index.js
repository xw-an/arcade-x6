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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Selection = void 0;
var global_1 = require("../../global");
var geometry_1 = require("../../geometry");
var util_1 = require("../../util");
var cell_1 = require("../../model/cell");
var collection_1 = require("../../model/collection");
var view_1 = require("../../view/view");
var util_2 = require("../transform/util");
var common_1 = require("../common");
var Selection = /** @class */ (function (_super) {
    __extends(Selection, _super);
    function Selection(options) {
        var _this = _super.call(this) || this;
        _this.options = util_1.ObjectExt.merge({}, Private.defaultOptions, options);
        if (_this.options.model) {
            _this.options.collection = _this.options.model.collection;
        }
        if (_this.options.collection) {
            _this.collection = _this.options.collection;
        }
        else {
            _this.collection = new collection_1.Collection([], {
                comparator: Private.depthComparator,
            });
            _this.options.collection = _this.collection;
        }
        _this.boxCount = 0;
        _this.createContainer();
        _this.initHandles();
        _this.startListening();
        return _this;
    }
    Object.defineProperty(Selection.prototype, "graph", {
        get: function () {
            return this.options.graph;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Selection.prototype, "boxClassName", {
        get: function () {
            return this.prefixClassName(Private.classNames.box);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Selection.prototype, "$boxes", {
        get: function () {
            return this.$container.children("." + this.boxClassName);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Selection.prototype, "handleOptions", {
        get: function () {
            return this.options;
        },
        enumerable: false,
        configurable: true
    });
    Selection.prototype.startListening = function () {
        var _a;
        var graph = this.graph;
        var collection = this.collection;
        this.delegateEvents((_a = {},
            _a["mousedown ." + this.boxClassName] = 'onSelectionBoxMouseDown',
            _a["touchstart ." + this.boxClassName] = 'onSelectionBoxMouseDown',
            _a), true);
        graph.on('scale', this.onGraphTransformed, this);
        graph.on('translate', this.onGraphTransformed, this);
        graph.model.on('updated', this.onModelUpdated, this);
        collection.on('added', this.onCellAdded, this);
        collection.on('removed', this.onCellRemoved, this);
        collection.on('reseted', this.onReseted, this);
        collection.on('updated', this.onCollectionUpdated, this);
        collection.on('node:change:position', this.onNodePositionChanged, this);
        collection.on('cell:changed', this.onCellChanged, this);
    };
    Selection.prototype.stopListening = function () {
        var graph = this.graph;
        var collection = this.collection;
        this.undelegateEvents();
        graph.off('scale', this.onGraphTransformed, this);
        graph.off('translate', this.onGraphTransformed, this);
        graph.model.off('updated', this.onModelUpdated, this);
        collection.off('added', this.onCellAdded, this);
        collection.off('removed', this.onCellRemoved, this);
        collection.off('reseted', this.onReseted, this);
        collection.off('updated', this.onCollectionUpdated, this);
        collection.off('node:change:position', this.onNodePositionChanged, this);
        collection.off('cell:changed', this.onCellChanged, this);
    };
    Selection.prototype.onRemove = function () {
        this.stopListening();
    };
    Selection.prototype.onGraphTransformed = function () {
        this.updateSelectionBoxes({ async: false });
    };
    Selection.prototype.onCellChanged = function () {
        this.updateSelectionBoxes();
    };
    Selection.prototype.onNodePositionChanged = function (_a) {
        var node = _a.node, options = _a.options;
        var _b = this.options, showNodeSelectionBox = _b.showNodeSelectionBox, pointerEvents = _b.pointerEvents;
        var ui = options.ui, selection = options.selection, translateBy = options.translateBy, snapped = options.snapped;
        var allowTranslating = (showNodeSelectionBox !== true || pointerEvents === 'none') &&
            !this.translating &&
            !selection;
        var translateByUi = ui && translateBy && node.id === translateBy;
        if (allowTranslating && (translateByUi || snapped)) {
            this.translating = true;
            var current = node.position();
            var previous = node.previous('position');
            var dx = current.x - previous.x;
            var dy = current.y - previous.y;
            if (dx !== 0 || dy !== 0) {
                this.translateSelectedNodes(dx, dy, node, options);
            }
            this.translating = false;
        }
    };
    Selection.prototype.onModelUpdated = function (_a) {
        var removed = _a.removed;
        if (removed && removed.length) {
            this.unselect(removed);
        }
    };
    Selection.prototype.isEmpty = function () {
        return this.length <= 0;
    };
    Selection.prototype.isSelected = function (cell) {
        return this.collection.has(cell);
    };
    Object.defineProperty(Selection.prototype, "length", {
        get: function () {
            return this.collection.length;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Selection.prototype, "cells", {
        get: function () {
            return this.collection.toArray();
        },
        enumerable: false,
        configurable: true
    });
    Selection.prototype.select = function (cells, options) {
        if (options === void 0) { options = {}; }
        options.dryrun = true;
        var items = this.filter(Array.isArray(cells) ? cells : [cells]);
        this.collection.add(items, options);
        return this;
    };
    Selection.prototype.unselect = function (cells, options) {
        if (options === void 0) { options = {}; }
        // dryrun to prevent cell be removed from graph
        options.dryrun = true;
        this.collection.remove(Array.isArray(cells) ? cells : [cells], options);
        return this;
    };
    Selection.prototype.reset = function (cells, options) {
        if (options === void 0) { options = {}; }
        if (cells) {
            if (options.batch) {
                var filterCells = this.filter(Array.isArray(cells) ? cells : [cells]);
                this.collection.reset(filterCells, __assign(__assign({}, options), { ui: true }));
                return this;
            }
            var prev = this.cells;
            var next = this.filter(Array.isArray(cells) ? cells : [cells]);
            var prevMap_1 = {};
            var nextMap_1 = {};
            prev.forEach(function (cell) { return (prevMap_1[cell.id] = cell); });
            next.forEach(function (cell) { return (nextMap_1[cell.id] = cell); });
            var added_1 = [];
            var removed_1 = [];
            next.forEach(function (cell) {
                if (!prevMap_1[cell.id]) {
                    added_1.push(cell);
                }
            });
            prev.forEach(function (cell) {
                if (!nextMap_1[cell.id]) {
                    removed_1.push(cell);
                }
            });
            if (removed_1.length) {
                this.unselect(removed_1, __assign(__assign({}, options), { ui: true }));
            }
            if (added_1.length) {
                this.select(added_1, __assign(__assign({}, options), { ui: true }));
            }
            if (removed_1.length === 0 && added_1.length === 0) {
                this.updateContainer();
            }
            return this;
        }
        return this.clean(options);
    };
    Selection.prototype.clean = function (options) {
        if (options === void 0) { options = {}; }
        if (this.length) {
            if (options.batch === false) {
                this.unselect(this.cells, options);
            }
            else {
                this.collection.reset([], __assign(__assign({}, options), { ui: true }));
            }
        }
        return this;
    };
    Selection.prototype.setFilter = function (filter) {
        this.options.filter = filter;
    };
    Selection.prototype.setContent = function (content) {
        this.options.content = content;
    };
    Selection.prototype.startSelecting = function (evt) {
        // Flow: startSelecting => adjustSelection => stopSelecting
        evt = this.normalizeEvent(evt); // eslint-disable-line
        this.clean();
        var x;
        var y;
        var graphContainer = this.graph.container;
        if (evt.offsetX != null &&
            evt.offsetY != null &&
            graphContainer.contains(evt.target)) {
            x = evt.offsetX;
            y = evt.offsetY;
        }
        else {
            var offset = this.$(graphContainer).offset();
            var scrollLeft = graphContainer.scrollLeft;
            var scrollTop = graphContainer.scrollTop;
            x = evt.clientX - offset.left + window.pageXOffset + scrollLeft;
            y = evt.clientY - offset.top + window.pageYOffset + scrollTop;
        }
        this.$container.css({
            top: y,
            left: x,
            width: 1,
            height: 1,
        });
        this.setEventData(evt, {
            action: 'selecting',
            clientX: evt.clientX,
            clientY: evt.clientY,
            offsetX: x,
            offsetY: y,
            scrollerX: 0,
            scrollerY: 0,
            moving: false,
        });
        this.delegateDocumentEvents(Private.documentEvents, evt.data);
    };
    Selection.prototype.filter = function (cells) {
        var _this = this;
        var filter = this.options.filter;
        if (Array.isArray(filter)) {
            return cells.filter(function (cell) { return !filter.includes(cell) && !filter.includes(cell.shape); });
        }
        if (typeof filter === 'function') {
            return cells.filter(function (cell) { return util_1.FunctionExt.call(filter, _this.graph, cell); });
        }
        return cells;
    };
    Selection.prototype.stopSelecting = function (evt) {
        var graph = this.graph;
        var eventData = this.getEventData(evt);
        var action = eventData.action;
        switch (action) {
            case 'selecting': {
                var width = this.$container.width();
                var height = this.$container.height();
                var offset = this.$container.offset();
                var origin_1 = graph.pageToLocal(offset.left, offset.top);
                var scale = graph.transform.getScale();
                width /= scale.sx;
                height /= scale.sy;
                var rect = new geometry_1.Rectangle(origin_1.x, origin_1.y, width, height);
                var cells = this.getCellViewsInArea(rect).map(function (view) { return view.cell; });
                this.reset(cells, { batch: true });
                this.hideRubberband();
                break;
            }
            case 'translating': {
                var client = graph.snapToGrid(evt.clientX, evt.clientY);
                if (!this.options.following) {
                    var data = eventData;
                    this.updateSelectedNodesPosition({
                        dx: data.clientX - data.originX,
                        dy: data.clientY - data.originY,
                    });
                }
                this.graph.model.stopBatch('move-selection');
                this.notifyBoxEvent('box:mouseup', evt, client.x, client.y);
                break;
            }
            default: {
                this.clean();
                break;
            }
        }
    };
    Selection.prototype.onMouseUp = function (evt) {
        var action = this.getEventData(evt).action;
        if (action) {
            this.stopSelecting(evt);
            this.undelegateDocumentEvents();
        }
    };
    Selection.prototype.onSelectionBoxMouseDown = function (evt) {
        if (!this.options.following) {
            evt.stopPropagation();
        }
        var e = this.normalizeEvent(evt);
        if (this.options.movable) {
            this.startTranslating(e);
        }
        var activeView = this.getCellViewFromElem(e.target);
        this.setEventData(e, { activeView: activeView });
        var client = this.graph.snapToGrid(e.clientX, e.clientY);
        this.notifyBoxEvent('box:mousedown', e, client.x, client.y);
        this.delegateDocumentEvents(Private.documentEvents, e.data);
    };
    Selection.prototype.startTranslating = function (evt) {
        this.graph.model.startBatch('move-selection');
        var client = this.graph.snapToGrid(evt.clientX, evt.clientY);
        this.setEventData(evt, {
            action: 'translating',
            clientX: client.x,
            clientY: client.y,
            originX: client.x,
            originY: client.y,
        });
    };
    Selection.prototype.getSelectionOffset = function (client, data) {
        var dx = client.x - data.clientX;
        var dy = client.y - data.clientY;
        var restrict = this.graph.hook.getRestrictArea();
        if (restrict) {
            var cells = this.collection.toArray();
            var totalBBox = cell_1.Cell.getCellsBBox(cells, { deep: true }) || geometry_1.Rectangle.create();
            var minDx = restrict.x - totalBBox.x;
            var minDy = restrict.y - totalBBox.y;
            var maxDx = restrict.x + restrict.width - (totalBBox.x + totalBBox.width);
            var maxDy = restrict.y + restrict.height - (totalBBox.y + totalBBox.height);
            if (dx < minDx) {
                dx = minDx;
            }
            if (dy < minDy) {
                dy = minDy;
            }
            if (maxDx < dx) {
                dx = maxDx;
            }
            if (maxDy < dy) {
                dy = maxDy;
            }
            if (!this.options.following) {
                var offsetX = client.x - data.originX;
                var offsetY = client.y - data.originY;
                dx = offsetX <= minDx || offsetX >= maxDx ? 0 : dx;
                dy = offsetY <= minDy || offsetY >= maxDy ? 0 : dy;
            }
        }
        return {
            dx: dx,
            dy: dy,
        };
    };
    Selection.prototype.updateSelectedNodesPosition = function (offset) {
        var dx = offset.dx, dy = offset.dy;
        if (dx || dy) {
            if ((this.translateSelectedNodes(dx, dy), this.boxesUpdated)) {
                if (this.collection.length > 1) {
                    this.updateSelectionBoxes();
                }
            }
            else {
                var scale = this.graph.transform.getScale();
                this.$boxes.add(this.$selectionContainer).css({
                    left: "+=" + dx * scale.sx,
                    top: "+=" + dy * scale.sy,
                });
            }
        }
    };
    Selection.prototype.autoScrollGraph = function (x, y) {
        var scroller = this.graph.scroller.widget;
        if (scroller) {
            return scroller.autoScroll(x, y);
        }
        return { scrollerX: 0, scrollerY: 0 };
    };
    Selection.prototype.adjustSelection = function (evt) {
        var e = this.normalizeEvent(evt);
        var eventData = this.getEventData(e);
        var action = eventData.action;
        switch (action) {
            case 'selecting': {
                var data = eventData;
                if (data.moving !== true) {
                    this.$container.appendTo(this.graph.container);
                    this.showRubberband();
                    data.moving = true;
                }
                var _a = this.autoScrollGraph(e.clientX, e.clientY), scrollerX = _a.scrollerX, scrollerY = _a.scrollerY;
                data.scrollerX += scrollerX;
                data.scrollerY += scrollerY;
                var dx = e.clientX - data.clientX + data.scrollerX;
                var dy = e.clientY - data.clientY + data.scrollerY;
                var left = parseInt(this.$container.css('left'), 10);
                var top_1 = parseInt(this.$container.css('top'), 10);
                this.$container.css({
                    left: dx < 0 ? data.offsetX + dx : left,
                    top: dy < 0 ? data.offsetY + dy : top_1,
                    width: Math.abs(dx),
                    height: Math.abs(dy),
                });
                break;
            }
            case 'translating': {
                var client = this.graph.snapToGrid(e.clientX, e.clientY);
                var data = eventData;
                var offset = this.getSelectionOffset(client, data);
                if (this.options.following) {
                    this.updateSelectedNodesPosition(offset);
                }
                else {
                    this.updateContainerPosition(offset);
                }
                if (offset.dx) {
                    data.clientX = client.x;
                }
                if (offset.dy) {
                    data.clientY = client.y;
                }
                this.notifyBoxEvent('box:mousemove', evt, client.x, client.y);
                break;
            }
            default:
                break;
        }
        this.boxesUpdated = false;
    };
    Selection.prototype.translateSelectedNodes = function (dx, dy, exclude, otherOptions) {
        var _this = this;
        var map = {};
        var excluded = [];
        if (exclude) {
            map[exclude.id] = true;
        }
        this.collection.toArray().forEach(function (cell) {
            cell.getDescendants({ deep: true }).forEach(function (child) {
                map[child.id] = true;
            });
        });
        if (otherOptions && otherOptions.translateBy) {
            var currentCell = this.graph.getCellById(otherOptions.translateBy);
            if (currentCell) {
                map[currentCell.id] = true;
                currentCell.getDescendants({ deep: true }).forEach(function (child) {
                    map[child.id] = true;
                });
                excluded.push(currentCell);
            }
        }
        this.collection.toArray().forEach(function (cell) {
            if (!map[cell.id]) {
                var options_1 = __assign(__assign({}, otherOptions), { selection: _this.cid, exclude: excluded });
                cell.translate(dx, dy, options_1);
                _this.graph.model.getConnectedEdges(cell).forEach(function (edge) {
                    if (!map[edge.id]) {
                        edge.translate(dx, dy, options_1);
                        map[edge.id] = true;
                    }
                });
            }
        });
    };
    Selection.prototype.getCellViewsInArea = function (rect) {
        var graph = this.graph;
        var options = {
            strict: this.options.strict,
        };
        var views = [];
        if (this.options.rubberNode) {
            if (this.options.useCellGeometry) {
                views = views.concat(graph.model
                    .getNodesInArea(rect, options)
                    .map(function (node) { return graph.renderer.findViewByCell(node); })
                    .filter(function (view) { return view != null; }));
            }
            else {
                views = views.concat(graph.renderer.findViewsInArea(rect, options));
            }
        }
        if (this.options.rubberEdge) {
            if (this.options.useCellGeometry) {
                views = views.concat(graph.model
                    .getEdgesInArea(rect, options)
                    .map(function (edge) { return graph.renderer.findViewByCell(edge); })
                    .filter(function (view) { return view != null; }));
            }
            else {
                views = views.concat(graph.renderer.findEdgeViewsInArea(rect, options));
            }
        }
        return views;
    };
    Selection.prototype.notifyBoxEvent = function (name, e, x, y) {
        var data = this.getEventData(e);
        var view = data.activeView;
        this.trigger(name, { e: e, view: view, x: x, y: y, cell: view.cell });
    };
    Selection.prototype.getSelectedClassName = function (cell) {
        return this.prefixClassName((cell.isNode() ? 'node' : 'edge') + "-selected");
    };
    Selection.prototype.addCellSelectedClassName = function (cell) {
        var view = this.graph.renderer.findViewByCell(cell);
        if (view) {
            view.addClass(this.getSelectedClassName(cell));
        }
    };
    Selection.prototype.removeCellUnSelectedClassName = function (cell) {
        var view = this.graph.renderer.findViewByCell(cell);
        if (view) {
            view.removeClass(this.getSelectedClassName(cell));
        }
    };
    Selection.prototype.destroySelectionBox = function (cell) {
        this.removeCellUnSelectedClassName(cell);
        if (this.canShowSelectionBox(cell)) {
            this.$container.find("[data-cell-id=\"" + cell.id + "\"]").remove();
            if (this.$boxes.length === 0) {
                this.hide();
            }
            this.boxCount = Math.max(0, this.boxCount - 1);
        }
    };
    Selection.prototype.destroyAllSelectionBoxes = function (cells) {
        var _this = this;
        cells.forEach(function (cell) { return _this.removeCellUnSelectedClassName(cell); });
        this.hide();
        this.$boxes.remove();
        this.boxCount = 0;
    };
    Selection.prototype.hide = function () {
        this.$container
            .removeClass(this.prefixClassName(Private.classNames.rubberband))
            .removeClass(this.prefixClassName(Private.classNames.selected));
    };
    Selection.prototype.showRubberband = function () {
        this.$container.addClass(this.prefixClassName(Private.classNames.rubberband));
    };
    Selection.prototype.hideRubberband = function () {
        this.$container.removeClass(this.prefixClassName(Private.classNames.rubberband));
    };
    Selection.prototype.showSelected = function () {
        this.$container
            .removeAttr('style')
            .addClass(this.prefixClassName(Private.classNames.selected));
    };
    Selection.prototype.createContainer = function () {
        this.container = document.createElement('div');
        this.$container = this.$(this.container);
        this.$container.addClass(this.prefixClassName(Private.classNames.root));
        if (this.options.className) {
            this.$container.addClass(this.options.className);
        }
        this.$selectionContainer = this.$('<div/>').addClass(this.prefixClassName(Private.classNames.inner));
        this.$selectionContent = this.$('<div/>').addClass(this.prefixClassName(Private.classNames.content));
        this.$selectionContainer.append(this.$selectionContent);
        this.$selectionContainer.attr('data-selection-length', this.collection.length);
        this.$container.prepend(this.$selectionContainer);
        this.$handleContainer = this.$selectionContainer;
    };
    Selection.prototype.updateContainerPosition = function (offset) {
        if (offset.dx || offset.dy) {
            this.$selectionContainer.css({
                left: "+=" + offset.dx,
                top: "+=" + offset.dy,
            });
        }
    };
    Selection.prototype.updateContainer = function () {
        var _this = this;
        var origin = { x: Infinity, y: Infinity };
        var corner = { x: 0, y: 0 };
        var cells = this.collection
            .toArray()
            .filter(function (cell) { return _this.canShowSelectionBox(cell); });
        cells.forEach(function (cell) {
            var view = _this.graph.renderer.findViewByCell(cell);
            if (view) {
                var bbox = view.getBBox({
                    useCellGeometry: _this.options.useCellGeometry,
                });
                origin.x = Math.min(origin.x, bbox.x);
                origin.y = Math.min(origin.y, bbox.y);
                corner.x = Math.max(corner.x, bbox.x + bbox.width);
                corner.y = Math.max(corner.y, bbox.y + bbox.height);
            }
        });
        this.$selectionContainer
            .css({
            position: 'absolute',
            pointerEvents: 'none',
            left: origin.x,
            top: origin.y,
            width: corner.x - origin.x,
            height: corner.y - origin.y,
        })
            .attr('data-selection-length', this.collection.length);
        var boxContent = this.options.content;
        if (boxContent) {
            if (typeof boxContent === 'function') {
                var content = util_1.FunctionExt.call(boxContent, this.graph, this, this.$selectionContent[0]);
                if (content) {
                    this.$selectionContent.html(content);
                }
            }
            else {
                this.$selectionContent.html(boxContent);
            }
        }
        if (this.collection.length > 0 && !this.container.parentNode) {
            this.$container.appendTo(this.graph.container);
        }
        else if (this.collection.length <= 0 && this.container.parentNode) {
            this.container.parentNode.removeChild(this.container);
        }
    };
    Selection.prototype.canShowSelectionBox = function (cell) {
        return ((cell.isNode() && this.options.showNodeSelectionBox === true) ||
            (cell.isEdge() && this.options.showEdgeSelectionBox === true));
    };
    Selection.prototype.createSelectionBox = function (cell) {
        this.addCellSelectedClassName(cell);
        if (this.canShowSelectionBox(cell)) {
            var view = this.graph.renderer.findViewByCell(cell);
            if (view) {
                var bbox = view.getBBox({
                    useCellGeometry: this.options.useCellGeometry,
                });
                var className = this.boxClassName;
                this.$('<div/>')
                    .addClass(className)
                    .addClass(className + "-" + (cell.isNode() ? 'node' : 'edge'))
                    .attr('data-cell-id', cell.id)
                    .css({
                    position: 'absolute',
                    left: bbox.x,
                    top: bbox.y,
                    width: bbox.width,
                    height: bbox.height,
                    pointerEvents: this.options.pointerEvents || 'auto',
                })
                    .appendTo(this.container);
                this.showSelected();
                this.boxCount += 1;
            }
        }
    };
    Selection.prototype.updateSelectionBoxes = function (options) {
        if (options === void 0) { options = {}; }
        if (this.collection.length > 0) {
            this.boxesUpdated = true;
            this.graph.renderer.requestViewUpdate(this, 1, 2, options);
        }
    };
    Selection.prototype.confirmUpdate = function () {
        var _this = this;
        if (this.boxCount) {
            this.hide();
            this.$boxes.each(function (_, elem) {
                var cellId = _this.$(elem).remove().attr('data-cell-id');
                var cell = _this.collection.get(cellId);
                if (cell) {
                    _this.createSelectionBox(cell);
                }
            });
            this.updateContainer();
        }
        return 0;
    };
    Selection.prototype.getCellViewFromElem = function (elem) {
        var id = elem.getAttribute('data-cell-id');
        if (id) {
            var cell = this.collection.get(id);
            if (cell) {
                return this.graph.renderer.findViewByCell(cell);
            }
        }
        return null;
    };
    Selection.prototype.onCellRemoved = function (_a) {
        var cell = _a.cell;
        this.destroySelectionBox(cell);
        this.updateContainer();
    };
    Selection.prototype.onReseted = function (_a) {
        var _this = this;
        var previous = _a.previous, current = _a.current;
        this.destroyAllSelectionBoxes(previous);
        current.forEach(function (cell) {
            _this.listenCellRemoveEvent(cell);
            _this.createSelectionBox(cell);
        });
        this.updateContainer();
    };
    Selection.prototype.onCellAdded = function (_a) {
        var cell = _a.cell;
        // The collection do not known the cell was removed when cell was
        // removed by interaction(such as, by "delete" shortcut), so we should
        // manually listen to cell's remove evnet.
        this.listenCellRemoveEvent(cell);
        this.createSelectionBox(cell);
        this.updateContainer();
    };
    Selection.prototype.listenCellRemoveEvent = function (cell) {
        cell.off('removed', this.onCellRemoved, this);
        cell.on('removed', this.onCellRemoved, this);
    };
    Selection.prototype.onCollectionUpdated = function (_a) {
        var _this = this;
        var added = _a.added, removed = _a.removed, options = _a.options;
        added.forEach(function (cell) {
            _this.trigger('cell:selected', { cell: cell, options: options });
            _this.graph.trigger('cell:selected', { cell: cell, options: options });
            if (cell.isNode()) {
                _this.trigger('node:selected', { cell: cell, options: options, node: cell });
                _this.graph.trigger('node:selected', { cell: cell, options: options, node: cell });
            }
            else if (cell.isEdge()) {
                _this.trigger('edge:selected', { cell: cell, options: options, edge: cell });
                _this.graph.trigger('edge:selected', { cell: cell, options: options, edge: cell });
            }
        });
        removed.forEach(function (cell) {
            _this.trigger('cell:unselected', { cell: cell, options: options });
            _this.graph.trigger('cell:unselected', { cell: cell, options: options });
            if (cell.isNode()) {
                _this.trigger('node:unselected', { cell: cell, options: options, node: cell });
                _this.graph.trigger('node:unselected', { cell: cell, options: options, node: cell });
            }
            else if (cell.isEdge()) {
                _this.trigger('edge:unselected', { cell: cell, options: options, edge: cell });
                _this.graph.trigger('edge:unselected', { cell: cell, options: options, edge: cell });
            }
        });
        var args = {
            added: added,
            removed: removed,
            options: options,
            selected: this.cells.filter(function (cell) { return !!_this.graph.getCellById(cell.id); }),
        };
        this.trigger('selection:changed', args);
        this.graph.trigger('selection:changed', args);
    };
    // #region handle
    Selection.prototype.deleteSelectedCells = function () {
        var cells = this.collection.toArray();
        this.clean();
        this.graph.model.removeCells(cells, { selection: this.cid });
    };
    Selection.prototype.startRotate = function (_a) {
        var e = _a.e;
        var cells = this.collection.toArray();
        var center = cell_1.Cell.getCellsBBox(cells).getCenter();
        var client = this.graph.snapToGrid(e.clientX, e.clientY);
        var angles = cells.reduce(function (memo, cell) {
            memo[cell.id] = geometry_1.Angle.normalize(cell.getAngle());
            return memo;
        }, {});
        this.setEventData(e, {
            center: center,
            angles: angles,
            start: client.theta(center),
        });
    };
    Selection.prototype.doRotate = function (_a) {
        var _this = this;
        var e = _a.e;
        var data = this.getEventData(e);
        var grid = this.graph.options.rotating.grid;
        var gridSize = typeof grid === 'function'
            ? util_1.FunctionExt.call(grid, this.graph, null)
            : grid;
        var client = this.graph.snapToGrid(e.clientX, e.clientY);
        var delta = data.start - client.theta(data.center);
        if (!data.rotated) {
            data.rotated = true;
        }
        if (Math.abs(delta) > 0.001) {
            this.collection.toArray().forEach(function (node) {
                var angle = global_1.Util.snapToGrid(data.angles[node.id] + delta, gridSize || 15);
                node.rotate(angle, {
                    absolute: true,
                    center: data.center,
                    selection: _this.cid,
                });
            });
            this.updateSelectionBoxes();
        }
    };
    Selection.prototype.stopRotate = function (_a) {
        var _this = this;
        var e = _a.e;
        var data = this.getEventData(e);
        if (data.rotated) {
            data.rotated = false;
            this.collection.toArray().forEach(function (node) {
                (0, util_2.notify)('node:rotated', e, _this.graph.findViewByCell(node));
            });
        }
    };
    Selection.prototype.startResize = function (_a) {
        var e = _a.e;
        var gridSize = this.graph.getGridSize();
        var cells = this.collection.toArray();
        var bbox = cell_1.Cell.getCellsBBox(cells);
        var bboxes = cells.map(function (cell) { return cell.getBBox(); });
        var maxWidth = bboxes.reduce(function (maxWidth, bbox) {
            return bbox.width < maxWidth ? bbox.width : maxWidth;
        }, Infinity);
        var maxHeight = bboxes.reduce(function (maxHeight, bbox) {
            return bbox.height < maxHeight ? bbox.height : maxHeight;
        }, Infinity);
        this.setEventData(e, {
            bbox: bbox,
            cells: this.graph.model.getSubGraph(cells),
            minWidth: (gridSize * bbox.width) / maxWidth,
            minHeight: (gridSize * bbox.height) / maxHeight,
        });
    };
    Selection.prototype.doResize = function (_a) {
        var e = _a.e, dx = _a.dx, dy = _a.dy;
        var data = this.eventData(e);
        var bbox = data.bbox;
        var width = bbox.width;
        var height = bbox.height;
        var newWidth = Math.max(width + dx, data.minWidth);
        var newHeight = Math.max(height + dy, data.minHeight);
        if (!data.resized) {
            data.resized = true;
        }
        if (Math.abs(width - newWidth) > 0.001 ||
            Math.abs(height - newHeight) > 0.001) {
            this.graph.model.resizeCells(newWidth, newHeight, data.cells, {
                selection: this.cid,
            });
            bbox.width = newWidth;
            bbox.height = newHeight;
            this.updateSelectionBoxes();
        }
    };
    Selection.prototype.stopResize = function (_a) {
        var _this = this;
        var e = _a.e;
        var data = this.eventData(e);
        if (data.resized) {
            data.resized = false;
            this.collection.toArray().forEach(function (node) {
                (0, util_2.notify)('node:resized', e, _this.graph.findViewByCell(node));
            });
        }
    };
    // #endregion
    Selection.prototype.dispose = function () {
        this.clean();
        this.remove();
    };
    __decorate([
        view_1.View.dispose()
    ], Selection.prototype, "dispose", null);
    return Selection;
}(view_1.View));
exports.Selection = Selection;
util_1.ObjectExt.applyMixins(Selection, common_1.Handle);
// private
// -------
var Private;
(function (Private) {
    var base = 'widget-selection';
    Private.classNames = {
        root: base,
        inner: base + "-inner",
        box: base + "-box",
        content: base + "-content",
        rubberband: base + "-rubberband",
        selected: base + "-selected",
    };
    Private.documentEvents = {
        mousemove: 'adjustSelection',
        touchmove: 'adjustSelection',
        mouseup: 'onMouseUp',
        touchend: 'onMouseUp',
        touchcancel: 'onMouseUp',
    };
    Private.defaultOptions = {
        movable: true,
        following: true,
        strict: false,
        useCellGeometry: false,
        content: function (selection) {
            return util_1.StringExt.template('<%= length %> node<%= length > 1 ? "s":"" %> selected.')({ length: selection.length });
        },
        handles: [
            {
                name: 'remove',
                position: 'nw',
                events: {
                    mousedown: 'deleteSelectedCells',
                },
            },
            {
                name: 'rotate',
                position: 'sw',
                events: {
                    mousedown: 'startRotate',
                    mousemove: 'doRotate',
                    mouseup: 'stopRotate',
                },
            },
            {
                name: 'resize',
                position: 'se',
                events: {
                    mousedown: 'startResize',
                    mousemove: 'doResize',
                    mouseup: 'stopResize',
                },
            },
        ],
    };
    function depthComparator(cell) {
        return cell.getAncestors().length;
    }
    Private.depthComparator = depthComparator;
})(Private || (Private = {}));
//# sourceMappingURL=index.js.map