import { Registry } from '../registry';
import * as markers from './main';
import { normalize as normalizeMarker } from './util';
export var Marker;
(function (Marker) {
    Marker.presets = markers;
    Marker.registry = Registry.create({
        type: 'marker',
    });
    Marker.registry.register(Marker.presets, true);
})(Marker || (Marker = {}));
(function (Marker) {
    Marker.normalize = normalizeMarker;
})(Marker || (Marker = {}));
//# sourceMappingURL=index.js.map