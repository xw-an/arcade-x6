"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveOptions = exports.resolve = exports.defaults = void 0;
var util_1 = require("../../../util");
var geometry_1 = require("../../../geometry");
var orth_1 = require("../orth");
exports.defaults = {
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
    cost: function () {
        var step = resolve(this.step, this);
        return step;
    },
    directions: function () {
        var step = resolve(this.step, this);
        var cost = resolve(this.cost, this);
        return [
            { cost: cost, offsetX: step, offsetY: 0 },
            { cost: cost, offsetX: -step, offsetY: 0 },
            { cost: cost, offsetX: 0, offsetY: step },
            { cost: cost, offsetX: 0, offsetY: -step },
        ];
    },
    penalties: function () {
        var step = resolve(this.step, this);
        return {
            0: 0,
            45: step / 2,
            90: step / 2,
        };
    },
    paddingBox: function () {
        var step = resolve(this.step, this);
        return {
            x: -step,
            y: -step,
            width: 2 * step,
            height: 2 * step,
        };
    },
    fallbackRouter: orth_1.orth,
    draggingRouter: null,
};
function resolve(input, options) {
    if (typeof input === 'function') {
        return input.call(options);
    }
    return input;
}
exports.resolve = resolve;
function resolveOptions(options) {
    var result = Object.keys(options).reduce(function (memo, key) {
        var ret = memo;
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
        var sides = util_1.NumberExt.normalizeSides(result.padding);
        result.paddingBox = {
            x: -sides.left,
            y: -sides.top,
            width: sides.left + sides.right,
            height: sides.top + sides.bottom,
        };
    }
    result.directions.forEach(function (direction) {
        var point1 = new geometry_1.Point(0, 0);
        var point2 = new geometry_1.Point(direction.offsetX, direction.offsetY);
        direction.angle = geometry_1.Angle.normalize(point1.theta(point2));
    });
    return result;
}
exports.resolveOptions = resolveOptions;
//# sourceMappingURL=options.js.map