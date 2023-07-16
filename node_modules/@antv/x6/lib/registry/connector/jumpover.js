"use strict";
/* eslint-disable no-underscore-dangle */
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
exports.jumpover = void 0;
var geometry_1 = require("../../geometry");
// takes care of math. error for case when jump is too close to end of line
var CLOSE_PROXIMITY_PADDING = 1;
var F13 = 1 / 3;
var F23 = 2 / 3;
function setupUpdating(view) {
    var updateList = view.graph._jumpOverUpdateList;
    // first time setup for this paper
    if (updateList == null) {
        updateList = view.graph._jumpOverUpdateList = [];
        /**
         * Handler for a batch:stop event to force
         * update of all registered links with jump over connector
         */
        view.graph.on('cell:mouseup', function () {
            var list = view.graph._jumpOverUpdateList;
            for (var i = 0; i < list.length; i += 1) {
                list[i].update();
            }
        });
        view.graph.on('model:reseted', function () {
            updateList = view.graph._jumpOverUpdateList = [];
        });
    }
    // add this link to a list so it can be updated when some other link is updated
    if (updateList.indexOf(view) < 0) {
        updateList.push(view);
        // watch for change of connector type or removal of link itself
        // to remove the link from a list of jump over connectors
        var clean = function () { return updateList.splice(updateList.indexOf(view), 1); };
        view.cell.once('change:connector', clean);
        view.cell.once('removed', clean);
    }
}
function createLines(sourcePoint, targetPoint, route) {
    if (route === void 0) { route = []; }
    var points = __spreadArray(__spreadArray([sourcePoint], route, true), [targetPoint], false);
    var lines = [];
    points.forEach(function (point, idx) {
        var next = points[idx + 1];
        if (next != null) {
            lines.push(new geometry_1.Line(point, next));
        }
    });
    return lines;
}
function findLineIntersections(line, crossCheckLines) {
    var intersections = [];
    crossCheckLines.forEach(function (crossCheckLine) {
        var intersection = line.intersectsWithLine(crossCheckLine);
        if (intersection) {
            intersections.push(intersection);
        }
    });
    return intersections;
}
function getDistence(p1, p2) {
    return new geometry_1.Line(p1, p2).squaredLength();
}
/**
 * Split input line into multiple based on intersection points.
 */
