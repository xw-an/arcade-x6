var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Dom } from '../util';
import { Highlighter } from '../registry';
import { Base } from './base';
export class HighlightManager extends Base {
    constructor() {
        super(...arguments);
        this.highlights = {};
    }
    init() {
        this.startListening();
    }
    startListening() {
        this.graph.on('cell:highlight', this.onCellHighlight, this);
        this.graph.on('cell:unhighlight', this.onCellUnhighlight, this);
    }
    stopListening() {
        this.graph.off('cell:highlight', this.onCellHighlight, this);
        this.graph.off('cell:unhighlight', this.onCellUnhighlight, this);
    }
    onCellHighlight({ view: cellView, magnet, options = {}, }) {
        const resolved = this.resolveHighlighter(options);
        if (!resolved) {
            return;
        }
        const key = this.getHighlighterId(magnet, resolved);
        if (!this.highlights[key]) {
            const highlighter = resolved.highlighter;
            highlighter.highlight(cellView, magnet, Object.assign({}, resolved.args));
            this.highlights[key] = {
                cellView,
                magnet,
                highlighter,
                args: resolved.args,
            };
        }
    }
    onCellUnhighlight({ magnet, options = {}, }) {
        const resolved = this.resolveHighlighter(options);
        if (!resolved) {
            return;
        }
        const id = this.getHighlighterId(magnet, resolved);
        this.unhighlight(id);
    }
    resolveHighlighter(options) {
        const graphOptions = this.options;
        let highlighterDef = options.highlighter;
        if (highlighterDef == null) {
            // check for built-in types
            const type = options.type;
            highlighterDef =
                (type && graphOptions.highlighting[type]) ||
                    graphOptions.highlighting.default;
        }
        if (highlighterDef == null) {
            return null;
        }
        const def = typeof highlighterDef === 'string'
            ? {
                name: highlighterDef,
            }
            : highlighterDef;
        const name = def.name;
        const highlighter = Highlighter.registry.get(name);
        if (highlighter == null) {
            return Highlighter.registry.onNotFound(name);
        }
        Highlighter.check(name, highlighter);
        return {
            name,
            highlighter,
            args: def.args || {},
        };
    }
    getHighlighterId(magnet, options) {
        Dom.ensureId(magnet);
        return options.name + magnet.id + JSON.stringify(options.args);
    }
    unhighlight(id) {
        const highlight = this.highlights[id];
        if (highlight) {
            highlight.highlighter.unhighlight(highlight.cellView, highlight.magnet, highlight.args);
            delete this.highlights[id];
        }
    }
    dispose() {
        Object.keys(this.highlights).forEach((id) => this.unhighlight(id));
        this.stopListening();
    }
}
__decorate([
    HighlightManager.dispose()
], HighlightManager.prototype, "dispose", null);
//# sourceMappingURL=highlight.js.map