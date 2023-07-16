import { ObjectExt, Dom } from '../util';
import { Timing, Interp } from '../common';
export class Animation {
    constructor(cell) {
        this.cell = cell;
        this.ids = {};
        this.cache = {};
    }
    get() {
        return Object.keys(this.ids);
    }
    start(path, targetValue, options = {}, delim = '/') {
        const startValue = this.cell.getPropByPath(path);
        const localOptions = ObjectExt.defaults(options, Animation.defaultOptions);
        const timing = this.getTiming(localOptions.timing);
        const interpolate = this.getInterp(localOptions.interp, startValue, targetValue);
        let startTime = 0;
        const key = Array.isArray(path) ? path.join(delim) : path;
        const paths = Array.isArray(path) ? path : path.split(delim);
        const iterate = () => {
            const now = new Date().getTime();
            if (startTime === 0) {
                startTime = now;
            }
            const elaspe = now - startTime;
            let progress = elaspe / localOptions.duration;
            if (progress < 1) {
                this.ids[key] = Dom.requestAnimationFrame(iterate);
            }
            else {
                progress = 1;
            }
            const currentValue = interpolate(timing(progress));
            this.cell.setPropByPath(paths, currentValue);
            if (options.progress) {
                options.progress(Object.assign({ progress, currentValue }, this.getArgs(key)));
            }
            if (progress === 1) {
                // TODO: remove in the next major version
                this.cell.notify('transition:end', this.getArgs(key));
                this.cell.notify('transition:complete', this.getArgs(key));
                options.complete && options.complete(this.getArgs(key));
                this.cell.notify('transition:finish', this.getArgs(key));
                options.finish && options.finish(this.getArgs(key));
                this.clean(key);
            }
        };
        setTimeout(() => {
            this.stop(path, undefined, delim);
            this.cache[key] = { startValue, targetValue, options: localOptions };
            this.ids[key] = Dom.requestAnimationFrame(iterate);
            // TODO: remove in the next major version
            this.cell.notify('transition:begin', this.getArgs(key));
            this.cell.notify('transition:start', this.getArgs(key));
            options.start && options.start(this.getArgs(key));
        }, options.delay);
        return this.stop.bind(this, path, delim, options);
    }
    stop(path, options = {}, delim = '/') {
        const paths = Array.isArray(path) ? path : path.split(delim);
        Object.keys(this.ids)
            .filter((key) => ObjectExt.isEqual(paths, key.split(delim).slice(0, paths.length)))
            .forEach((key) => {
            Dom.cancelAnimationFrame(this.ids[key]);
            const data = this.cache[key];
            const commonArgs = this.getArgs(key);
            const localOptions = Object.assign(Object.assign({}, data.options), options);
            const jumpedToEnd = localOptions.jumpedToEnd;
            if (jumpedToEnd && data.targetValue != null) {
                this.cell.setPropByPath(key, data.targetValue);
                this.cell.notify('transition:end', Object.assign({}, commonArgs));
                this.cell.notify('transition:complete', Object.assign({}, commonArgs));
                localOptions.complete && localOptions.complete(Object.assign({}, commonArgs));
            }
            const stopArgs = Object.assign({ jumpedToEnd }, commonArgs);
            this.cell.notify('transition:stop', Object.assign({}, stopArgs));
            localOptions.stop && localOptions.stop(Object.assign({}, stopArgs));
            this.cell.notify('transition:finish', Object.assign({}, commonArgs));
            localOptions.finish && localOptions.finish(Object.assign({}, commonArgs));
            this.clean(key);
        });
        return this;
    }
    clean(key) {
        delete this.ids[key];
        delete this.cache[key];
    }
    getTiming(timing) {
        return typeof timing === 'string' ? Timing[timing] : timing;
    }
    getInterp(interp, startValue, targetValue) {
        if (interp) {
            return interp(startValue, targetValue);
        }
        if (typeof targetValue === 'number') {
            return Interp.number(startValue, targetValue);
        }
        if (typeof targetValue === 'string') {
            if (targetValue[0] === '#') {
                return Interp.color(startValue, targetValue);
            }
            return Interp.unit(startValue, targetValue);
        }
        return Interp.object(startValue, targetValue);
    }
    getArgs(key) {
        const data = this.cache[key];
        return {
            path: key,
            startValue: data.startValue,
            targetValue: data.targetValue,
            cell: this.cell,
        };
    }
}
(function (Animation) {
    Animation.defaultOptions = {
        delay: 10,
        duration: 100,
        timing: 'linear',
    };
})(Animation || (Animation = {}));
//# sourceMappingURL=animation.js.map