import { Registry } from '../../registry';
import { Markup } from '../../view';
import { Node } from '../../model/node';
import { NodeView } from '../../view/node';
import { Base } from '../base';
export class HTML extends Base {
    get html() {
        return this.getHTML();
    }
    set html(val) {
        this.setHTML(val);
    }
    getHTML() {
        return this.store.get('html');
    }
    setHTML(html, options = {}) {
        if (html == null) {
            this.removeHTML(options);
        }
        else {
            this.store.set('html', html, options);
        }
        return this;
    }
    removeHTML(options = {}) {
        return this.store.remove('html', options);
    }
}
(function (HTML) {
    class View extends NodeView {
        init() {
            super.init();
            this.cell.on('change:*', () => {
                const shouldUpdate = this.graph.hook.shouldUpdateHTMLComponent(this.cell);
                if (shouldUpdate) {
                    this.renderHTMLComponent();
                }
            });
        }
        confirmUpdate(flag) {
            const ret = super.confirmUpdate(flag);
            return this.handleAction(ret, View.action, () => this.renderHTMLComponent());
        }
        renderHTMLComponent() {
            const container = this.selectors.foContent;
            if (container) {
                const $wrap = this.$(container).empty();
                const component = this.graph.hook.getHTMLComponent(this.cell);
                if (component) {
                    if (typeof component === 'string') {
                        $wrap.html(component);
                    }
                    else {
                        $wrap.append(component);
                    }
                }
            }
        }
    }
    HTML.View = View;
    (function (View) {
        View.action = 'html';
        View.config({
            bootstrap: [View.action],
            actions: {
                html: View.action,
            },
        });
        NodeView.registry.register('html-view', View);
    })(View = HTML.View || (HTML.View = {}));
})(HTML || (HTML = {}));
(function (HTML) {
    HTML.config({
        view: 'html-view',
        markup: [
            {
                tagName: 'rect',
                selector: 'body',
            },
            Object.assign({}, Markup.getForeignObjectMarkup()),
            {
                tagName: 'text',
                selector: 'label',
            },
        ],
        attrs: {
            body: {
                fill: 'none',
                stroke: 'none',
                refWidth: '100%',
                refHeight: '100%',
            },
            fo: {
                refWidth: '100%',
                refHeight: '100%',
            },
        },
    });
    Node.registry.register('html', HTML);
})(HTML || (HTML = {}));
(function (HTML) {
    HTML.componentRegistry = Registry.create({
        type: 'html componnet',
    });
})(HTML || (HTML = {}));
//# sourceMappingURL=html.js.map