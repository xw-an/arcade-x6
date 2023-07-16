"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.closest = void 0;
__exportStar(require("./ratio"), exports);
__exportStar(require("./length"), exports);
__exportStar(require("./orth"), exports);
var closest_1 = require("./closest");
Object.defineProperty(exports, "closest", { enumerable: true, get: function () { return closest_1.closest; } });
//# sourceMappingURL=main.js.map