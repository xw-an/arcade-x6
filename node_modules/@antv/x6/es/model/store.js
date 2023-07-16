var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Basecoat } from '../common';
import { ObjectExt } from '../util';
export class Store extends Basecoat {
    constructor(data = {}) {
        super();
        this.pending = false;
        this.changing = false;
        this.data = {};
        this.mutate(ObjectExt.cloneDeep(data));
        this.changed = {};
    }
    mutate(data, options = {}) {
        const unset = options.unset === true;
        const silent = options.silent === true;
        const changes = [];
        const changing = this.changing;
        this.changing = true;
        if (!changing) {
            this.previous = ObjectExt.cloneDeep(this.data);
            this.changed = {};
        }
        const current = this.data;
        const previous = this.previous;
        const changed = this.changed;
        Object.keys(data).forEach((k) => {
            const key = k;
            const newValue = data[key];
            if (!ObjectExt.isEqual(current[key], newValue)) {
                changes.push(key);
            }
            if (!ObjectExt.isEqual(previous[key], newValue)) {
                changed[key] = newValue;
            }
            else {
                delete changed[key];
            }
            if (unset) {
                delete current[key];
            }
            else {
                current[key] = newValue;
            }
        });
        if (!silent && changes.length > 0) {
            this.pending = true;
            this.pendingOptions = options;
            changes.forEach((key) => {
                this.emit('change:*', {
                    key,
                    options,
                    store: this,
                    current: current[key],
                    previous: previous[key],
                });
            });
        }
        if (changing) {
            return this;
        }
        if (!silent) {
            // Changes can be recursively nested within `"change"` events.
            while (this.pending) {
                this.pending = false;
                this.emit('changed', {
                    current,
                    previous,
                    store: this,
                    options: this.pendingOptions,
                });
            }
        }
        this.pending = false;
        this.changing = false;
        this.pendingOptions = null;
        return this;
    }
    get(key, defaultValue) {
        if (key == null) {
            return this.data;
        }
        const ret = this.data[key];
        return ret == null ? defaultValue : ret;
    }
    getPrevious(key) {
        if (this.previous) {
            const ret = this.previous[key];
            return ret == null ? undefined : ret;
        }
        return undefined;
    }
    set(key, value, options) {
        if (key != null) {
            if (typeof key === 'object') {
                this.mutate(key, value);
            }
            else {
                this.mutate({ [key]: value }, options);
            }
        }
        return this;
    }
    remove(key, options) {
        const empty = undefined;
        const subset = {};
        let opts;
        if (typeof key === 'string') {
            subset[key] = empty;
            opts = options;
        }
        else if (Array.isArray(key)) {
            key.forEach((k) => (subset[k] = empty));
            opts = options;
        }
        else {
            // eslint-disable-next-line
            for (const key in this.data) {
                subset[key] = empty;
            }
            opts = key;
        }
        this.mutate(subset, Object.assign(Object.assign({}, opts), { unset: true }));
        return this;
    }
    getByPath(path) {
        return ObjectExt.getByPath(this.data, path, '/');
    }
    setByPath(path, value, options = {}) {
        const delim = '/';
        const pathArray = Array.isArray(path) ? [...path] : path.split(delim);
        const pathString = Array.isArray(path) ? path.join(delim) : path;
        const property = pathArray[0];
        const pathArrayLength = pathArray.length;
        options.propertyPath = pathString;
        options.propertyValue = value;
        options.propertyPathArray = pathArray;
        if (pathArrayLength === 1) {
            this.set(property, value, options);
        }
        else {
            const update = {};
            let diver = update;
            let nextKey = property;
            // Initialize the nested object. Subobjects are either arrays or objects.
            // An empty array is created if the sub-key is an integer. Otherwise, an
            // empty object is created.
            for (let i = 1; i < pathArrayLength; i += 1) {
                const key = pathArray[i];
                const isArrayIndex = Number.isFinite(Number(key));
                diver = diver[nextKey] = isArrayIndex ? [] : {};
                nextKey = key;
            }
            // Fills update with the `value` on `path`.
            ObjectExt.setByPath(update, pathArray, value, delim);
            const data = ObjectExt.cloneDeep(this.data);
            // If rewrite mode enabled, we replace value referenced by path with the
            // new one (we don't merge).
            if (options.rewrite) {
                ObjectExt.unsetByPath(data, path, delim);
            }
            const merged = ObjectExt.merge(data, update);
            this.set(property, merged[property], options);
        }
        return this;
    }
    removeByPath(path, options) {
        const keys = Array.isArray(path) ? path : path.split('/');
        const key = keys[0];
        if (keys.length === 1) {
            this.remove(key, options);
        }
        else {
            const paths = keys.slice(1);
            const prop = ObjectExt.cloneDeep(this.get(key));
            if (prop) {
                ObjectExt.unsetByPath(prop, paths);
            }
            this.set(key, prop, options);
        }
        return this;
    }
    hasChanged(key) {
        if (key == null) {
            return Object.keys(this.changed).length > 0;
        }
        return key in this.changed;
    }
    /**
     * Returns an object containing all the data that have changed,
     * or `null` if there are no changes. Useful for determining what
     * parts of a view need to be updated.
     */
    getChanges(diff) {
        if (diff == null) {
            return this.hasChanged() ? ObjectExt.cloneDeep(this.changed) : null;
        }
        const old = this.changing ? this.previous : this.data;
        const changed = {};
        let hasChanged;
        // eslint-disable-next-line
        for (const key in diff) {
            const val = diff[key];
            if (!ObjectExt.isEqual(old[key], val)) {
                changed[key] = val;
                hasChanged = true;
            }
        }
        return hasChanged ? ObjectExt.cloneDeep(changed) : null;
    }
    /**
     * Returns a copy of the store's `data` object.
     */
    toJSON() {
        return ObjectExt.cloneDeep(this.data);
    }
    clone() {
        const constructor = this.constructor;
        return new constructor(this.data);
    }
    dispose() {
        this.off();
        this.data = {};
        this.previous = {};
        this.changed = {};
        this.pending = false;
        this.changing = false;
        this.pendingOptions = null;
        this.trigger('disposed', { store: this });
    }
}
__decorate([
    Basecoat.dispose()
], Store.prototype, "dispose", null);
//# sourceMappingURL=store.js.map