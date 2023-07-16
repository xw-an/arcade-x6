"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Image = void 0;
var util_1 = require("./util");
exports.Image = (0, util_1.createShape)('image', {
    attrs: {
        text: {
            refY: null,
            refDy: 16,
        },
    },
    propHooks: (0, util_1.getImageUrlHook)(),
});
//# sourceMappingURL=image.js.map