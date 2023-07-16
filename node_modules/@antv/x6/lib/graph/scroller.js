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
exports.ScrollerManager = void 0;
var util_1 = require("../util");
var types_1 = require("../types");
var base_1 = require("./base");
var ScrollerManager = /** @class */ (function (_super) {
    __extends(ScrollerManager, _super);
    function ScrollerManager() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(ScrollerManager.prototype, "widgetOptions", {
        get: function () {
            return this.options.scroller;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ScrollerManager.prototype, "pannable", {
        get: function () {
            if (this.widgetOptions) {
                if (typeof this.widgetOptions.pannable === 'object') {
                    return this.widgetOptions.pannable.enabled;
                }
                return !!this.widgetOptions.pannable;
            }
            return false;
        },
        enumerable: false,
        configurable: true
    });
    ScrollerManager.prototype.init = function () {
        this.widget = this.graph.hook.createScroller();
        this.startListening();
        this.updateClassName();
        if (this.widget) {
            this.widget.center();
        }
    };
    ScrollerManager.prototype.startListening = function () {
        var eventTypes = [];
        var pannable = this.widgetOptions.pannable;
        if (typeof pannable === 'object') {
            eventTypes = pannable.eventTypes || [];
        }
        else {
            eventTypes = ['leftMouseDown'];
        }
        if (eventTypes.includes('leftMouseDown')) {
            this.graph.on('blank:mousedown', this.preparePanning, this);
            this.graph.on('node:unhandled:mousedown', this.preparePanning, this);
            this.graph.on('edge:unhandled:mousedown', this.preparePanning, this);
        }
        if (eventTypes.includes('rightMouseDown')) {
            this.onRightMouseDown = this.onRightMouseDown.bind(this);
            this.view.$(this.widget.container).on('mousedown', this.onRightMouseDown);
        }
    };
    ScrollerManager.prototype.stopListening = function () {
        var eventTypes = [];
        var pannable = this.widgetOptions.pannable;
        if (typeof pannable === 'object') {
            eventTypes = pannable.eventTypes || [];
        }
        else {
            eventTypes = ['leftMouseDown'];
        }
        if (eventTypes.includes('leftMouseDown')) {
            this.graph.off('blank:mousedown', this.preparePanning, this);
            this.graph.off('node:unhandled:mousedown', this.preparePanning, this);
            this.graph.off('edge:unhandled:mousedown', this.preparePanning, this);
        }
        if (eventTypes.includes('rightMouseDown')) {
            this.view
                .$(this.widget.container)
                .off('mousedown', this.onRightMouseDown);
        }
    };
    ScrollerManager.prototype.onRightMouseDown = function (e) {
        var _this = this;
        if (e.button === 2 && this.allowPanning(e, true) && this.widget) {
            this.updateClassName(true);
            this.widget.startPanning(e);
            this.widget.once('pan:stop', function () { return _this.updateClassName(false); });
        }
    };
    ScrollerManager.prototype.preparePanning = function (_a) {
        var _this = this;
        var e = _a.e;
        if (this.widget) {
            if (this.allowPanning(e, true) ||
                (this.allowPanning(e) && !this.graph.selection.allowRubberband(e, true))) {
                this.updateClassName(true);
                this.widget.startPanning(e);
                this.widget.once('pan:stop', function () { return _this.updateClassName(false); });
            }
        }
    };
    ScrollerManager.prototype.allowPanning = function (e, strict) {
        return (this.widget &&
            this.pannable &&
            types_1.ModifierKey.isMatch(e, this.widgetOptions.modifiers, strict) &&
            this.graph.hook.allowPanning(e));
    };
    ScrollerManager.prototype.updateClassName = function (isPanning) {
        if (this.widget == null) {
            return;
        }
        var container = this.widget.container;
        var pannable = this.view.prefixClassName('graph-scroller-pannable');
        if (this.pannable) {
            util_1.Dom.addClass(container, pannable);
            container.dataset.panning = (!!isPanning).toString(); // Use dataset to control scroller panning style to avoid reflow caused by changing classList
        }
        else {
            util_1.Dom.removeClass(container, pannable);
        }
    };
    ScrollerManager.prototype.enablePanning = function () {
        if (!this.pannable) {
            this.widgetOptions.pannable = true;
            this.updateClassName();
            // if (
            //   ModifierKey.equals(
            //     this.graph.options.scroller.modifiers,
            //     this.graph.options.selecting.modifiers,
            //   )
            // ) {
            //   this.graph.selection.disableRubberband()
            // }
        }
    };
    ScrollerManager.prototype.disablePanning = function () {
        if (this.pannable) {
            this.widgetOptions.pannable = false;
            this.updateClassName();
        }
    };
    ScrollerManager.prototype.lock = function () {
        if (this.widget) {
            this.widget.lock();
        }
    };
    ScrollerManager.prototype.unlock = function () {
        if (this.widget) {
            this.widget.unlock();
        }
    };
    ScrollerManager.prototype.update = function () {
        if (this.widget) {
            this.widget.update();
        }
    };
    ScrollerManager.prototype.enableAutoResize = function () {
        if (this.widget) {
            this.widget.enableAutoResize();
        }
    };
    ScrollerManager.prototype.disableAutoResize = function () {
        if (this.widget) {
            this.widget.disableAutoResize();
        }
    };
    ScrollerManager.prototype.resize = function (width, height) {
        if (this.widget) {
            this.widget.resize(width, height);
        }
    };
    ScrollerManager.prototype.dispose = function () {
        if (this.widget) {
            this.widget.dispose();
        }
        this.stopListening();
    };
    __decorate([
        base_1.Base.dispose()
    ], ScrollerManager.prototype, "dispose", null);
    return ScrollerManager;
}(base_1.Base));
exports.ScrollerManager = ScrollerManager;
//# sourceMappingURL=scroller.js.map