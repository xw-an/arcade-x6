"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mesh = void 0;
var util_1 = require("../../util");
exports.mesh = {
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
};
//# sourceMappingURL=mesh.js.map