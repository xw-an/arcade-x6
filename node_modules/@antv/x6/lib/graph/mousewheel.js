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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MouseWheel = void 0;
var types_1 = require("../types");
var util_1 = require("../util");
var common_1 = require("../common");
var MouseWheel = /** @class */ (function (_super) {
    __extends(MouseWheel, _super);
    function MouseWheel(options) {
        var _this = _super.call(this) || this;
        _this.options = options;
        _this.cumulatedFactor = 1;
        var scroller = _this.graph.scroller.widget;
        _this.container = scroller ? scroller.container : _this.graph.container;
        _this.target = _this.options.global ? document : _this.container;
        _this.mousewheelHandle = new util_1.Dom.MouseWheelHandle(_this.target, _this.onMouseWheel.bind(_this), _this.allowMouseWheel.bind(_this));
        if (_this.options.enabled) {
            _this.enable(true);
        }
        return _this;
    }
    Object.defineProperty(MouseWheel.prototype, "graph", {
        get: function () {
            return this.options.graph;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(MouseWheel.prototype, "disabled", {
        get: function () {
            return this.options.enabled !== true;
        },
        enumerable: false,
        configurable: true
    });
    MouseWheel.prototype.enable = function (force) {
        if (this.disabled || force) {
            this.options.enabled = true;
            this.graph.options.mousewheel.enabled = true;
            this.mousewheelHandle.enable();
        }
    };
    MouseWheel.prototype.disable = function () {
        if (!this.disabled) {
            this.options.enabled = false;
            this.graph.options.mousewheel.enabled = false;
            this.mousewheelHandle.disable();
        }
    };
    MouseWheel.prototype.allowMouseWheel = function (evt) {
        var e = (evt.originalEvent || evt);
        var guard = this.options.guard;
        return ((guard == null || guard.call(this.graph, e)) &&
            types_1.ModifierKey.isMatch(e, this.options.modifiers));
    };
    MouseWheel.prototype.onMouseWheel = function (evt) {
        var e = (evt.originalEvent || evt);
        var guard = this.options.guard;
        if ((guard == null || guard.call(this.graph, e)) &&
            types_1.ModifierKey.isMatch(e, this.options.modifiers)) {
            var factor = this.options.factor || 1.2;
            if (this.currentScale == null) {
                this.startPos = { x: evt.clientX, y: evt.clientY };
                this.currentScale = this.graph.scroller.widget
                    ? this.graph.scroller.widget.zoom()
                    : this.graph.transform.getScale().sx;
            }
            var delta = evt.deltaY;
            if (delta < 0) {
                // zoomin
                // ------
                // Switches to 1% zoom steps below 15%
                if (this.currentScale < 0.15) {
                    this.cumulatedFactor = (this.currentScale + 0.01) / this.currentScale;
                }
                else {
                    // Uses to 5% zoom steps for better grid rendering in
                    // webkit and to avoid rounding errors for zoom steps
                    this.cumulatedFactor =
                        Math.round(this.currentScale * factor * 20) / 20 / this.currentScale;
                }
            }
            else {
                // zoomout
                // -------
                // Switches to 1% zoom steps below 15%
                if (this.currentScale <= 0.15) {
                    this.cumulatedFactor = (this.currentScale - 0.01) / this.currentScale;
                }
                else {
                    // Uses to 5% zoom steps for better grid rendering in
                    // webkit and to avoid rounding errors for zoom steps
                    this.cumulatedFactor =
                        Math.round(this.currentScale * (1 / factor) * 20) /
                            20 /
                            this.currentScale;
                }
            }
            this.cumulatedFactor = Math.max(0.01, Math.min(this.currentScale * this.cumulatedFactor, 160) /
                this.currentScale);
            var scroller = this.graph.scroller.widget;
            var currentScale = this.currentScale;
            var targetScale = this.graph.transform.clampScale(currentScale * this.cumulatedFactor);
            var minScale = this.options.minScale || Number.MIN_SAFE_INTEGER;
            var maxScale = this.options.maxScale || Number.MAX_SAFE_INTEGER;
            targetScale = util_1.NumberExt.clamp(targetScale, minScale, maxScale);
            if (targetScale !== currentScale) {
                if (scroller) {
                    if (this.options.zoomAtMousePosition) {
                        var origin_1 = this.graph.coord.clientToLocalPoint(this.startPos);
                        scroller.zoom(targetScale, {
                            absolute: true,
                            center: origin_1.clone(),
                        });
                    }
                    else {
                        scroller.zoom(targetScale, { absolute: true });
                    }
                }
                else {
                    if (this.options.zoomAtMousePosition) {
                        var origin_2 = this.graph.coord.clientToGraphPoint(this.startPos);
                        this.graph.transform.zoom(targetScale, {
                            absolute: true,
                            center: origin_2.clone(),
                            ui: true,
                        });
                    }
                    else {
                        this.graph.transform.zoom(targetScale, { absolute: true, ui: true });
                    }
                }
            }
            this.currentScale = null;
            this.cumulatedFactor = 1;
        }
    };
    MouseWheel.prototype.dispose = function () {
        this.disable();
    };
    __decorate([
        common_1.Disposable.dispose()
    ], MouseWheel.prototype, "dispose", null);
    return MouseWheel;
}(common_1.Disposable));
exports.MouseWheel = MouseWheel;
//# sourceMappingURL=mousewheel.js.map