import { Registry } from '../registry';
import * as connectors from './main';
export var Connector;
(function (Connector) {
    Connector.presets = connectors;
    Connector.registry = Registry.create({
        type: 'connector',
    });
    Connector.registry.register(Connector.presets, true);
})(Connector || (Connector = {}));
//# sourceMappingURL=index.js.map