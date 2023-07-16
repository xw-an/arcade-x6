"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findShapeNode = exports.getStrokeWidth = exports.offset = void 0;
var geometry_1 = require("../../geometry");
function offset(p1, p2, offset) {
    var tx;
    if (typeof offset === 'object') {
        if (Number.isFinite(offset.y)) {
            var line = new geometry_1.Line(p2, p1);
            var _a = line.parallel(offset.y), start = _a.start, end = _a.end;
            p2 = start; // eslint-disable-line
            p1 = end; // eslint-disable-line
        }
        tx = offset.x;
    }
    else {
        tx = offset;
    }
    if (tx == null || !Number.isFinite(tx)) {
        return p1;
    }
    var length = p1.distance(p2);
    if (tx === 0 && length > 0) {
        return p1;
    }
    return p1.move(p2, -Math.min(tx, length - 1));
}
exports.offset = offset;
function getStrokeWidth(magnet) {
    var stroke = magnet.getAttribute('stroke-width');
    if (stroke === null) {
        return 0;
    }
    return parseFloat(stroke) || 0;
}
exports.getStrokeWidth = getStrokeWidth;
function findShapeNode(magnet) {
    if (magnet == null) {
        return null;
    }
    var node = magnet;
    do {
        var tagName = node.tagName;
        if (typeof tagName !== 'string')
            return null;
        tagName = tagName.toUpperCase();
        if (tagName === 'G') {
            node = node.firstElementChild;
        }
        else if (tagName === 'TITLE') {
            node = node.nextElementSibling;
        }
        else
            break;
    } while (node);
    return node;
}
exports.findShapeNode = findShapeNode;
//# sourceMappingURL=util.js.map