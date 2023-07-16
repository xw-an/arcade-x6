export { isFunction, once, noop, debounce, defer } from 'lodash-es';
export function apply(fn, ctx, args) {
    if (args) {
        switch (args.length) {
            case 0:
                return fn.call(ctx);
            case 1:
                return fn.call(ctx, args[0]);
            case 2:
                return fn.call(ctx, args[0], args[1]);
            case 3:
                return fn.call(ctx, args[0], args[1], args[2]);
            case 4:
                return fn.call(ctx, args[0], args[1], args[2], args[3]);
            case 5:
                return fn.call(ctx, args[0], args[1], args[2], args[3], args[4]);
            case 6:
                return fn.call(ctx, args[0], args[1], args[2], args[3], args[4], args[5]);
            default:
                return fn.apply(ctx, args);
        }
    }
    return fn.call(ctx);
}
export function call(fn, ctx, ...args) {
    return apply(fn, ctx, args);
}
function repush(array, item) {
    for (let i = 0, ii = array.length; i < ii; i += 1) {
        if (array[i] === item) {
            return array.push(array.splice(i, 1)[0]);
        }
    }
}
export function cacher(fn, ctx, postProcessor) {
    const keys = [];
    const cache = {};
    const f = (...args) => {
        let hasCache = false;
        const key = args.join('\u2400');
        if (key in cache) {
            hasCache = true;
            repush(keys, key);
        }
        else {
            if (keys.length >= 1000) {
                delete cache[keys.shift()];
            }
            keys.push(key);
            cache[key] = apply(fn, ctx || null, args);
        }
        return postProcessor ? postProcessor(cache[key], hasCache) : cache[key];
    };
    return f;
}
//# sourceMappingURL=function.js.map