"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sepia = void 0;
var util_1 = require("./util");
function sepia(args) {
    if (args === void 0) { args = {}; }
    var amount = (0, util_1.getNumber)(args.amount, 1);
    var a = 0.393 + 0.607 * (1 - amount);
    var b = 0.769 - 0.769 * (1 - amount);
    var c = 0.189 - 0.189 * (1 - amount);
    var d = 0.349 - 0.349 * (1 - amount);
    var e = 0.686 + 0.314 * (1 - amount);
    var f = 0.168 - 0.168 * (1 - amount);
    var g = 0.272 - 0.272 * (1 - amount);
    var h = 0.534 - 0.534 * (1 - amount);
    var i = 0.131 + 0.869 * (1 - amount);
    return ("\n      <filter>\n        <feColorMatrix type=\"matrix\" values=\"" + a + " " + b + " " + c + " 0 0 " + d + " " + e + " " + f + " 0 0 " + g + " " + h + " " + i + " 0 0 0 0 0 1 0\"/>\n      </filter>\n    ").trim();
}
exports.sepia = sepia;
//# sourceMappingURL=sepia.js.map