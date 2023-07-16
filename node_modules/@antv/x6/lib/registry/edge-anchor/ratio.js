"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ratio = void 0;
var ratio = function (view, magnet, ref, options) {
    var ratio = options.ratio != null ? options.ratio : 0.5;
    if (ratio > 1) {
        ratio /= 100;
    }
    return view.getPointAtRatio(ratio);
};
exports.ratio = ratio;
//# sourceMappingURL=ratio.js.map