"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hueRotate = void 0;
var util_1 = require("./util");
function hueRotate(args) {
    if (args === void 0) { args = {}; }
    var angle = (0, util_1.getNumber)(args.angle, 0);
    return ("\n      <filter>\n        <feColorMatrix type=\"hueRotate\" values=\"" + angle + "\"/>\n      </filter>\n    ").trim();
}
exports.hueRotate = hueRotate;
//# sourceMappingURL=hue-rotate.js.map