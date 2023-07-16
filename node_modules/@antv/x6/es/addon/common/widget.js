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
import { View } from '../../view';
export class Widget extends View {
    constructor(options) {
        super();
        const _a = options, { view, cell, node, edge, graph } = _a, localOptions = __rest(_a, ["view", "cell", "node", "edge", "graph"]);
        if (view) {
            this.view = view;
            this.cell = view.cell;
            this.graph = view.graph;
            this.model = this.graph.model;
        }
        else if ((cell || edge || node) && graph) {
            this.cell = node || edge || cell;
            this.view = graph.renderer.findViewByCell(this.cell);
            this.graph = graph;
            this.model = this.graph.model;
        }
        const ctor = this.constructor;
        if (options.clearAll !== false) {
            ctor.removeInstances(this.graph);
        }
        ctor.register(this);
        this.init(localOptions);
    }
    static ensureCache() {
        if (!this.instanceCache.has(this)) {
            this.instanceCache.set(this, {});
        }
        return this.instanceCache.get(this);
    }
    static register(instance, graph) {
        if (graph == null) {
            // eslint-disable-next-line
            graph = instance.graph;
        }
        const dic = this.ensureCache();
        let cache = dic[graph.view.cid];
        if (cache == null) {
            cache = dic[graph.view.cid] = {};
        }
        cache[instance.cid] = instance;
    }
    static unregister(instance, graph) {
        if (graph == null) {
            // eslint-disable-next-line
            graph = instance.graph;
        }
        const dic = this.ensureCache();
        if (dic[graph.view.cid]) {
            delete dic[graph.view.cid][instance.cid];
        }
    }
    static removeInstances(graph) {
        const dic = this.ensureCache();
        const cache = dic[graph.view.cid];
        if (cache) {
            Object.keys(cache).forEach((cid) => {
                const instance = cache[cid];
                if (instance) {
                    instance.remove();
                }
            });
        }
    }
    static getInstances(graph) {
        const dic = this.ensureCache();
        return dic[graph.view.cid] || {};
    }
    init(options) { } // eslint-disable-line
    render() {
        return this;
    }
    startListening() {
        if (this.options.clearOnBlankMouseDown !== false) {
            this.graph.on('blank:mousedown', this.remove, this);
        }
    }
    stopListening() {
        if (this.options.clearOnBlankMouseDown !== false) {
            this.graph.off('blank:mousedown', this.remove, this);
        }
    }
    remove() {
        this.stopListening();
        const ctor = this.constructor;
        ctor.unregister(this);
        return super.remove();
    }
    dispose() {
        this.remove();
    }
}
// #region static
Widget.instanceCache = new WeakMap();
__decorate([
    View.dispose()
], Widget.prototype, "dispose", null);
//# sourceMappingURL=widget.js.map