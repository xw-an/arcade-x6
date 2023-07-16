"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Polyline = void 0;
var util_1 = require("./util");
exports.Polyline = (0, util_1.createShape)('polyline', {
    width: 60,
    height: 40,
    attrs: {
        text: {
            refY: null,
            refDy: 16,
        },
    },
});
//# sourceMappingURL=polyline.js.map