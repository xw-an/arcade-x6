import { Graph, FunctionExt } from '@antv/x6';
import { registry } from './registry';
Graph.Hook.prototype.getVueComponent = function (node) {
    const getVueComponent = this.options.getVueComponent;
    if (typeof getVueComponent === 'function') {
        const ret = FunctionExt.call(getVueComponent, this.graph, node);
        if (ret != null) {
            return ret;
        }
    }
    let ret = node.getComponent();
    if (typeof ret === 'string') {
        const component = registry.get(ret);
        if (component == null) {
            return registry.onNotFound(ret);
        }
        ret = component;
    }
    return ret;
};
//# sourceMappingURL=hook.js.map