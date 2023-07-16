"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pinAbsolute = exports.pinRelative = void 0;
var geometry_1 = require("../../geometry");
function toPercentage(value, max) {
    if (max === 0) {
        return '0%';
    }
    return Math.round((value / max) * 100) + "%";
}
function pin(relative) {
    var strategy = function (terminal, view, magnet, coords) {
        return view.isEdgeElement(magnet)
            ? pinEdgeTerminal(relative, terminal, view, magnet, coords)
            : pinNodeTerminal(relative, terminal, view, magnet, coords);
    };
    return strategy;
}
function pinNodeTerminal(relative, data, view, magnet, coords) {
    var node = view.cell;
    var angle = node.getAngle();
    var bbox = view.getUnrotatedBBoxOfElement(magnet);
    var center = node.getBBox().getCenter();
    var pos = geometry_1.Point.create(coords).rotate(angle, center);
    var dx = pos.x - bbox.x;
    var dy = pos.y - bbox.y;
    if (relative) {
        dx = toPercentage(dx, bbox.width);
        dy = toPercentage(dy, bbox.height);
    }
    data.anchor = {
        name: 'topLeft',
        args: {
            dx: dx,
            dy: dy,
            rotate: true,
        },
    };
    return data;
}
function pinEdgeTerminal(relative, end, view, magnet, coords) {
    var connection = view.getConnection();
    if (!connection) {
        return end;
    }
    var length = connection.closestPointLength(coords);
    if (relative) {
        var totalLength = connection.length();
        end.anchor = {
            name: 'ratio',
            args: {
                ratio: length / totalLength,
            },
        };
    }
    else {
        end.anchor = {
            name: 'length',
            args: {
                length: length,
            },
        };
    }
    return end;
}
exports.pinRelative = pin(true);
exports.pinAbsolute = pin(false);
//# sourceMappingURL=pin.js.map