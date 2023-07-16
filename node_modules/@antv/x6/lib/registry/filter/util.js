"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNumber = exports.getString = void 0;
function getString(value, defaultValue) {
    return value != null ? value : defaultValue;
}
exports.getString = getString;
function getNumber(num, defaultValue) {
    return num != null && Number.isFinite(num) ? num : defaultValue;
}
exports.getNumber = getNumber;
//# sourceMappingURL=util.js.map