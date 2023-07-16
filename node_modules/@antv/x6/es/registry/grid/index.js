import { Dom, Vector } from '../../util';
import { Registry } from '../registry';
import * as patterns from './main';
export class Grid {
    constructor() {
        this.patterns = {};
        this.root = Vector.create(Dom.createSvgDocument(), {
            width: '100%',
            height: '100%',
        }, [Dom.createSvgElement('defs')]).node;
    }
    add(id, elem) {
        const firstChild = this.root.childNodes[0];
        if (firstChild) {
            firstChild.appendChild(elem);
        }
        this.patterns[id] = elem;
        Vector.create('rect', {
            width: '100%',
            height: '100%',
            fill: `url(#${id})`,
        }).appendTo(this.root);
    }
    get(id) {
        return this.patterns[id];
    }
    has(id) {
        return this.patterns[id] != null;
    }
}
(function (Grid) {
    Grid.presets = patterns;
    Grid.registry = Registry.create({
        type: 'grid',
    });
    Grid.registry.register(Grid.presets, true);
})(Grid || (Grid = {}));
//# sourceMappingURL=index.js.map