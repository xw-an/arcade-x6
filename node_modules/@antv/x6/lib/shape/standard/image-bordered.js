"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BorderedImage = void 0;
var util_1 = require("../basic/util");
var util_2 = require("./util");
exports.BorderedImage = (0, util_2.createShape)('image-bordered', {
    markup: [
        {
            tagName: 'rect',
            selector: 'background',
            attrs: {
                stroke: 'none',
            },
        },
        {
            tagName: 'image',
            selector: 'image',
        },
        {
            tagName: 'rect',
            selector: 'border',
            attrs: {
                fill: 'none',
            },
        },
        {
            tagName: 'text',
            selector: 'label',
        },
    ],
    attrs: {
        background: {
            refWidth: -1,
            refHeight: -1,
            x: 0.5,
            y: 0.5,
            fill: '#ffffff',
        },
        border: {
            refWidth: '100%',
            refHeight: '100%',
            stroke: '#333333',
            strokeWidth: 2,
        },
        image: {
            // xlinkHref: '[URL]'
            refWidth: -1,
            refHeight: -1,
            x: 0.5,
            y: 0.5,
        },
    },
    propHooks: (0, util_1.getImageUrlHook)(),
});
//# sourceMappingURL=image-bordered.js.map