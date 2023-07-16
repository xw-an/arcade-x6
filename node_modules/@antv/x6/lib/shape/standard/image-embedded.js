"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmbeddedImage = void 0;
var util_1 = require("../basic/util");
var util_2 = require("./util");
exports.EmbeddedImage = (0, util_2.createShape)('image-embedded', {
    markup: [
        {
            tagName: 'rect',
            selector: 'body',
        },
        {
            tagName: 'image',
            selector: 'image',
        },
        {
            tagName: 'text',
            selector: 'label',
        },
    ],
    attrs: {
        body: {
            refWidth: '100%',
            refHeight: '100%',
            stroke: '#333333',
            fill: '#FFFFFF',
            strokeWidth: 2,
        },
        image: {
            // xlinkHref: '[URL]'
            refWidth: '30%',
            refHeight: -20,
            x: 10,
            y: 10,
            preserveAspectRatio: 'xMidYMin',
        },
    },
    propHooks: (0, util_1.getImageUrlHook)(),
});
//# sourceMappingURL=image-embedded.js.map