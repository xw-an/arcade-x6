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
exports.router = void 0;
var util_1 = require("../../../util");
var geometry_1 = require("../../../geometry");
var sorted_set_1 = require("./sorted-set");
var obstacle_map_1 = require("./obstacle-map");
var util = __importStar(require("./util"));
var options_1 = require("./options");
/**
 * Finds the route between two points (`from`, `to`).
 */
function findRoute(edgeView, from, to, map, options) {
    var precision = options.precision;
    var sourceEndpoint;
    var targetEndpoint;
    if (geometry_1.Rectangle.isRectangle(from)) {
        sourceEndpoint = util.round(util.getSourceEndpoint(edgeView, options).clone(), precision);
    }
    else {
        sourceEndpoint = util.round(from.clone(), precision);
    }
    if (geometry_1.Rectangle.isRectangle(to)) {
        targetEndpoint = util.round(util.getTargetEndpoint(edgeView, options).clone(), precision);
    }
    else {
        targetEndpoint = util.round(to.clone(), precision);
    }
    // Get grid for this route.
    var grid = util.getGrid(options.step, sourceEndpoint, targetEndpoint);
    // Get pathfinding points.
    // -----------------------
    var startPoint = sourceEndpoint;
    var endPoint = targetEndpoint;
    var startPoints;
    var endPoints;
    if (geometry_1.Rectangle.isRectangle(from)) {
        startPoints = util.getRectPoints(startPoint, from, options.startDirections, grid, options);
    }
    else {
        startPoints = [startPoint];
    }
    if (geometry_1.Rectangle.isRectangle(to)) {
        endPoints = util.getRectPoints(targetEndpoint, to, options.endDirections, grid, options);
    }
    else {
        endPoints = [endPoint];
    }
    // take into account only accessible rect points (those not under obstacles)
    startPoints = startPoints.filter(function (p) { return map.isAccessible(p); });
    endPoints = endPoints.filter(function (p) { return map.isAccessible(p); });
    // There is an accessible route point on both sides.
    if (startPoints.length > 0 && endPoints.length > 0) {
        var openSet = new sorted_set_1.SortedSet();
        // Keeps the actual points for given nodes of the open set.
        var points = {};
        // Keeps the point that is immediate predecessor of given element.
        var parents = {};
        // Cost from start to a point along best known path.
        var costs = {};
        for (var i = 0, n = startPoints.length; i < n; i += 1) {
            // startPoint is assumed to be aligned already
            var startPoint_1 = startPoints[i];
            var key = util.getKey(startPoint_1);
            openSet.add(key, util.getCost(startPoint_1, endPoints));
            points[key] = startPoint_1;
            costs[key] = 0;
        }
        var previousRouteDirectionAngle = options.previousDirectionAngle;
        // undefined for first route
        var isPathBeginning = previousRouteDirectionAngle === undefined;
        // directions
        var direction = void 0;
        var directionChange = void 0;
        var directions = util.getGridOffsets(grid, options);
        var numDirections = directions.length;
        var endPointsKeys = endPoints.reduce(function (res, endPoint) {
            var key = util.getKey(endPoint);
            res.push(key);
            return res;
        }, []);
        // main route finding loop
        var sameStartEndPoints = geometry_1.Point.equalPoints(startPoints, endPoints);
        var loopsRemaining = options.maxLoopCount;
        while (!openSet.isEmpty() && loopsRemaining > 0) {
            // Get the closest item and mark it CLOSED
            var currentKey = openSet.pop();
            var currentPoint = points[currentKey];
            var currentParent = parents[currentKey];
            var currentCost = costs[currentKey];
            var isStartPoint = currentPoint.equals(startPoint);
            var isRouteBeginning = currentParent == null;
            var previousDirectionAngle = void 0;
            if (!isRouteBeginning) {
                previousDirectionAngle = util.getDirectionAngle(currentParent, currentPoint, numDirections, grid, options);
            }
            else if (!isPathBeginning) {
                // a vertex on the route
                previousDirectionAngle = previousRouteDirectionAngle;
            }
            else if (!isStartPoint) {
                // beginning of route on the path
                previousDirectionAngle = util.getDirectionAngle(startPoint, currentPoint, numDirections, grid, options);
            }
            else {
                previousDirectionAngle = null;
            }
            // Check if we reached any endpoint
            var skipEndCheck = isRouteBeginning && sameStartEndPoints;
            if (!skipEndCheck && endPointsKeys.indexOf(currentKey) >= 0) {
                options.previousDirectionAngle = previousDirectionAngle;
                return util.reconstructRoute(parents, points, currentPoint, startPoint, endPoint);
            }
            // Go over all possible directions and find neighbors
            for (var i = 0; i < numDirections; i += 1) {
                direction = directions[i];
                var directionAngle = direction.angle;
                directionChange = util.getDirectionChange(previousDirectionAngle, directionAngle);
                // Don't use the point changed rapidly.
                if (!(isPathBeginning && isStartPoint) &&
                    directionChange > options.maxDirectionChange) {
                    continue;
                }
                var neighborPoint = util.align(currentPoint
                    .clone()
                    .translate(direction.gridOffsetX || 0, direction.gridOffsetY || 0), grid, precision);
                var neighborKey = util.getKey(neighborPoint);
                // Closed points were already evaluated.
                if (openSet.isClose(neighborKey) || !map.isAccessible(neighborPoint)) {
                    continue;
                }
                // Neighbor is an end point.
                if (endPointsKeys.indexOf(neighborKey) >= 0) {
                    var isEndPoint = neighborPoint.equals(endPoint);
                    if (!isEndPoint) {
                        var endDirectionAngle = util.getDirectionAngle(neighborPoint, endPoint, numDirections, grid, options);
                        var endDirectionChange = util.getDirectionChange(directionAngle, endDirectionAngle);
                        if (endDirectionChange > options.maxDirectionChange) {
                            continue;
                        }
                    }
                }
                // The current direction is ok.
                // ----------------------------
                var neighborCost = direction.cost;
                var neighborPenalty = isStartPoint
                    ? 0
                    : options.penalties[directionChange];
                var costFromStart = currentCost + neighborCost + neighborPenalty;
                // Neighbor point has not been processed yet or the cost of
                // the path from start is lower than previously calculated.
                if (!openSet.isOpen(neighborKey) ||
                    costFromStart < costs[neighborKey]) {
                    points[neighborKey] = neighborPoint;
                    parents[neighborKey] = currentPoint;
                    costs[neighborKey] = costFromStart;
                    openSet.add(neighborKey, costFromStart + util.getCost(neighborPoint, endPoints));
                }
            }
            loopsRemaining -= 1;
        }
    }
    if (options.fallbackRoute) {
        return util_1.FunctionExt.call(options.fallbackRoute, this, startPoint, endPoint, options);
    }
    return null;
}
var router = function (vertices, optionsRaw, edgeView) {
    var options = (0, options_1.resolveOptions)(optionsRaw);
    var sourceBBox = util.getSourceBBox(edgeView, options);
    var targetBBox = util.getTargetBBox(edgeView, options);
    var sourceEndpoint = util.getSourceEndpoint(edgeView, options);
    // pathfinding
    var map = new obstacle_map_1.ObstacleMap(options).build(edgeView.graph.model, edgeView.cell);
    var oldVertices = vertices.map(function (p) { return geometry_1.Point.create(p); });
    var newVertices = [];
    // The origin of first route's grid, does not need snapping
    var tailPoint = sourceEndpoint;
    var from;
    var to;
    for (var i = 0, len = oldVertices.length; i <= len; i += 1) {
        var partialRoute = null;
        from = to || sourceBBox;
        to = oldVertices[i];
        // This is the last iteration
        if (to == null) {
            to = targetBBox;
            // If the target is a point, we should use dragging route
            // instead of main routing method if it has been provided.
            var edge = edgeView.cell;
            var isEndingAtPoint = edge.getSourceCellId() == null || edge.getTargetCellId() == null;
            if (isEndingAtPoint && typeof options.draggingRouter === 'function') {
                var dragFrom = from === sourceBBox ? sourceEndpoint : from;
                var dragTo = to.getOrigin();
                partialRoute = util_1.FunctionExt.call(options.draggingRouter, edgeView, dragFrom, dragTo, options);
            }
        }
        // Find the partial route
        if (partialRoute == null) {
            partialRoute = findRoute(edgeView, from, to, map, options);
        }
        // Cannot found the partial route.
        if (partialRoute === null) {
            // eslint-next-line
            console.warn("Unable to execute manhattan algorithm, use orth instead");
            return util_1.FunctionExt.call(options.fallbackRouter, this, vertices, options, edgeView);
        }
        // Remove the first point if the previous partial route has
        // the same point as last.
        var leadPoint = partialRoute[0];
        if (leadPoint && leadPoint.equals(tailPoint)) {
            partialRoute.shift();
        }
        // Save tailPoint for next iteration
        tailPoint = partialRoute[partialRoute.length - 1] || tailPoint;
        newVertices.push.apply(newVertices, partialRoute);
    }
    return newVertices;
};
exports.router = router;
//# sourceMappingURL=router.js.map