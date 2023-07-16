"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.orth = void 0;
var util_1 = require("../../util");
var geometry_1 = require("../../geometry");
var Util = __importStar(require("./util"));
/**
 * Returns a route with orthogonal line segments.
 */
var orth = function (vertices, options, edgeView) {
    var sourceBBox = Util.getSourceBBox(edgeView, options);
    var targetBBox = Util.getTargetBBox(edgeView, options);
    var sourceAnchor = Util.getSourceAnchor(edgeView, options);
    var targetAnchor = Util.getTargetAnchor(edgeView, options);
    // If anchor lies outside of bbox, the bbox expands to include it
    sourceBBox = sourceBBox.union(Util.getPointBBox(sourceAnchor));
    targetBBox = targetBBox.union(Util.getPointBBox(targetAnchor));
    var points = vertices.map(function (p) { return geometry_1.Point.create(p); });
    points.unshift(sourceAnchor);
    points.push(targetAnchor);
    // bearing of previous route segment
    var bearing = null;
    var result = [];
    for (var i = 0, len = points.length - 1; i < len; i += 1) {
        var route = null;
        var from = points[i];
        var to = points[i + 1];
        var isOrthogonal = Private.getBearing(from, to) != null;
        if (i === 0) {
            // source
            if (i + 1 === len) {
                // source -> target
                // Expand one of the nodes by 1px to detect situations when the two
                // nodes are positioned next to each other with no gap in between.
                if (sourceBBox.intersectsWithRect(targetBBox.clone().inflate(1))) {
                    route = Private.insideNode(from, to, sourceBBox, targetBBox);
                }
                else if (!isOrthogonal) {
                    route = Private.nodeToNode(from, to, sourceBBox, targetBBox);
                }
            }
            else {
                // source -> vertex
                if (sourceBBox.containsPoint(to)) {
                    route = Private.insideNode(from, to, sourceBBox, Util.getPointBBox(to).moveAndExpand(Util.getPaddingBox(options)));
                }
                else if (!isOrthogonal) {
                    route = Private.nodeToVertex(from, to, sourceBBox);
                }
            }
        }
        else if (i + 1 === len) {
            // vertex -> target
            // prevent overlaps with previous line segment
            var isOrthogonalLoop = isOrthogonal && Private.getBearing(to, from) === bearing;
            if (targetBBox.containsPoint(from) || isOrthogonalLoop) {
                route = Private.insideNode(from, to, Util.getPointBBox(from).moveAndExpand(Util.getPaddingBox(options)), targetBBox, bearing);
            }
            else if (!isOrthogonal) {
                route = Private.vertexToNode(from, to, targetBBox, bearing);
            }
        }
        else if (!isOrthogonal) {
            // vertex -> vertex
            route = Private.vertexToVertex(from, to, bearing);
        }
        // set bearing for next iteration
        if (route) {
            result.push.apply(result, route.points);
            bearing = route.direction;
        }
        else {
            // orthogonal route and not looped
            bearing = Private.getBearing(from, to);
        }
        // push `to` point to identified orthogonal vertices array
        if (i + 1 < len) {
            result.push(to);
        }
    }
    return result;
};
exports.orth = orth;
var Private;
(function (Private) {
    /**
     * Bearing to opposite bearing map
     */
    var opposites = {
        N: 'S',
        S: 'N',
        E: 'W',
        W: 'E',
    };
    /**
     * Bearing to radians map
     */
    var radians = {
        N: (-Math.PI / 2) * 3,
        S: -Math.PI / 2,
        E: 0,
        W: Math.PI,
    };
    /**
     * Returns a point `p` where lines p,p1 and p,p2 are perpendicular
     * and p is not contained in the given box
     */
    function freeJoin(p1, p2, bbox) {
        var p = new geometry_1.Point(p1.x, p2.y);
        if (bbox.containsPoint(p)) {
            p = new geometry_1.Point(p2.x, p1.y);
        }
        // kept for reference
        // if (bbox.containsPoint(p)) {
        //   return null
        // }
        return p;
    }
    /**
     * Returns either width or height of a bbox based on the given bearing.
     */
    function getBBoxSize(bbox, bearing) {
        return bbox[bearing === 'W' || bearing === 'E' ? 'width' : 'height'];
    }
    Private.getBBoxSize = getBBoxSize;
    function getBearing(from, to) {
        if (from.x === to.x) {
            return from.y > to.y ? 'N' : 'S';
        }
        if (from.y === to.y) {
            return from.x > to.x ? 'W' : 'E';
        }
        return null;
    }
    Private.getBearing = getBearing;
    function vertexToVertex(from, to, bearing) {
        var p1 = new geometry_1.Point(from.x, to.y);
        var p2 = new geometry_1.Point(to.x, from.y);
        var d1 = getBearing(from, p1);
        var d2 = getBearing(from, p2);
        var opposite = bearing ? opposites[bearing] : null;
        var p = d1 === bearing || (d1 !== opposite && (d2 === opposite || d2 !== bearing))
            ? p1
            : p2;
        return { points: [p], direction: getBearing(p, to) };
    }
    Private.vertexToVertex = vertexToVertex;
    function nodeToVertex(from, to, fromBBox) {
        var p = freeJoin(from, to, fromBBox);
        return { points: [p], direction: getBearing(p, to) };
    }
    Private.nodeToVertex = nodeToVertex;
    function vertexToNode(from, to, toBBox, bearing) {
        var points = [new geometry_1.Point(from.x, to.y), new geometry_1.Point(to.x, from.y)];
        var freePoints = points.filter(function (p) { return !toBBox.containsPoint(p); });
        var freeBearingPoints = freePoints.filter(function (p) { return getBearing(p, from) !== bearing; });
        var p;
        if (freeBearingPoints.length > 0) {
            // Try to pick a point which bears the same direction as the previous segment.
            p = freeBearingPoints.filter(function (p) { return getBearing(from, p) === bearing; }).pop();
            p = p || freeBearingPoints[0];
            return {
                points: [p],
                direction: getBearing(p, to),
            };
        }
        {
            // Here we found only points which are either contained in the element or they would create
            // a link segment going in opposite direction from the previous one.
            // We take the point inside element and move it outside the element in the direction the
            // route is going. Now we can join this point with the current end (using freeJoin).
            p = util_1.ArrayExt.difference(points, freePoints)[0];
            var p2 = geometry_1.Point.create(to).move(p, -getBBoxSize(toBBox, bearing) / 2);
            var p1 = freeJoin(p2, from, toBBox);
            return {
                points: [p1, p2],
                direction: getBearing(p2, to),
            };
        }
    }
    Private.vertexToNode = vertexToNode;
    function nodeToNode(from, to, fromBBox, toBBox) {
        var route = nodeToVertex(to, from, toBBox);
        var p1 = route.points[0];
        if (fromBBox.containsPoint(p1)) {
            route = nodeToVertex(from, to, fromBBox);
            var p2 = route.points[0];
            if (toBBox.containsPoint(p2)) {
                var fromBorder = geometry_1.Point.create(from).move(p2, -getBBoxSize(fromBBox, getBearing(from, p2)) / 2);
                var toBorder = geometry_1.Point.create(to).move(p1, -getBBoxSize(toBBox, getBearing(to, p1)) / 2);
                var mid = new geometry_1.Line(fromBorder, toBorder).getCenter();
                var startRoute = nodeToVertex(from, mid, fromBBox);
                var endRoute = vertexToVertex(mid, to, startRoute.direction);
                route.points = [startRoute.points[0], endRoute.points[0]];
                route.direction = endRoute.direction;
            }
        }
        return route;
    }
    Private.nodeToNode = nodeToNode;
    // Finds route for situations where one node is inside the other.
    // Typically the route is directed outside the outer node first and
    // then back towards the inner node.
    function insideNode(from, to, fromBBox, toBBox, bearing) {
        var boundary = fromBBox.union(toBBox).inflate(1);
        // start from the point which is closer to the boundary
        var center = boundary.getCenter();
        var reversed = center.distance(to) > center.distance(from);
        var start = reversed ? to : from;
        var end = reversed ? from : to;
        var p1;
        var p2;
        var p3;
        if (bearing) {
            // Points on circle with radius equals 'W + H` are always outside the rectangle
            // with width W and height H if the center of that circle is the center of that rectangle.
            p1 = geometry_1.Point.fromPolar(boundary.width + boundary.height, radians[bearing], start);
            p1 = boundary.getNearestPointToPoint(p1).move(p1, -1);
        }
        else {
            p1 = boundary.getNearestPointToPoint(start).move(start, 1);
        }
        p2 = freeJoin(p1, end, boundary);
        var points;
        if (p1.round().equals(p2.round())) {
            p2 = geometry_1.Point.fromPolar(boundary.width + boundary.height, geometry_1.Angle.toRad(p1.theta(start)) + Math.PI / 2, end);
            p2 = boundary.getNearestPointToPoint(p2).move(end, 1).round();
            p3 = freeJoin(p1, p2, boundary);
            points = reversed ? [p2, p3, p1] : [p1, p3, p2];
        }
        else {
            points = reversed ? [p2, p1] : [p1, p2];
        }
        var direction = reversed ? getBearing(p1, to) : getBearing(p2, to);
        return {
            points: points,
            direction: direction,
        };
    }
    Private.insideNode = insideNode;
})(Private || (Private = {}));
//# sourceMappingURL=orth.js.map