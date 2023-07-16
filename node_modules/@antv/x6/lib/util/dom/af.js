"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cancelAnimationFrame = exports.requestAnimationFrame = void 0;
exports.requestAnimationFrame = (function () {
    var raf;
    var win = window;
    if (win != null) {
        raf =
            win.requestAnimationFrame ||
                win.webkitRequestAnimationFrame ||
                win.mozRequestAnimationFrame ||
                win.oRequestAnimationFrame ||
                win.msRequestAnimationFrame;
        if (raf != null) {
            raf = raf.bind(win);
        }
    }
    if (raf == null) {
        var lastTime_1 = 0;
        raf = function (callback) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime_1));
            var id = setTimeout(function () {
                callback(currTime + timeToCall);
            }, timeToCall);
            lastTime_1 = currTime + timeToCall;
            return id;
        };
    }
    return raf;
})();
exports.cancelAnimationFrame = (function () {
    var caf;
    var win = window;
    if (win != null) {
        caf =
            win.cancelAnimationFrame ||
                win.webkitCancelAnimationFrame ||
                win.webkitCancelRequestAnimationFrame ||
                win.msCancelAnimationFrame ||
                win.msCancelRequestAnimationFrame ||
                win.oCancelAnimationFrame ||
                win.oCancelRequestAnimationFrame ||
                win.mozCancelAnimationFrame ||
                win.mozCancelRequestAnimationFrame;
        if (caf) {
            caf = caf.bind(win);
        }
    }
    if (caf == null) {
        caf = clearTimeout;
    }
    return caf;
})();
//# sourceMappingURL=af.js.map