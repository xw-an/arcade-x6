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
exports.PanningManager = void 0;
var types_1 = require("../types");
var util_1 = require("../util");
var base_1 = require("./base");
var PanningManager = /** @class */ (function (_super) {
    __extends(PanningManager, _super);
    function PanningManager() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(PanningManager.prototype, "widgetOptions", {
        get: function () {
            return this.options.panning;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(PanningManager.prototype, "pannable", {
        get: function () {
            return this.widgetOptions && this.widgetOptions.enabled === true;
        },
        enumerable: false,
        configurable: true
    });
    PanningManager.prototype.init = function () {
        this.startListening();
        this.updateClassName();
    };
    PanningManager.prototype.startListening = function () {
        var eventTypes = this.widgetOptions.eventTypes;
        if (!eventTypes) {
            return;
        }
        if (eventTypes.includes('leftMouseDown')) {
            this.graph.on('blank:mousedown', this.preparePanning, this);
            this.graph.on('node:unhandled:mousedown', this.preparePanning, this);
            this.graph.on('edge:unhandled:mousedown', this.preparePanning, this);
        }
        if (eventTypes.includes('rightMouseDown')) {
            this.onRightMouseDown = this.onRightMouseDown.bind(this);
            this.view.$(this.graph.container).on('mousedown', this.onRightMouseDown);
        }
        if (eventTypes.includes('mouseWheel')) {
            this.mousewheelHandle = new util_1.Dom.MouseWheelHandle(this.graph.container, this.onMouseWheel.bind(this), this.allowMouseWheel.bind(this));
            this.mousewheelHandle.enable();
        }
    };
    PanningManager.prototype.stopListening = function () {
        var eventTypes = this.widgetOptions.eventTypes;
        if (!eventTypes) {
            return;
        }
        if (eventTypes.includes('leftMouseDown')) {
            this.graph.off('blank:mousedown', this.preparePanning, this);
            this.graph.off('node:unhandled:mousedown', this.preparePanning, this);
            this.graph.off('edge:unhandled:mousedown', this.preparePanning, this);
        }
        if (eventTypes.includes('rightMouseDown')) {
            this.view.$(this.graph.container).off('mousedown', this.onRightMouseDown);
        }
        if (eventTypes.includes('mouseWheel')) {
            if (this.mousewheelHandle) {
                this.mousewheelHandle.disable();
            }
        }
    };
    PanningManager.prototype.preparePanning = function (_a) {
        var e = _a.e;
        if (this.allowPanning(e, true) ||
            (this.allowPanning(e) && !this.graph.selection.allowRubberband(e, true))) {
            this.startPanning(e);
        }
    };
    PanningManager.prototype.allowPanning = function (e, strict) {
        return (this.pannable &&
            types_1.ModifierKey.isMatch(e, this.widgetOptions.modifiers, strict) &&
            this.graph.hook.allowPanning(e));
    };
    PanningManager.prototype.startPanning = function (evt) {
        var e = this.view.normalizeEvent(evt);
        this.clientX = e.clientX;
        this.clientY = e.clientY;
        this.panning = true;
        this.updateClassName();
        this.view.$(document.body).on({
            'mousemove.panning touchmove.panning': this.pan.bind(this),
            'mouseup.panning touchend.panning': this.stopPanning.bind(this),
            'mouseleave.panning': this.stopPanning.bind(this),
        });
        this.view.$(window).on('mouseup.panning', this.stopPanning.bind(this));
    };
    PanningManager.prototype.pan = function (evt) {
        var e = this.view.normalizeEvent(evt);
        var dx = e.clientX - this.clientX;
        var dy = e.clientY - this.clientY;
        this.clientX = e.clientX;
        this.clientY = e.clientY;
        var ts = this.graph.transform.getTranslation();
        var tx = ts.tx + dx;
        var ty = ts.ty + dy;
        this.graph.transform.translate(tx, ty, { ui: true });
    };
    // eslint-disable-next-line
    PanningManager.prototype.stopPanning = function (e) {
        this.panning = false;
        this.updateClassName();
        this.view.$(document.body).off('.panning');
        this.view.$(window).off('.panning');
    };
    PanningManager.prototype.updateClassName = function () {
        var container = this.view.container;
        var panning = this.view.prefixClassName('graph-panning');
        var pannable = this.view.prefixClassName('graph-pannable');
        if (this.pannable) {
            if (this.panning) {
                util_1.Dom.addClass(container, panning);
                util_1.Dom.removeClass(container, pannable);
            }
            else {
                util_1.Dom.removeClass(container, panning);
                util_1.Dom.addClass(container, pannable);
            }
        }
        else {
            util_1.Dom.removeClass(container, panning);
            util_1.Dom.removeClass(container, pannable);
        }
    };
    PanningManager.prototype.onRightMouseDown = function (e) {
        if (e.button === 2 && this.allowPanning(e, true)) {
            this.startPanning(e);
        }
    };
    PanningManager.prototype.allowMouseWheel = function (e) {
        return this.pannable && !e.ctrlKey;
    };
    PanningManager.prototype.onMouseWheel = function (e, deltaX, deltaY) {
        if (!e.ctrlKey) {
            this.graph.translateBy(-deltaX, -deltaY);
        }
    };
    PanningManager.prototype.autoPanning = function (x, y) {
        var buffer = 10;
        var graphArea = this.graph.getGraphArea();
        var dx = 0;
        var dy = 0;
        if (x <= graphArea.left + buffer) {
            dx = -buffer;
        }
        if (y <= graphArea.top + buffer) {
            dy = -buffer;
        }
        if (x >= graphArea.right - buffer) {
            dx = buffer;
        }
        if (y >= graphArea.bottom - buffer) {
            dy = buffer;
        }
        if (dx !== 0 || dy !== 0) {
            this.graph.translateBy(-dx, -dy);
        }
    };
    PanningManager.prototype.enablePanning = function () {
        if (!this.pannable) {
            this.widgetOptions.enabled = true;
            this.updateClassName();
        }
    };
    PanningManager.prototype.disablePanning = function () {
        if (this.pannable) {
            this.widgetOptions.enabled = false;
            this.updateClassName();
        }
    };
    PanningManager.prototype.dispose = function () {
        this.stopListening();
    };
    __decorate([
        base_1.Base.dispose()
    ], PanningManager.prototype, "dispose", null);
    return PanningManager;
}(base_1.Base));
exports.PanningManager = PanningManager;
//# sourceMappingURL=panning.js.map