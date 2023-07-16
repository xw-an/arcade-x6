var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import { Base } from './base';
export class ClipboardManager extends Base {
    get commonOptions() {
        const _a = this.instanceOptions, { enabled } = _a, others = __rest(_a, ["enabled"]);
        return others;
    }
    get instanceOptions() {
        return this.options.clipboard;
    }
    get cells() {
        return this.widget.cells;
    }
    get disabled() {
        return this.instanceOptions.enabled !== true;
    }
    init() {
        this.widget = this.graph.hook.createClipboard();
        this.widget.deserialize(this.instanceOptions);
    }
    enable() {
        if (this.disabled) {
            this.instanceOptions.enabled = true;
        }
    }
    disable() {
        if (!this.disabled) {
            this.instanceOptions.enabled = false;
        }
    }
    copy(cells, options = {}) {
        if (!this.disabled) {
            this.widget.copy(cells, this.graph, Object.assign(Object.assign({}, this.commonOptions), options));
            this.graph.trigger('clipboard:changed', { cells });
        }
    }
    cut(cells, options = {}) {
        if (!this.disabled) {
            this.widget.cut(cells, this.graph, Object.assign(Object.assign({}, this.commonOptions), options));
            this.graph.trigger('clipboard:changed', { cells });
        }
    }
    paste(options = {}, graph = this.graph) {
        if (!this.disabled) {
            return this.widget.paste(graph, Object.assign(Object.assign({}, this.commonOptions), options));
        }
        return [];
    }
    clean(force) {
        if (!this.disabled || force) {
            this.widget.clean();
            this.graph.trigger('clipboard:changed', { cells: [] });
        }
    }
    isEmpty() {
        return this.widget.isEmpty();
    }
    dispose() {
        this.clean(true);
    }
}
__decorate([
    Base.dispose()
], ClipboardManager.prototype, "dispose", null);
//# sourceMappingURL=clipboard.js.map