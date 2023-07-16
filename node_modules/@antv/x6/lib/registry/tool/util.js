"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getViewBBox = exports.getAnchor = void 0;
var util_1 = require("../../util");
var connection_strategy_1 = require("../connection-strategy");
function getAnchor(pos, terminalView, terminalMagnet, type) {
    var end = util_1.FunctionExt.call(connection_strategy_1.ConnectionStrategy.presets.pinRelative, this.graph, {}, terminalView, terminalMagnet, pos, this.cell, type, {});
    return end.anchor;
}
exports.getAnchor = getAnchor;
function getViewBBox(view, quick) {
    if (quick) {
        return view.cell.getBBox();
    }
    return view.cell.isEdge()
        ? view.getConnection().bbox()
        : view.getUnrotatedBBoxOfElement(view.container);
}
exports.getViewBBox = getViewBBox;
//# sourceMappingURL=util.js.map