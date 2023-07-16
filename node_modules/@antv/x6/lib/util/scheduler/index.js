"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Scheduler = void 0;
var Scheduler;
(function (Scheduler) {
    var queue = [];
    var threshold = 1000 / 60;
    var unit = [];
    var deadline = 0;
    var getTime = function () { return performance.now(); };
    var peek = function (queue) { return queue[0]; };
    var schedule = function (cb) { return unit.push(cb) === 1 && postMessage(); };
    var postMessage = (function () {
        var cb = function () { var _a, _b; return (_b = (_a = unit.splice(0, unit.length))[0]) === null || _b === void 0 ? void 0 : _b.call(_a); };
        if (typeof MessageChannel !== 'undefined') {
            var _a = new MessageChannel(), port1 = _a.port1, port2_1 = _a.port2;
            port1.onmessage = cb;
            return function () { return port2_1.postMessage(null); };
        }
        return function () { return setTimeout(cb); };
    })();
    var flushTask = function () {
        deadline = getTime() + threshold;
        var job = peek(queue);
        while (job && !Scheduler.shouldYield()) {
            var callback = job.callback, data = job.data;
            job.callback = null;
            var next = callback && callback(data);
            if (next) {
                job.callback = next;
            }
            else {
                queue.shift();
            }
            job = peek(queue);
        }
        job && schedule(flushTask);
    };
    Scheduler.scheduleTask = function (callback, data) {
        var task = {
            callback: callback,
            data: data,
        };
        queue.push(task);
        schedule(flushTask);
    };
    Scheduler.shouldYield = function () {
        var _a, _b;
        return (((_b = (_a = navigator) === null || _a === void 0 ? void 0 : _a.scheduling) === null || _b === void 0 ? void 0 : _b.isInputPending()) || getTime() >= deadline);
    };
})(Scheduler = exports.Scheduler || (exports.Scheduler = {}));
//# sourceMappingURL=index.js.map