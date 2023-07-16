"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.vertexMarker = exports.targetMarker = exports.sourceMarker = void 0;
var util_1 = require("../../util");
var marker_1 = require("../marker");
function qualify(value) {
    return typeof value === 'string' || util_1.ObjectExt.isPlainObject(value);
}
exports.sourceMarker = {
    qualify: qualify,
    set: function (marker, _a) {
        var view = _a.view, attrs = _a.attrs;
        return createMarker('marker-start', marker, view, attrs);
    },
};
exports.targetMarker = {
    qualify: qualify,
    set: function (marker, _a) {
        var view = _a.view, attrs = _a.attrs;
        return createMarker('marker-end', marker, view, attrs, {
            transform: 'rotate(180)',
        });
    },
};
exports.vertexMarker = {
    qualify: qualify,
    set: function (marker, _a) {
        var view = _a.view, attrs = _a.attrs;
        return createMarker('marker-mid', marker, view, attrs);
    },
};
function createMarker(type, marker, view, attrs, manual) {
    var _a;
    if (manual === void 0) { manual = {}; }
    var def = typeof marker === 'string' ? { name: marker } : marker;
    var name = def.name, args = def.args, others = __rest(def, ["name", "args"]);
    var preset = others;
    if (name && typeof name === 'string') {
        var fn = marker_1.Marker.registry.get(name);
        if (fn) {
            preset = fn(__assign(__assign({}, others), args));
        }
        else {
            return marker_1.Marker.registry.onNotFound(name);
        }
    }
    var options = __assign(__assign(__assign({}, normalizeAttr(attrs, type)), manual), preset);
    return _a = {},
        _a[type] = "url(#" + view.graph.defineMarker(options) + ")",
        _a;
}
function normalizeAttr(attr, type) {
    var result = {};
    // The context 'fill' is disregared here. The usual case is to use the
    // marker with a connection(for which 'fill' attribute is set to 'none').
    var stroke = attr.stroke;
    if (typeof stroke === 'string') {
        result.stroke = stroke;
        result.fill = stroke;
    }
    // Again the context 'fill-opacity' is ignored.
    var strokeOpacity = attr.strokeOpacity;
    if (strokeOpacity == null) {
        strokeOpacity = attr['stroke-opacity'];
    }
    if (strokeOpacity == null) {
        strokeOpacity = attr.opacity;
    }
    if (strokeOpacity != null) {
        result['stroke-opacity'] = strokeOpacity;
        result['fill-opacity'] = strokeOpacity;
    }
    if (type !== 'marker-mid') {
        var strokeWidth = parseFloat((attr.strokeWidth || attr['stroke-width']));
        if (Number.isFinite(strokeWidth) && strokeWidth > 1) {
            var offset = Math.ceil(strokeWidth / 2);
            result.refX = type === 'marker-start' ? offset : -offset;
        }
    }
    return result;
}
//# sourceMappingURL=marker.js.map