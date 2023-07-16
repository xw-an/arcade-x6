"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSensor = void 0;
var object_1 = require("./object");
var observer_1 = require("./observer");
exports.createSensor = typeof ResizeObserver !== 'undefined'
    ? observer_1.createSensor
    : object_1.createSensor;
//# sourceMappingURL=index.js.map