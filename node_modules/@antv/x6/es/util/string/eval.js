export function exec(exp) {
    let result = null;
    try {
        result = window.eval(exp); // eslint-disable-line
    }
    catch (e) {
        // pass
    }
    return result;
}
//# sourceMappingURL=eval.js.map