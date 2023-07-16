"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.brightness = void 0;
var util_1 = require("./util");
function brightness(args) {
    if (args === void 0) { args = {}; }
    var amount = (0, util_1.getNumber)(args.amount, 1);
    return ("\n    <filter>\n      <feComponentTransfer>\n        <feFuncR type=\"linear\" slope=\"" + amount + "\"/>\n        <feFuncG type=\"linear\" slope=\"" + amount + "\"/>\n        <feFuncB type=\"linear\" slope=\"" + amount + "\"/>\n      </feComponentTransfer>\n    </filter>\n  ").trim();
}
exports.brightness = brightness;
//# sourceMappingURL=brightness.js.map