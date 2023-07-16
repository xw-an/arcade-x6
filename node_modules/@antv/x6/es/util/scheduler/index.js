export var Scheduler;
(function (Scheduler) {
    const queue = [];
    const threshold = 1000 / 60;
    const unit = [];
    let deadline = 0;
    const getTime = () => performance.now();
    const peek = (queue) => queue[0];
    const schedule = (cb) => unit.push(cb) === 1 && postMessage();
    const postMessage = (() => {
        const cb = () => { var _a, _b; return (_b = (_a = unit.splice(0, unit.length))[0]) === null || _b === void 0 ? void 0 : _b.call(_a); };
        if (typeof MessageChannel !== 'undefined') {
            const { port1, port2 } = new MessageChannel();
            port1.onmessage = cb;
            return () => port2.postMessage(null);
        }
        return () => setTimeout(cb);
    })();
    const flushTask = () => {
        deadline = getTime() + threshold;
        let job = peek(queue);
        while (job && !Scheduler.shouldYield()) {
            const { callback, data } = job;
            job.callback = null;
            const next = callback && callback(data);
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
    Scheduler.scheduleTask = (callback, data) => {
        const task = {
            callback,
            data,
        };
        queue.push(task);
        schedule(flushTask);
    };
    Scheduler.shouldYield = () => {
        var _a, _b;
        return (((_b = (_a = navigator) === null || _a === void 0 ? void 0 : _a.scheduling) === null || _b === void 0 ? void 0 : _b.isInputPending()) || getTime() >= deadline);
    };
})(Scheduler || (Scheduler = {}));
//# sourceMappingURL=index.js.map