"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ellipse = void 0;
var util_1 = require("./util");
exports.Ellipse = (0, util_1.createShape)('ellipse', {
    width: 60,
    height: 40,
    attrs: {
        ellipse: {
            rx: 30,
            ry: 20,
            cx: 30,
            cy: 20,
        },
    },
});
//# sourceMappingURL=ellipse.js.map