"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeSides = exports.parseCssNumeric = exports.normalizePercentage = exports.isPercentage = exports.random = exports.mod = exports.isNumeric = exports.parseInt = exports.toSafeInteger = exports.toInteger = exports.toNumber = exports.toFinite = exports.inRange = exports.clamp = exports.isSafeInteger = exports.isInteger = exports.isFinite = exports.isNumber = exports.isNaN = void 0;
var lodash_es_1 = require("lodash-es");
Object.defineProperty(exports, "isNaN", { enumerable: true, get: function () { return lodash_es_1.isNaN; } });
Object.defineProperty(exports, "isNumber", { enumerable: true, get: function () { return lodash_es_1.isNumber; } });
Object.defineProperty(exports, "isFinite", { enumerable: true, get: function () { return lodash_es_1.isFinite; } });
Object.defineProperty(exports, "isInteger", { enumerable: true, get: function () { return lodash_es_1.isInteger; } });
Object.defineProperty(exports, "isSafeInteger", { enumerable: true, get: function () { return lodash_es_1.isSafeInteger; } });
Object.defineProperty(exports, "clamp", { enumerable: true, get: function () { return lodash_es_1.clamp; } });
Object.defineProperty(exports, "inRange", { enumerable: true, get: function () { return lodash_es_1.inRange; } });
Object.defineProperty(exports, "toFinite", { enumerable: true, get: function () { return lodash_es_1.toFinite; } });
Object.defineProperty(exports, "toNumber", { enumerable: true, get: function () { return lodash_es_1.toNumber; } });
Object.defineProperty(exports, "toInteger", { enumerable: true, get: function () { return lodash_es_1.toInteger; } });
Object.defineProperty(exports, "toSafeInteger", { enumerable: true, get: function () { return lodash_es_1.toSafeInteger; } });
Object.defineProperty(exports, "parseInt", { enumerable: true, get: function () { return lodash_es_1.parseInt; } });
var lang_1 = require("../lang/lang");
Object.defineProperty(exports, "isNumeric", { enumerable: true, get: function () { return lang_1.isNumeric; } });
/**
 * Returns the remainder of division of `n` by `m`. You should use this
 * instead of the built-in operation as the built-in operation does not
 * properly handle negative numbers.
 */
function mod(n, m) {
    return ((n % m) + m) % m;
}
exports.mod = mod;
function random(lower, upper) {
    if (upper == null) {
        upper = lower == null ? 1 : lower; // eslint-disable-line
        lower = 0; // eslint-disable-line
    }
    else if (upper < lower) {
        var tmp = lower;
        lower = upper; // eslint-disable-line
        upper = tmp; // eslint-disable-line
    }
    return Math.floor(Math.random() * (upper - lower + 1) + lower);
}
exports.random = random;
function isPercentage(val) {
    return typeof val === 'string' && val.slice(-1) === '%';
}
exports.isPercentage = isPercentage;
function normalizePercentage(num, ref) {
    if (num == null) {
        return 0;
    }
    var raw;
    if (typeof num === 'string') {
        raw = parseFloat(num);
        if (isPercentage(num)) {
            raw /= 100;
            if (Number.isFinite(raw)) {
                return raw * ref;
            }
        }
    }
    else {
        raw = num;
    }
    if (!Number.isFinite(raw)) {
        return 0;
    }
    if (raw > 0 && raw < 1) {
        return raw * ref;
    }
    return raw;
}
exports.normalizePercentage = normalizePercentage;
function parseCssNumeric(val, units) {
    function getUnit(regexp) {
        var matches = new RegExp("(?:\\d+(?:\\.\\d+)*)(" + regexp + ")$").exec(val);
        if (!matches) {
            return null;
        }
        return matches[1];
    }
    var number = parseFloat(val);
    if (Number.isNaN(number)) {
        return null;
    }
    // determine the unit
    var regexp;
    if (units == null) {
        // accept any unit, as well as no unit
        regexp = '[A-Za-z]*';
    }
    else if (Array.isArray(units)) {
        if (units.length === 0) {
            return null;
        }
        regexp = units.join('|');
    }
    else if (typeof units === 'string') {
        regexp = units;
    }
    var unit = getUnit(regexp);
    if (unit === null) {
        return null;
    }
    return {
        unit: unit,
        value: number,
    };
}
exports.parseCssNumeric = parseCssNumeric;
function normalizeSides(box) {
    if (typeof box === 'object') {
        var left = 0;
        var top_1 = 0;
        var right = 0;
        var bottom = 0;
        if (box.vertical != null && Number.isFinite(box.vertical)) {
            top_1 = bottom = box.vertical;
        }
        if (box.horizontal != null && Number.isFinite(box.horizontal)) {
            right = left = box.horizontal;
        }
        if (box.left != null && Number.isFinite(box.left))
            left = box.left;
        if (box.top != null && Number.isFinite(box.top))
            top_1 = box.top;
        if (box.right != null && Number.isFinite(box.right))
            right = box.right;
        if (box.bottom != null && Number.isFinite(box.bottom))
            bottom = box.bottom;
        return { top: top_1, right: right, bottom: bottom, left: left };
    }
    var val = 0;
    if (box != null && Number.isFinite(box)) {
        val = box;
    }
    return { top: val, right: val, bottom: val, left: val };
}
exports.normalizeSides = normalizeSides;
//# sourceMappingURL=number.js.map