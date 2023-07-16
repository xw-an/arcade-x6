"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModifierKey = void 0;
// eslint-disable-next-line
var ModifierKey;
(function (ModifierKey) {
    function parse(modifiers) {
        var or = [];
        var and = [];
        if (Array.isArray(modifiers)) {
            or.push.apply(or, modifiers);
        }
        else {
            modifiers.split('|').forEach(function (item) {
                if (item.indexOf('&') === -1) {
                    or.push(item);
                }
                else {
                    and.push.apply(and, item.split('&'));
                }
            });
        }
        return { or: or, and: and };
    }
    ModifierKey.parse = parse;
    function equals(modifiers1, modifiers2) {
        if (modifiers1 != null && modifiers2 != null) {
            var m1 = parse(modifiers1);
            var m2 = parse(modifiers2);
            var or1 = m1.or.sort();
            var or2 = m2.or.sort();
            var and1 = m1.and.sort();
            var and2 = m2.and.sort();
            var equal = function (a1, a2) {
                return (a1.length === a2.length &&
                    (a1.length === 0 || a1.every(function (a, i) { return a === a2[i]; })));
            };
            return equal(or1, or2) && equal(and1, and2);
        }
        if (modifiers1 == null && modifiers2 == null) {
            return true;
        }
        return false;
    }
    ModifierKey.equals = equals;
    function isMatch(e, modifiers, strict) {
        if (modifiers == null ||
            (Array.isArray(modifiers) && modifiers.length === 0)) {
            return strict
                ? e.altKey !== true &&
                    e.ctrlKey !== true &&
                    e.metaKey !== true &&
                    e.shiftKey !== true
                : true;
        }
        var _a = parse(modifiers), or = _a.or, and = _a.and;
        var match = function (key) {
            var name = key.toLowerCase() + "Key";
            return e[name] === true;
        };
        return or.some(function (key) { return match(key); }) && and.every(function (key) { return match(key); });
    }
    ModifierKey.isMatch = isMatch;
})(ModifierKey = exports.ModifierKey || (exports.ModifierKey = {}));
//# sourceMappingURL=modifier.js.map