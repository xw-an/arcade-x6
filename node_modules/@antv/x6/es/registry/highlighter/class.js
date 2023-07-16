import { Dom } from '../../util';
import { Util } from '../../global';
const defaultClassName = Util.prefix('highlighted');
export const className = {
    highlight(cellView, magnet, options) {
        const cls = (options && options.className) || defaultClassName;
        Dom.addClass(magnet, cls);
    },
    unhighlight(cellView, magnet, options) {
        const cls = (options && options.className) || defaultClassName;
        Dom.removeClass(magnet, cls);
    },
};
//# sourceMappingURL=class.js.map