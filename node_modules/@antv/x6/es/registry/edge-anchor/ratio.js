export const ratio = function (view, magnet, ref, options) {
    let ratio = options.ratio != null ? options.ratio : 0.5;
    if (ratio > 1) {
        ratio /= 100;
    }
    return view.getPointAtRatio(ratio);
};
//# sourceMappingURL=ratio.js.map