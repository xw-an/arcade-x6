import { ObjectExt } from '../../util';
export const style = {
    qualify: ObjectExt.isPlainObject,
    set(styles, { view, elem }) {
        view.$(elem).css(styles);
    },
};
//# sourceMappingURL=style.js.map