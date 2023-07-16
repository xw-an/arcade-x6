"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dot = void 0;
var util_1 = require("../../util");
exports.dot = {
    color: '#aaaaaa',
    thickness: 1,
    markup: 'rect',
    update: function (elem, options) {
        var width = options.thickness * options.sx;
        var height = options.thickness * options.sy;
        util_1.Dom.attr(elem, {
            width: width,
            height: height,
            rx: width,
            ry: height,
            fill: options.color,
        });
    },
};
//# sourceMappingURL=dot.js.map