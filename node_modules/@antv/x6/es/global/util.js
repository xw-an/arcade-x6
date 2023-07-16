import { snapToGrid as snap } from '../geometry/util';
import { normalize } from '../registry/marker/util';
import { Config } from './config';
export var Util;
(function (Util) {
    Util.snapToGrid = snap;
    Util.normalizeMarker = normalize;
    function prefix(suffix) {
        return `${Config.prefixCls}-${suffix}`;
    }
    Util.prefix = prefix;
})(Util || (Util = {}));
(function (Util) {
    function makeTree(parent, options, parentNode, collector = []) {
        const children = typeof options.children === 'function'
            ? options.children(parent)
            : parent[options.children || 'children'];
        if (!parentNode) {
            parentNode = options.createNode(parent); // eslint-disable-line
            collector.push(parentNode);
        }
        if (Array.isArray(children)) {
            children.forEach((child) => {
                const node = options.createNode(child);
                const edge = options.createEdge(parentNode, node);
                collector.push(node, edge);
                this.makeTree(child, options, node, collector);
            });
        }
        return collector;
    }
    Util.makeTree = makeTree;
})(Util || (Util = {}));
//# sourceMappingURL=util.js.map