"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.flipY = void 0;
var flipY = function (img) {
    // d d
    // q q
    var canvas = document.createElement('canvas');
    var width = img.width;
    var height = img.height;
    canvas.width = width;
    canvas.height = height * 2;
    var ctx = canvas.getContext('2d');
    // top image
    ctx.drawImage(img, 0, 0, width, height);
    // flipped bottom image
    ctx.translate(0, 2 * height);
    ctx.scale(1, -1);
    ctx.drawImage(img, 0, 0, width, height);
    return canvas;
};
exports.flipY = flipY;
//# sourceMappingURL=flip-y.js.map