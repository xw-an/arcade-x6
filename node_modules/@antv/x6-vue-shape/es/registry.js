import { Graph, Registry } from '@antv/x6';
export const registry = Registry.create({
    type: 'vue componnet',
});
Graph.registerVueComponent = registry.register;
Graph.unregisterVueComponent = registry.unregister;
//# sourceMappingURL=registry.js.map