export function getString(value, defaultValue) {
    return value != null ? value : defaultValue;
}
export function getNumber(num, defaultValue) {
    return num != null && Number.isFinite(num) ? num : defaultValue;
}
//# sourceMappingURL=util.js.map