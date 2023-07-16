import { Registry } from '../registry';
import * as patterns from './main';
export var Background;
(function (Background) {
    Background.presets = Object.assign({}, patterns);
    Background.presets['flip-x'] = patterns.flipX;
    Background.presets['flip-y'] = patterns.flipY;
    Background.presets['flip-xy'] = patterns.flipXY;
    Background.registry = Registry.create({
        type: 'background pattern',
    });
    Background.registry.register(Background.presets, true);
})(Background || (Background = {}));
//# sourceMappingURL=index.js.map