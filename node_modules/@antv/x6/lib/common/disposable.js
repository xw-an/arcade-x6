"use strict";
/* eslint-disable no-underscore-dangle */
Object.defineProperty(exports, "__esModule", { value: true });
exports.DisposableSet = exports.DisposableDelegate = exports.Disposable = void 0;
var Disposable = /** @class */ (function () {
    function Disposable() {
    }
    Object.defineProperty(Disposable.prototype, "disposed", {
        get: function () {
            return this._disposed === true;
        },
        enumerable: false,
        configurable: true
    });
    Disposable.prototype.dispose = function () {
        this._disposed = true;
    };
    return Disposable;
}());
exports.Disposable = Disposable;
(function (Disposable) {
    function dispose() {
        return function (target, methodName, descriptor) {
            var raw = descriptor.value;
            var proto = target.__proto__; // eslint-disable-line
            descriptor.value = function () {
                if (this.disposed) {
                    return;
                }
                raw.call(this);
                proto.dispose.call(this);
            };
        };
    }
    Disposable.dispose = dispose;
})(Disposable = exports.Disposable || (exports.Disposable = {}));
exports.Disposable = Disposable;
/**
 * A disposable object which delegates to a callback function.
 */
var DisposableDelegate = /** @class */ (function () {
    /**
     * Construct a new disposable delegate.
     *
     * @param callback - The callback function to invoke on dispose.
     */
    function DisposableDelegate(callback) {
        this.callback = callback;
    }
    Object.defineProperty(DisposableDelegate.prototype, "disposed", {
        /**
         * Test whether the delegate has been disposed.
         */
        get: function () {
            return !this.callback;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Dispose of the delegate and invoke the callback function.
     */
    DisposableDelegate.prototype.dispose = function () {
        if (!this.callback) {
            return;
        }
        var callback = this.callback;
        this.callback = null;
        callback();
    };
    return DisposableDelegate;
}());
exports.DisposableDelegate = DisposableDelegate;
/**
 * An object which manages a collection of disposable items.
 */
var DisposableSet = /** @class */ (function () {
    function DisposableSet() {
        this.isDisposed = false; // eslint-disable-line:variable-name
        this.items = new Set();
    }
    Object.defineProperty(DisposableSet.prototype, "disposed", {
        /**
         * Test whether the set has been disposed.
         */
        get: function () {
            return this.isDisposed;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Dispose of the set and the items it contains.
     *
     * #### Notes
     * Items are disposed in the order they are added to the set.
     */
    DisposableSet.prototype.dispose = function () {
        if (this.isDisposed) {
            return;
        }
        this.isDisposed = true;
        this.items.forEach(function (item) {
            item.dispose();
        });
        this.items.clear();
    };
    /**
     * Test whether the set contains a specific item.
     *
     * @param item - The item of interest.
     *
     * @returns `true` if the set contains the item, `false` otherwise.
     */
    DisposableSet.prototype.contains = function (item) {
        return this.items.has(item);
    };
    /**
     * Add a disposable item to the set.
     *
     * @param item - The item to add to the set.
     *
     * #### Notes
     * If the item is already contained in the set, this is a no-op.
     */
    DisposableSet.prototype.add = function (item) {
        this.items.add(item);
    };
    /**
     * Remove a disposable item from the set.
     *
     * @param item - The item to remove from the set.
     *
     * #### Notes
     * If the item is not contained in the set, this is a no-op.
     */
    DisposableSet.prototype.remove = function (item) {
        this.items.delete(item);
    };
    /**
     * Remove all items from the set.
     */
    DisposableSet.prototype.clear = function () {
        this.items.clear();
    };
    return DisposableSet;
}());
exports.DisposableSet = DisposableSet;
(function (DisposableSet) {
    /**
     * Create a disposable set from an iterable of items.
     *
     * @param items - The iterable or array-like object of interest.
     *
     * @returns A new disposable initialized with the given items.
     */
    function from(items) {
        var set = new DisposableSet();
        items.forEach(function (item) {
            set.add(item);
        });
        return set;
    }
    DisposableSet.from = from;
})(DisposableSet = exports.DisposableSet || (exports.DisposableSet = {}));
exports.DisposableSet = DisposableSet;
//# sourceMappingURL=disposable.js.map