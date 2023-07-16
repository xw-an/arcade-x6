import { NodeView } from '../../view';
import { getName, createShape } from './util';
const viewName = getName('text');
export class Text extends createShape('text', {
    view: viewName,
    attrs: {
        text: {
            fontSize: 18,
            fill: '#000000',
            stroke: null,
            refX: 0.5,
            refY: 0.5,
        },
    },
}, { noText: true }) {
}
(function (Text) {
    class View extends NodeView {
        confirmUpdate(flag, options = {}) {
            let ret = super.confirmUpdate(flag, options);
            if (this.hasAction(ret, 'scale')) {
                this.resize();
                ret = this.removeAction(ret, 'scale');
            }
            return ret;
        }
    }
    Text.View = View;
    View.config({
        actions: {
            attrs: ['scale'],
        },
    });
    NodeView.registry.register(viewName, View);
})(Text || (Text = {}));
//# sourceMappingURL=text.js.map