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
exports.SizeManager = void 0;
var base_1 = require("./base");
var util_1 = require("../util");
var SizeManager = /** @class */ (function (_super) {
    __extends(SizeManager, _super);
    function SizeManager() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SizeManager.prototype.hasScroller = function () {
        return this.graph.scroller.widget != null;
    };
    SizeManager.prototype.getContainer = function () {
        return this.hasScroller()
            ? this.graph.scroller.widget.container
            : this.graph.container;
    };
    SizeManager.prototype.init = function () {
        var _this = this;
        var autoResize = this.options.autoResize;
        if (autoResize) {
            var target = typeof autoResize === 'boolean'
                ? this.getContainer()
                : autoResize;
            util_1.SizeSensor.bind(target, function () {
                var container = _this.getContainer();
                // container is border-box
                var width = container.offsetWidth;
                var height = container.offsetHeight;
                _this.resize(width, height);
            });
        }
    };
    SizeManager.prototype.resize = function (width, height) {
        if (this.hasScroller()) {
            this.resizeScroller(width, height);
        }
        else {
            this.resizeGraph(width, height);
        }
    };
    SizeManager.prototype.resizeGraph = function (width, height) {
        this.graph.transform.resize(width, height);
    };
    SizeManager.prototype.resizeScroller = function (width, height) {
        this.graph.scroller.resize(width, height);
    };
    SizeManager.prototype.resizePage = function (width, height) {
        var instance = this.graph.scroller.widget;
        if (instance) {
            instance.updatePageSize(width, height);
        }
    };
    SizeManager.prototype.dispose = function () {
        util_1.SizeSensor.clear(this.getContainer());
    };
    __decorate([
        base_1.Base.dispose()
    ], SizeManager.prototype, "dispose", null);
    return SizeManager;
}(base_1.Base));
exports.SizeManager = SizeManager;
//# sourceMappingURL=size.js.map