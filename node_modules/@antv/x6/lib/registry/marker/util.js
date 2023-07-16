"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalize = void 0;
var geometry_1 = require("../../geometry");
function normalize(d, offset1, offset2) {
    var offsetX;
    var offsetY;
    if (typeof offset1 === 'object') {
        offsetX = offset1.x;
        offsetY = offset1.y;
    }
    else {
        offsetX = offset1;
        offsetY = offset2;
    }
    var path = geometry_1.Path.parse(d);
    var bbox = path.bbox();
    if (bbox) {
        var ty = -bbox.height / 2 - bbox.y;
        var tx = -bbox.width / 2 - bbox.x;
        if (typeof offsetX === 'number') {
            tx -= offsetX;
        }
        if (typeof offsetY === 'number') {
            ty -= offsetY;
        }
        path.translate(tx, ty);
    }
    return path.serialize();
}
exports.normalize = normalize;
//# sourceMappingURL=util.js.map