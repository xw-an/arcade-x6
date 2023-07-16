import { Registry } from '../registry';
import * as strategies from './main';
export var ConnectionStrategy;
(function (ConnectionStrategy) {
    ConnectionStrategy.presets = strategies;
    ConnectionStrategy.registry = Registry.create({
        type: 'connection strategy',
    });
    ConnectionStrategy.registry.register(ConnectionStrategy.presets, true);
})(ConnectionStrategy || (ConnectionStrategy = {}));
//# sourceMappingURL=index.js.map