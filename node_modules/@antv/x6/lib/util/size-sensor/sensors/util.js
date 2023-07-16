"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.debounce = void 0;
function debounce(fn, delay) {
    var _this = this;
    if (delay === void 0) { delay = 60; }
    var timer = null;
    return function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        if (timer) {
            clearTimeout(timer);
        }
        timer = window.setTimeout(function () {
            fn.apply(_this, args);
        }, delay);
    };
}
exports.debounce = debounce;
//# sourceMappingURL=util.js.map