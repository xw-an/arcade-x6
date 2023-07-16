"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.flipX = void 0;
var flipX = function (img) {
    // d b
    // d b
    var canvas = document.createElement('canvas');
    var width = img.width;
    var height = img.height;
    canvas.width = width * 2;
    canvas.height = height;
    var ctx = canvas.getContext('2d');
    // left image
    ctx.drawImage(img, 0, 0, width, height);
    // flipped right image
    ctx.translate(2 * width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(img, 0, 0, width, height);
    return canvas;
};
exports.flipX = flipX;
//# sourceMappingURL=flip-x.js.map