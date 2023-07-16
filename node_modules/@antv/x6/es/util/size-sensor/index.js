import { createSensor } from './sensors';
export var SizeSensor;
(function (SizeSensor) {
    const cache = new WeakMap();
    function get(element) {
        let sensor = cache.get(element);
        if (sensor) {
            return sensor;
        }
        sensor = createSensor(element);
        cache.set(element, sensor);
        return sensor;
    }
    function remove(sensor) {
        sensor.destroy();
        cache.delete(sensor.element);
    }
    SizeSensor.bind = (element, cb) => {
        const sensor = get(element);
        sensor.bind(cb);
        return () => sensor.unbind(cb);
    };
    SizeSensor.clear = (element) => {
        const sensor = get(element);
        remove(sensor);
    };
})(SizeSensor || (SizeSensor = {}));
//# sourceMappingURL=index.js.map