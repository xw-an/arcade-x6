"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cylinder = void 0;
var path_1 = require("./path");
var util_1 = require("./util");
exports.Cylinder = (0, util_1.createShape)('cylinder', {
    width: 40,
    height: 40,
    attrs: {
        path: {
            fill: '#FFFFFF',
            stroke: '#cbd2d7',
            strokeWidth: 3,
            d: [
                'M 0 10 C 10 5, 30 5, 40 10 C 30 15, 10 15, 0 10',
                'L 0 20',
                'C 10 25, 30 25, 40 20',
                'L 40 10',
            ].join(' '),
        },
        text: {
            refY: 0.7,
            refDy: null,
            fill: '#435460',
        },
    },
}, {
    parent: path_1.Path,
    ignoreMarkup: true,
});
//# sourceMappingURL=cylinder.js.map