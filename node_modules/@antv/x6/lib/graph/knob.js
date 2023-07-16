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
Object.defineProperty(exports, "__esModule", { value: true });
exports.KnobManager = void 0;
var base_1 = require("./base");
var KnobManager = /** @class */ (function (_super) {
    __extends(KnobManager, _super);
    function KnobManager() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.widgets = new Map();
        return _this;
    }
    Object.defineProperty(KnobManager.prototype, "isSelectionEnabled", {
        get: function () {
            return this.options.selecting.enabled === true;
        },
        enumerable: false,
        configurable: true
    });
    KnobManager.prototype.init = function () {
        this.startListening();
    };
    KnobManager.prototype.startListening = function () {
        this.graph.on('node:mouseup', this.onNodeMouseUp, this);
        this.graph.on('node:selected', this.onNodeSelected, this);
        this.graph.on('node:unselected', this.onNodeUnSelected, this);
    };
    KnobManager.prototype.stopListening = function () {
        this.graph.off('node:mouseup', this.onNodeMouseUp, this);
        this.graph.off('node:selected', this.onNodeSelected, this);
        this.graph.off('node:unselected', this.onNodeUnSelected, this);
    };
    KnobManager.prototype.onNodeMouseUp = function (_a) {
        var node = _a.node;
        if (!this.isSelectionEnabled) {
            var widgets = this.graph.hook.createKnob(node, { clearAll: true });
            if (widgets) {
                this.widgets.set(node, widgets);
            }
        }
    };
    KnobManager.prototype.onNodeSelected = function (_a) {
        var node = _a.node;
        if (this.isSelectionEnabled) {
            var widgets = this.graph.hook.createKnob(node, { clearAll: false });
            if (widgets) {
                this.widgets.set(node, widgets);
            }
        }
    };
    KnobManager.prototype.onNodeUnSelected = function (_a) {
        var node = _a.node;
        if (this.isSelectionEnabled) {
            var widgets = this.widgets.get(node);
            if (widgets) {
                widgets.forEach(function (widget) { return widget.dispose(); });
            }
            this.widgets.delete(node);
        }
    };
    return KnobManager;
}(base_1.Base));
exports.KnobManager = KnobManager;
//# sourceMappingURL=knob.js.map