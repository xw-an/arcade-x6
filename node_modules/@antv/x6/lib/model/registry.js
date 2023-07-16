"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShareRegistry = void 0;
var ShareRegistry;
(function (ShareRegistry) {
    var edgeRegistry;
    var nodeRegistry;
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
})(ShareRegistry = exports.ShareRegistry || (exports.ShareRegistry = {}));
//# sourceMappingURL=registry.js.map