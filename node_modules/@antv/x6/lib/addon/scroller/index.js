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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Scroller = void 0;
var util_1 = require("../../util");
var geometry_1 = require("../../geometry");
var view_1 = require("../../view/view");
var renderer_1 = require("../../graph/renderer");
var view_2 = require("../../graph/view");
var background_1 = require("../../graph/background");
var Scroller = /** @class */ (function (_super) {
    __extends(Scroller, _super);
    function Scroller(options) {
        var _this = _super.call(this) || this;
        _this.padding = { left: 0, top: 0, right: 0, bottom: 0 };
        _this.options = Util.getOptions(options);
        var scale = _this.graph.transform.getScale();
        _this.sx = scale.sx;
        _this.sy = scale.sy;
        var width = _this.options.width || _this.graph.options.width;
        var height = _this.options.height || _this.graph.options.height;
        _this.container = document.createElement('div');
        _this.$container = _this.$(_this.container)
            .addClass(_this.prefixClassName(Util.containerClass))
            .css({ width: width, height: height });
        if (_this.options.pageVisible) {
            _this.$container.addClass(_this.prefixClassName(Util.pagedClass));
        }
        if (_this.options.className) {
            _this.$container.addClass(_this.options.className);
        }
        var graphContainer = _this.graph.container;
        if (graphContainer.parentNode) {
            _this.$container.insertBefore(graphContainer);
        }
        // copy style
        var style = graphContainer.getAttribute('style');
        if (style) {
            var obj_1 = {};
            var styles = style.split(';');
            styles.forEach(function (item) {
                var section = item.trim();
                if (section) {
                    var pair = section.split(':');
                    if (pair.length) {
                        obj_1[pair[0].trim()] = pair[1] ? pair[1].trim() : '';
                    }
                }
            });
            Object.keys(obj_1).forEach(function (key) {
                if (key === 'width' || key === 'height') {
                    return;
                }
                graphContainer.style[key] = '';
                _this.container.style[key] = obj_1[key];
            });
        }
        _this.content = document.createElement('div');
        _this.$content = _this.$(_this.content)
            .addClass(_this.prefixClassName(Util.contentClass))
            .css({
            width: _this.graph.options.width,
            height: _this.graph.options.height,
        });
        // custom background
        _this.background = document.createElement('div');
        _this.$background = _this.$(_this.background).addClass(_this.prefixClassName(Util.backgroundClass));
        _this.$content.append(_this.background);
        if (!_this.options.pageVisible) {
            _this.$content.append(_this.graph.view.grid);
        }
        _this.$content.append(graphContainer);
        _this.$content.appendTo(_this.container);
        _this.startListening();
        if (!_this.options.pageVisible) {
            _this.graph.grid.update();
        }
        _this.backgroundManager = new Scroller.Background(_this);
        if (!_this.options.autoResize) {
            _this.update();
        }
        return _this;
    }
    Object.defineProperty(Scroller.prototype, "graph", {
        get: function () {
            return this.options.graph;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Scroller.prototype, "model", {
        get: function () {
            return this.graph.model;
        },
        enumerable: false,
        configurable: true
    });
    Scroller.prototype.startListening = function () {
        var graph = this.graph;
        var model = this.model;
        graph.on('scale', this.onScale, this);
        graph.on('resize', this.onResize, this);
        graph.on('before:print', this.storeScrollPosition, this);
        graph.on('before:export', this.storeScrollPosition, this);
        graph.on('after:print', this.restoreScrollPosition, this);
        graph.on('after:export', this.restoreScrollPosition, this);
        graph.on('render:done', this.onRenderDone, this);
        graph.on('unfreeze', this.onUpdate, this);
        model.on('reseted', this.onUpdate, this);
        model.on('cell:added', this.onUpdate, this);
        model.on('cell:removed', this.onUpdate, this);
        model.on('cell:changed', this.onUpdate, this);
        model.on('batch:stop', this.onBatchStop, this);
        this.delegateBackgroundEvents();
    };
    Scroller.prototype.stopListening = function () {
        var graph = this.graph;
        var model = this.model;
        graph.off('scale', this.onScale, this);
        graph.off('resize', this.onResize, this);
        graph.off('beforeprint', this.storeScrollPosition, this);
        graph.off('beforeexport', this.storeScrollPosition, this);
        graph.off('afterprint', this.restoreScrollPosition, this);
        graph.off('afterexport', this.restoreScrollPosition, this);
        graph.off('render:done', this.onRenderDone, this);
        graph.off('unfreeze', this.onUpdate, this);
        model.off('reseted', this.onUpdate, this);
        model.off('cell:added', this.onUpdate, this);
        model.off('cell:removed', this.onUpdate, this);
        model.off('cell:changed', this.onUpdate, this);
        model.off('batch:stop', this.onBatchStop, this);
        this.undelegateBackgroundEvents();
    };
    Scroller.prototype.enableAutoResize = function () {
        this.options.autoResize = true;
    };
    Scroller.prototype.disableAutoResize = function () {
        this.options.autoResize = false;
    };
    Scroller.prototype.onUpdate = function () {
        if (this.graph.isAsync() || !this.options.autoResize) {
            return;
        }
        this.update();
    };
    Scroller.prototype.onBatchStop = function (args) {
        if (this.graph.isAsync() || !this.options.autoResize) {
            return;
        }
        if (renderer_1.Renderer.UPDATE_DELAYING_BATCHES.includes(args.name)) {
            this.update();
        }
    };
    Scroller.prototype.delegateBackgroundEvents = function (events) {
        var _this = this;
        var evts = events || view_2.GraphView.events;
        this.delegatedHandlers = Object.keys(evts).reduce(function (memo, name) {
            var handler = evts[name];
            if (name.indexOf(' ') === -1) {
                if (typeof handler === 'function') {
                    memo[name] = handler;
                }
                else {
                    var method = _this.graph.view[handler];
                    if (typeof method === 'function') {
                        method = method.bind(_this.graph.view);
                        memo[name] = method;
                    }
                }
            }
            return memo;
        }, {});
        this.onBackgroundEvent = this.onBackgroundEvent.bind(this);
        Object.keys(this.delegatedHandlers).forEach(function (name) {
            _this.delegateEvent(name, {
                guarded: false,
            }, _this.onBackgroundEvent);
        });
    };
    Scroller.prototype.undelegateBackgroundEvents = function () {
        var _this = this;
        Object.keys(this.delegatedHandlers).forEach(function (name) {
            _this.undelegateEvent(name, _this.onBackgroundEvent);
        });
    };
    Scroller.prototype.onBackgroundEvent = function (e) {
        var valid = false;
        var target = e.target;
        if (!this.options.pageVisible) {
            var view = this.graph.view;
            valid = view.background === target || view.grid === target;
        }
        else if (this.options.background) {
            valid = this.background === target;
        }
        else {
            valid = this.content === target;
        }
        if (valid) {
            var handler = this.delegatedHandlers[e.type];
            if (typeof handler === 'function') {
                handler.apply(this.graph, arguments); // eslint-disable-line
            }
        }
    };
    Scroller.prototype.onRenderDone = function (_a) {
        var stats = _a.stats;
        if (this.options.autoResize && stats.priority < 2) {
            this.update();
        }
    };
    Scroller.prototype.onResize = function () {
        if (this.cachedCenterPoint) {
            this.centerPoint(this.cachedCenterPoint.x, this.cachedCenterPoint.y);
            this.updatePageBreak();
        }
    };
    Scroller.prototype.onScale = function (_a) {
        var sx = _a.sx, sy = _a.sy, ox = _a.ox, oy = _a.oy;
        this.updateScale(sx, sy);
        if (ox || oy) {
            this.centerPoint(ox, oy);
            this.updatePageBreak();
        }
        var autoResizeOptions = this.options.autoResizeOptions || this.options.fitTocontentOptions;
        if (typeof autoResizeOptions === 'function') {
            this.update();
        }
    };
    Scroller.prototype.storeScrollPosition = function () {
        this.cachedScrollLeft = this.container.scrollLeft;
        this.cachedScrollTop = this.container.scrollTop;
    };
    Scroller.prototype.restoreScrollPosition = function () {
        this.container.scrollLeft = this.cachedScrollLeft;
        this.container.scrollTop = this.cachedScrollTop;
        this.cachedScrollLeft = null;
        this.cachedScrollTop = null;
    };
    Scroller.prototype.storeClientSize = function () {
        this.cachedClientSize = {
            width: this.container.clientWidth,
            height: this.container.clientHeight,
        };
    };
    Scroller.prototype.restoreClientSize = function () {
        this.cachedClientSize = null;
    };
    Scroller.prototype.beforeManipulation = function () {
        if (util_1.Platform.IS_IE || util_1.Platform.IS_EDGE) {
            this.$container.css('visibility', 'hidden');
        }
    };
    Scroller.prototype.afterManipulation = function () {
        if (util_1.Platform.IS_IE || util_1.Platform.IS_EDGE) {
            this.$container.css('visibility', 'visible');
        }
    };
    Scroller.prototype.updatePageSize = function (width, height) {
        if (width != null) {
            this.options.pageWidth = width;
        }
        if (height != null) {
            this.options.pageHeight = height;
        }
        this.updatePageBreak();
    };
    Scroller.prototype.updatePageBreak = function () {
        if (this.pageBreak && this.pageBreak.parentNode) {
            this.pageBreak.parentNode.removeChild(this.pageBreak);
        }
        this.pageBreak = null;
        if (this.options.pageVisible && this.options.pageBreak) {
            var graphWidth = this.graph.options.width;
            var graphHeight = this.graph.options.height;
            var pageWidth = this.options.pageWidth * this.sx;
            var pageHeight = this.options.pageHeight * this.sy;
            if (pageWidth === 0 || pageHeight === 0) {
                return;
            }
            if (graphWidth > pageWidth || graphHeight > pageHeight) {
                var hasPageBreak = false;
                var container = document.createElement('div');
                for (var i = 1, l = Math.floor(graphWidth / pageWidth); i < l; i += 1) {
                    this.$('<div/>')
                        .addClass(this.prefixClassName("graph-pagebreak-vertical"))
                        .css({ left: i * pageWidth })
                        .appendTo(container);
                    hasPageBreak = true;
                }
                for (var i = 1, l = Math.floor(graphHeight / pageHeight); i < l; i += 1) {
                    this.$('<div/>')
                        .addClass(this.prefixClassName("graph-pagebreak-horizontal"))
                        .css({ top: i * pageHeight })
                        .appendTo(container);
                    hasPageBreak = true;
                }
                if (hasPageBreak) {
                    util_1.Dom.addClass(container, this.prefixClassName('graph-pagebreak'));
                    this.$(this.graph.view.grid).after(container);
                    this.pageBreak = container;
                }
            }
        }
    };
    Scroller.prototype.update = function () {
        var size = this.getClientSize();
        this.cachedCenterPoint = this.clientToLocalPoint(size.width / 2, size.height / 2);
        var resizeOptions = this.options.autoResizeOptions || this.options.fitTocontentOptions;
        if (typeof resizeOptions === 'function') {
            resizeOptions = util_1.FunctionExt.call(resizeOptions, this, this);
        }
        var options = __assign({ gridWidth: this.options.pageWidth, gridHeight: this.options.pageHeight, allowNewOrigin: 'negative', contentArea: this.calcContextArea(resizeOptions) }, resizeOptions);
        this.graph.fitToContent(this.getFitToContentOptions(options));
    };
    Scroller.prototype.calcContextArea = function (resizeOptions) {
        var direction = resizeOptions === null || resizeOptions === void 0 ? void 0 : resizeOptions.direction;
        if (!direction) {
            return this.graph.transform.getContentArea(resizeOptions);
        }
        function getCellBBox(cell) {
            var rect = cell.getBBox();
            if (rect) {
                if (cell.isNode()) {
                    var angle = cell.getAngle();
                    if (angle != null && angle !== 0) {
                        rect = rect.bbox(angle);
                    }
                }
            }
            return rect;
        }
        var gridWidth = this.options.pageWidth || 1;
        var gridHeight = this.options.pageHeight || 1;
        var calculativeCells = this.graph.getCells();
        if (!direction.includes('top')) {
            calculativeCells = calculativeCells.filter(function (cell) {
                var bbox = getCellBBox(cell);
                return bbox.y >= 0;
            });
        }
        if (!direction.includes('left')) {
            calculativeCells = calculativeCells.filter(function (cell) {
                var bbox = getCellBBox(cell);
                return bbox.x >= 0;
            });
        }
        if (!direction.includes('right')) {
            calculativeCells = calculativeCells.filter(function (cell) {
                var bbox = getCellBBox(cell);
                return bbox.x + bbox.width <= gridWidth;
            });
        }
        if (!direction.includes('bottom')) {
            calculativeCells = calculativeCells.filter(function (cell) {
                var bbox = getCellBBox(cell);
                return bbox.y + bbox.height <= gridHeight;
            });
        }
        return this.model.getCellsBBox(calculativeCells) || new geometry_1.Rectangle();
    };
    Scroller.prototype.getFitToContentOptions = function (options) {
        var sx = this.sx;
        var sy = this.sy;
        options.gridWidth && (options.gridWidth *= sx);
        options.gridHeight && (options.gridHeight *= sy);
        options.minWidth && (options.minWidth *= sx);
        options.minHeight && (options.minHeight *= sy);
        if (typeof options.padding === 'object') {
            options.padding = {
                left: (options.padding.left || 0) * sx,
                right: (options.padding.right || 0) * sx,
                top: (options.padding.top || 0) * sy,
                bottom: (options.padding.bottom || 0) * sy,
            };
        }
        else if (typeof options.padding === 'number') {
            options.padding *= sx;
        }
        if (!this.options.autoResize) {
            options.contentArea = geometry_1.Rectangle.create();
        }
        return options;
    };
    Scroller.prototype.updateScale = function (sx, sy) {
        var options = this.graph.options;
        var dx = sx / this.sx;
        var dy = sy / this.sy;
        this.sx = sx;
        this.sy = sy;
        this.graph.translate(options.x * dx, options.y * dy);
        this.graph.resizeGraph(options.width * dx, options.height * dy);
    };
    Scroller.prototype.scrollbarPosition = function (left, top, options) {
        if (left == null && top == null) {
            return {
                left: this.container.scrollLeft,
                top: this.container.scrollTop,
            };
        }
        var prop = {};
        if (typeof left === 'number') {
            prop.scrollLeft = left;
        }
        if (typeof top === 'number') {
            prop.scrollTop = top;
        }
        if (options && options.animation) {
            this.$container.animate(prop, options.animation);
        }
        else {
            this.$container.prop(prop);
        }
        return this;
    };
    /**
     * Try to scroll to ensure that the position (x,y) on the graph (in local
     * coordinates) is at the center of the viewport. If only one of the
     * coordinates is specified, only scroll in the specified dimension and
     * keep the other coordinate unchanged.
     */
    Scroller.prototype.scrollToPoint = function (x, y, options) {
        var size = this.getClientSize();
        var ctm = this.graph.matrix();
        var prop = {};
        if (typeof x === 'number') {
            prop.scrollLeft = x - size.width / 2 + ctm.e + (this.padding.left || 0);
        }
        if (typeof y === 'number') {
            prop.scrollTop = y - size.height / 2 + ctm.f + (this.padding.top || 0);
        }
        if (options && options.animation) {
            this.$container.animate(prop, options.animation);
        }
        else {
            this.$container.prop(prop);
        }
        return this;
    };
    /**
     * Try to scroll to ensure that the center of graph content is at the
     * center of the viewport.
     */
    Scroller.prototype.scrollToContent = function (options) {
        var sx = this.sx;
        var sy = this.sy;
        var center = this.graph.getContentArea().getCenter();
        return this.scrollToPoint(center.x * sx, center.y * sy, options);
    };
    /**
     * Try to scroll to ensure that the center of cell is at the center of
     * the viewport.
     */
    Scroller.prototype.scrollToCell = function (cell, options) {
        var sx = this.sx;
        var sy = this.sy;
        var center = cell.getBBox().getCenter();
        return this.scrollToPoint(center.x * sx, center.y * sy, options);
    };
    /**
     * The center methods are more aggressive than the scroll methods. These
     * methods position the graph so that a specific point on the graph lies
     * at the center of the viewport, adding paddings around the paper if
     * necessary (e.g. if the requested point lies in a corner of the paper).
     * This means that the requested point will always move into the center
     * of the viewport. (Use the scroll functions to avoid adding paddings
     * and only scroll the viewport as far as the graph boundary.)
     */
    /**
     * Position the center of graph to the center of the viewport.
     */
    Scroller.prototype.center = function (optons) {
        return this.centerPoint(optons);
    };
    Scroller.prototype.centerPoint = function (x, y, options) {
        var ctm = this.graph.matrix();
        var sx = ctm.a;
        var sy = ctm.d;
        var tx = -ctm.e;
        var ty = -ctm.f;
        var tWidth = tx + this.graph.options.width;
        var tHeight = ty + this.graph.options.height;
        var localOptions;
        this.storeClientSize(); // avoid multilple reflow
        if (typeof x === 'number' || typeof y === 'number') {
            localOptions = options;
            var visibleCenter = this.getVisibleArea().getCenter();
            if (typeof x === 'number') {
                x *= sx; // eslint-disable-line
            }
            else {
                x = visibleCenter.x; // eslint-disable-line
            }
            if (typeof y === 'number') {
                y *= sy; // eslint-disable-line
            }
            else {
                y = visibleCenter.y; // eslint-disable-line
            }
        }
        else {
            localOptions = x;
            x = (tx + tWidth) / 2; // eslint-disable-line
            y = (ty + tHeight) / 2; // eslint-disable-line
        }
        if (localOptions && localOptions.padding) {
            return this.positionPoint({ x: x, y: y }, '50%', '50%', localOptions);
        }
        var padding = this.getPadding();
        var clientSize = this.getClientSize();
        var cx = clientSize.width / 2;
        var cy = clientSize.height / 2;
        var left = cx - padding.left - x + tx;
        var right = cx - padding.right + x - tWidth;
        var top = cy - padding.top - y + ty;
        var bottom = cy - padding.bottom + y - tHeight;
        this.addPadding(Math.max(left, 0), Math.max(right, 0), Math.max(top, 0), Math.max(bottom, 0));
        var result = this.scrollToPoint(x, y, localOptions || undefined);
        this.restoreClientSize();
        return result;
    };
    Scroller.prototype.centerContent = function (options) {
        return this.positionContent('center', options);
    };
    Scroller.prototype.centerCell = function (cell, options) {
        return this.positionCell(cell, 'center', options);
    };
    /**
     * The position methods are a more general version of the center methods.
     * They position the graph so that a specific point on the graph lies at
     * requested coordinates inside the viewport.
     */
    /**
     *
     */
    Scroller.prototype.positionContent = function (pos, options) {
        var rect = this.graph.getContentArea(options);
        return this.positionRect(rect, pos, options);
    };
    Scroller.prototype.positionCell = function (cell, pos, options) {
        var bbox = cell.getBBox();
        return this.positionRect(bbox, pos, options);
    };
    Scroller.prototype.positionRect = function (rect, pos, options) {
        var bbox = geometry_1.Rectangle.create(rect);
        switch (pos) {
            case 'center':
                return this.positionPoint(bbox.getCenter(), '50%', '50%', options);
            case 'top':
                return this.positionPoint(bbox.getTopCenter(), '50%', 0, options);
            case 'top-right':
                return this.positionPoint(bbox.getTopRight(), '100%', 0, options);
            case 'right':
                return this.positionPoint(bbox.getRightMiddle(), '100%', '50%', options);
            case 'bottom-right':
                return this.positionPoint(bbox.getBottomRight(), '100%', '100%', options);
            case 'bottom':
                return this.positionPoint(bbox.getBottomCenter(), '50%', '100%', options);
            case 'bottom-left':
                return this.positionPoint(bbox.getBottomLeft(), 0, '100%', options);
            case 'left':
                return this.positionPoint(bbox.getLeftMiddle(), 0, '50%', options);
            case 'top-left':
                return this.positionPoint(bbox.getTopLeft(), 0, 0, options);
            default:
                return this;
        }
    };
    Scroller.prototype.positionPoint = function (point, x, y, options) {
        if (options === void 0) { options = {}; }
        var pad = options.padding, localOptions = __rest(options, ["padding"]);
        var padding = util_1.NumberExt.normalizeSides(pad);
        var clientRect = geometry_1.Rectangle.fromSize(this.getClientSize());
        var targetRect = clientRect.clone().moveAndExpand({
            x: padding.left,
            y: padding.top,
            width: -padding.right - padding.left,
            height: -padding.top - padding.bottom,
        });
        // eslint-disable-next-line
        x = util_1.NumberExt.normalizePercentage(x, Math.max(0, targetRect.width));
        if (x < 0) {
            x = targetRect.width + x; // eslint-disable-line
        }
        // eslint-disable-next-line
        y = util_1.NumberExt.normalizePercentage(y, Math.max(0, targetRect.height));
        if (y < 0) {
            y = targetRect.height + y; // eslint-disable-line
        }
        var origin = targetRect.getTopLeft().translate(x, y);
        var diff = clientRect.getCenter().diff(origin);
        var scale = this.zoom();
        var rawDiff = diff.scale(1 / scale, 1 / scale);
        var result = geometry_1.Point.create(point).translate(rawDiff);
        return this.centerPoint(result.x, result.y, localOptions);
    };
    Scroller.prototype.zoom = function (factor, options) {
        if (factor == null) {
            return this.sx;
        }
        options = options || {}; // eslint-disable-line
        var cx;
        var cy;
        var clientSize = this.getClientSize();
        var center = this.clientToLocalPoint(clientSize.width / 2, clientSize.height / 2);
        var sx = factor;
        var sy = factor;
        if (!options.absolute) {
            sx += this.sx;
            sy += this.sy;
        }
        if (options.scaleGrid) {
            sx = Math.round(sx / options.scaleGrid) * options.scaleGrid;
            sy = Math.round(sy / options.scaleGrid) * options.scaleGrid;
        }
        if (options.maxScale) {
            sx = Math.min(options.maxScale, sx);
            sy = Math.min(options.maxScale, sy);
        }
        if (options.minScale) {
            sx = Math.max(options.minScale, sx);
            sy = Math.max(options.minScale, sy);
        }
        sx = this.graph.transform.clampScale(sx);
        sy = this.graph.transform.clampScale(sy);
        if (options.center) {
            var fx = sx / this.sx;
            var fy = sy / this.sy;
            cx = options.center.x - (options.center.x - center.x) / fx;
            cy = options.center.y - (options.center.y - center.y) / fy;
        }
        else {
            cx = center.x;
            cy = center.y;
        }
        this.beforeManipulation();
        this.graph.transform.scale(sx, sy);
        this.centerPoint(cx, cy);
        this.afterManipulation();
        return this;
    };
    Scroller.prototype.zoomToRect = function (rect, options) {
        if (options === void 0) { options = {}; }
        var area = geometry_1.Rectangle.create(rect);
        var graph = this.graph;
        options.contentArea = area;
        if (options.viewportArea == null) {
            options.viewportArea = {
                x: graph.options.x,
                y: graph.options.y,
                width: this.$container.width(),
                height: this.$container.height(),
            };
        }
        this.beforeManipulation();
        graph.transform.scaleContentToFitImpl(options, false);
        var center = area.getCenter();
        this.centerPoint(center.x, center.y);
        this.afterManipulation();
        return this;
    };
    Scroller.prototype.zoomToFit = function (options) {
        if (options === void 0) { options = {}; }
        return this.zoomToRect(this.graph.getContentArea(options), options);
    };
    Scroller.prototype.transitionToPoint = function (x, y, options) {
        var _this = this;
        if (typeof x === 'object') {
            options = y; // eslint-disable-line
            y = x.y; // eslint-disable-line
            x = x.x; // eslint-disable-line
        }
        else {
            y = y; // eslint-disable-line
        }
        if (options == null) {
            options = {}; // eslint-disable-line
        }
        var transform;
        var transformOrigin;
        var scale = this.sx;
        var targetScale = Math.max(options.scale || scale, 0.000001);
        var clientSize = this.getClientSize();
        var targetPoint = new geometry_1.Point(x, y);
        var localPoint = this.clientToLocalPoint(clientSize.width / 2, clientSize.height / 2);
        if (scale === targetScale) {
            var translate = localPoint.diff(targetPoint).scale(scale, scale).round();
            transform = "translate(" + translate.x + "px," + translate.y + "px)";
        }
        else {
            var delta = (targetScale / (scale - targetScale)) * targetPoint.distance(localPoint);
            var range = localPoint.clone().move(targetPoint, delta);
            var origin_1 = this.localToBackgroundPoint(range).round();
            transform = "scale(" + targetScale / scale + ")";
            transformOrigin = origin_1.x + "px " + origin_1.y + "px";
        }
        var onTransitionEnd = options.onTransitionEnd;
        this.$container.addClass(Util.transitionClassName);
        this.$content
            .off(Util.transitionEventName)
            .on(Util.transitionEventName, function (e) {
            _this.syncTransition(targetScale, { x: x, y: y });
            if (typeof onTransitionEnd === 'function') {
                util_1.FunctionExt.call(onTransitionEnd, _this, e.originalEvent);
            }
        })
            .css({
            transform: transform,
            transformOrigin: transformOrigin,
            transition: 'transform',
            transitionDuration: options.duration || '1s',
            transitionDelay: options.delay,
            transitionTimingFunction: options.timing,
        });
        return this;
    };
    Scroller.prototype.syncTransition = function (scale, p) {
        this.beforeManipulation();
        this.graph.scale(scale);
        this.removeTransition();
        this.centerPoint(p.x, p.y);
        this.afterManipulation();
        return this;
    };
    Scroller.prototype.removeTransition = function () {
        this.$container.removeClass(Util.transitionClassName);
        this.$content.off(Util.transitionEventName).css({
            transform: '',
            transformOrigin: '',
            transition: '',
            transitionDuration: '',
            transitionDelay: '',
            transitionTimingFunction: '',
        });
        return this;
    };
    Scroller.prototype.transitionToRect = function (rectangle, options) {
        if (options === void 0) { options = {}; }
        var rect = geometry_1.Rectangle.create(rectangle);
        var maxScale = options.maxScale || Infinity;
        var minScale = options.minScale || Number.MIN_VALUE;
        var scaleGrid = options.scaleGrid || null;
        var PIXEL_SIZE = options.visibility || 1;
        var center = options.center
            ? geometry_1.Point.create(options.center)
            : rect.getCenter();
        var clientSize = this.getClientSize();
        var w = clientSize.width * PIXEL_SIZE;
        var h = clientSize.height * PIXEL_SIZE;
        var scale = new geometry_1.Rectangle(center.x - w / 2, center.y - h / 2, w, h).getMaxUniformScaleToFit(rect, center);
        scale = Math.min(scale, maxScale);
        if (scaleGrid) {
            scale = Math.floor(scale / scaleGrid) * scaleGrid;
        }
        scale = Math.max(minScale, scale);
        return this.transitionToPoint(center, __assign({ scale: scale }, options));
    };
    Scroller.prototype.startPanning = function (evt) {
        var e = this.normalizeEvent(evt);
        this.clientX = e.clientX;
        this.clientY = e.clientY;
        this.trigger('pan:start', { e: e });
        this.$(document.body).on({
            'mousemove.panning touchmove.panning': this.pan.bind(this),
            'mouseup.panning touchend.panning': this.stopPanning.bind(this),
            'mouseleave.panning': this.stopPanning.bind(this),
        });
        this.$(window).on('mouseup.panning', this.stopPanning.bind(this));
    };
    Scroller.prototype.pan = function (evt) {
        var e = this.normalizeEvent(evt);
        var dx = e.clientX - this.clientX;
        var dy = e.clientY - this.clientY;
        this.container.scrollTop -= dy;
        this.container.scrollLeft -= dx;
        this.clientX = e.clientX;
        this.clientY = e.clientY;
        this.trigger('panning', { e: e });
    };
    Scroller.prototype.stopPanning = function (e) {
        this.$(document.body).off('.panning');
        this.$(window).off('.panning');
        this.trigger('pan:stop', { e: e });
    };
    Scroller.prototype.clientToLocalPoint = function (a, b) {
        var x = typeof a === 'object' ? a.x : a;
        var y = typeof a === 'object' ? a.y : b;
        var ctm = this.graph.matrix();
        x += this.container.scrollLeft - this.padding.left - ctm.e;
        y += this.container.scrollTop - this.padding.top - ctm.f;
        return new geometry_1.Point(x / ctm.a, y / ctm.d);
    };
    Scroller.prototype.localToBackgroundPoint = function (x, y) {
        var p = typeof x === 'object' ? geometry_1.Point.create(x) : new geometry_1.Point(x, y);
        var ctm = this.graph.matrix();
        var padding = this.padding;
        return util_1.Dom.transformPoint(p, ctm).translate(padding.left, padding.top);
    };
    Scroller.prototype.resize = function (width, height) {
        var w = width != null ? width : this.container.offsetWidth;
        var h = height != null ? height : this.container.offsetHeight;
        if (typeof w === 'number') {
            w = Math.round(w);
        }
        if (typeof h === 'number') {
            h = Math.round(h);
        }
        this.options.width = w;
        this.options.height = h;
        this.$container.css({ width: w, height: h });
        this.update();
    };
    Scroller.prototype.getClientSize = function () {
        if (this.cachedClientSize) {
            return this.cachedClientSize;
        }
        return {
            width: this.container.clientWidth,
            height: this.container.clientHeight,
        };
    };
    Scroller.prototype.autoScroll = function (clientX, clientY) {
        var buffer = 10;
        var container = this.container;
        var rect = container.getBoundingClientRect();
        var dx = 0;
        var dy = 0;
        if (clientX <= rect.left + buffer) {
            dx = -buffer;
        }
        if (clientY <= rect.top + buffer) {
            dy = -buffer;
        }
        if (clientX >= rect.right - buffer) {
            dx = buffer;
        }
        if (clientY >= rect.bottom - buffer) {
            dy = buffer;
        }
        if (dx !== 0) {
            container.scrollLeft += dx;
        }
        if (dy !== 0) {
            container.scrollTop += dy;
        }
        return {
            scrollerX: dx,
            scrollerY: dy,
        };
    };
    Scroller.prototype.addPadding = function (left, right, top, bottom) {
        var padding = this.getPadding();
        this.padding = {
            left: Math.round(padding.left + (left || 0)),
            top: Math.round(padding.top + (top || 0)),
            bottom: Math.round(padding.bottom + (bottom || 0)),
            right: Math.round(padding.right + (right || 0)),
        };
        padding = this.padding;
        this.$content.css({
            width: padding.left + this.graph.options.width + padding.right,
            height: padding.top + this.graph.options.height + padding.bottom,
        });
        var container = this.graph.container;
        container.style.left = this.padding.left + "px";
        container.style.top = this.padding.top + "px";
        return this;
    };
    Scroller.prototype.getPadding = function () {
        var padding = this.options.padding;
        if (typeof padding === 'function') {
            return util_1.NumberExt.normalizeSides(util_1.FunctionExt.call(padding, this, this));
        }
        return util_1.NumberExt.normalizeSides(padding);
    };
    /**
     * Returns the untransformed size and origin of the current viewport.
     */
    Scroller.prototype.getVisibleArea = function () {
        var ctm = this.graph.matrix();
        var size = this.getClientSize();
        var box = {
            x: this.container.scrollLeft || 0,
            y: this.container.scrollTop || 0,
            width: size.width,
            height: size.height,
        };
        var area = util_1.Dom.transformRectangle(box, ctm.inverse());
        area.x -= (this.padding.left || 0) / this.sx;
        area.y -= (this.padding.top || 0) / this.sy;
        return area;
    };
    Scroller.prototype.isCellVisible = function (cell, options) {
        if (options === void 0) { options = {}; }
        var bbox = cell.getBBox();
        var area = this.getVisibleArea();
        return options.strict
            ? area.containsRect(bbox)
            : area.isIntersectWithRect(bbox);
    };
    Scroller.prototype.isPointVisible = function (point) {
        return this.getVisibleArea().containsPoint(point);
    };
    /**
     * Lock the current viewport by disabling user scrolling.
     */
    Scroller.prototype.lock = function () {
        this.$container.css('overflow', 'hidden');
        return this;
    };
    /**
     * Enable user scrolling if previously locked.
     */
    Scroller.prototype.unlock = function () {
        this.$container.css('overflow', 'scroll');
        return this;
    };
    Scroller.prototype.onRemove = function () {
        this.stopListening();
    };
    Scroller.prototype.dispose = function () {
        this.$(this.graph.container).insertBefore(this.$container);
        this.remove();
    };
    __decorate([
        view_1.View.dispose()
    ], Scroller.prototype, "dispose", null);
    return Scroller;
}(view_1.View));
exports.Scroller = Scroller;
(function (Scroller) {
    var Background = /** @class */ (function (_super) {
        __extends(Background, _super);
        function Background(scroller) {
            var _this = _super.call(this, scroller.graph) || this;
            _this.scroller = scroller;
            if (scroller.options.background) {
                _this.draw(scroller.options.background);
            }
            return _this;
        }
        Object.defineProperty(Background.prototype, "elem", {
            get: function () {
                return this.scroller.background;
            },
            enumerable: false,
            configurable: true
        });
        Background.prototype.init = function () {
            this.graph.on('scale', this.update, this);
            this.graph.on('translate', this.update, this);
        };
        Background.prototype.updateBackgroundOptions = function (options) {
            this.scroller.options.background = options;
        };
        return Background;
    }(background_1.BackgroundManager));
    Scroller.Background = Background;
})(Scroller = exports.Scroller || (exports.Scroller = {}));
exports.Scroller = Scroller;
var Util;
(function (Util) {
    Util.containerClass = 'graph-scroller';
    Util.panningClass = Util.containerClass + "-panning";
    Util.pannableClass = Util.containerClass + "-pannable";
    Util.pagedClass = Util.containerClass + "-paged";
    Util.contentClass = Util.containerClass + "-content";
    Util.backgroundClass = Util.containerClass + "-background";
    Util.transitionClassName = 'transition-in-progress';
    Util.transitionEventName = 'transitionend.graph-scroller-transition';
    Util.defaultOptions = {
        padding: function () {
            var size = this.getClientSize();
            var minWidth = Math.max(this.options.minVisibleWidth || 0, 1) || 1;
            var minHeight = Math.max(this.options.minVisibleHeight || 0, 1) || 1;
            var left = Math.max(size.width - minWidth, 0);
            var top = Math.max(size.height - minHeight, 0);
            return { left: left, top: top, right: left, bottom: top };
        },
        minVisibleWidth: 50,
        minVisibleHeight: 50,
        pageVisible: false,
        pageBreak: false,
        autoResize: true,
    };
    function getOptions(options) {
        var result = util_1.ObjectExt.merge({}, Util.defaultOptions, options);
        if (result.pageWidth == null) {
            result.pageWidth = options.graph.options.width;
        }
        if (result.pageHeight == null) {
            result.pageHeight = options.graph.options.height;
        }
        return result;
    }
    Util.getOptions = getOptions;
})(Util || (Util = {}));
//# sourceMappingURL=index.js.map