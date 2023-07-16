"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bottomRight = exports.bottomLeft = exports.topRight = exports.topLeft = exports.right = exports.left = exports.bottom = exports.top = exports.center = void 0;
var util_1 = require("../../util");
exports.center = createBBoxAnchor('center');
exports.top = createBBoxAnchor('topCenter');
exports.bottom = createBBoxAnchor('bottomCenter');
exports.left = createBBoxAnchor('leftMiddle');
exports.right = createBBoxAnchor('rightMiddle');
exports.topLeft = createBBoxAnchor('topLeft');
exports.topRight = createBBoxAnchor('topRight');
exports.bottomLeft = createBBoxAnchor('bottomLeft');
exports.bottomRight = createBBoxAnchor('bottomRight');
function createBBoxAnchor(method) {
    return function (view, magnet, ref, options) {
        if (options === void 0) { options = {}; }
        var bbox = options.rotate
            ? view.getUnrotatedBBoxOfElement(magnet)
            : view.getBBoxOfElement(magnet);
        var result = bbox[method];
        result.x += util_1.NumberExt.normalizePercentage(options.dx, bbox.width);
        result.y += util_1.NumberExt.normalizePercentage(options.dy, bbox.height);
        var cell = view.cell;
        return options.rotate
            ? result.rotate(-cell.getAngle(), cell.getBBox().getCenter())
            : result;
    };
}
//# sourceMappingURL=bbox.js.map