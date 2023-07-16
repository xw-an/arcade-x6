"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InscribedImage = void 0;
var util_1 = require("../basic/util");
var util_2 = require("./util");
exports.InscribedImage = (0, util_2.createShape)('image-inscribed', {
    propHooks: (0, util_1.getImageUrlHook)(),
    markup: [
        {
            tagName: 'ellipse',
            selector: 'background',
        },
        {
            tagName: 'image',
            selector: 'image',
        },
        {
            tagName: 'ellipse',
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
        border: {
            refRx: '50%',
            refRy: '50%',
            refCx: '50%',
            refCy: '50%',
            stroke: '#333333',
            strokeWidth: 2,
        },
        background: {
            refRx: '50%',
            refRy: '50%',
            refCx: '50%',
            refCy: '50%',
            fill: '#ffffff',
        },
        image: {
            // The image corners touch the border when its size is Math.sqrt(2) / 2 = 0.707.. ~= 70%
            refWidth: '68%',
            refHeight: '68%',
            // The image offset is calculated as (100% - 68%) / 2
            refX: '16%',
            refY: '16%',
            preserveAspectRatio: 'xMidYMid',
            // xlinkHref: '[URL]'
        },
        // label: {
        //   refX: '50%',
        //   refY: '100%',
        //   refY2: 10,
        //   textAnchor: 'middle',
        //   textVerticalAnchor: 'top',
        // },
    },
});
//# sourceMappingURL=image-inscribed.js.map