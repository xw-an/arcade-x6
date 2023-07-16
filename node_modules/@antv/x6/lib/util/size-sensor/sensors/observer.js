"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSensor = void 0;
var util_1 = require("./util");
function createSensor(element) {
    var sensor = null;
    var listeners = [];
    var trigger = (0, util_1.debounce)(function () {
        listeners.forEach(function (listener) {
            listener(element);
        });
    });
    var create = function () {
        var s = new ResizeObserver(trigger);
        s.observe(element);
        trigger();
        return s;
    };
    var bind = function (listener) {
        if (!sensor) {
            sensor = create();
        }
        if (listeners.indexOf(listener) === -1) {
            listeners.push(listener);
        }
    };
    var destroy = function () {
        if (sensor) {
            sensor.disconnect();
            listeners = [];
            sensor = null;
        }
    };
    var unbind = function (listener) {
        var idx = listeners.indexOf(listener);
        if (idx !== -1) {
            listeners.splice(idx, 1);
        }
        // no listener, and sensor is exist then destroy the sensor
        if (listeners.length === 0 && sensor) {
            destroy();
        }
    };
    return {
        element: element,
        bind: bind,
        destroy: destroy,
        unbind: unbind,
    };
}
exports.createSensor = createSensor;
//# sourceMappingURL=observer.js.map