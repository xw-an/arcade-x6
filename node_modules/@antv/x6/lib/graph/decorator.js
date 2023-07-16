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
exports.Decorator = void 0;
var Decorator;
(function (Decorator) {
    function checkScroller(err, warning) {
        return function (target, methodName, descriptor) {
            var raw = descriptor.value;
            descriptor.value = function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                var scroller = this.scroller.widget;
                if (scroller == null) {
                    var msg = "Shoule enable scroller to use method '" + methodName + "'";
                    if (err !== false) {
                        console.error(msg);
                        throw new Error(msg);
                    }
                    if (warning !== false) {
                        console.warn(msg);
                    }
                    return this;
                }
                return raw.call.apply(raw, __spreadArray([this], args, false));
            };
        };
    }
    Decorator.checkScroller = checkScroller;
})(Decorator = exports.Decorator || (exports.Decorator = {}));
//# sourceMappingURL=decorator.js.map