"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.doubleMesh = void 0;
var util_1 = require("../../util");
exports.doubleMesh = [
    {
        color: 'rgba(224,224,224,1)',
        thickness: 1,
        markup: 'path',
        update: function (elem, options) {
            var d;
            var width = options.width;
            var height = options.height;
            var thickness = options.thickness;
            if (width - thickness >= 0 && height - thickness >= 0) {
                d = ['M', width, 0, 'H0 M0 0 V0', height].join(' ');
            }
            else {
                d = 'M 0 0 0 0';
            }
            util_1.Dom.attr(elem, {
                d: d,
                stroke: options.color,
                'stroke-width': options.thickness,
            });
        },
    },
    {
        color: 'rgba(224,224,224,0.2)',
        thickness: 3,
        factor: 4,
        markup: 'path',
        update: function (elem, options) {
            var d;
            var factor = options.factor || 1;
            var width = options.width * factor;
            var height = options.height * factor;
            var thickness = options.thickness;
            if (width - thickness >= 0 && height - thickness >= 0) {
                d = ['M', width, 0, 'H0 M0 0 V0', height].join(' ');
            }
            else {
                d = 'M 0 0 0 0';
            }
            // update wrapper size
            options.width = width;
            options.height = height;
            util_1.Dom.attr(elem, {
                d: d,
                stroke: options.color,
                'stroke-width': options.thickness,
            });
        },
    },
];
//# sourceMappingURL=double-mesh.js.map