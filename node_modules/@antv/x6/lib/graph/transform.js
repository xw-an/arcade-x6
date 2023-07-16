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
exports.TransformManager = void 0;
var util_1 = require("../util");
var geometry_1 = require("../geometry");
var base_1 = require("./base");
var TransformManager = /** @class */ (function (_super) {
    __extends(TransformManager, _super);
    function TransformManager() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.widgets = new Map();
        return _this;
    }
    Object.defineProperty(TransformManager.prototype, "container", {
        get: function () {
            return this.graph.view.container;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TransformManager.prototype, "viewport", {
        get: function () {
            return this.graph.view.viewport;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TransformManager.prototype, "isSelectionEnabled", {
        get: function () {
            return this.options.selecting.enabled === true;
        },
        enumerable: false,
        configurable: true
    });
    TransformManager.prototype.init = function () {
        this.startListening();
        this.resize();
    };
    TransformManager.prototype.startListening = function () {
        this.graph.on('node:mouseup', this.onNodeMouseUp, this);
        this.graph.on('node:selected', this.onNodeSelected, this);
        this.graph.on('node:unselected', this.onNodeUnSelected, this);
    };
    TransformManager.prototype.stopListening = function () {
        this.graph.off('node:mouseup', this.onNodeMouseUp, this);
        this.graph.off('node:selected', this.onNodeSelected, this);
        this.graph.off('node:unselected', this.onNodeUnSelected, this);
    };
    TransformManager.prototype.onNodeMouseUp = function (_a) {
        var node = _a.node;
        if (!this.isSelectionEnabled) {
            var widget = this.graph.hook.createTransform(node, { clearAll: true });
            if (widget) {
                this.widgets.set(node, widget);
            }
        }
    };
    TransformManager.prototype.onNodeSelected = function (_a) {
        var node = _a.node;
        if (this.isSelectionEnabled) {
            var widget = this.graph.hook.createTransform(node, { clearAll: false });
            if (widget) {
                this.widgets.set(node, widget);
            }
        }
    };
    TransformManager.prototype.onNodeUnSelected = function (_a) {
        var node = _a.node;
        if (this.isSelectionEnabled) {
            var widget = this.widgets.get(node);
            if (widget) {
                widget.dispose();
            }
            this.widgets.delete(node);
        }
    };
    /**
     * Returns the current transformation matrix of the graph.
     */
    TransformManager.prototype.getMatrix = function () {
        var transform = this.viewport.getAttribute('transform');
        if (transform !== this.viewportTransformString) {
            // `getCTM`: top-left relative to the SVG element
            // `getScreenCTM`: top-left relative to the document
            this.viewportMatrix = this.viewport.getCTM();
            this.viewportTransformString = transform;
        }
        // Clone the cached current transformation matrix.
        // If no matrix previously stored the identity matrix is returned.
        return util_1.Dom.createSVGMatrix(this.viewportMatrix);
    };
    /**
     * Sets new transformation with the given `matrix`
     */
    TransformManager.prototype.setMatrix = function (matrix) {
        var ctm = util_1.Dom.createSVGMatrix(matrix);
        var transform = util_1.Dom.matrixToTransformString(ctm);
        this.viewport.setAttribute('transform', transform);
        this.viewportMatrix = ctm;
        this.viewportTransformString = transform;
    };
    TransformManager.prototype.resize = function (width, height) {
        var w = width === undefined ? this.options.width : width;
        var h = height === undefined ? this.options.height : height;
        this.options.width = w;
        this.options.height = h;
        if (typeof w === 'number') {
            w = Math.round(w);
        }
        if (typeof h === 'number') {
            h = Math.round(h);
        }
        this.container.style.width = w == null ? '' : w + "px";
        this.container.style.height = h == null ? '' : h + "px";
        var size = this.getComputedSize();
        this.graph.trigger('resize', __assign({}, size));
        return this;
    };
    TransformManager.prototype.getComputedSize = function () {
        var w = this.options.width;
        var h = this.options.height;
        if (!util_1.NumberExt.isNumber(w)) {
            w = this.container.clientWidth;
        }
        if (!util_1.NumberExt.isNumber(h)) {
            h = this.container.clientHeight;
        }
        return { width: w, height: h };
    };
    TransformManager.prototype.getScale = function () {
        return util_1.Dom.matrixToScale(this.getMatrix());
    };
    TransformManager.prototype.scale = function (sx, sy, ox, oy, options) {
        if (sy === void 0) { sy = sx; }
        if (ox === void 0) { ox = 0; }
        if (oy === void 0) { oy = 0; }
        if (options === void 0) { options = {}; }
        sx = this.clampScale(sx); // eslint-disable-line
        sy = this.clampScale(sy); // eslint-disable-line
        if (ox || oy) {
            var ts = this.getTranslation();
            var tx = ts.tx - ox * (sx - 1);
            var ty = ts.ty - oy * (sy - 1);
            if (tx !== ts.tx || ty !== ts.ty) {
                this.translate(tx, ty);
            }
        }
        var matrix = this.getMatrix();
        matrix.a = sx;
        matrix.d = sy;
        this.setMatrix(matrix);
        this.graph.trigger('scale', __assign({ sx: sx, sy: sy, ox: ox, oy: oy }, options));
        return this;
    };
    TransformManager.prototype.clampScale = function (scale) {
        var range = this.graph.options.scaling;
        return util_1.NumberExt.clamp(scale, range.min || 0.01, range.max || 16);
    };
    TransformManager.prototype.getZoom = function () {
        return this.getScale().sx;
    };
    TransformManager.prototype.zoom = function (factor, options) {
        options = options || {}; // eslint-disable-line
        var sx = factor;
        var sy = factor;
        var scale = this.getScale();
        var clientSize = this.getComputedSize();
        var cx = clientSize.width / 2;
        var cy = clientSize.height / 2;
        if (!options.absolute) {
            sx += scale.sx;
            sy += scale.sy;
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
        if (options.center) {
            cx = options.center.x;
            cy = options.center.y;
        }
        sx = this.clampScale(sx);
        sy = this.clampScale(sy);
        if (cx || cy) {
            var ts = this.getTranslation();
            var tx = cx - (cx - ts.tx) * (sx / scale.sx);
            var ty = cy - (cy - ts.ty) * (sy / scale.sy);
            if (tx !== ts.tx || ty !== ts.ty) {
                this.translate(tx, ty, { ui: options.ui });
            }
        }
        this.scale(sx, sy, 0, 0, { ui: options.ui });
        return this;
    };
    TransformManager.prototype.getRotation = function () {
        return util_1.Dom.matrixToRotation(this.getMatrix());
    };
    TransformManager.prototype.rotate = function (angle, cx, cy) {
        if (cx == null || cy == null) {
            var bbox = util_1.Dom.getBBox(this.graph.view.stage);
            cx = bbox.width / 2; // eslint-disable-line
            cy = bbox.height / 2; // eslint-disable-line
        }
        var ctm = this.getMatrix()
            .translate(cx, cy)
            .rotate(angle)
            .translate(-cx, -cy);
        this.setMatrix(ctm);
        return this;
    };
    TransformManager.prototype.getTranslation = function () {
        return util_1.Dom.matrixToTranslation(this.getMatrix());
    };
    TransformManager.prototype.translate = function (tx, ty, options) {
        if (options === void 0) { options = {}; }
        var matrix = this.getMatrix();
        matrix.e = tx || 0;
        matrix.f = ty || 0;
        this.setMatrix(matrix);
        var ts = this.getTranslation();
        this.options.x = ts.tx;
        this.options.y = ts.ty;
        this.graph.trigger('translate', __assign(__assign({}, ts), options));
        return this;
    };
    TransformManager.prototype.setOrigin = function (ox, oy) {
        return this.translate(ox || 0, oy || 0);
    };
    TransformManager.prototype.fitToContent = function (gridWidth, gridHeight, padding, options) {
        if (typeof gridWidth === 'object') {
            var opts = gridWidth;
            gridWidth = opts.gridWidth || 1; // eslint-disable-line
            gridHeight = opts.gridHeight || 1; // eslint-disable-line
            padding = opts.padding || 0; // eslint-disable-line
            options = opts; // eslint-disable-line
        }
        else {
            gridWidth = gridWidth || 1; // eslint-disable-line
            gridHeight = gridHeight || 1; // eslint-disable-line
            padding = padding || 0; // eslint-disable-line
            if (options == null) {
                options = {}; // eslint-disable-line
            }
        }
        var paddings = util_1.NumberExt.normalizeSides(padding);
        var border = options.border || 0;
        var contentArea = options.contentArea
            ? geometry_1.Rectangle.create(options.contentArea)
            : this.getContentArea(options);
        if (border > 0) {
            contentArea.inflate(border);
        }
        var scale = this.getScale();
        var translate = this.getTranslation();
        var sx = scale.sx;
        var sy = scale.sy;
        contentArea.x *= sx;
        contentArea.y *= sy;
        contentArea.width *= sx;
        contentArea.height *= sy;
        var width = Math.max(Math.ceil((contentArea.width + contentArea.x) / gridWidth), 1) *
            gridWidth;
        var height = Math.max(Math.ceil((contentArea.height + contentArea.y) / gridHeight), 1) * gridHeight;
        var tx = 0;
        var ty = 0;
        if ((options.allowNewOrigin === 'negative' && contentArea.x < 0) ||
            (options.allowNewOrigin === 'positive' && contentArea.x >= 0) ||
            options.allowNewOrigin === 'any') {
            tx = Math.ceil(-contentArea.x / gridWidth) * gridWidth;
            tx += paddings.left;
            width += tx;
        }
        if ((options.allowNewOrigin === 'negative' && contentArea.y < 0) ||
            (options.allowNewOrigin === 'positive' && contentArea.y >= 0) ||
            options.allowNewOrigin === 'any') {
            ty = Math.ceil(-contentArea.y / gridHeight) * gridHeight;
            ty += paddings.top;
            height += ty;
        }
        width += paddings.right;
        height += paddings.bottom;
        // Make sure the resulting width and height are greater than minimum.
        width = Math.max(width, options.minWidth || 0);
        height = Math.max(height, options.minHeight || 0);
        // Make sure the resulting width and height are lesser than maximum.
        width = Math.min(width, options.maxWidth || Number.MAX_SAFE_INTEGER);
        height = Math.min(height, options.maxHeight || Number.MAX_SAFE_INTEGER);
        var size = this.getComputedSize();
        var sizeChanged = width !== size.width || height !== size.height;
        var originChanged = tx !== translate.tx || ty !== translate.ty;
        // Change the dimensions only if there is a size discrepency or an origin change
        if (originChanged) {
            this.translate(tx, ty);
        }
        if (sizeChanged) {
            this.resize(width, height);
        }
        return new geometry_1.Rectangle(-tx / sx, -ty / sy, width / sx, height / sy);
    };
    TransformManager.prototype.scaleContentToFit = function (options) {
        if (options === void 0) { options = {}; }
        this.scaleContentToFitImpl(options);
    };
    TransformManager.prototype.scaleContentToFitImpl = function (options, translate) {
        if (options === void 0) { options = {}; }
        if (translate === void 0) { translate = true; }
        var contentBBox;
        var contentLocalOrigin;
        if (options.contentArea) {
            var contentArea = options.contentArea;
            contentBBox = this.graph.localToGraph(contentArea);
            contentLocalOrigin = geometry_1.Point.create(contentArea);
        }
        else {
            contentBBox = this.getContentBBox(options);
            contentLocalOrigin = this.graph.graphToLocal(contentBBox);
        }
        if (!contentBBox.width || !contentBBox.height) {
            return;
        }
        var padding = util_1.NumberExt.normalizeSides(options.padding);
        var minScale = options.minScale || 0;
        var maxScale = options.maxScale || Number.MAX_SAFE_INTEGER;
        var minScaleX = options.minScaleX || minScale;
        var maxScaleX = options.maxScaleX || maxScale;
        var minScaleY = options.minScaleY || minScale;
        var maxScaleY = options.maxScaleY || maxScale;
        var fittingBox;
        if (options.viewportArea) {
            fittingBox = options.viewportArea;
        }
        else {
            var computedSize = this.getComputedSize();
            var currentTranslate = this.getTranslation();
            fittingBox = {
                x: currentTranslate.tx,
                y: currentTranslate.ty,
                width: computedSize.width,
                height: computedSize.height,
            };
        }
        fittingBox = geometry_1.Rectangle.create(fittingBox).moveAndExpand({
            x: padding.left,
            y: padding.top,
            width: -padding.left - padding.right,
            height: -padding.top - padding.bottom,
        });
        var currentScale = this.getScale();
        var newSX = (fittingBox.width / contentBBox.width) * currentScale.sx;
        var newSY = (fittingBox.height / contentBBox.height) * currentScale.sy;
        if (options.preserveAspectRatio !== false) {
            newSX = newSY = Math.min(newSX, newSY);
        }
        // snap scale to a grid
        var gridSize = options.scaleGrid;
        if (gridSize) {
            newSX = gridSize * Math.floor(newSX / gridSize);
            newSY = gridSize * Math.floor(newSY / gridSize);
        }
        // scale min/max boundaries
        newSX = util_1.NumberExt.clamp(newSX, minScaleX, maxScaleX);
        newSY = util_1.NumberExt.clamp(newSY, minScaleY, maxScaleY);
        this.scale(newSX, newSY);
        if (translate) {
            var origin_1 = this.options;
            var newOX = fittingBox.x - contentLocalOrigin.x * newSX - origin_1.x;
            var newOY = fittingBox.y - contentLocalOrigin.y * newSY - origin_1.y;
            this.translate(newOX, newOY);
        }
    };
    TransformManager.prototype.getContentArea = function (options) {
        if (options === void 0) { options = {}; }
        if (options.useCellGeometry) {
            return this.model.getAllCellsBBox() || new geometry_1.Rectangle();
        }
        return util_1.Dom.getBBox(this.graph.view.stage);
    };
    TransformManager.prototype.getContentBBox = function (options) {
        if (options === void 0) { options = {}; }
        return this.graph.localToGraph(this.getContentArea(options));
    };
    TransformManager.prototype.getGraphArea = function () {
        var rect = geometry_1.Rectangle.fromSize(this.getComputedSize());
        return this.graph.graphToLocal(rect);
    };
    TransformManager.prototype.zoomToRect = function (rect, options) {
        if (options === void 0) { options = {}; }
        var area = geometry_1.Rectangle.create(rect);
        var graph = this.graph;
        options.contentArea = area;
        if (options.viewportArea == null) {
            options.viewportArea = {
                x: graph.options.x,
                y: graph.options.y,
                width: this.options.width,
                height: this.options.height,
            };
        }
        this.scaleContentToFitImpl(options, false);
        var center = area.getCenter();
        this.centerPoint(center.x, center.y);
        return this;
    };
    TransformManager.prototype.zoomToFit = function (options) {
        if (options === void 0) { options = {}; }
        return this.zoomToRect(this.getContentArea(options), options);
    };
    TransformManager.prototype.centerPoint = function (x, y) {
        var clientSize = this.getComputedSize();
        var scale = this.getScale();
        var ts = this.getTranslation();
        var cx = clientSize.width / 2;
        var cy = clientSize.height / 2;
        x = typeof x === 'number' ? x : cx; // eslint-disable-line
        y = typeof y === 'number' ? y : cy; // eslint-disable-line
        x = cx - x * scale.sx; // eslint-disable-line
        y = cy - y * scale.sy; // eslint-disable-line
        if (ts.tx !== x || ts.ty !== y) {
            this.translate(x, y);
        }
    };
    TransformManager.prototype.centerContent = function (options) {
        var rect = this.graph.getContentArea(options);
        var center = rect.getCenter();
        this.centerPoint(center.x, center.y);
    };
    TransformManager.prototype.centerCell = function (cell) {
        return this.positionCell(cell, 'center');
    };
    TransformManager.prototype.positionPoint = function (point, x, y) {
        var clientSize = this.getComputedSize();
        // eslint-disable-next-line
        x = util_1.NumberExt.normalizePercentage(x, Math.max(0, clientSize.width));
        if (x < 0) {
            x = clientSize.width + x; // eslint-disable-line
        }
        // eslint-disable-next-line
        y = util_1.NumberExt.normalizePercentage(y, Math.max(0, clientSize.height));
        if (y < 0) {
            y = clientSize.height + y; // eslint-disable-line
        }
        var ts = this.getTranslation();
        var scale = this.getScale();
        var dx = x - point.x * scale.sx;
        var dy = y - point.y * scale.sy;
        if (ts.tx !== dx || ts.ty !== dy) {
            this.translate(dx, dy);
        }
    };
    TransformManager.prototype.positionRect = function (rect, pos) {
        var bbox = geometry_1.Rectangle.create(rect);
        switch (pos) {
            case 'center':
                return this.positionPoint(bbox.getCenter(), '50%', '50%');
            case 'top':
                return this.positionPoint(bbox.getTopCenter(), '50%', 0);
            case 'top-right':
                return this.positionPoint(bbox.getTopRight(), '100%', 0);
            case 'right':
                return this.positionPoint(bbox.getRightMiddle(), '100%', '50%');
            case 'bottom-right':
                return this.positionPoint(bbox.getBottomRight(), '100%', '100%');
            case 'bottom':
                return this.positionPoint(bbox.getBottomCenter(), '50%', '100%');
            case 'bottom-left':
                return this.positionPoint(bbox.getBottomLeft(), 0, '100%');
            case 'left':
                return this.positionPoint(bbox.getLeftMiddle(), 0, '50%');
            case 'top-left':
                return this.positionPoint(bbox.getTopLeft(), 0, 0);
            default:
                return this;
        }
    };
    TransformManager.prototype.positionCell = function (cell, pos) {
        var bbox = cell.getBBox();
        return this.positionRect(bbox, pos);
    };
    TransformManager.prototype.positionContent = function (pos, options) {
        var rect = this.graph.getContentArea(options);
        return this.positionRect(rect, pos);
    };
    TransformManager.prototype.dispose = function () {
        this.widgets.forEach(function (widget) { return widget.dispose(); });
        this.widgets.clear();
        this.stopListening();
    };
    __decorate([
        TransformManager.dispose()
    ], TransformManager.prototype, "dispose", null);
    return TransformManager;
}(base_1.Base));
exports.TransformManager = TransformManager;
//# sourceMappingURL=transform.js.map