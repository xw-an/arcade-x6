import { ObjectExt } from '../../util';
export const stroke = {
    qualify: ObjectExt.isPlainObject,
    set(stroke, { view }) {
        const cell = view.cell;
        const options = Object.assign({}, stroke);
        if (cell.isEdge() && options.type === 'linearGradient') {
            const edgeView = view;
            const source = edgeView.sourcePoint;
            const target = edgeView.targetPoint;
            options.id = `gradient-${options.type}-${cell.id}`;
            options.attrs = Object.assign(Object.assign({}, options.attrs), { x1: source.x, y1: source.y, x2: target.x, y2: target.y, gradientUnits: 'userSpaceOnUse' });
            view.graph.defs.remove(options.id);
        }
        return `url(#${view.graph.defineGradient(options)})`;
    },
};
//# sourceMappingURL=stroke.js.map