"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Image = void 0;
var util_1 = require("../basic/util");
var util_2 = require("./util");
exports.Image = (0, util_2.createShape)('image', {
    attrs: {
        image: {
            refWidth: '100%',
            refHeight: '100%',
        },
    },
    propHooks: (0, util_1.getImageUrlHook)(),
}, {
    selector: 'image',
});
//# sourceMappingURL=image.js.map