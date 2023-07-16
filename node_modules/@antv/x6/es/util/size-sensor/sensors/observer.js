import { debounce } from './util';
export function createSensor(element) {
    let sensor = null;
    let listeners = [];
    const trigger = debounce(() => {
        listeners.forEach((listener) => {
            listener(element);
        });
    });
    const create = () => {
        const s = new ResizeObserver(trigger);
        s.observe(element);
        trigger();
        return s;
    };
    const bind = (listener) => {
        if (!sensor) {
            sensor = create();
        }
        if (listeners.indexOf(listener) === -1) {
            listeners.push(listener);
        }
    };
    const destroy = () => {
        if (sensor) {
            sensor.disconnect();
            listeners = [];
            sensor = null;
        }
    };
    const unbind = (listener) => {
        const idx = listeners.indexOf(listener);
        if (idx !== -1) {
            listeners.splice(idx, 1);
        }
        // no listener, and sensor is exist then destroy the sensor
        if (listeners.length === 0 && sensor) {
            destroy();
        }
    };
    return {
        element,
        bind,
        destroy,
        unbind,
    };
}
//# sourceMappingURL=observer.js.map