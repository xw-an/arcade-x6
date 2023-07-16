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
exports.flatten = exports.unsetByPath = exports.setByPath = exports.getByPath = exports.isMaliciousProp = exports.getBoolean = exports.getNumber = exports.getValue = exports.ensure = exports.defaultsDeep = exports.defaults = exports.cloneDeep = exports.clone = exports.isPlainObject = exports.isObject = exports.isEmpty = exports.isEqual = exports.extend = exports.merge = exports.forIn = exports.pick = exports.has = void 0;
var lodash_es_1 = require("lodash-es");
Object.defineProperty(exports, "has", { enumerable: true, get: function () { return lodash_es_1.has; } });
Object.defineProperty(exports, "pick", { enumerable: true, get: function () { return lodash_es_1.pick; } });
Object.defineProperty(exports, "forIn", { enumerable: true, get: function () { return lodash_es_1.forIn; } });
Object.defineProperty(exports, "merge", { enumerable: true, get: function () { return lodash_es_1.merge; } });
Object.defineProperty(exports, "extend", { enumerable: true, get: function () { return lodash_es_1.extend; } });
Object.defineProperty(exports, "isEqual", { enumerable: true, get: function () { return lodash_es_1.isEqual; } });
Object.defineProperty(exports, "isEmpty", { enumerable: true, get: function () { return lodash_es_1.isEmpty; } });
Object.defineProperty(exports, "isObject", { enumerable: true, get: function () { return lodash_es_1.isObject; } });
Object.defineProperty(exports, "isPlainObject", { enumerable: true, get: function () { return lodash_es_1.isPlainObject; } });
Object.defineProperty(exports, "clone", { enumerable: true, get: function () { return lodash_es_1.clone; } });
Object.defineProperty(exports, "cloneDeep", { enumerable: true, get: function () { return lodash_es_1.cloneDeep; } });
Object.defineProperty(exports, "defaults", { enumerable: true, get: function () { return lodash_es_1.defaults; } });
Object.defineProperty(exports, "defaultsDeep", { enumerable: true, get: function () { return lodash_es_1.defaultsDeep; } });
__exportStar(require("./mixins"), exports);
__exportStar(require("./inherit"), exports);
function ensure(value, defaultValue) {
    return value != null ? value : defaultValue;
}
exports.ensure = ensure;
function getValue(obj, key, defaultValue) {
    var value = obj != null ? obj[key] : null;
    return defaultValue !== undefined ? ensure(value, defaultValue) : value;
}
exports.getValue = getValue;
function getNumber(obj, key, defaultValue) {
    var value = obj != null ? obj[key] : null;
    if (value == null) {
        return defaultValue;
    }
    value = +value;
    if (Number.isNaN(value) || !Number.isFinite(value)) {
        return defaultValue;
    }
    return value;
}
exports.getNumber = getNumber;
function getBoolean(obj, key, defaultValue) {
    var value = obj != null ? obj[key] : null;
    if (value == null) {
        return defaultValue;
    }
    return !!value;
}
exports.getBoolean = getBoolean;
function isMaliciousProp(prop) {
    return prop === '__proto__';
}
exports.isMaliciousProp = isMaliciousProp;
function getByPath(obj, path, delimiter) {
    if (delimiter === void 0) { delimiter = '/'; }
    var ret;
    var keys = Array.isArray(path) ? path : path.split(delimiter);
    if (keys.length) {
        ret = obj;
        while (keys.length) {
            var key = keys.shift();
            if (Object(ret) === ret && key && key in ret) {
                ret = ret[key];
            }
            else {
                return undefined;
            }
        }
    }
    return ret;
}
exports.getByPath = getByPath;
function setByPath(obj, path, value, delimiter) {
    if (delimiter === void 0) { delimiter = '/'; }
    var keys = Array.isArray(path) ? path : path.split(delimiter);
    var lastKey = keys.pop();
    if (lastKey && !isMaliciousProp(lastKey)) {
        var diver_1 = obj;
        keys.forEach(function (key) {
            if (!isMaliciousProp(key)) {
                if (diver_1[key] == null) {
                    diver_1[key] = {};
                }
                diver_1 = diver_1[key];
            }
        });
        diver_1[lastKey] = value;
    }
    return obj;
}
exports.setByPath = setByPath;
function unsetByPath(obj, path, delimiter) {
    if (delimiter === void 0) { delimiter = '/'; }
    var keys = Array.isArray(path) ? path.slice() : path.split(delimiter);
    var propertyToRemove = keys.pop();
    if (propertyToRemove) {
        if (keys.length > 0) {
            var parent_1 = getByPath(obj, keys);
            if (parent_1) {
                delete parent_1[propertyToRemove];
            }
        }
        else {
            delete obj[propertyToRemove];
        }
    }
    return obj;
}
exports.unsetByPath = unsetByPath;
function flatten(obj, delim, stop) {
    if (delim === void 0) { delim = '/'; }
    var ret = {};
    Object.keys(obj).forEach(function (key) {
        var val = obj[key];
        var deep = typeof val === 'object' || Array.isArray(val);
        if (deep && stop && stop(val)) {
            deep = false;
        }
        if (deep) {
            var flatObject_1 = flatten(val, delim, stop);
            Object.keys(flatObject_1).forEach(function (flatKey) {
                ret[key + delim + flatKey] = flatObject_1[flatKey];
            });
        }
        else {
            ret[key] = val;
        }
    });
    // eslint-disable-next-line no-restricted-syntax
    for (var key in obj) {
        if (!Object.prototype.hasOwnProperty.call(obj, key)) {
            continue;
        }
    }
    return ret;
}
exports.flatten = flatten;
//# sourceMappingURL=object.js.map