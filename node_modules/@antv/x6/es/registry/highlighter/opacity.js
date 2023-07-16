import { Dom } from '../../util';
import { Util } from '../../global';
const className = Util.prefix('highlight-opacity');
export const opacity = {
    highlight(cellView, magnet) {
        Dom.addClass(magnet, className);
    },
    unhighlight(cellView, magnetEl) {
        Dom.removeClass(magnetEl, className);
    },
};
//# sourceMappingURL=opacity.js.map