"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.blur = void 0;
var util_1 = require("./util");
function blur(args) {
    if (args === void 0) { args = {}; }
    var x = (0, util_1.getNumber)(args.x, 2);
    var stdDeviation = args.y != null && Number.isFinite(args.y) ? [x, args.y] : x;
    return ("\n    <filter>\n      <feGaussianBlur stdDeviation=\"" + stdDeviation + "\"/>\n    </filter>\n  ").trim();
}
exports.blur = blur;
//# sourceMappingURL=blur.js.map