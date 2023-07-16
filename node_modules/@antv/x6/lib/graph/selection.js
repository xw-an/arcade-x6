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
exports.SelectionManager = void 0;
var types_1 = require("../types");
var base_1 = require("./base");
var SelectionManager = /** @class */ (function (_super) {
    __extends(SelectionManager, _super);
    function SelectionManager() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.movedMap = new WeakMap();
        _this.unselectMap = new WeakMap();
        return _this;
    }
    Object.defineProperty(SelectionManager.prototype, "widgetOptions", {
        get: function () {
            return this.options.selecting;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SelectionManager.prototype, "rubberbandDisabled", {
        get: function () {
            return (this.widgetOptions.enabled !== true ||
                this.widgetOptions.rubberband !== true);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SelectionManager.prototype, "disabled", {
        get: function () {
            return this.widgetOptions.enabled !== true;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SelectionManager.prototype, "length", {
        get: function () {
            return this.widget.length;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SelectionManager.prototype, "cells", {
        get: function () {
            return this.widget.cells;
        },
        enumerable: false,
        configurable: true
    });
    SelectionManager.prototype.init = function () {
        this.widget = this.graph.hook.createSelection();
        this.startListening();
    };
    SelectionManager.prototype.startListening = function () {
        this.graph.on('blank:mousedown', this.onBlankMouseDown, this);
        this.graph.on('blank:click', this.onBlankClick, this);
        this.graph.on('cell:mousemove', this.onCellMouseMove, this);
        this.graph.on('cell:mouseup', this.onCellMouseUp, this);
        this.widget.on('box:mousedown', this.onBoxMouseDown, this);
    };
    SelectionManager.prototype.stopListening = function () {
        this.graph.off('blank:mousedown', this.onBlankMouseDown, this);
        this.graph.off('blank:click', this.onBlankClick, this);
        this.graph.off('cell:mousemove', this.onCellMouseMove, this);
        this.graph.off('cell:mouseup', this.onCellMouseUp, this);
        this.widget.off('box:mousedown', this.onBoxMouseDown, this);
    };
    SelectionManager.prototype.onBlankMouseDown = function (_a) {
        var e = _a.e;
        if (this.allowRubberband(e, true) ||
            (this.allowRubberband(e) &&
                !this.graph.scroller.allowPanning(e, true) &&
                !this.graph.panning.allowPanning(e, true))) {
            this.startRubberband(e);
        }
    };
    SelectionManager.prototype.onBlankClick = function () {
        this.clean();
    };
    SelectionManager.prototype.allowRubberband = function (e, strict) {
        return (!this.rubberbandDisabled &&
            types_1.ModifierKey.isMatch(e, this.widgetOptions.modifiers, strict) &&
            this.graph.hook.allowRubberband(e));
    };
    SelectionManager.prototype.allowMultipleSelection = function (e) {
        return (this.isMultiple() &&
            types_1.ModifierKey.isMatch(e, this.widgetOptions.multipleSelectionModifiers));
    };
    SelectionManager.prototype.onCellMouseMove = function (_a) {
        var cell = _a.cell;
        this.movedMap.set(cell, true);
    };
    SelectionManager.prototype.onCellMouseUp = function (_a) {
        var e = _a.e, cell = _a.cell;
        var options = this.widgetOptions;
        var disabled = this.disabled;
        if (!disabled && this.movedMap.has(cell)) {
            disabled = options.selectCellOnMoved === false;
            if (!disabled) {
                disabled = options.selectNodeOnMoved === false && cell.isNode();
            }
            if (!disabled) {
                disabled = options.selectEdgeOnMoved === false && cell.isEdge();
            }
        }
        if (!disabled) {
            if (!this.allowMultipleSelection(e)) {
                this.reset(cell);
            }
            else if (this.unselectMap.has(cell)) {
                this.unselectMap.delete(cell);
            }
            else if (this.isSelected(cell)) {
                this.unselect(cell);
            }
            else {
                this.select(cell);
            }
        }
        this.movedMap.delete(cell);
    };
    SelectionManager.prototype.onBoxMouseDown = function (_a) {
        var e = _a.e, cell = _a.cell;
        if (!this.disabled) {
            if (this.allowMultipleSelection(e)) {
                this.unselect(cell);
                this.unselectMap.set(cell, true);
            }
        }
    };
    SelectionManager.prototype.isEmpty = function () {
        return this.length <= 0;
    };
    SelectionManager.prototype.isSelected = function (cell) {
        return this.widget.isSelected(cell);
    };
    SelectionManager.prototype.getCells = function (cells) {
        var _this = this;
        return (Array.isArray(cells) ? cells : [cells])
            .map(function (cell) {
            return typeof cell === 'string' ? _this.graph.getCellById(cell) : cell;
        })
            .filter(function (cell) { return cell != null; });
    };
    SelectionManager.prototype.select = function (cells, options) {
        if (options === void 0) { options = {}; }
        var selected = this.getCells(cells);
        if (selected.length) {
            if (this.isMultiple()) {
                this.widget.select(selected, options);
            }
            else {
                this.reset(selected.slice(0, 1), options);
            }
        }
        return this;
    };
    SelectionManager.prototype.unselect = function (cells, options) {
        if (options === void 0) { options = {}; }
        this.widget.unselect(this.getCells(cells), options);
        return this;
    };
    SelectionManager.prototype.reset = function (cells, options) {
        if (options === void 0) { options = {}; }
        this.widget.reset(cells ? this.getCells(cells) : [], options);
        return this;
    };
    SelectionManager.prototype.clean = function (options) {
        if (options === void 0) { options = {}; }
        this.widget.clean(options);
        return this;
    };
    SelectionManager.prototype.enable = function () {
        if (this.disabled) {
            this.widgetOptions.enabled = true;
        }
        return this;
    };
    SelectionManager.prototype.disable = function () {
        if (!this.disabled) {
            this.widgetOptions.enabled = false;
        }
        return this;
    };
    SelectionManager.prototype.startRubberband = function (e) {
        if (!this.rubberbandDisabled) {
            this.widget.startSelecting(e);
        }
        return this;
    };
    SelectionManager.prototype.enableRubberband = function () {
        if (this.rubberbandDisabled) {
            this.widgetOptions.rubberband = true;
            // if (
            //   ModifierKey.equals(
            //     this.graph.options.scroller.modifiers,
            //     this.graph.options.selecting.modifiers,
            //   )
            // ) {
            //   this.graph.scroller.disablePanning()
            // }
        }
        return this;
    };
    SelectionManager.prototype.disableRubberband = function () {
        if (!this.rubberbandDisabled) {
            this.widgetOptions.rubberband = false;
        }
        return this;
    };
    SelectionManager.prototype.isMultiple = function () {
        return this.widgetOptions.multiple !== false;
    };
    SelectionManager.prototype.enableMultiple = function () {
        this.widgetOptions.multiple = true;
        return this;
    };
    SelectionManager.prototype.disableMultiple = function () {
        this.widgetOptions.multiple = false;
        return this;
    };
    SelectionManager.prototype.setModifiers = function (modifiers) {
        this.widgetOptions.modifiers = modifiers;
        return this;
    };
    SelectionManager.prototype.setContent = function (content) {
        this.widget.setContent(content);
        return this;
    };
    SelectionManager.prototype.setFilter = function (filter) {
        this.widget.setFilter(filter);
        return this;
    };
    SelectionManager.prototype.dispose = function () {
        this.stopListening();
        this.widget.dispose();
    };
    __decorate([
        base_1.Base.dispose()
    ], SelectionManager.prototype, "dispose", null);
    return SelectionManager;
}(base_1.Base));
exports.SelectionManager = SelectionManager;
//# sourceMappingURL=selection.js.map