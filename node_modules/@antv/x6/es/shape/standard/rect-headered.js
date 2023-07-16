import { Node } from '../../model/node';
import { Base } from '../base';
export const HeaderedRect = Node.define({
    shape: 'rect-headered',
    markup: [
        {
            tagName: 'rect',
            selector: 'body',
        },
        {
            tagName: 'rect',
            selector: 'header',
        },
        {
            tagName: 'text',
            selector: 'headerText',
        },
        {
            tagName: 'text',
            selector: 'bodyText',
        },
    ],
    attrs: {
        body: Object.assign(Object.assign({}, Base.bodyAttr), { refWidth: '100%', refHeight: '100%' }),
        header: Object.assign(Object.assign({}, Base.bodyAttr), { refWidth: '100%', height: 30, stroke: '#000000' }),
        headerText: Object.assign(Object.assign({}, Base.labelAttr), { refX: '50%', refY: 15, fontSize: 16 }),
        bodyText: Object.assign(Object.assign({}, Base.labelAttr), { refY2: 15 }),
    },
});
//# sourceMappingURL=rect-headered.js.map