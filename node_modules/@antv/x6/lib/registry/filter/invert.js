"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.invert = void 0;
var util_1 = require("./util");
function invert(args) {
    if (args === void 0) { args = {}; }
    var amount = (0, util_1.getNumber)(args.amount, 1);
    var amount2 = 1 - amount;
    return ("\n      <filter>\n        <feComponentTransfer>\n          <feFuncR type=\"table\" tableValues=\"" + amount + " " + amount2 + "\"/>\n          <feFuncG type=\"table\" tableValues=\"" + amount + " " + amount2 + "\"/>\n          <feFuncB type=\"table\" tableValues=\"" + amount + " " + amount2 + "\"/>\n        </feComponentTransfer>\n      </filter>\n    ").trim();
}
exports.invert = invert;
//# sourceMappingURL=invert.js.map