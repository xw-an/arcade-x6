import { Registry } from '../registry';
import * as anchors from './main';
export var NodeAnchor;
(function (NodeAnchor) {
    NodeAnchor.presets = anchors;
    NodeAnchor.registry = Registry.create({
        type: 'node endpoint',
    });
    NodeAnchor.registry.register(NodeAnchor.presets, true);
})(NodeAnchor || (NodeAnchor = {}));
//# sourceMappingURL=index.js.map