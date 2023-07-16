"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Polygon = void 0;
var util_1 = require("./util");
exports.Polygon = (0, util_1.createShape)('polygon', {
    width: 60,
    height: 40,
    attrs: {
        text: {
            refY: null,
            refDy: 16,
        },
    },
});
//# sourceMappingURL=polygon.js.map