"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ellipseSpread = exports.ellipse = void 0;
var geometry_1 = require("../../geometry");
var util_1 = require("./util");
var ellipse = function (portsPositionArgs, elemBBox, groupPositionArgs) {
    var startAngle = groupPositionArgs.start || 0;
    var stepAngle = groupPositionArgs.step || 20;
    return ellipseLayout(portsPositionArgs, elemBBox, startAngle, function (index, count) { return (index + 0.5 - count / 2) * stepAngle; });
};
exports.ellipse = ellipse;
var ellipseSpread = function (portsPositionArgs, elemBBox, groupPositionArgs) {
    var startAngle = groupPositionArgs.start || 0;
    var stepAngle = groupPositionArgs.step || 360 / portsPositionArgs.length;
    return ellipseLayout(portsPositionArgs, elemBBox, startAngle, function (index) {
        return index * stepAngle;
    });
};
exports.ellipseSpread = ellipseSpread;
function ellipseLayout(portsPositionArgs, elemBBox, startAngle, stepFn) {
    var center = elemBBox.getCenter();
    var start = elemBBox.getTopCenter();
    var ratio = elemBBox.width / elemBBox.height;
    var ellipse = geometry_1.Ellipse.fromRect(elemBBox);
    var count = portsPositionArgs.length;
    return portsPositionArgs.map(function (item, index) {
        var angle = startAngle + stepFn(index, count);
        var p = start.clone().rotate(-angle, center).scale(ratio, 1, center);
        var theta = item.compensateRotate ? -ellipse.tangentTheta(p) : 0;
        if (item.dx || item.dy) {
            p.translate(item.dx || 0, item.dy || 0);
        }
        if (item.dr) {
            p.move(center, item.dr);
        }
        return (0, util_1.toResult)(p.round(), theta, item);
    });
}
//# sourceMappingURL=ellipse.js.map