"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ellipse = void 0;
var util_1 = require("./util");
exports.Ellipse = (0, util_1.createShape)('ellipse', {
    attrs: {
        body: {
            refCx: '50%',
            refCy: '50%',
            refRx: '50%',
            refRy: '50%',
        },
    },
});
//# sourceMappingURL=ellipse.js.map