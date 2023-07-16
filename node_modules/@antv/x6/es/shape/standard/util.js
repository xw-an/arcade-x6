import { ObjectExt } from '../../util';
import { Base } from '../base';
export function getMarkup(tagName, selector = 'body') {
    return [
        {
            tagName,
            selector,
        },
        {
            tagName: 'text',
            selector: 'label',
        },
    ];
}
export function createShape(shape, config, options = {}) {
    const defaults = {
        constructorName: shape,
        markup: getMarkup(shape, options.selector),
        attrs: {
            [shape]: Object.assign({}, Base.bodyAttr),
        },
    };
    const base = options.parent || Base;
    return base.define(ObjectExt.merge(defaults, config, { shape }));
}
//# sourceMappingURL=util.js.map