function createJumps(line, intersections, jumpSize) {
    return intersections.reduce(function (memo, point, idx) {
        // skipping points that were merged with the previous line
        // to make bigger arc over multiple lines that are close to each other
        if (skippedPoints.includes(point)) {
            return memo;
        }
        // always grab the last line from buffer and modify it
        var lastLine = memo.pop() || line;
        // calculate start and end of jump by moving by a given size of jump
        var jumpStart = geometry_1.Point.create(point).move(lastLine.start, -jumpSize);
        var jumpEnd = geometry_1.Point.create(point).move(lastLine.start, +jumpSize);
        // now try to look at the next intersection point
        var nextPoint = intersections[idx + 1];
        if (nextPoint != null) {
            var distance = jumpEnd.distance(nextPoint);
            if (distance <= jumpSize) {
                // next point is close enough, move the jump end by this
                // difference and mark the next point to be skipped
                jumpEnd = nextPoint.move(lastLine.start, distance);
                skippedPoints.push(nextPoint);
            }
        }
        else {
            // this block is inside of `else` as an optimization so the distance is
            // not calculated when we know there are no other intersection points
            var endDistance = jumpStart.distance(lastLine.end);
            // if the end is too close to possible jump, draw remaining line instead of a jump
            if (endDistance < jumpSize * 2 + CLOSE_PROXIMITY_PADDING) {
                memo.push(lastLine);
                return memo;
            }
        }
        var startDistance = jumpEnd.distance(lastLine.start);
        if (startDistance < jumpSize * 2 + CLOSE_PROXIMITY_PADDING) {
            // if the start of line is too close to jump, draw that line instead of a jump
            memo.push(lastLine);
            return memo;
        }
        // finally create a jump line
        var jumpLine = new geometry_1.Line(jumpStart, jumpEnd);
        // it's just simple line but with a `isJump` property
        jumppedLines.push(jumpLine);
        memo.push(new geometry_1.Line(lastLine.start, jumpStart), jumpLine, new geometry_1.Line(jumpEnd, lastLine.end));
        return memo;
    }, []);
}
function buildPath(lines, jumpSize, jumpType, radius) {
    var path = new geometry_1.Path();
    var segment;
    // first move to the start of a first line
    segment = geometry_1.Path.createSegment('M', lines[0].start);
    path.appendSegment(segment);
    lines.forEach(function (line, index) {
        if (jumppedLines.includes(line)) {
            var angle = void 0;
            var diff = void 0;
            var control1 = void 0;
            var control2 = void 0;
            if (jumpType === 'arc') {
                // approximates semicircle with 2 curves
                angle = -90;
                // determine rotation of arc based on difference between points
                diff = line.start.diff(line.end);
                // make sure the arc always points up (or right)
                var xAxisRotate = diff.x < 0 || (diff.x === 0 && diff.y < 0);
                if (xAxisRotate) {
                    angle += 180;
                }
                var center = line.getCenter();
                var centerLine = new geometry_1.Line(center, line.end).rotate(angle, center);
                var halfLine 
                // first half
                = void 0;
                // first half
                halfLine = new geometry_1.Line(line.start, center);
                control1 = halfLine.pointAt(2 / 3).rotate(angle, line.start);
                control2 = centerLine.pointAt(1 / 3).rotate(-angle, centerLine.end);
                segment = geometry_1.Path.createSegment('C', control1, control2, centerLine.end);
                path.appendSegment(segment);
                // second half
                halfLine = new geometry_1.Line(center, line.end);
                control1 = centerLine.pointAt(1 / 3).rotate(angle, centerLine.end);
                control2 = halfLine.pointAt(1 / 3).rotate(-angle, line.end);
                segment = geometry_1.Path.createSegment('C', control1, control2, line.end);
                path.appendSegment(segment);
            }
            else if (jumpType === 'gap') {
                segment = geometry_1.Path.createSegment('M', line.end);
                path.appendSegment(segment);
            }
            else if (jumpType === 'cubic') {
                // approximates semicircle with 1 curve
                angle = line.start.theta(line.end);
                var xOffset = jumpSize * 0.6;
                var yOffset = jumpSize * 1.35;
                // determine rotation of arc based on difference between points
                diff = line.start.diff(line.end);
                // make sure the arc always points up (or right)
                var xAxisRotate = diff.x < 0 || (diff.x === 0 && diff.y < 0);
                if (xAxisRotate) {
                    yOffset *= -1;
                }
                control1 = new geometry_1.Point(line.start.x + xOffset, line.start.y + yOffset).rotate(angle, line.start);
                control2 = new geometry_1.Point(line.end.x - xOffset, line.end.y + yOffset).rotate(angle, line.end);
                segment = geometry_1.Path.createSegment('C', control1, control2, line.end);
                path.appendSegment(segment);
            }
        }
        else {
            var nextLine = lines[index + 1];
            if (radius === 0 || !nextLine || jumppedLines.includes(nextLine)) {
                segment = geometry_1.Path.createSegment('L', line.end);
                path.appendSegment(segment);
            }
            else {
                buildRoundedSegment(radius, path, line.end, line.start, nextLine.end);
            }
        }
    });
    return path;
}
function buildRoundedSegment(offset, path, curr, prev, next) {
    var prevDistance = curr.distance(prev) / 2;
    var nextDistance = curr.distance(next) / 2;
    var startMove = -Math.min(offset, prevDistance);
    var endMove = -Math.min(offset, nextDistance);
    var roundedStart = curr.clone().move(prev, startMove).round();
    var roundedEnd = curr.clone().move(next, endMove).round();
    var control1 = new geometry_1.Point(F13 * roundedStart.x + F23 * curr.x, F23 * curr.y + F13 * roundedStart.y);
    var control2 = new geometry_1.Point(F13 * roundedEnd.x + F23 * curr.x, F23 * curr.y + F13 * roundedEnd.y);
    var segment;
    segment = geometry_1.Path.createSegment('L', roundedStart);
    path.appendSegment(segment);
    segment = geometry_1.Path.createSegment('C', control1, control2, roundedEnd);
    path.appendSegment(segment);
}
var jumppedLines;
var skippedPoints;
var jumpover = function (sourcePoint, targetPoint, routePoints, options) {
    var _this = this;
    if (options === void 0) { options = {}; }
    jumppedLines = [];
    skippedPoints = [];
    setupUpdating(this);
    var jumpSize = options.size || 5;
    var jumpType = options.type || 'arc';
    var radius = options.radius || 0;
    // list of connector types not to jump over.
    var ignoreConnectors = options.ignoreConnectors || ['smooth'];
    var graph = this.graph;
    var model = graph.model;
    var allLinks = model.getEdges();
    // there is just one link, draw it directly
    if (allLinks.length === 1) {
        return buildPath(createLines(sourcePoint, targetPoint, routePoints), jumpSize, jumpType, radius);
    }
    var edge = this.cell;
    var thisIndex = allLinks.indexOf(edge);
    var defaultConnector = graph.options.connecting.connector || {};
    // not all links are meant to be jumped over.
    var edges = allLinks.filter(function (link, idx) {
        var connector = link.getConnector() || defaultConnector;
        // avoid jumping over links with connector type listed in `ignored connectors`.
        if (ignoreConnectors.includes(connector.name)) {
            return false;
        }
        // filter out links that are above this one and  have the same connector type
        // otherwise there would double hoops for each intersection
        if (idx > thisIndex) {
            return connector.name !== 'jumpover';
        }
        return true;
    });
    // find views for all links
    var linkViews = edges.map(function (edge) {
        return graph.renderer.findViewByCell(edge);
    });
    // create lines for this link
    var thisLines = createLines(sourcePoint, targetPoint, routePoints);
    // create lines for all other links
    var linkLines = linkViews.map(function (linkView) {
        if (linkView == null) {
            return [];
        }
        if (linkView === _this) {
            return thisLines;
        }
        return createLines(linkView.sourcePoint, linkView.targetPoint, linkView.routePoints);
    });
    // transform lines for this link by splitting with jump lines at
    // points of intersection with other links
    var jumpingLines = [];
    thisLines.forEach(function (line) {
        // iterate all links and grab the intersections with this line
        // these are then sorted by distance so the line can be split more easily
        var intersections = edges
            .reduce(function (memo, link, i) {
            // don't intersection with itself
            if (link !== edge) {
                var lineIntersections = findLineIntersections(line, linkLines[i]);
                memo.push.apply(memo, lineIntersections);
            }
            return memo;
        }, [])
            .sort(function (a, b) { return getDistence(line.start, a) - getDistence(line.start, b); });
        if (intersections.length > 0) {
            // split the line based on found intersection points
            jumpingLines.push.apply(jumpingLines, createJumps(line, intersections, jumpSize));
        }
        else {
            // without any intersection the line goes uninterrupted
            jumpingLines.push(line);
        }
    });
    var path = buildPath(jumpingLines, jumpSize, jumpType, radius);
    jumppedLines = [];
    skippedPoints = [];
    return options.raw ? path : path.serialize();
};
exports.jumpover = jumpover;
//# sourceMappingURL=jumpover.js.map