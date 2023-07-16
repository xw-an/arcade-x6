"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fixedDot = void 0;
var util_1 = require("../../util");
exports.fixedDot = {
    color: '#aaaaaa',
    thickness: 1,
    markup: 'rect',
    update: function (elem, options) {
        var size = options.sx <= 1 ? options.thickness * options.sx : options.thickness;
        util_1.Dom.attr(elem, {
            width: size,
            height: size,
            rx: size,
            ry: size,
            fill: options.color,
        });
    },
};
//# sourceMappingURL=fixed-dot.js.map