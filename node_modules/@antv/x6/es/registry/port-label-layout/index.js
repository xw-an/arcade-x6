import { Registry } from '../registry';
import * as layouts from './main';
export var PortLabelLayout;
(function (PortLabelLayout) {
    PortLabelLayout.presets = layouts;
    PortLabelLayout.registry = Registry.create({
        type: 'port label layout',
    });
    PortLabelLayout.registry.register(PortLabelLayout.presets, true);
})(PortLabelLayout || (PortLabelLayout = {}));
//# sourceMappingURL=index.js.map