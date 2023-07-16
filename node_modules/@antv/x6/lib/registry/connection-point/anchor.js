"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.anchor = void 0;
var util_1 = require("./util");
function alignLine(line, type, offset) {
    if (offset === void 0) { offset = 0; }
    var start = line.start, end = line.end;
    var a;
    var b;
    var direction;
    var coordinate;
    switch (type) {
        case 'left':
            coordinate = 'x';
            a = end;
            b = start;
            direction = -1;
            break;
        case 'right':
            coordinate = 'x';
            a = start;
            b = end;
            direction = 1;
            break;
        case 'top':
            coordinate = 'y';
            a = end;
            b = start;
            direction = -1;
            break;
        case 'bottom':
            coordinate = 'y';
            a = start;
            b = end;
            direction = 1;
            break;
        default:
            return;
    }
    if (start[coordinate] < end[coordinate]) {
        a[coordinate] = b[coordinate];
    }
    else {
        b[coordinate] = a[coordinate];
    }
    if (Number.isFinite(offset)) {
        a[coordinate] += direction * offset;
        b[coordinate] += direction * offset;
    }
}
/**
 * Places the connection point at the edge's endpoint.
 */
var anchor = function (line, view, magnet, options) {
    var alignOffset = options.alignOffset, align = options.align;
    if (align) {
        alignLine(line, align, alignOffset);
    }
    return (0, util_1.offset)(line.end, line.start, options.offset);
};
exports.anchor = anchor;
//# sourceMappingURL=anchor.js.map