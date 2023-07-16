"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SizeSensor = void 0;
var sensors_1 = require("./sensors");
var SizeSensor;
(function (SizeSensor) {
    var cache = new WeakMap();
    function get(element) {
        var sensor = cache.get(element);
        if (sensor) {
            return sensor;
        }
        sensor = (0, sensors_1.createSensor)(element);
        cache.set(element, sensor);
        return sensor;
    }
    function remove(sensor) {
        sensor.destroy();
        cache.delete(sensor.element);
    }
    SizeSensor.bind = function (element, cb) {
        var sensor = get(element);
        sensor.bind(cb);
        return function () { return sensor.unbind(cb); };
    };
    SizeSensor.clear = function (element) {
        var sensor = get(element);
        remove(sensor);
    };
})(SizeSensor = exports.SizeSensor || (exports.SizeSensor = {}));
//# sourceMappingURL=index.js.map