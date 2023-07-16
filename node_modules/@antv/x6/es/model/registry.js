export var ShareRegistry;
(function (ShareRegistry) {
    let edgeRegistry;
    let nodeRegistry;
    function exist(name, isNode) {
        return isNode
            ? edgeRegistry != null && edgeRegistry.exist(name)
            : nodeRegistry != null && nodeRegistry.exist(name);
    }
    ShareRegistry.exist = exist;
    function setEdgeRegistry(registry) {
        edgeRegistry = registry;
    }
    ShareRegistry.setEdgeRegistry = setEdgeRegistry;
    function setNodeRegistry(registry) {
        nodeRegistry = registry;
    }
    ShareRegistry.setNodeRegistry = setNodeRegistry;
})(ShareRegistry || (ShareRegistry = {}));
//# sourceMappingURL=registry.js.map