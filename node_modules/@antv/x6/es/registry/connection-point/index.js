import { Registry } from '../registry';
import * as connectionPoints from './main';
export var ConnectionPoint;
(function (ConnectionPoint) {
    ConnectionPoint.presets = connectionPoints;
    ConnectionPoint.registry = Registry.create({
        type: 'connection point',
    });
    ConnectionPoint.registry.register(ConnectionPoint.presets, true);
})(ConnectionPoint || (ConnectionPoint = {}));
//# sourceMappingURL=index.js.map