export var Decorator;
(function (Decorator) {
    function checkScroller(err, warning) {
        return (target, methodName, descriptor) => {
            const raw = descriptor.value;
            descriptor.value = function (...args) {
                const scroller = this.scroller.widget;
                if (scroller == null) {
                    const msg = `Shoule enable scroller to use method '${methodName}'`;
                    if (err !== false) {
                        console.error(msg);
                        throw new Error(msg);
                    }
                    if (warning !== false) {
                        console.warn(msg);
                    }
                    return this;
                }
                return raw.call(this, ...args);
            };
        };
    }
    Decorator.checkScroller = checkScroller;
})(Decorator || (Decorator = {}));
//# sourceMappingURL=decorator.js.map