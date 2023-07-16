"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSensor = void 0;
var util_1 = require("./util");
function createSensor(element) {
    var sensor = null;
    var listeners = [];
    var create = function () {
        if (getComputedStyle(element).position === 'static') {
            var style = element.style;
            style.position = 'relative';
        }
        var obj = document.createElement('object');
        obj.onload = function () {
            obj.contentDocument.defaultView.addEventListener('resize', trigger);
            trigger();
        };
        obj.style.display = 'block';
        obj.style.position = 'absolute';
        obj.style.top = '0';
        obj.style.left = '0';
        obj.style.height = '100%';
        obj.style.width = '100%';
        obj.style.overflow = 'hidden';
        obj.style.pointerEvents = 'none';
        obj.style.zIndex = '-1';
        obj.style.opacity = '0';
        obj.setAttribute('tabindex', '-1');
        obj.type = 'text/html';
        element.appendChild(obj);
        // for ie, should set data attribute delay, or will be white screen
        obj.data = 'about:blank';
        return obj;
    };
    var trigger = (0, util_1.debounce)(function () {
        listeners.forEach(function (listener) { return listener(element); });
    });
    var bind = function (listener) {
        if (!sensor) {
            sensor = create();
        }
        if (listeners.indexOf(listener) === -1) {
            listeners.push(listener);
        }
    };
    var destroy = function () {
        if (sensor && sensor.parentNode) {
            if (sensor.contentDocument) {
                sensor.contentDocument.defaultView.removeEventListener('resize', trigger);
            }
            sensor.parentNode.removeChild(sensor);
            sensor = null;
            listeners = [];
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
//# sourceMappingURL=object.js.map