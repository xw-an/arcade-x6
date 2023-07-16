import { ObjectExt } from '../../util';
const defaults = {
    position: { x: 0, y: 0 },
    angle: 0,
    attrs: {
        '.': {
            y: '0',
            'text-anchor': 'start',
        },
    },
};
export function toResult(preset, args) {
    const { x, y, angle, attrs } = args || {};
    return ObjectExt.defaultsDeep({}, { angle, attrs, position: { x, y } }, preset, defaults);
}
//# sourceMappingURL=util.js.map