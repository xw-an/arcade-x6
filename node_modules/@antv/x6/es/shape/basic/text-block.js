import { Platform, StringExt, ObjectExt, Dom } from '../../util';
import { Node } from '../../model';
import { NodeView } from '../../view';
import { getName } from './util';
const contentSelector = '.text-block-content';
const registryName = getName('text-block');
export class TextBlock extends Node {
    get content() {
        return this.getContent();
    }
    set content(val) {
        this.setContent(val);
    }
    getContent() {
        return this.store.get('content', '');
    }
    setContent(content, options = {}) {
        this.store.set('content', content, options);
    }
    setup() {
        super.setup();
        this.store.on('change:*', (metadata) => {
            const key = metadata.key;
            if (key === 'content') {
                this.updateContent(this.getContent());
            }
            else if (key === 'size') {
                this.updateSize(this.getSize());
            }
        });
        this.updateSize(this.getSize());
        this.updateContent(this.getContent());
    }
    updateSize(size) {
        if (Platform.SUPPORT_FOREIGNOBJECT) {
            this.setAttrs({
                foreignObject: Object.assign({}, size),
                [contentSelector]: {
                    style: Object.assign({}, size),
                },
            });
        }
    }
    updateContent(content) {
        if (Platform.SUPPORT_FOREIGNOBJECT) {
            this.setAttrs({
                [contentSelector]: {
                    html: content ? StringExt.sanitizeHTML(content) : '',
                },
            });
        }
        else {
            this.setAttrs({
                [contentSelector]: {
                    text: content,
                },
            });
        }
    }
}
(function (TextBlock) {
    TextBlock.config({
        type: registryName,
        view: registryName,
        markup: [
            '<g class="rotatable">',
            '<g class="scalable"><rect/></g>',
            Platform.SUPPORT_FOREIGNOBJECT
                ? [
                    `<foreignObject>`,
                    `<body xmlns="http://www.w3.org/1999/xhtml">`,
                    `<div class="${contentSelector.substr(1)}" />`,
                    `</body>`,
                    `</foreignObject>`,
                ].join('')
                : `<text class="${contentSelector.substr(1)}"/>`,
            '</g>',
        ].join(''),
        attrs: {
            '.': {
                fill: '#ffffff',
                stroke: 'none',
            },
            rect: {
                fill: '#ffffff',
                stroke: '#000000',
                width: 80,
                height: 100,
            },
            text: {
                fill: '#000000',
                fontSize: 14,
                fontFamily: 'Arial, helvetica, sans-serif',
            },
            body: {
                style: {
                    background: 'transparent',
                    position: 'static',
                    margin: 0,
                    padding: 0,
                },
            },
            foreignObject: {
                style: {
                    overflow: 'hidden',
                },
            },
            [contentSelector]: {
                refX: 0.5,
                refY: 0.5,
                yAlign: 'middle',
                xAlign: 'middle',
                style: {
                    textAlign: 'center',
                    verticalAlign: 'middle',
                    display: 'table-cell',
                    padding: '0 5px',
                    margin: 0,
                },
            },
        },
    });
    Node.registry.register(registryName, TextBlock);
})(TextBlock || (TextBlock = {}));
(function (TextBlock) {
    const contentAction = 'content';
    class View extends NodeView {
        confirmUpdate(flag, options = {}) {
            let ret = super.confirmUpdate(flag, options);
            if (this.hasAction(ret, contentAction)) {
                this.updateContent();
                ret = this.removeAction(ret, contentAction);
            }
            return ret;
        }
        update(partialAttrs) {
            if (Platform.SUPPORT_FOREIGNOBJECT) {
                super.update(partialAttrs);
            }
            else {
                const node = this.cell;
                const attrs = Object.assign({}, (partialAttrs || node.getAttrs()));
                delete attrs[contentSelector];
                super.update(attrs);
                if (!partialAttrs || ObjectExt.has(partialAttrs, contentSelector)) {
                    this.updateContent(partialAttrs);
                }
            }
        }
        updateContent(partialAttrs) {
            if (Platform.SUPPORT_FOREIGNOBJECT) {
                super.update(partialAttrs);
            }
            else {
                const node = this.cell;
                const textAttrs = (partialAttrs || node.getAttrs())[contentSelector];
                // Break the text to fit the node size taking into
                // account the attributes set on the node.
                const text = Dom.breakText(node.getContent(), node.getSize(), textAttrs, {
                    svgDocument: this.graph.view.svg,
                });
                const attrs = {
                    [contentSelector]: ObjectExt.merge({}, textAttrs, { text }),
                };
                super.update(attrs);
            }
        }
    }
    TextBlock.View = View;
    (function (View) {
        View.config({
            bootstrap: ['render', contentAction],
            actions: Platform.SUPPORT_FOREIGNOBJECT
                ? {}
                : {
                    size: contentAction,
                    content: contentAction,
                },
        });
        NodeView.registry.register(registryName, View);
    })(View = TextBlock.View || (TextBlock.View = {}));
})(TextBlock || (TextBlock = {}));
//# sourceMappingURL=text-block.js.map