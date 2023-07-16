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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loop = void 0;
var geometry_1 = require("../../geometry");
function rollup(points, merge) {
    if (merge != null && merge !== false) {
        var amount = typeof merge === 'boolean' ? 0 : merge;
        if (amount > 0) {
            var center1 = geometry_1.Point.create(points[1]).move(points[2], amount);
            var center2 = geometry_1.Point.create(points[1]).move(points[0], amount);
            return __spreadArray(__spreadArray([center1.toJSON()], points, true), [center2.toJSON()], false);
        }
        {
            var center = points[1];
            return __spreadArray(__spreadArray([__assign({}, center)], points, true), [__assign({}, center)], false);
        }
    }
    return points;
}
var loop = function (vertices, options, edgeView) {
    var width = options.width || 50;
    var height = options.height || 80;
    var halfHeight = height / 2;
    var angle = options.angle || 'auto';
    var sourceAnchor = edgeView.sourceAnchor;
    var targetAnchor = edgeView.targetAnchor;
    var sourceBBox = edgeView.sourceBBox;
    var targetBBox = edgeView.targetBBox;
    if (sourceAnchor.equals(targetAnchor)) {
        var getVertices = function (angle) {
            var rad = geometry_1.Angle.toRad(angle);
            var sin = Math.sin(rad);
            var cos = Math.cos(rad);
            var center = new geometry_1.Point(sourceAnchor.x + cos * width, sourceAnchor.y + sin * width);
            var ref = new geometry_1.Point(center.x - cos * halfHeight, center.y - sin * halfHeight);
            var p1 = ref.clone().rotate(-90, center);
            var p2 = ref.clone().rotate(90, center);
            return [p1.toJSON(), center.toJSON(), p2.toJSON()];
        };
        var validate = function (end) {
            var start = sourceAnchor.clone().move(end, -1);
            var line = new geometry_1.Line(start, end);
            return (!sourceBBox.containsPoint(end) && !sourceBBox.intersectsWithLine(line));
        };
        var angles = [0, 90, 180, 270, 45, 135, 225, 315];
        if (typeof angle === 'number') {
            return rollup(getVertices(angle), options.merge);
        }
        var center = sourceBBox.getCenter();
        if (center.equals(sourceAnchor)) {
            return rollup(getVertices(0), options.merge);
        }
        var deg = center.angleBetween(sourceAnchor, center.clone().translate(1, 0));
        var ret = getVertices(deg);
        if (validate(ret[1])) {
            return rollup(ret, options.merge);
        }
        // return the best vertices
        for (var i = 1, l = angles.length; i < l; i += 1) {
            ret = getVertices(deg + angles[i]);
            if (validate(ret[1])) {
                return rollup(ret, options.merge);
            }
        }
        return rollup(ret, options.merge);
    }
    {
        var line = new geometry_1.Line(sourceAnchor, targetAnchor);
        var parallel = line.parallel(-width);
        var center = parallel.getCenter();
        var p1 = parallel.start.clone().move(parallel.end, halfHeight);
        var p2 = parallel.end.clone().move(parallel.start, halfHeight);
        var ref = line.parallel(-1);
        var line1 = new geometry_1.Line(ref.start, center);
        var line2 = new geometry_1.Line(ref.end, center);
        if (sourceBBox.containsPoint(center) ||
            targetBBox.containsPoint(center) ||
            sourceBBox.intersectsWithLine(line1) ||
            sourceBBox.intersectsWithLine(line2) ||
            targetBBox.intersectsWithLine(line1) ||
            targetBBox.intersectsWithLine(line2)) {
            parallel = line.parallel(width);
            center = parallel.getCenter();
            p1 = parallel.start.clone().move(parallel.end, halfHeight);
            p2 = parallel.end.clone().move(parallel.start, halfHeight);
        }
        if (options.merge) {
            var line_1 = new geometry_1.Line(sourceAnchor, targetAnchor);
            var normal = new geometry_1.Line(center, line_1.center).setLength(Number.MAX_SAFE_INTEGER);
            var intersects1 = sourceBBox.intersectsWithLine(normal);
            var intersects2 = targetBBox.intersectsWithLine(normal);
            var intersects = intersects1
                ? Array.isArray(intersects1)
                    ? intersects1
                    : [intersects1]
                : [];
            if (intersects2) {
                if (Array.isArray(intersects2)) {
                    intersects.push.apply(intersects, intersects2);
                }
                else {
                    intersects.push(intersects2);
                }
            }
            var anchor = line_1.center.closest(intersects);
            if (anchor) {
                edgeView.sourceAnchor = anchor.clone();
                edgeView.targetAnchor = anchor.clone();
            }
            else {
                edgeView.sourceAnchor = line_1.center.clone();
                edgeView.targetAnchor = line_1.center.clone();
            }
        }
        return rollup([p1.toJSON(), center.toJSON(), p2.toJSON()], options.merge);
    }
};
exports.loop = loop;
//# sourceMappingURL=loop.js.map