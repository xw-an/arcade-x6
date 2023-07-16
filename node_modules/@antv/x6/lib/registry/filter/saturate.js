"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.saturate = void 0;
var util_1 = require("./util");
function saturate(args) {
    if (args === void 0) { args = {}; }
    var amount = (0, util_1.getNumber)(args.amount, 1);
    return ("\n      <filter>\n        <feColorMatrix type=\"saturate\" values=\"" + (1 - amount) + "\"/>\n      </filter>\n    ").trim();
}
exports.saturate = saturate;
//# sourceMappingURL=saturate.js.map