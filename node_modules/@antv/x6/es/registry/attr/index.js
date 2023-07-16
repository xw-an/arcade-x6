import { FunctionExt } from '../../util';
import { Registry } from '../registry';
import { raw } from './raw';
import * as attrs from './main';
export var Attr;
(function (Attr) {
    function isValidDefinition(def, val, options) {
        if (def != null) {
            if (typeof def === 'string') {
                return true;
            }
            if (typeof def.qualify !== 'function' ||
                FunctionExt.call(def.qualify, this, val, options)) {
                return true;
            }
        }
        return false;
    }
    Attr.isValidDefinition = isValidDefinition;
})(Attr || (Attr = {}));
(function (Attr) {
    Attr.presets = Object.assign(Object.assign({}, raw), attrs);
    Attr.registry = Registry.create({
        type: 'attribute definition',
    });
    Attr.registry.register(Attr.presets, true);
})(Attr || (Attr = {}));
//# sourceMappingURL=index.js.map