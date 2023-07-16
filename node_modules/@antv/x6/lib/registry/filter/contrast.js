"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.contrast = void 0;
var util_1 = require("./util");
function contrast(args) {
    if (args === void 0) { args = {}; }
    var amount = (0, util_1.getNumber)(args.amount, 1);
    var amount2 = 0.5 - amount / 2;
    return ("\n    <filter>\n     <feComponentTransfer>\n        <feFuncR type=\"linear\" slope=\"" + amount + "\" intercept=\"" + amount2 + "\"/>\n        <feFuncG type=\"linear\" slope=\"" + amount + "\" intercept=\"" + amount2 + "\"/>\n        <feFuncB type=\"linear\" slope=\"" + amount + "\" intercept=\"" + amount2 + "\"/>\n      </feComponentTransfer>\n    </filter>\n  ").trim();
}
exports.contrast = contrast;
//# sourceMappingURL=contrast.js.map