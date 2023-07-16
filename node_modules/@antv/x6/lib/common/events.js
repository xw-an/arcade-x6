"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Events = void 0;
var util_1 = require("../util");
var Events = /** @class */ (function () {
    function Events() {
        this.listeners = {};
    }
    Events.prototype.on = function (name, handler, context) {
        if (handler == null) {
            return this;
        }
        if (!this.listeners[name]) {
            this.listeners[name] = [];
        }
        var cache = this.listeners[name];
        cache.push(handler, context);
        return this;
    };
    Events.prototype.once = function (name, handler, context) {
        var _this = this;
        var cb = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            _this.off(name, cb);
            return Private.call([handler, context], args);
        };
        return this.on(name, cb, this);
    };
    Events.prototype.off = function (name, handler, context) {
        // remove all events.
        if (!(name || handler || context)) {
            this.listeners = {};
            return this;
        }
        var listeners = this.listeners;
        var names = name ? [name] : Object.keys(listeners);
        names.forEach(function (n) {
            var cache = listeners[n];
            if (!cache) {
                return;
            }
            // remove all events with specified name.
            if (!(handler || context)) {
                delete listeners[n];
                return;
            }
            for (var i = cache.length - 2; i >= 0; i -= 2) {
                if (!((handler && cache[i] !== handler) ||
                    (context && cache[i + 1] !== context))) {
                    cache.splice(i, 2);
                }
            }
        });
        return this;
    };
    Events.prototype.trigger = function (name) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        var returned = true;
        if (name !== '*') {
            var list_1 = this.listeners[name];
            if (list_1 != null) {
                returned = Private.call(__spreadArray([], list_1, true), args);
            }
        }
        var list = this.listeners['*'];
        if (list != null) {
            return util_1.FunctionExt.toAsyncBoolean([
                returned,
                Private.call(__spreadArray([], list, true), __spreadArray([name], args, true)),
            ]);
        }
        return returned;
    };
    Events.prototype.emit = function (name) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        return this.trigger.apply(this, __spreadArray([name], args, false));
    };
    return Events;
}());
exports.Events = Events;
var Private;
(function (Private) {
    function call(list, args) {
        var results = [];
        for (var i = 0; i < list.length; i += 2) {
            var handler = list[i];
            var context = list[i + 1];
            var params = Array.isArray(args) ? args : [args];
            var ret = util_1.FunctionExt.apply(handler, context, params);
            results.push(ret);
        }
        return util_1.FunctionExt.toAsyncBoolean(results);
    }
    Private.call = call;
})(Private || (Private = {}));
//# sourceMappingURL=events.js.map