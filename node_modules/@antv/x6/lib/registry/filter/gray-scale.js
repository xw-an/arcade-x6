"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.grayScale = void 0;
var util_1 = require("./util");
function grayScale(args) {
    if (args === void 0) { args = {}; }
    var amount = (0, util_1.getNumber)(args.amount, 1);
    var a = 0.2126 + 0.7874 * (1 - amount);
    var b = 0.7152 - 0.7152 * (1 - amount);
    var c = 0.0722 - 0.0722 * (1 - amount);
    var d = 0.2126 - 0.2126 * (1 - amount);
    var e = 0.7152 + 0.2848 * (1 - amount);
    var f = 0.0722 - 0.0722 * (1 - amount);
    var g = 0.2126 - 0.2126 * (1 - amount);
    var h = 0.0722 + 0.9278 * (1 - amount);
    return ("\n    <filter>\n      <feColorMatrix type=\"matrix\" values=\"" + a + " " + b + " " + c + " 0 0 " + d + " " + e + " " + f + " 0 0 " + g + " " + b + " " + h + " 0 0 0 0 0 1 0\"/>\n    </filter>\n  ").trim();
}
exports.grayScale = grayScale;
//# sourceMappingURL=gray-scale.js.map