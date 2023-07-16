import { ObjectExt } from '../../util';
export const fill = {
    qualify: ObjectExt.isPlainObject,
    set(fill, { view }) {
        return `url(#${view.graph.defineGradient(fill)})`;
    },
};
//# sourceMappingURL=fill.js.map