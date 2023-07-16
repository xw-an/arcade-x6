"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.metro = void 0;
var util_1 = require("../../util");
var geometry_1 = require("../../geometry");
var options_1 = require("./manhattan/options");
var index_1 = require("./manhattan/index");
var defaults = {
    maxDirectionChange: 45,
    // an array of directions to find next points on the route
    // different from start/end directions
    directions: function () {
        var step = (0, options_1.resolve)(this.step, this);
        var cost = (0, options_1.resolve)(this.cost, this);
        var diagonalCost = Math.ceil(Math.sqrt((step * step) << 1)); // eslint-disable-line no-bitwise
        return [
            { cost: cost, offsetX: step, offsetY: 0 },
            { cost: diagonalCost, offsetX: step, offsetY: step },
            { cost: cost, offsetX: 0, offsetY: step },
            { cost: diagonalCost, offsetX: -step, offsetY: step },
            { cost: cost, offsetX: -step, offsetY: 0 },
            { cost: diagonalCost, offsetX: -step, offsetY: -step },
            { cost: cost, offsetX: 0, offsetY: -step },
            { cost: diagonalCost, offsetX: step, offsetY: -step },
        ];
    },
    // a simple route used in situations when main routing method fails
    // (exceed max number of loop iterations, inaccessible)
    fallbackRoute: function (from, to, options) {
        // Find a route which breaks by 45 degrees ignoring all obstacles.
        var theta = from.theta(to);
        var route = [];
        var a = { x: to.x, y: from.y };
        var b = { x: from.x, y: to.y };
        if (theta % 180 > 90) {
            var t = a;
            a = b;
            b = t;
        }
        var p1 = theta % 90 < 45 ? a : b;
        var l1 = new geometry_1.Line(from, p1);
        var alpha = 90 * Math.ceil(theta / 90);
        var p2 = geometry_1.Point.fromPolar(l1.squaredLength(), geometry_1.Angle.toRad(alpha + 135), p1);
        var l2 = new geometry_1.Line(to, p2);
        var intersectionPoint = l1.intersectsWithLine(l2);
        var point = intersectionPoint || to;
        var directionFrom = intersectionPoint ? point : from;
        var quadrant = 360 / options.directions.length;
        var angleTheta = directionFrom.theta(to);
        var normalizedAngle = geometry_1.Angle.normalize(angleTheta + quadrant / 2);
        var directionAngle = quadrant * Math.floor(normalizedAngle / quadrant);
        options.previousDirectionAngle = directionAngle;
        if (point)
            route.push(point.round());
        route.push(to);
        return route;
    },
};
var metro = function (vertices, options, linkView) {
    return util_1.FunctionExt.call(index_1.manhattan, this, vertices, __assign(__assign({}, defaults), options), linkView);
};
exports.metro = metro;
//# sourceMappingURL=metro.js.map