"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.applyMixins = void 0;
/**
 * @see https://www.typescriptlang.org/docs/handbook/mixins.html
 */
function applyMixins(derivedCtor) {
    var baseCtors = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        baseCtors[_i - 1] = arguments[_i];
    }
    baseCtors.forEach(function (baseCtor) {
        Object.getOwnPropertyNames(baseCtor.prototype).forEach(function (name) {
            if (name !== 'constructor') {
                Object.defineProperty(derivedCtor.prototype, name, Object.getOwnPropertyDescriptor(baseCtor.prototype, name));
            }
        });
    });
}
exports.applyMixins = applyMixins;
//# sourceMappingURL=mixins.js.map