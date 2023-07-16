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
import { ObjectExt } from '../../util';
import { Marker } from '../marker';
function qualify(value) {
    return typeof value === 'string' || ObjectExt.isPlainObject(value);
}
export const sourceMarker = {
    qualify,
    set(marker, { view, attrs }) {
        return createMarker('marker-start', marker, view, attrs);
    },
};
export const targetMarker = {
    qualify,
    set(marker, { view, attrs }) {
        return createMarker('marker-end', marker, view, attrs, {
            transform: 'rotate(180)',
        });
    },
};
export const vertexMarker = {
    qualify,
    set(marker, { view, attrs }) {
        return createMarker('marker-mid', marker, view, attrs);
    },
};
function createMarker(type, marker, view, attrs, manual = {}) {
    const def = typeof marker === 'string' ? { name: marker } : marker;
    const { name, args } = def, others = __rest(def, ["name", "args"]);
    let preset = others;
    if (name && typeof name === 'string') {
        const fn = Marker.registry.get(name);
        if (fn) {
            preset = fn(Object.assign(Object.assign({}, others), args));
        }
        else {
            return Marker.registry.onNotFound(name);
        }
    }
    const options = Object.assign(Object.assign(Object.assign({}, normalizeAttr(attrs, type)), manual), preset);
    return {
        [type]: `url(#${view.graph.defineMarker(options)})`,
    };
}
function normalizeAttr(attr, type) {
    const result = {};
    // The context 'fill' is disregared here. The usual case is to use the
    // marker with a connection(for which 'fill' attribute is set to 'none').
    const stroke = attr.stroke;
    if (typeof stroke === 'string') {
        result.stroke = stroke;
        result.fill = stroke;
    }
    // Again the context 'fill-opacity' is ignored.
    let strokeOpacity = attr.strokeOpacity;
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
        const strokeWidth = parseFloat((attr.strokeWidth || attr['stroke-width']));
        if (Number.isFinite(strokeWidth) && strokeWidth > 1) {
            const offset = Math.ceil(strokeWidth / 2);
            result.refX = type === 'marker-start' ? offset : -offset;
        }
    }
    return result;
}
//# sourceMappingURL=marker.js.map