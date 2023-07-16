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
exports.MiniMap = void 0;
var util_1 = require("../../util");
var view_1 = require("../../view/view");
var graph_1 = require("../../graph/graph");
var ClassName;
(function (ClassName) {
    ClassName.root = 'widget-minimap';
    ClassName.viewport = ClassName.root + "-viewport";
    ClassName.zoom = ClassName.viewport + "-zoom";
})(ClassName || (ClassName = {}));
var MiniMap = /** @class */ (function (_super) {
    __extends(MiniMap, _super);
    function MiniMap(options) {
        var _this = _super.call(this) || this;
        _this.options = __assign(__assign({}, Util.defaultOptions), options);
        _this.updateViewport = util_1.FunctionExt.debounce(_this.updateViewport.bind(_this), 0);
        _this.container = document.createElement('div');
        _this.$container = _this.$(_this.container).addClass(_this.prefixClassName(ClassName.root));
        var graphContainer = document.createElement('div');
        _this.container.appendChild(graphContainer);
        _this.$viewport = _this.$('<div>').addClass(_this.prefixClassName(ClassName.viewport));
        if (_this.options.scalable) {
            _this.zoomHandle = _this.$('<div>')
                .addClass(_this.prefixClassName(ClassName.zoom))
                .appendTo(_this.$viewport)
                .get(0);
        }
        _this.$container.append(_this.$viewport).css({
            width: _this.options.width,
            height: _this.options.height,
            padding: _this.options.padding,
        });
        if (_this.options.container) {
            _this.options.container.appendChild(_this.container);
        }
        _this.sourceGraph = _this.graph;
        var targetGraphOptions = __assign(__assign({}, _this.options.graphOptions), { container: graphContainer, model: _this.sourceGraph.model, frozen: true, async: _this.sourceGraph.isAsync(), interacting: false, grid: false, background: false, rotating: false, resizing: false, embedding: false, selecting: false, snapline: false, clipboard: false, history: false, scroller: false });
        _this.targetGraph = _this.options.createGraph
            ? _this.options.createGraph(targetGraphOptions)
            : new graph_1.Graph(targetGraphOptions);
        _this.targetGraph.renderer.unfreeze();
        _this.updatePaper(_this.sourceGraph.options.width, _this.sourceGraph.options.height);
        _this.startListening();
        return _this;
    }
    Object.defineProperty(MiniMap.prototype, "graph", {
        get: function () {
            return this.options.graph;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(MiniMap.prototype, "scroller", {
        get: function () {
            return this.graph.scroller.widget;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(MiniMap.prototype, "graphContainer", {
        get: function () {
            if (this.scroller) {
                return this.scroller.container;
            }
            return this.graph.container;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(MiniMap.prototype, "$graphContainer", {
        get: function () {
            if (this.scroller) {
                return this.scroller.$container;
            }
            return this.$(this.graph.container);
        },
        enumerable: false,
        configurable: true
    });
    MiniMap.prototype.startListening = function () {
        var _a;
        if (this.scroller) {
            this.$graphContainer.on("scroll" + this.getEventNamespace(), this.updateViewport);
        }
        else {
            this.sourceGraph.on('translate', this.onTransform, this);
            this.sourceGraph.on('scale', this.onTransform, this);
            this.sourceGraph.on('model:updated', this.onModelUpdated, this);
        }
        this.sourceGraph.on('resize', this.updatePaper, this);
        this.delegateEvents((_a = {
                mousedown: 'startAction',
                touchstart: 'startAction'
            },
            _a["mousedown ." + this.prefixClassName('graph')] = 'scrollTo',
            _a["touchstart ." + this.prefixClassName('graph')] = 'scrollTo',
            _a));
    };
    MiniMap.prototype.stopListening = function () {
        if (this.scroller) {
            this.$graphContainer.off(this.getEventNamespace());
        }
        else {
            this.sourceGraph.off('translate', this.onTransform, this);
            this.sourceGraph.off('scale', this.onTransform, this);
            this.sourceGraph.off('model:updated', this.onModelUpdated, this);
        }
        this.sourceGraph.off('resize', this.updatePaper, this);
        this.undelegateEvents();
    };
    MiniMap.prototype.onRemove = function () {
        this.targetGraph.view.remove();
        this.stopListening();
        this.targetGraph.dispose();
    };
    MiniMap.prototype.onTransform = function (options) {
        if (options.ui || this.targetGraphTransforming) {
            this.updateViewport();
        }
    };
    MiniMap.prototype.onModelUpdated = function () {
        this.targetGraph.zoomToFit();
    };
    MiniMap.prototype.updatePaper = function (w, h) {
        var width;
        var height;
        if (typeof w === 'object') {
            width = w.width;
            height = w.height;
        }
        else {
            width = w;
            height = h;
        }
        var origin = this.sourceGraph.options;
        var scale = this.sourceGraph.transform.getScale();
        var maxWidth = this.options.width - 2 * this.options.padding;
        var maxHeight = this.options.height - 2 * this.options.padding;
        width /= scale.sx; // eslint-disable-line
        height /= scale.sy; // eslint-disable-line
        this.ratio = Math.min(maxWidth / width, maxHeight / height);
        var ratio = this.ratio;
        var x = (origin.x * ratio) / scale.sx;
        var y = (origin.y * ratio) / scale.sy;
        width *= ratio; // eslint-disable-line
        height *= ratio; // eslint-disable-line
        this.targetGraph.resizeGraph(width, height);
        this.targetGraph.translate(x, y);
        if (this.scroller) {
            this.targetGraph.scale(ratio, ratio);
        }
        else {
            this.targetGraph.zoomToFit();
        }
        this.updateViewport();
        return this;
    };
    MiniMap.prototype.updateViewport = function () {
        var sourceGraphScale = this.sourceGraph.transform.getScale();
        var targetGraphScale = this.targetGraph.transform.getScale();
        var origin = null;
        if (this.scroller) {
            origin = this.scroller.clientToLocalPoint(0, 0);
        }
        else {
            origin = this.graph.graphToLocal(0, 0);
        }
        var position = this.$(this.targetGraph.container).position();
        var translation = this.targetGraph.translate();
        translation.ty = translation.ty || 0;
        this.geometry = {
            top: position.top + origin.y * targetGraphScale.sy + translation.ty,
            left: position.left + origin.x * targetGraphScale.sx + translation.tx,
            width: (this.$graphContainer.innerWidth() * targetGraphScale.sx) /
                sourceGraphScale.sx,
            height: (this.$graphContainer.innerHeight() * targetGraphScale.sy) /
                sourceGraphScale.sy,
        };
        this.$viewport.css(this.geometry);
    };
    MiniMap.prototype.startAction = function (evt) {
        var e = this.normalizeEvent(evt);
        var action = e.target === this.zoomHandle ? 'zooming' : 'panning';
        var _a = this.sourceGraph.translate(), tx = _a.tx, ty = _a.ty;
        var eventData = {
            action: action,
            clientX: e.clientX,
            clientY: e.clientY,
            scrollLeft: this.graphContainer.scrollLeft,
            scrollTop: this.graphContainer.scrollTop,
            zoom: this.sourceGraph.zoom(),
            scale: this.sourceGraph.transform.getScale(),
            geometry: this.geometry,
            translateX: tx,
            translateY: ty,
        };
        this.targetGraphTransforming = true;
        this.delegateDocumentEvents(Util.documentEvents, eventData);
    };
    MiniMap.prototype.doAction = function (evt) {
        var _this = this;
        var e = this.normalizeEvent(evt);
        var clientX = e.clientX;
        var clientY = e.clientY;
        var data = e.data;
        switch (data.action) {
            case 'panning': {
                var scale = this.sourceGraph.transform.getScale();
                var rx = (clientX - data.clientX) * scale.sx;
                var ry = (clientY - data.clientY) * scale.sy;
                if (this.scroller) {
                    this.graphContainer.scrollLeft = data.scrollLeft + rx / this.ratio;
                    this.graphContainer.scrollTop = data.scrollTop + ry / this.ratio;
                }
                else {
                    this.sourceGraph.translate(data.translateX - rx / this.ratio, data.translateY - ry / this.ratio);
                }
                break;
            }
            case 'zooming': {
                var startScale = data.scale;
                var startGeometry = data.geometry;
                var delta_1 = 1 + (data.clientX - clientX) / startGeometry.width / startScale.sx;
                if (data.frameId) {
                    cancelAnimationFrame(data.frameId);
                }
                data.frameId = requestAnimationFrame(function () {
                    _this.sourceGraph.zoom(delta_1 * data.zoom, {
                        absolute: true,
                        minScale: _this.options.minScale,
                        maxScale: _this.options.maxScale,
                    });
                });
                break;
            }
            default:
                break;
        }
    };
    MiniMap.prototype.stopAction = function () {
        this.undelegateDocumentEvents();
        this.targetGraphTransforming = false;
    };
    MiniMap.prototype.scrollTo = function (evt) {
        var e = this.normalizeEvent(evt);
        var x;
        var y;
        var ts = this.targetGraph.translate();
        ts.ty = ts.ty || 0;
        if (e.offsetX == null) {
            var offset = this.$(this.targetGraph.container).offset();
            x = e.pageX - offset.left;
            y = e.pageY - offset.top;
        }
        else {
            x = e.offsetX;
            y = e.offsetY;
        }
        var cx = (x - ts.tx) / this.ratio;
        var cy = (y - ts.ty) / this.ratio;
        this.sourceGraph.centerPoint(cx, cy);
    };
    MiniMap.prototype.dispose = function () {
        this.remove();
    };
    __decorate([
        view_1.View.dispose()
    ], MiniMap.prototype, "dispose", null);
    return MiniMap;
}(view_1.View));
exports.MiniMap = MiniMap;
var Util;
(function (Util) {
    Util.defaultOptions = {
        width: 300,
        height: 200,
        padding: 10,
        scalable: true,
        minScale: 0.01,
        maxScale: 16,
        graphOptions: {},
        createGraph: function (options) { return new graph_1.Graph(options); },
    };
    Util.documentEvents = {
        mousemove: 'doAction',
        touchmove: 'doAction',
        mouseup: 'stopAction',
        touchend: 'stopAction',
    };
})(Util || (Util = {}));
//# sourceMappingURL=index.js.map