"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetOffset = exports.yAlign = exports.xAlign = void 0;
var util_1 = require("../../util");
var geometry_1 = require("../../geometry");
// `x-align` when set to `middle` causes centering of the subelement around its new x coordinate.
// `x-align` when set to `right` uses the x coordinate as referenced to the right of the bbox.
exports.xAlign = {
    offset: offsetWrapper('x', 'width', 'right'),
};
// `y-align` when set to `middle` causes centering of the subelement around its new y coordinate.
// `y-align` when set to `bottom` uses the y coordinate as referenced to the bottom of the bbox.
exports.yAlign = {
    offset: offsetWrapper('y', 'height', 'bottom'),
};
exports.resetOffset = {
    offset: function (val, _a) {
        var refBBox = _a.refBBox;
        return val ? { x: -refBBox.x, y: -refBBox.y } : { x: 0, y: 0 };
    },
};
function offsetWrapper(axis, dimension, corner) {
    return function (value, _a) {
        var refBBox = _a.refBBox;
        var point = new geometry_1.Point();
        var delta;
        if (value === 'middle') {
            delta = refBBox[dimension] / 2;
        }
        else if (value === corner) {
            delta = refBBox[dimension];
        }
        else if (typeof value === 'number' && Number.isFinite(value)) {
            delta = value > -1 && value < 1 ? -refBBox[dimension] * value : -value;
        }
        else if (util_1.NumberExt.isPercentage(value)) {
            delta = (refBBox[dimension] * parseFloat(value)) / 100;
        }
        else {
            delta = 0;
        }
        point[axis] = -(refBBox[axis] + delta);
        return point;
    };
}
//# sourceMappingURL=align.js.map