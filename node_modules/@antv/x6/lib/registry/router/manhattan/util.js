"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reconstructRoute = exports.getRectPoints = exports.getCost = exports.normalizePoint = exports.getKey = exports.align = exports.round = exports.getGrid = exports.getGridOffsets = exports.getDirectionChange = exports.getDirectionAngle = exports.getTargetEndpoint = exports.getSourceEndpoint = exports.getTargetBBox = exports.getSourceBBox = void 0;
var util_1 = require("../../../global/util");
var geometry_1 = require("../../../geometry");
function getSourceBBox(view, options) {
    var bbox = view.sourceBBox.clone();
    if (options && options.paddingBox) {
        return bbox.moveAndExpand(options.paddingBox);
    }
    return bbox;
}
exports.getSourceBBox = getSourceBBox;
function getTargetBBox(view, options) {
    var bbox = view.targetBBox.clone();
    if (options && options.paddingBox) {
        return bbox.moveAndExpand(options.paddingBox);
    }
    return bbox;
}
exports.getTargetBBox = getTargetBBox;
function getSourceEndpoint(view, options) {
    if (view.sourceAnchor) {
        return view.sourceAnchor;
    }
    var sourceBBox = getSourceBBox(view, options);
    return sourceBBox.getCenter();
}
exports.getSourceEndpoint = getSourceEndpoint;
function getTargetEndpoint(view, options) {
    if (view.targetAnchor) {
        return view.targetAnchor;
    }
    var targetBBox = getTargetBBox(view, options);
    return targetBBox.getCenter();
}
exports.getTargetEndpoint = getTargetEndpoint;
// returns a direction index from start point to end point
// corrects for grid deformation between start and end
function getDirectionAngle(start, end, directionCount, grid, options) {
    var quadrant = 360 / directionCount;
    var angleTheta = start.theta(fixAngleEnd(start, end, grid, options));
    var normalizedAngle = geometry_1.Angle.normalize(angleTheta + quadrant / 2);
    return quadrant * Math.floor(normalizedAngle / quadrant);
}
exports.getDirectionAngle = getDirectionAngle;
function fixAngleEnd(start, end, grid, options) {
    var step = options.step;
    var diffX = end.x - start.x;
    var diffY = end.y - start.y;
    var gridStepsX = diffX / grid.x;
    var gridStepsY = diffY / grid.y;
    var distanceX = gridStepsX * step;
    var distanceY = gridStepsY * step;
    return new geometry_1.Point(start.x + distanceX, start.y + distanceY);
}
/**
 * Returns the change in direction between two direction angles.
 */
