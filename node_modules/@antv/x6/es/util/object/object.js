export { has, pick, forIn, merge, extend, isEqual, isEmpty, isObject, isPlainObject, clone, cloneDeep, defaults, defaultsDeep, } from 'lodash-es';
export * from './mixins';
export * from './inherit';
export function ensure(value, defaultValue) {
    return value != null ? value : defaultValue;
}
export function getValue(obj, key, defaultValue) {
    const value = obj != null ? obj[key] : null;
    return defaultValue !== undefined ? ensure(value, defaultValue) : value;
}
export function getNumber(obj, key, defaultValue) {
    let value = obj != null ? obj[key] : null;
    if (value == null) {
        return defaultValue;
    }
    value = +value;
    if (Number.isNaN(value) || !Number.isFinite(value)) {
        return defaultValue;
    }
    return value;
}
export function getBoolean(obj, key, defaultValue) {
    const value = obj != null ? obj[key] : null;
    if (value == null) {
        return defaultValue;
    }
    return !!value;
}
export function isMaliciousProp(prop) {
    return prop === '__proto__';
}
export function getByPath(obj, path, delimiter = '/') {
    let ret;
    const keys = Array.isArray(path) ? path : path.split(delimiter);
    if (keys.length) {
        ret = obj;
        while (keys.length) {
            const key = keys.shift();
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
export function setByPath(obj, path, value, delimiter = '/') {
    const keys = Array.isArray(path) ? path : path.split(delimiter);
    const lastKey = keys.pop();
    if (lastKey && !isMaliciousProp(lastKey)) {
        let diver = obj;
        keys.forEach((key) => {
            if (!isMaliciousProp(key)) {
                if (diver[key] == null) {
                    diver[key] = {};
                }
                diver = diver[key];
            }
        });
        diver[lastKey] = value;
    }
    return obj;
}
export function unsetByPath(obj, path, delimiter = '/') {
    const keys = Array.isArray(path) ? path.slice() : path.split(delimiter);
    const propertyToRemove = keys.pop();
    if (propertyToRemove) {
        if (keys.length > 0) {
            const parent = getByPath(obj, keys);
            if (parent) {
                delete parent[propertyToRemove];
            }
        }
        else {
            delete obj[propertyToRemove];
        }
    }
    return obj;
}
export function flatten(obj, delim = '/', stop) {
    const ret = {};
    Object.keys(obj).forEach((key) => {
        const val = obj[key];
        let deep = typeof val === 'object' || Array.isArray(val);
        if (deep && stop && stop(val)) {
            deep = false;
        }
        if (deep) {
            const flatObject = flatten(val, delim, stop);
            Object.keys(flatObject).forEach((flatKey) => {
                ret[key + delim + flatKey] = flatObject[flatKey];
            });
        }
        else {
            ret[key] = val;
        }
    });
    // eslint-disable-next-line no-restricted-syntax
    for (const key in obj) {
        if (!Object.prototype.hasOwnProperty.call(obj, key)) {
            continue;
        }
    }
    return ret;
}
//# sourceMappingURL=object.js.map