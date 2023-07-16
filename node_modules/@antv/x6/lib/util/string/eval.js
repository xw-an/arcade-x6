"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.exec = void 0;
function exec(exp) {
    var result = null;
    try {
        result = window.eval(exp); // eslint-disable-line
    }
    catch (e) {
        // pass
    }
    return result;
}
exports.exec = exec;
//# sourceMappingURL=eval.js.map