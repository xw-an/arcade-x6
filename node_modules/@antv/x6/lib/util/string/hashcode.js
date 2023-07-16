"use strict";
/* eslint-disable no-bitwise */
Object.defineProperty(exports, "__esModule", { value: true });
exports.hashcode = void 0;
/**
 * Return a simple hash code from a string.
 * Source from: https://github.com/sindresorhus/fnv1a/blob/master/index.js#L25
 */
function hashcode(str) {
    var hash = 2166136261;
    var isUnicoded = false;
    var string = str;
    for (var i = 0, ii = string.length; i < ii; i += 1) {
        var characterCode = string.charCodeAt(i);
        // Non-ASCII characters trigger the Unicode escape logic
        if (characterCode > 0x7f && !isUnicoded) {
            string = unescape(encodeURIComponent(string));
            characterCode = string.charCodeAt(i);
            isUnicoded = true;
        }
        hash ^= characterCode;
        hash += (hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24);
    }
    return hash >>> 0;
}
exports.hashcode = hashcode;
//# sourceMappingURL=hashcode.js.map