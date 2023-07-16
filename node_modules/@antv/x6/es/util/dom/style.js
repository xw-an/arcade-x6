import { getVendorPrefixedName } from './prefix';
export function setPrefixedStyle(style, name, value) {
    const vendor = getVendorPrefixedName(name);
    if (vendor != null) {
        style[vendor] = value;
    }
    style[name] = value;
}
export function getComputedStyle(elem, name) {
    // IE9+
    const computed = elem.ownerDocument &&
        elem.ownerDocument.defaultView &&
        elem.ownerDocument.defaultView.opener
        ? elem.ownerDocument.defaultView.getComputedStyle(elem, null)
        : window.getComputedStyle(elem, null);
    if (computed && name) {
        return computed.getPropertyValue(name) || computed[name];
    }
    return computed;
}
export function hasScrollbars(container) {
    const style = getComputedStyle(container);
    return (style != null && (style.overflow === 'scroll' || style.overflow === 'auto'));
}
//# sourceMappingURL=style.js.map