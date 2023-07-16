import { Registry } from '../registry';
import * as filters from './main';
export var Filter;
(function (Filter) {
    Filter.presets = filters;
    Filter.registry = Registry.create({
        type: 'filter',
    });
    Filter.registry.register(Filter.presets, true);
})(Filter || (Filter = {}));
//# sourceMappingURL=index.js.map