function getDirectionChange(angle1, angle2) {
    var change = Math.abs(angle1 - angle2);
    return change > 180 ? 360 - change : change;
}
exports.getDirectionChange = getDirectionChange;
// fix direction offsets according to current grid
function getGridOffsets(grid, options) {
    var step = options.step;
    options.directions.forEach(function (direction) {
        direction.gridOffsetX = (direction.offsetX / step) * grid.x;
        direction.gridOffsetY = (direction.offsetY / step) * grid.y;
    });
    return options.directions;
}
exports.getGridOffsets = getGridOffsets;
// get grid size in x and y dimensions, adapted to source and target positions
function getGrid(step, source, target) {
    return {
        source: source.clone(),
        x: getGridDimension(target.x - source.x, step),
        y: getGridDimension(target.y - source.y, step),
    };
}
exports.getGrid = getGrid;
function getGridDimension(diff, step) {
    // return step if diff = 0
    if (!diff) {
        return step;
    }
    var abs = Math.abs(diff);
    var count = Math.round(abs / step);
    // return `abs` if less than one step apart
    if (!count) {
        return abs;
    }
    // otherwise, return corrected step
    var roundedDiff = count * step;
    var remainder = abs - roundedDiff;
    var correction = remainder / count;
    return step + correction;
}
function snapGrid(point, grid) {
    var source = grid.source;
    var x = util_1.Util.snapToGrid(point.x - source.x, grid.x) + source.x;
    var y = util_1.Util.snapToGrid(point.y - source.y, grid.y) + source.y;
    return new geometry_1.Point(x, y);
}
function round(point, precision) {
    return point.round(precision);
}
exports.round = round;
function align(point, grid, precision) {
    return round(snapGrid(point.clone(), grid), precision);
}
exports.align = align;
function getKey(point) {
    return point.toString();
}
exports.getKey = getKey;
function normalizePoint(point) {
    return new geometry_1.Point(point.x === 0 ? 0 : Math.abs(point.x) / point.x, point.y === 0 ? 0 : Math.abs(point.y) / point.y);
}
exports.normalizePoint = normalizePoint;
function getCost(from, anchors) {
    var min = Infinity;
    for (var i = 0, len = anchors.length; i < len; i += 1) {
        var dist = from.manhattanDistance(anchors[i]);
        if (dist < min) {
            min = dist;
        }
    }
    return min;
}
exports.getCost = getCost;
// Find points around the bbox taking given directions into account
// lines are drawn from anchor in given directions, intersections recorded
// if anchor is outside bbox, only those directions that intersect get a rect point
// the anchor itself is returned as rect point (representing some directions)
// (since those directions are unobstructed by the bbox)
function getRectPoints(anchor, bbox, directionList, grid, options) {
    var precision = options.precision;
    var directionMap = options.directionMap;
    var centerVector = anchor.diff(bbox.getCenter());
    var rectPoints = Object.keys(directionMap).reduce(function (res, key) {
        if (directionList.includes(key)) {
            var direction = directionMap[key];
            // Create a line that is guaranteed to intersect the bbox if bbox
            // is in the direction even if anchor lies outside of bbox.
            var ending = new geometry_1.Point(anchor.x + direction.x * (Math.abs(centerVector.x) + bbox.width), anchor.y + direction.y * (Math.abs(centerVector.y) + bbox.height));
            var intersectionLine = new geometry_1.Line(anchor, ending);
            // Get the farther intersection, in case there are two
            // (that happens if anchor lies next to bbox)
            var intersections = intersectionLine.intersect(bbox) || [];
            var farthestIntersectionDistance = void 0;
            var farthestIntersection = null;
            for (var i = 0; i < intersections.length; i += 1) {
                var intersection = intersections[i];
                var distance = anchor.squaredDistance(intersection);
                if (farthestIntersectionDistance == null ||
                    distance > farthestIntersectionDistance) {
                    farthestIntersectionDistance = distance;
                    farthestIntersection = intersection;
                }
            }
            // If an intersection was found in this direction, it is our rectPoint
            if (farthestIntersection) {
                var target = align(farthestIntersection, grid, precision);
                // If the rectPoint lies inside the bbox, offset it by one more step
                if (bbox.containsPoint(target)) {
                    target = align(target.translate(direction.x * grid.x, direction.y * grid.y), grid, precision);
                }
                res.push(target);
            }
        }
        return res;
    }, []);
    // if anchor lies outside of bbox, add it to the array of points
    if (!bbox.containsPoint(anchor)) {
        rectPoints.push(align(anchor, grid, precision));
    }
    return rectPoints;
}
exports.getRectPoints = getRectPoints;
// reconstructs a route by concatenating points with their parents
function reconstructRoute(parents, points, tailPoint, from, to) {
    var route = [];
    var prevDiff = normalizePoint(to.diff(tailPoint));
    // tailPoint is assumed to be aligned already
    var currentKey = getKey(tailPoint);
    var parent = parents[currentKey];
    var point;
    while (parent) {
        // point is assumed to be aligned already
        point = points[currentKey];
        var diff = normalizePoint(point.diff(parent));
        if (!diff.equals(prevDiff)) {
            route.unshift(point);
            prevDiff = diff;
        }
        // parent is assumed to be aligned already
        currentKey = getKey(parent);
        parent = parents[currentKey];
    }
    // leadPoint is assumed to be aligned already
    var leadPoint = points[currentKey];
    var fromDiff = normalizePoint(leadPoint.diff(from));
    if (!fromDiff.equals(prevDiff)) {
        route.unshift(leadPoint);
    }
    return route;
}
exports.reconstructRoute = reconstructRoute;
//# sourceMappingURL=util.js.map