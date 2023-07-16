"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Circle = void 0;
var util_1 = require("./util");
exports.Circle = (0, util_1.createShape)('circle', {
    width: 60,
    height: 60,
    attrs: {
        circle: {
            r: 30,
            cx: 30,
            cy: 30,
        },
    },
});
//# sourceMappingURL=circle.js.map