import { FunctionExt } from '../util';
export class Events {
    constructor() {
        this.listeners = {};
    }
    on(name, handler, context) {
        if (handler == null) {
            return this;
        }
        if (!this.listeners[name]) {
            this.listeners[name] = [];
        }
        const cache = this.listeners[name];
        cache.push(handler, context);
        return this;
    }
    once(name, handler, context) {
        const cb = (...args) => {
            this.off(name, cb);
            return Private.call([handler, context], args);
        };
        return this.on(name, cb, this);
    }
    off(name, handler, context) {
        // remove all events.
        if (!(name || handler || context)) {
            this.listeners = {};
            return this;
        }
        const listeners = this.listeners;
        const names = name ? [name] : Object.keys(listeners);
        names.forEach((n) => {
            const cache = listeners[n];
            if (!cache) {
                return;
            }
            // remove all events with specified name.
            if (!(handler || context)) {
                delete listeners[n];
                return;
            }
            for (let i = cache.length - 2; i >= 0; i -= 2) {
                if (!((handler && cache[i] !== handler) ||
                    (context && cache[i + 1] !== context))) {
                    cache.splice(i, 2);
                }
            }
        });
        return this;
    }
    trigger(name, ...args) {
        let returned = true;
        if (name !== '*') {
            const list = this.listeners[name];
            if (list != null) {
                returned = Private.call([...list], args);
            }
        }
        const list = this.listeners['*'];
        if (list != null) {
            return FunctionExt.toAsyncBoolean([
                returned,
                Private.call([...list], [name, ...args]),
            ]);
        }
        return returned;
    }
    emit(name, ...args) {
        return this.trigger(name, ...args);
    }
}
var Private;
(function (Private) {
    function call(list, args) {
        const results = [];
        for (let i = 0; i < list.length; i += 2) {
            const handler = list[i];
            const context = list[i + 1];
            const params = Array.isArray(args) ? args : [args];
            const ret = FunctionExt.apply(handler, context, params);
            results.push(ret);
        }
        return FunctionExt.toAsyncBoolean(results);
    }
    Private.call = call;
})(Private || (Private = {}));
//# sourceMappingURL=events.js.map