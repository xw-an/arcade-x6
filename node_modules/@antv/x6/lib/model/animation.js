"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Animation = void 0;
var util_1 = require("../util");
var common_1 = require("../common");
var Animation = /** @class */ (function () {
    function Animation(cell) {
        this.cell = cell;
        this.ids = {};
        this.cache = {};
    }
    Animation.prototype.get = function () {
        return Object.keys(this.ids);
    };
    Animation.prototype.start = function (path, targetValue, options, delim) {
        var _this = this;
        if (options === void 0) { options = {}; }
        if (delim === void 0) { delim = '/'; }
        var startValue = this.cell.getPropByPath(path);
        var localOptions = util_1.ObjectExt.defaults(options, Animation.defaultOptions);
        var timing = this.getTiming(localOptions.timing);
        var interpolate = this.getInterp(localOptions.interp, startValue, targetValue);
        var startTime = 0;
        var key = Array.isArray(path) ? path.join(delim) : path;
        var paths = Array.isArray(path) ? path : path.split(delim);
        var iterate = function () {
            var now = new Date().getTime();
            if (startTime === 0) {
                startTime = now;
            }
            var elaspe = now - startTime;
            var progress = elaspe / localOptions.duration;
            if (progress < 1) {
                _this.ids[key] = util_1.Dom.requestAnimationFrame(iterate);
            }
            else {
                progress = 1;
            }
            var currentValue = interpolate(timing(progress));
            _this.cell.setPropByPath(paths, currentValue);
            if (options.progress) {
                options.progress(__assign({ progress: progress, currentValue: currentValue }, _this.getArgs(key)));
            }
            if (progress === 1) {
                // TODO: remove in the next major version
                _this.cell.notify('transition:end', _this.getArgs(key));
                _this.cell.notify('transition:complete', _this.getArgs(key));
                options.complete && options.complete(_this.getArgs(key));
                _this.cell.notify('transition:finish', _this.getArgs(key));
                options.finish && options.finish(_this.getArgs(key));
                _this.clean(key);
            }
        };
        setTimeout(function () {
            _this.stop(path, undefined, delim);
            _this.cache[key] = { startValue: startValue, targetValue: targetValue, options: localOptions };
            _this.ids[key] = util_1.Dom.requestAnimationFrame(iterate);
            // TODO: remove in the next major version
            _this.cell.notify('transition:begin', _this.getArgs(key));
            _this.cell.notify('transition:start', _this.getArgs(key));
            options.start && options.start(_this.getArgs(key));
        }, options.delay);
        return this.stop.bind(this, path, delim, options);
    };
    Animation.prototype.stop = function (path, options, delim) {
        var _this = this;
        if (options === void 0) { options = {}; }
        if (delim === void 0) { delim = '/'; }
        var paths = Array.isArray(path) ? path : path.split(delim);
        Object.keys(this.ids)
            .filter(function (key) {
            return util_1.ObjectExt.isEqual(paths, key.split(delim).slice(0, paths.length));
        })
            .forEach(function (key) {
            util_1.Dom.cancelAnimationFrame(_this.ids[key]);
            var data = _this.cache[key];
            var commonArgs = _this.getArgs(key);
            var localOptions = __assign(__assign({}, data.options), options);
            var jumpedToEnd = localOptions.jumpedToEnd;
            if (jumpedToEnd && data.targetValue != null) {
                _this.cell.setPropByPath(key, data.targetValue);
                _this.cell.notify('transition:end', __assign({}, commonArgs));
                _this.cell.notify('transition:complete', __assign({}, commonArgs));
                localOptions.complete && localOptions.complete(__assign({}, commonArgs));
            }
            var stopArgs = __assign({ jumpedToEnd: jumpedToEnd }, commonArgs);
            _this.cell.notify('transition:stop', __assign({}, stopArgs));
            localOptions.stop && localOptions.stop(__assign({}, stopArgs));
            _this.cell.notify('transition:finish', __assign({}, commonArgs));
            localOptions.finish && localOptions.finish(__assign({}, commonArgs));
            _this.clean(key);
        });
        return this;
    };
    Animation.prototype.clean = function (key) {
        delete this.ids[key];
        delete this.cache[key];
    };
    Animation.prototype.getTiming = function (timing) {
        return typeof timing === 'string' ? common_1.Timing[timing] : timing;
    };
    Animation.prototype.getInterp = function (interp, startValue, targetValue) {
        if (interp) {
            return interp(startValue, targetValue);
        }
        if (typeof targetValue === 'number') {
            return common_1.Interp.number(startValue, targetValue);
        }
        if (typeof targetValue === 'string') {
            if (targetValue[0] === '#') {
                return common_1.Interp.color(startValue, targetValue);
            }
            return common_1.Interp.unit(startValue, targetValue);
        }
        return common_1.Interp.object(startValue, targetValue);
    };
    Animation.prototype.getArgs = function (key) {
        var data = this.cache[key];
        return {
            path: key,
            startValue: data.startValue,
            targetValue: data.targetValue,
            cell: this.cell,
        };
    };
    return Animation;
}());
exports.Animation = Animation;
(function (Animation) {
    Animation.defaultOptions = {
        delay: 10,
        duration: 100,
        timing: 'linear',
    };
})(Animation = exports.Animation || (exports.Animation = {}));
exports.Animation = Animation;
//# sourceMappingURL=animation.js.map