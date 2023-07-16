"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mergeAttrs = exports.styleToObject = exports.kebablizeAttrs = exports.qualifyAttr = exports.attr = exports.setAttributes = exports.setAttribute = exports.removeAttribute = exports.getAttribute = exports.CASE_SENSITIVE_ATTR = void 0;
var elem_1 = require("./elem");
var format_1 = require("../string/format");
exports.CASE_SENSITIVE_ATTR = [
    'viewBox',
    'attributeName',
    'attributeType',
    'repeatCount',
];
function getAttribute(elem, name) {
    return elem.getAttribute(name);
}
exports.getAttribute = getAttribute;
function removeAttribute(elem, name) {
    var qualified = qualifyAttr(name);
    if (qualified.ns) {
        if (elem.hasAttributeNS(qualified.ns, qualified.local)) {
            elem.removeAttributeNS(qualified.ns, qualified.local);
        }
    }
    else if (elem.hasAttribute(name)) {
        elem.removeAttribute(name);
    }
}
exports.removeAttribute = removeAttribute;
function setAttribute(elem, name, value) {
    if (value == null) {
        return removeAttribute(elem, name);
    }
    var qualified = qualifyAttr(name);
    if (qualified.ns && typeof value === 'string') {
        elem.setAttributeNS(qualified.ns, name, value);
    }
    else if (name === 'id') {
        elem.id = "" + value;
    }
    else {
        elem.setAttribute(name, "" + value);
    }
}
exports.setAttribute = setAttribute;
function setAttributes(elem, attrs) {
    Object.keys(attrs).forEach(function (name) {
        setAttribute(elem, name, attrs[name]);
    });
}
exports.setAttributes = setAttributes;
function attr(elem, name, value) {
    if (name == null) {
        var attrs = elem.attributes;
        var ret = {};
        for (var i = 0; i < attrs.length; i += 1) {
            ret[attrs[i].name] = attrs[i].value;
        }
        return ret;
    }
    if (typeof name === 'string' && value === undefined) {
        return elem.getAttribute(name);
    }
    if (typeof name === 'object') {
        setAttributes(elem, name);
    }
    else {
        setAttribute(elem, name, value);
    }
}
exports.attr = attr;
function qualifyAttr(name) {
    if (name.indexOf(':') !== -1) {
        var combinedKey = name.split(':');
        return {
            ns: elem_1.ns[combinedKey[0]],
            local: combinedKey[1],
        };
    }
    return {
        ns: null,
        local: name,
    };
}
exports.qualifyAttr = qualifyAttr;
function kebablizeAttrs(attrs) {
    var result = {};
    Object.keys(attrs).forEach(function (key) {
        var name = exports.CASE_SENSITIVE_ATTR.includes(key) ? key : (0, format_1.kebabCase)(key);
        result[name] = attrs[key];
    });
    return result;
}
exports.kebablizeAttrs = kebablizeAttrs;
function styleToObject(styleString) {
    var ret = {};
    var styles = styleString.split(';');
    styles.forEach(function (item) {
        var section = item.trim();
        if (section) {
            var pair = section.split('=');
            if (pair.length) {
                ret[pair[0].trim()] = pair[1] ? pair[1].trim() : '';
            }
        }
    });
    return ret;
}
exports.styleToObject = styleToObject;
function mergeAttrs(target, source) {
    Object.keys(source).forEach(function (attr) {
        if (attr === 'class') {
            target[attr] = target[attr]
                ? target[attr] + " " + source[attr]
                : source[attr];
        }
        else if (attr === 'style') {
            var to = typeof target[attr] === 'object';
            var so = typeof source[attr] === 'object';
            var tt = void 0;
            var ss = void 0;
            if (to && so) {
                tt = target[attr];
                ss = source[attr];
            }
            else if (to) {
                tt = target[attr];
                ss = styleToObject(source[attr]);
            }
            else if (so) {
                tt = styleToObject(target[attr]);
                ss = source[attr];
            }
            else {
                tt = styleToObject(target[attr]);
                ss = styleToObject(source[attr]);
            }
            target[attr] = mergeAttrs(tt, ss);
        }
        else {
            target[attr] = source[attr];
        }
    });
    return target;
}
exports.mergeAttrs = mergeAttrs;
//# sourceMappingURL=attr.js.map