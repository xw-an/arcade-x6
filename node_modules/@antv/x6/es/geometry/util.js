export function round(num, precision = 0) {
    return Number.isInteger(num) ? num : +num.toFixed(precision);
}
export function random(min, max) {
    let mmin;
    let mmax;
    if (max == null) {
        mmax = min == null ? 1 : min;
        mmin = 0;
    }
    else {
        mmax = max;
        mmin = min == null ? 0 : min;
    }
    if (mmax < mmin) {
        const temp = mmin;
        mmin = mmax;
        mmax = temp;
    }
    return Math.floor(Math.random() * (mmax - mmin + 1) + mmin);
}
export function clamp(value, min, max) {
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
export function snapToGrid(value, gridSize) {
    return gridSize * Math.round(value / gridSize);
}
export function containsPoint(rect, point) {
    return (point != null &&
        rect != null &&
        point.x >= rect.x &&
        point.x <= rect.x + rect.width &&
        point.y >= rect.y &&
        point.y <= rect.y + rect.height);
}
export function squaredLength(p1, p2) {
    const dx = p1.x - p2.x;
    const dy = p1.y - p2.y;
    return dx * dx + dy * dy;
}
//# sourceMappingURL=util.js.map