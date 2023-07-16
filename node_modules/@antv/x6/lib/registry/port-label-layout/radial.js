"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.radialOriented = exports.radial = void 0;
var geometry_1 = require("../../geometry");
var util_1 = require("./util");
var radial = function (portPosition, elemBBox, args) { return radialLayout(portPosition.diff(elemBBox.getCenter()), false, args); };
exports.radial = radial;
var radialOriented = function (portPosition, elemBBox, args) { return radialLayout(portPosition.diff(elemBBox.getCenter()), true, args); };
exports.radialOriented = radialOriented;
function radialLayout(portCenterOffset, autoOrient, args) {
    var offset = args.offset != null ? args.offset : 20;
    var origin = new geometry_1.Point(0, 0);
    var angle = -portCenterOffset.theta(origin);
    var pos = portCenterOffset
        .clone()
        .move(origin, offset)
        .diff(portCenterOffset)
        .round();
    var y = '.3em';
    var textAnchor;
    var orientAngle = angle;
    if ((angle + 90) % 180 === 0) {
        textAnchor = autoOrient ? 'end' : 'middle';
        if (!autoOrient && angle === -270) {
            y = '0em';
        }
    }
    else if (angle > -270 && angle < -90) {
        textAnchor = 'start';
        orientAngle = angle - 180;
    }
    else {
        textAnchor = 'end';
    }
    return (0, util_1.toResult)({
        position: pos.round().toJSON(),
        angle: autoOrient ? orientAngle : 0,
        attrs: {
            '.': {
                y: y,
                'text-anchor': textAnchor,
            },
        },
    }, args);
}
//# sourceMappingURL=radial.js.map