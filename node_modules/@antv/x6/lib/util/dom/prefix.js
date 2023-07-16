"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getVendorPrefixedName = void 0;
var hyphenPattern = /-(.)/g;
function camelize(str) {
    return str.replace(hyphenPattern, function (_, char) { return char.toUpperCase(); });
}
var memoized = {};
var prefixes = ['Webkit', 'ms', 'Moz', 'O'];
var testStyle = document ? document.createElement('div').style : {};
function getWithPrefix(name) {
    for (var i = 0; i < prefixes.length; i += 1) {
        var prefixedName = prefixes[i] + name;
        if (prefixedName in testStyle) {
            return prefixedName;
        }
    }
    return null;
}
function getVendorPrefixedName(property) {
    var name = camelize(property);
    if (memoized[name] == null) {
        var capitalizedName = name.charAt(0).toUpperCase() + name.slice(1);
        memoized[name] = name in testStyle ? name : getWithPrefix(capitalizedName);
    }
    return memoized[name];
}
exports.getVendorPrefixedName = getVendorPrefixedName;
//# sourceMappingURL=prefix.js.map