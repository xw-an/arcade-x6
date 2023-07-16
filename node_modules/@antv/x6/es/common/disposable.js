/* eslint-disable no-underscore-dangle */
export class Disposable {
    get disposed() {
        return this._disposed === true;
    }
    dispose() {
        this._disposed = true;
    }
}
(function (Disposable) {
    function dispose() {
        return (target, methodName, descriptor) => {
            const raw = descriptor.value;
            const proto = target.__proto__; // eslint-disable-line
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
})(Disposable || (Disposable = {}));
/**
 * A disposable object which delegates to a callback function.
 */
export class DisposableDelegate {
    /**
     * Construct a new disposable delegate.
     *
     * @param callback - The callback function to invoke on dispose.
     */
    constructor(callback) {
        this.callback = callback;
    }
    /**
     * Test whether the delegate has been disposed.
     */
    get disposed() {
        return !this.callback;
    }
    /**
     * Dispose of the delegate and invoke the callback function.
     */
    dispose() {
        if (!this.callback) {
            return;
        }
        const callback = this.callback;
        this.callback = null;
        callback();
    }
}
/**
 * An object which manages a collection of disposable items.
 */
export class DisposableSet {
    constructor() {
        this.isDisposed = false; // eslint-disable-line:variable-name
        this.items = new Set();
    }
    /**
     * Test whether the set has been disposed.
     */
    get disposed() {
        return this.isDisposed;
    }
    /**
     * Dispose of the set and the items it contains.
     *
     * #### Notes
     * Items are disposed in the order they are added to the set.
     */
    dispose() {
        if (this.isDisposed) {
            return;
        }
        this.isDisposed = true;
        this.items.forEach((item) => {
            item.dispose();
        });
        this.items.clear();
    }
    /**
     * Test whether the set contains a specific item.
     *
     * @param item - The item of interest.
     *
     * @returns `true` if the set contains the item, `false` otherwise.
     */
    contains(item) {
        return this.items.has(item);
    }
    /**
     * Add a disposable item to the set.
     *
     * @param item - The item to add to the set.
     *
     * #### Notes
     * If the item is already contained in the set, this is a no-op.
     */
    add(item) {
        this.items.add(item);
    }
    /**
     * Remove a disposable item from the set.
     *
     * @param item - The item to remove from the set.
     *
     * #### Notes
     * If the item is not contained in the set, this is a no-op.
     */
    remove(item) {
        this.items.delete(item);
    }
    /**
     * Remove all items from the set.
     */
    clear() {
        this.items.clear();
    }
}
(function (DisposableSet) {
    /**
     * Create a disposable set from an iterable of items.
     *
     * @param items - The iterable or array-like object of interest.
     *
     * @returns A new disposable initialized with the given items.
     */
    function from(items) {
        const set = new DisposableSet();
        items.forEach((item) => {
            set.add(item);
        });
        return set;
    }
    DisposableSet.from = from;
})(DisposableSet || (DisposableSet = {}));
//# sourceMappingURL=disposable.js.map