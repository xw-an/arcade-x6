import { NumberExt } from '../../../util';
import { Point, Angle } from '../../../geometry';
import { orth } from '../orth';
export const defaults = {
    step: 10,
    maxLoopCount: 2000,
    precision: 1,
    maxDirectionChange: 90,
    perpendicular: true,
    excludeTerminals: [],
    excludeShapes: [],
    excludeNodes: [],
    excludeHiddenNodes: false,
    startDirections: ['top', 'right', 'bottom', 'left'],
    endDirections: ['top', 'right', 'bottom', 'left'],
    directionMap: {
        top: { x: 0, y: -1 },
        right: { x: 1, y: 0 },
        bottom: { x: 0, y: 1 },
        left: { x: -1, y: 0 },
    },
    cost() {
        const step = resolve(this.step, this);
        return step;
    },
    directions() {
        const step = resolve(this.step, this);
        const cost = resolve(this.cost, this);
        return [
            { cost, offsetX: step, offsetY: 0 },
            { cost, offsetX: -step, offsetY: 0 },
            { cost, offsetX: 0, offsetY: step },
            { cost, offsetX: 0, offsetY: -step },
        ];
    },
    penalties() {
        const step = resolve(this.step, this);
        return {
            0: 0,
            45: step / 2,
            90: step / 2,
        };
    },
    paddingBox() {
        const step = resolve(this.step, this);
        return {
            x: -step,
            y: -step,
            width: 2 * step,
            height: 2 * step,
        };
    },
    fallbackRouter: orth,
    draggingRouter: null,
};
export function resolve(input, options) {
    if (typeof input === 'function') {
        return input.call(options);
    }
    return input;
}
export function resolveOptions(options) {
    const result = Object.keys(options).reduce((memo, key) => {
        const ret = memo;
        if (key === 'fallbackRouter' ||
            key === 'draggingRouter' ||
            key === 'fallbackRoute') {
            ret[key] = options[key];
        }
        else {
            ret[key] = resolve(options[key], options);
        }
        return memo;
    }, {});
    if (result.padding) {
        const sides = NumberExt.normalizeSides(result.padding);
        result.paddingBox = {
            x: -sides.left,
            y: -sides.top,
            width: sides.left + sides.right,
            height: sides.top + sides.bottom,
        };
    }
    result.directions.forEach((direction) => {
        const point1 = new Point(0, 0);
        const point2 = new Point(direction.offsetX, direction.offsetY);
        direction.angle = Angle.normalize(point1.theta(point2));
    });
    return result;
}
//# sourceMappingURL=options.js.map