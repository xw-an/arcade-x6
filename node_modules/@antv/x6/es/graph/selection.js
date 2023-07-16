var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { ModifierKey } from '../types';
import { Base } from './base';
export class SelectionManager extends Base {
    constructor() {
        super(...arguments);
        this.movedMap = new WeakMap();
        this.unselectMap = new WeakMap();
    }
    get widgetOptions() {
        return this.options.selecting;
    }
    get rubberbandDisabled() {
        return (this.widgetOptions.enabled !== true ||
            this.widgetOptions.rubberband !== true);
    }
    get disabled() {
        return this.widgetOptions.enabled !== true;
    }
    get length() {
        return this.widget.length;
    }
    get cells() {
        return this.widget.cells;
    }
    init() {
        this.widget = this.graph.hook.createSelection();
        this.startListening();
    }
    startListening() {
        this.graph.on('blank:mousedown', this.onBlankMouseDown, this);
        this.graph.on('blank:click', this.onBlankClick, this);
        this.graph.on('cell:mousemove', this.onCellMouseMove, this);
        this.graph.on('cell:mouseup', this.onCellMouseUp, this);
        this.widget.on('box:mousedown', this.onBoxMouseDown, this);
    }
    stopListening() {
        this.graph.off('blank:mousedown', this.onBlankMouseDown, this);
        this.graph.off('blank:click', this.onBlankClick, this);
        this.graph.off('cell:mousemove', this.onCellMouseMove, this);
        this.graph.off('cell:mouseup', this.onCellMouseUp, this);
        this.widget.off('box:mousedown', this.onBoxMouseDown, this);
    }
    onBlankMouseDown({ e }) {
        if (this.allowRubberband(e, true) ||
            (this.allowRubberband(e) &&
                !this.graph.scroller.allowPanning(e, true) &&
                !this.graph.panning.allowPanning(e, true))) {
            this.startRubberband(e);
        }
    }
    onBlankClick() {
        this.clean();
    }
    allowRubberband(e, strict) {
        return (!this.rubberbandDisabled &&
            ModifierKey.isMatch(e, this.widgetOptions.modifiers, strict) &&
            this.graph.hook.allowRubberband(e));
    }
    allowMultipleSelection(e) {
        return (this.isMultiple() &&
            ModifierKey.isMatch(e, this.widgetOptions.multipleSelectionModifiers));
    }
    onCellMouseMove({ cell }) {
        this.movedMap.set(cell, true);
    }
    onCellMouseUp({ e, cell }) {
        const options = this.widgetOptions;
        let disabled = this.disabled;
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
    }
    onBoxMouseDown({ e, cell }) {
        if (!this.disabled) {
            if (this.allowMultipleSelection(e)) {
                this.unselect(cell);
                this.unselectMap.set(cell, true);
            }
        }
    }
    isEmpty() {
        return this.length <= 0;
    }
    isSelected(cell) {
        return this.widget.isSelected(cell);
    }
    getCells(cells) {
        return (Array.isArray(cells) ? cells : [cells])
            .map((cell) => typeof cell === 'string' ? this.graph.getCellById(cell) : cell)
            .filter((cell) => cell != null);
    }
    select(cells, options = {}) {
        const selected = this.getCells(cells);
        if (selected.length) {
            if (this.isMultiple()) {
                this.widget.select(selected, options);
            }
            else {
                this.reset(selected.slice(0, 1), options);
            }
        }
        return this;
    }
    unselect(cells, options = {}) {
        this.widget.unselect(this.getCells(cells), options);
        return this;
    }
    reset(cells, options = {}) {
        this.widget.reset(cells ? this.getCells(cells) : [], options);
        return this;
    }
    clean(options = {}) {
        this.widget.clean(options);
        return this;
    }
    enable() {
        if (this.disabled) {
            this.widgetOptions.enabled = true;
        }
        return this;
    }
    disable() {
        if (!this.disabled) {
            this.widgetOptions.enabled = false;
        }
        return this;
    }
    startRubberband(e) {
        if (!this.rubberbandDisabled) {
            this.widget.startSelecting(e);
        }
        return this;
    }
    enableRubberband() {
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
    }
    disableRubberband() {
        if (!this.rubberbandDisabled) {
            this.widgetOptions.rubberband = false;
        }
        return this;
    }
    isMultiple() {
        return this.widgetOptions.multiple !== false;
    }
    enableMultiple() {
        this.widgetOptions.multiple = true;
        return this;
    }
    disableMultiple() {
        this.widgetOptions.multiple = false;
        return this;
    }
    setModifiers(modifiers) {
        this.widgetOptions.modifiers = modifiers;
        return this;
    }
    setContent(content) {
        this.widget.setContent(content);
        return this;
    }
    setFilter(filter) {
        this.widget.setFilter(filter);
        return this;
    }
    dispose() {
        this.stopListening();
        this.widget.dispose();
    }
}
__decorate([
    Base.dispose()
], SelectionManager.prototype, "dispose", null);
//# sourceMappingURL=selection.js.map