import { Node, Markup, ObjectExt } from '@antv/x6';
export class VueShape extends Node {
    get component() {
        return this.getComponent();
    }
    set component(val) {
        this.setComponent(val);
    }
    getComponent() {
        return this.store.get('component');
    }
    setComponent(component, options = {}) {
        if (component == null) {
            this.removeComponent(options);
        }
        else {
            this.store.set('component', component, options);
        }
        return this;
    }
    removeComponent(options = {}) {
        this.store.remove('component', options);
        return this;
    }
}
(function (VueShape) {
    function getMarkup(useForeignObject, primer = 'rect') {
        const markup = [
            {
                tagName: primer,
                selector: 'body',
            },
        ];
        if (useForeignObject) {
            markup.push(Markup.getForeignObjectMarkup());
        }
        else {
            markup.push({
                tagName: 'g',
                selector: 'content',
            });
        }
        markup.push({
            tagName: 'text',
            selector: 'label',
        });
        return markup;
    }
    VueShape.config({
        view: 'vue-shape-view',
        markup: getMarkup(true),
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
            label: {
                fontSize: 14,
                fill: '#333',
                refX: '50%',
                refY: '50%',
                textAnchor: 'middle',
                textVerticalAnchor: 'middle',
            },
        },
        propHooks(metadata) {
            if (metadata.markup == null) {
                const primer = metadata.primer;
                const useForeignObject = metadata.useForeignObject;
                if (primer != null || useForeignObject != null) {
                    metadata.markup = getMarkup(useForeignObject !== false, primer);
                    if (primer) {
                        if (metadata.attrs == null) {
                            metadata.attrs = {};
                        }
                        let attrs = {};
                        if (primer === 'circle') {
                            attrs = {
                                refCx: '50%',
                                refCy: '50%',
                                refR: '50%',
                            };
                        }
                        else if (primer === 'ellipse') {
                            attrs = {
                                refCx: '50%',
                                refCy: '50%',
                                refRx: '50%',
                                refRy: '50%',
                            };
                        }
                        if (primer !== 'rect') {
                            metadata.attrs = ObjectExt.merge({}, metadata.attrs, {
                                body: Object.assign({ refWidth: null, refHeight: null }, attrs),
                            });
                        }
                    }
                }
            }
            return metadata;
        },
    });
    Node.registry.register('vue-shape', VueShape, true);
})(VueShape || (VueShape = {}));
//# sourceMappingURL=node.js.map