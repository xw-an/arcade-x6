import { ObjectExt } from '../../util';
export const filter = {
    qualify: ObjectExt.isPlainObject,
    set(filter, { view }) {
        return `url(#${view.graph.defineFilter(filter)})`;
    },
};
//# sourceMappingURL=filter.js.map