"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toggleClass = exports.removeClass = exports.addClass = exports.hasClass = exports.getClass = void 0;
var rclass = /[\t\r\n\f]/g;
var rnotwhite = /\S+/g;
var fillSpaces = function (str) { return " " + str + " "; };
function getClass(elem) {
    return (elem && elem.getAttribute && elem.getAttribute('class')) || '';
}
exports.getClass = getClass;
function hasClass(elem, selector) {
    if (elem == null || selector == null) {
        return false;
    }
    var classNames = fillSpaces(getClass(elem));
    var className = fillSpaces(selector);
    return elem.nodeType === 1
        ? classNames.replace(rclass, ' ').includes(className)
        : false;
}
exports.hasClass = hasClass;
function addClass(elem, selector) {
    if (elem == null || selector == null) {
        return;
    }
    if (typeof selector === 'function') {
        return addClass(elem, selector(getClass(elem)));
    }
    if (typeof selector === 'string' && elem.nodeType === 1) {
        var classes = selector.match(rnotwhite) || [];
        var oldValue = fillSpaces(getClass(elem)).replace(rclass, ' ');
        var newValue = classes.reduce(function (memo, cls) {
            if (memo.indexOf(fillSpaces(cls)) < 0) {
                return "" + memo + cls + " ";
            }
            return memo;
        }, oldValue);
        newValue = newValue.trim();
        if (oldValue !== newValue) {
            elem.setAttribute('class', newValue);
        }
    }
}
exports.addClass = addClass;
function removeClass(elem, selector) {
    if (elem == null) {
        return;
    }
    if (typeof selector === 'function') {
        return removeClass(elem, selector(getClass(elem)));
    }
    if ((!selector || typeof selector === 'string') && elem.nodeType === 1) {
        var classes = (selector || '').match(rnotwhite) || [];
        var oldValue = fillSpaces(getClass(elem)).replace(rclass, ' ');
        var newValue = classes.reduce(function (memo, cls) {
            var className = fillSpaces(cls);
            if (memo.indexOf(className) > -1) {
                return memo.replace(className, ' ');
            }
            return memo;
        }, oldValue);
        newValue = selector ? newValue.trim() : '';
        if (oldValue !== newValue) {
            elem.setAttribute('class', newValue);
        }
    }
}
exports.removeClass = removeClass;
function toggleClass(elem, selector, stateVal) {
    if (elem == null || selector == null) {
        return;
    }
    if (stateVal != null && typeof selector === 'string') {
        stateVal ? addClass(elem, selector) : removeClass(elem, selector);
        return;
    }
    if (typeof selector === 'function') {
        return toggleClass(elem, selector(getClass(elem), stateVal), stateVal);
    }
    if (typeof selector === 'string') {
        var metches = selector.match(rnotwhite) || [];
        metches.forEach(function (cls) {
            hasClass(elem, cls) ? removeClass(elem, cls) : addClass(elem, cls);
        });
    }
}
exports.toggleClass = toggleClass;
//# sourceMappingURL=class.js.map