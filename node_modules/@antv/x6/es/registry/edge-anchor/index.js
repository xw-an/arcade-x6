import { Registry } from '../registry';
import * as anchors from './main';
export var EdgeAnchor;
(function (EdgeAnchor) {
    EdgeAnchor.presets = anchors;
    EdgeAnchor.registry = Registry.create({
        type: 'edge endpoint',
    });
    EdgeAnchor.registry.register(EdgeAnchor.presets, true);
})(EdgeAnchor || (EdgeAnchor = {}));
//# sourceMappingURL=index.js.map