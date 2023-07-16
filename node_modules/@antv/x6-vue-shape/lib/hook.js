"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var x6_1 = require("@antv/x6");
var registry_1 = require("./registry");
x6_1.Graph.Hook.prototype.getVueComponent = function (node) {
    var getVueComponent = this.options.getVueComponent;
    if (typeof getVueComponent === 'function') {
        var ret_1 = x6_1.FunctionExt.call(getVueComponent, this.graph, node);
        if (ret_1 != null) {
            return ret_1;
        }
    }
    var ret = node.getComponent();
    if (typeof ret === 'string') {
        var component = registry_1.registry.get(ret);
        if (component == null) {
            return registry_1.registry.onNotFound(ret);
        }
        ret = component;
    }
    return ret;
};
//# sourceMappingURL=hook.js.map