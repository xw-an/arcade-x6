"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.nodeCenter = void 0;
/**
 * Places the anchor of the edge at center of the node bbox.
 */
var nodeCenter = function (view, magnet, ref, options, endType) {
    var result = view.cell.getConnectionPoint(this.cell, endType);
    if (options.dx || options.dy) {
        result.translate(options.dx || 0, options.dy || 0);
    }
    return result;
};
exports.nodeCenter = nodeCenter;
//# sourceMappingURL=node-center.js.map