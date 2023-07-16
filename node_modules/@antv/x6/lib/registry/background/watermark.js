"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.watermark = void 0;
var geometry_1 = require("../../geometry");
var watermark = function (img, options) {
    var width = img.width;
    var height = img.height;
    var canvas = document.createElement('canvas');
    canvas.width = width * 3;
    canvas.height = height * 3;
    var ctx = canvas.getContext('2d');
    var angle = options.angle != null ? -options.angle : -20;
    var radians = geometry_1.Angle.toRad(angle);
    var stepX = canvas.width / 4;
    var stepY = canvas.height / 4;
    for (var i = 0; i < 4; i += 1) {
        for (var j = 0; j < 4; j += 1) {
            if ((i + j) % 2 > 0) {
                ctx.setTransform(1, 0, 0, 1, (2 * i - 1) * stepX, (2 * j - 1) * stepY);
                ctx.rotate(radians);
                ctx.drawImage(img, -width / 2, -height / 2, width, height);
            }
        }
    }
    return canvas;
};
exports.watermark = watermark;
//# sourceMappingURL=watermark.js.map