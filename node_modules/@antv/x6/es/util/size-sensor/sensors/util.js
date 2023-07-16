export function debounce(fn, delay = 60) {
    let timer = null;
    return (...args) => {
        if (timer) {
            clearTimeout(timer);
        }
        timer = window.setTimeout(() => {
            fn.apply(this, args);
        }, delay);
    };
}
//# sourceMappingURL=util.js.map