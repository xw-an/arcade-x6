"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loop = void 0;
var geometry_1 = require("../../geometry");
var loop = function (sourcePoint, targetPoint, routePoints, options) {
    if (options === void 0) { options = {}; }
    var fix = routePoints.length === 3 ? 0 : 1;
    var p1 = geometry_1.Point.create(routePoints[0 + fix]);
    var p2 = geometry_1.Point.create(routePoints[2 + fix]);
    var center = geometry_1.Point.create(routePoints[1 + fix]);
    if (!geometry_1.Point.equals(sourcePoint, targetPoint)) {
        var middle = new geometry_1.Point((sourcePoint.x + targetPoint.x) / 2, (sourcePoint.y + targetPoint.y) / 2);
        var angle = middle.angleBetween(geometry_1.Point.create(sourcePoint).rotate(90, middle), center);
        if (angle > 1) {
            p1.rotate(180 - angle, middle);
            p2.rotate(180 - angle, middle);
            center.rotate(180 - angle, middle);
        }
    }
    var pathData = "\n     M " + sourcePoint.x + " " + sourcePoint.y + "\n     Q " + p1.x + " " + p1.y + " " + center.x + " " + center.y + "\n     Q " + p2.x + " " + p2.y + " " + targetPoint.x + " " + targetPoint.y + "\n  ";
    return options.raw ? geometry_1.Path.parse(pathData) : pathData;
};
exports.loop = loop;
//# sourceMappingURL=loop.js.map