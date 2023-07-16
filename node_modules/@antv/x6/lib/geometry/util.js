"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.squaredLength = exports.containsPoint = exports.snapToGrid = exports.clamp = exports.random = exports.round = void 0;
function round(num, precision) {
    if (precision === void 0) { precision = 0; }
    return Number.isInteger(num) ? num : +num.toFixed(precision);
}
exports.round = round;
function random(min, max) {
    var mmin;
    var mmax;
    if (max == null) {
        mmax = min == null ? 1 : min;
        mmin = 0;
    }
    else {
        mmax = max;
        mmin = min == null ? 0 : min;
    }
    if (mmax < mmin) {
        var temp = mmin;
        mmin = mmax;
        mmax = temp;
    }
    return Math.floor(Math.random() * (mmax - mmin + 1) + mmin);
}
exports.random = random;
function clamp(value, min, max) {
    if (Number.isNaN(value)) {
        return NaN;
    }
    if (Number.isNaN(min) || Number.isNaN(max)) {
        return 0;
    }
    return min < max
        ? value < min
            ? min
            : value > max
                ? max
                : value
        : value < max
            ? max
            : value > min
                ? min
                : value;
}
exports.clamp = clamp;
function snapToGrid(value, gridSize) {
    return gridSize * Math.round(value / gridSize);
}
exports.snapToGrid = snapToGrid;
function containsPoint(rect, point) {
    return (point != null &&
        rect != null &&
        point.x >= rect.x &&
        point.x <= rect.x + rect.width &&
        point.y >= rect.y &&
        point.y <= rect.y + rect.height);
}
exports.containsPoint = containsPoint;
function squaredLength(p1, p2) {
    var dx = p1.x - p2.x;
    var dy = p1.y - p2.y;
    return dx * dx + dy * dy;
}
exports.squaredLength = squaredLength;
//# sourceMappingURL=util.js.map