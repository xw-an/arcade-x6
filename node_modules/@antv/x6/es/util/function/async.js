export function isAsyncLike(obj) {
    return typeof obj === 'object' && obj.then && typeof obj.then === 'function';
}
export function isAsync(obj) {
    return obj != null && (obj instanceof Promise || isAsyncLike(obj));
}
export function toAsyncBoolean(...inputs) {
    const results = [];
    inputs.forEach((arg) => {
        if (Array.isArray(arg)) {
            results.push(...arg);
        }
        else {
            results.push(arg);
        }
    });
    const hasAsync = results.some((res) => isAsync(res));
    if (hasAsync) {
        const deferres = results.map((res) => isAsync(res) ? res : Promise.resolve(res !== false));
        return Promise.all(deferres).then((arr) => arr.reduce((memo, item) => item !== false && memo, true));
    }
    return results.every((res) => res !== false);
}
export function toDeferredBoolean(...inputs) {
    const ret = toAsyncBoolean(inputs);
    return typeof ret === 'boolean' ? Promise.resolve(ret) : ret;
}
//# sourceMappingURL=async.js.map