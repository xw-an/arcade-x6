import { Base } from './base';
export class KnobManager extends Base {
    constructor() {
        super(...arguments);
        this.widgets = new Map();
    }
    get isSelectionEnabled() {
        return this.options.selecting.enabled === true;
    }
    init() {
        this.startListening();
    }
    startListening() {
        this.graph.on('node:mouseup', this.onNodeMouseUp, this);
        this.graph.on('node:selected', this.onNodeSelected, this);
        this.graph.on('node:unselected', this.onNodeUnSelected, this);
    }
    stopListening() {
        this.graph.off('node:mouseup', this.onNodeMouseUp, this);
        this.graph.off('node:selected', this.onNodeSelected, this);
        this.graph.off('node:unselected', this.onNodeUnSelected, this);
    }
    onNodeMouseUp({ node }) {
        if (!this.isSelectionEnabled) {
            const widgets = this.graph.hook.createKnob(node, { clearAll: true });
            if (widgets) {
                this.widgets.set(node, widgets);
            }
        }
    }
    onNodeSelected({ node }) {
        if (this.isSelectionEnabled) {
            const widgets = this.graph.hook.createKnob(node, { clearAll: false });
            if (widgets) {
                this.widgets.set(node, widgets);
            }
        }
    }
    onNodeUnSelected({ node }) {
        if (this.isSelectionEnabled) {
            const widgets = this.widgets.get(node);
            if (widgets) {
                widgets.forEach((widget) => widget.dispose());
            }
            this.widgets.delete(node);
        }
    }
}
//# sourceMappingURL=knob.js.map