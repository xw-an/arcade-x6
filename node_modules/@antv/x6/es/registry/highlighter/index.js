import { Registry } from '../registry';
import * as highlighters from './main';
export var Highlighter;
(function (Highlighter) {
    function check(name, highlighter) {
        if (typeof highlighter.highlight !== 'function') {
            throw new Error(`Highlighter '${name}' is missing required \`highlight()\` method`);
        }
        if (typeof highlighter.unhighlight !== 'function') {
            throw new Error(`Highlighter '${name}' is missing required \`unhighlight()\` method`);
        }
    }
    Highlighter.check = check;
})(Highlighter || (Highlighter = {}));
(function (Highlighter) {
    Highlighter.presets = highlighters;
    Highlighter.registry = Registry.create({
        type: 'highlighter',
    });
    Highlighter.registry.register(Highlighter.presets, true);
})(Highlighter || (Highlighter = {}));
//# sourceMappingURL=index.js.map