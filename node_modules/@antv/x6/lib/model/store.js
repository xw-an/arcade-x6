"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
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
exports.Store = void 0;
var common_1 = require("../common");
var util_1 = require("../util");
var Store = /** @class */ (function (_super) {
    __extends(Store, _super);
    function Store(data) {
        if (data === void 0) { data = {}; }
        var _this = _super.call(this) || this;
        _this.pending = false;
        _this.changing = false;
        _this.data = {};
        _this.mutate(util_1.ObjectExt.cloneDeep(data));
        _this.changed = {};
        return _this;
    }
    Store.prototype.mutate = function (data, options) {
        var _this = this;
        if (options === void 0) { options = {}; }
        var unset = options.unset === true;
        var silent = options.silent === true;
        var changes = [];
        var changing = this.changing;
        this.changing = true;
        if (!changing) {
            this.previous = util_1.ObjectExt.cloneDeep(this.data);
            this.changed = {};
        }
        var current = this.data;
        var previous = this.previous;
        var changed = this.changed;
        Object.keys(data).forEach(function (k) {
            var key = k;
            var newValue = data[key];
            if (!util_1.ObjectExt.isEqual(current[key], newValue)) {
                changes.push(key);
            }
            if (!util_1.ObjectExt.isEqual(previous[key], newValue)) {
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
            changes.forEach(function (key) {
                _this.emit('change:*', {
                    key: key,
                    options: options,
                    store: _this,
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
                    current: current,
                    previous: previous,
                    store: this,
                    options: this.pendingOptions,
                });
            }
        }
        this.pending = false;
        this.changing = false;
        this.pendingOptions = null;
        return this;
    };
    Store.prototype.get = function (key, defaultValue) {
        if (key == null) {
            return this.data;
        }
        var ret = this.data[key];
        return ret == null ? defaultValue : ret;
    };
    Store.prototype.getPrevious = function (key) {
        if (this.previous) {
            var ret = this.previous[key];
            return ret == null ? undefined : ret;
        }
        return undefined;
    };
    Store.prototype.set = function (key, value, options) {
        var _a;
        if (key != null) {
            if (typeof key === 'object') {
                this.mutate(key, value);
            }
            else {
                this.mutate((_a = {}, _a[key] = value, _a), options);
            }
        }
        return this;
    };
    Store.prototype.remove = function (key, options) {
        var empty = undefined;
        var subset = {};
        var opts;
        if (typeof key === 'string') {
            subset[key] = empty;
            opts = options;
        }
        else if (Array.isArray(key)) {
            key.forEach(function (k) { return (subset[k] = empty); });
            opts = options;
        }
        else {
            // eslint-disable-next-line
            for (var key_1 in this.data) {
                subset[key_1] = empty;
            }
            opts = key;
        }
        this.mutate(subset, __assign(__assign({}, opts), { unset: true }));
        return this;
    };
    Store.prototype.getByPath = function (path) {
        return util_1.ObjectExt.getByPath(this.data, path, '/');
    };
    Store.prototype.setByPath = function (path, value, options) {
        if (options === void 0) { options = {}; }
        var delim = '/';
        var pathArray = Array.isArray(path) ? __spreadArray([], path, true) : path.split(delim);
        var pathString = Array.isArray(path) ? path.join(delim) : path;
        var property = pathArray[0];
        var pathArrayLength = pathArray.length;
        options.propertyPath = pathString;
        options.propertyValue = value;
        options.propertyPathArray = pathArray;
        if (pathArrayLength === 1) {
            this.set(property, value, options);
        }
        else {
            var update = {};
            var diver = update;
            var nextKey = property;
            // Initialize the nested object. Subobjects are either arrays or objects.
            // An empty array is created if the sub-key is an integer. Otherwise, an
            // empty object is created.
            for (var i = 1; i < pathArrayLength; i += 1) {
                var key = pathArray[i];
                var isArrayIndex = Number.isFinite(Number(key));
                diver = diver[nextKey] = isArrayIndex ? [] : {};
                nextKey = key;
            }
            // Fills update with the `value` on `path`.
            util_1.ObjectExt.setByPath(update, pathArray, value, delim);
            var data = util_1.ObjectExt.cloneDeep(this.data);
            // If rewrite mode enabled, we replace value referenced by path with the
            // new one (we don't merge).
            if (options.rewrite) {
                util_1.ObjectExt.unsetByPath(data, path, delim);
            }
            var merged = util_1.ObjectExt.merge(data, update);
            this.set(property, merged[property], options);
        }
        return this;
    };
    Store.prototype.removeByPath = function (path, options) {
        var keys = Array.isArray(path) ? path : path.split('/');
        var key = keys[0];
        if (keys.length === 1) {
            this.remove(key, options);
        }
        else {
            var paths = keys.slice(1);
            var prop = util_1.ObjectExt.cloneDeep(this.get(key));
            if (prop) {
                util_1.ObjectExt.unsetByPath(prop, paths);
            }
            this.set(key, prop, options);
        }
        return this;
    };
    Store.prototype.hasChanged = function (key) {
        if (key == null) {
            return Object.keys(this.changed).length > 0;
        }
        return key in this.changed;
    };
    /**
     * Returns an object containing all the data that have changed,
     * or `null` if there are no changes. Useful for determining what
     * parts of a view need to be updated.
     */
    Store.prototype.getChanges = function (diff) {
        if (diff == null) {
            return this.hasChanged() ? util_1.ObjectExt.cloneDeep(this.changed) : null;
        }
        var old = this.changing ? this.previous : this.data;
        var changed = {};
        var hasChanged;
        // eslint-disable-next-line
        for (var key in diff) {
            var val = diff[key];
            if (!util_1.ObjectExt.isEqual(old[key], val)) {
                changed[key] = val;
                hasChanged = true;
            }
        }
        return hasChanged ? util_1.ObjectExt.cloneDeep(changed) : null;
    };
    /**
     * Returns a copy of the store's `data` object.
     */
    Store.prototype.toJSON = function () {
        return util_1.ObjectExt.cloneDeep(this.data);
    };
    Store.prototype.clone = function () {
        var constructor = this.constructor;
        return new constructor(this.data);
    };
    Store.prototype.dispose = function () {
        this.off();
        this.data = {};
        this.previous = {};
        this.changed = {};
        this.pending = false;
        this.changing = false;
        this.pendingOptions = null;
        this.trigger('disposed', { store: this });
    };
    __decorate([
        common_1.Basecoat.dispose()
    ], Store.prototype, "dispose", null);
    return Store;
}(common_1.Basecoat));
exports.Store = Store;
//# sourceMappingURL=store.js.map