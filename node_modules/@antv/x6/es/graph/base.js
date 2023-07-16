import { Disposable } from '../common';
export class Base extends Disposable {
    constructor(graph) {
        super();
        this.graph = graph;
        this.init();
    }
    get options() {
        return this.graph.options;
    }
    get model() {
        return this.graph.model;
    }
    get view() {
        return this.graph.view;
    }
    init() { }
}
//# sourceMappingURL=base.js.map