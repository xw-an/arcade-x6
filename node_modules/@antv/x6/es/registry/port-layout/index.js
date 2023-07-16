import { Registry } from '../registry';
import * as layouts from './main';
export var PortLayout;
(function (PortLayout) {
    PortLayout.presets = layouts;
    PortLayout.registry = Registry.create({
        type: 'port layout',
    });
    PortLayout.registry.register(PortLayout.presets, true);
})(PortLayout || (PortLayout = {}));
//# sourceMappingURL=index.js.map