"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Util = void 0;
var util_1 = require("../geometry/util");
var util_2 = require("../registry/marker/util");
var config_1 = require("./config");
var Util;
(function (Util) {
    Util.snapToGrid = util_1.snapToGrid;
    Util.normalizeMarker = util_2.normalize;
    function prefix(suffix) {
        return config_1.Config.prefixCls + "-" + suffix;
    }
    Util.prefix = prefix;
})(Util = exports.Util || (exports.Util = {}));
(function (Util) {
    function makeTree(parent, options, parentNode, collector) {
        var _this = this;
        if (collector === void 0) { collector = []; }
        var children = typeof options.children === 'function'
            ? options.children(parent)
            : parent[options.children || 'children'];
        if (!parentNode) {
            parentNode = options.createNode(parent); // eslint-disable-line
            collector.push(parentNode);
        }
        if (Array.isArray(children)) {
            children.forEach(function (child) {
                var node = options.createNode(child);
                var edge = options.createEdge(parentNode, node);
                collector.push(node, edge);
                _this.makeTree(child, options, node, collector);
            });
        }
        return collector;
    }
    Util.makeTree = makeTree;
})(Util = exports.Util || (exports.Util = {}));
//# sourceMappingURL=util.js.map