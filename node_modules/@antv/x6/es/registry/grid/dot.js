import { Dom } from '../../util';
export const dot = {
    color: '#aaaaaa',
    thickness: 1,
    markup: 'rect',
    update(elem, options) {
        const width = options.thickness * options.sx;
        const height = options.thickness * options.sy;
        Dom.attr(elem, {
            width,
            height,
            rx: width,
            ry: height,
            fill: options.color,
        });
    },
};
//# sourceMappingURL=dot.js.map