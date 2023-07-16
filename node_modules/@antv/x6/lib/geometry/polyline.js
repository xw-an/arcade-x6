"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.Polyline = void 0;
var point_1 = require("./point");
var rectangle_1 = require("./rectangle");
var line_1 = require("./line");
var geometry_1 = require("./geometry");
var Polyline = /** @class */ (function (_super) {
    __extends(Polyline, _super);
    function Polyline(points) {
        var _this = _super.call(this) || this;
        if (points != null) {
            if (typeof points === 'string') {
                return Polyline.parse(points);
            }
            _this.points = points.map(function (p) { return point_1.Point.create(p); });
        }
        else {
            _this.points = [];
        }
        return _this;
    }
    Object.defineProperty(Polyline.prototype, Symbol.toStringTag, {
        get: function () {
            return Polyline.toStringTag;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Polyline.prototype, "start", {
        get: function () {
            if (this.points.length === 0) {
                return null;
            }
            return this.points[0];
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Polyline.prototype, "end", {
        get: function () {
            if (this.points.length === 0) {
                return null;
            }
            return this.points[this.points.length - 1];
        },
        enumerable: false,
        configurable: true
    });
    Polyline.prototype.scale = function (sx, sy, origin) {
        if (origin === void 0) { origin = new point_1.Point(); }
        this.points.forEach(function (p) { return p.scale(sx, sy, origin); });
        return this;
    };
    Polyline.prototype.rotate = function (angle, origin) {
        this.points.forEach(function (p) { return p.rotate(angle, origin); });
        return this;
    };
    Polyline.prototype.translate = function (dx, dy) {
        var t = point_1.Point.create(dx, dy);
        this.points.forEach(function (p) { return p.translate(t.x, t.y); });
        return this;
    };
    Polyline.prototype.bbox = function () {
        if (this.points.length === 0) {
            return new rectangle_1.Rectangle();
        }
        var x1 = Infinity;
        var x2 = -Infinity;
        var y1 = Infinity;
        var y2 = -Infinity;
        var points = this.points;
        for (var i = 0, ii = points.length; i < ii; i += 1) {
            var point = points[i];
            var x = point.x;
            var y = point.y;
            if (x < x1)
                x1 = x;
            if (x > x2)
                x2 = x;
            if (y < y1)
                y1 = y;
            if (y > y2)
                y2 = y;
        }
        return new rectangle_1.Rectangle(x1, y1, x2 - x1, y2 - y1);
    };
    Polyline.prototype.closestPoint = function (p) {
        var cpLength = this.closestPointLength(p);
        return this.pointAtLength(cpLength);
    };
    Polyline.prototype.closestPointLength = function (p) {
        var points = this.points;
        var count = points.length;
        if (count === 0 || count === 1) {
            return 0;
        }
        var length = 0;
        var cpLength = 0;
        var minSqrDistance = Infinity;
        for (var i = 0, ii = count - 1; i < ii; i += 1) {
            var line = new line_1.Line(points[i], points[i + 1]);
            var lineLength = line.length();
            var cpNormalizedLength = line.closestPointNormalizedLength(p);
            var cp = line.pointAt(cpNormalizedLength);
            var sqrDistance = cp.squaredDistance(p);
            if (sqrDistance < minSqrDistance) {
                minSqrDistance = sqrDistance;
                cpLength = length + cpNormalizedLength * lineLength;
            }
            length += lineLength;
        }
        return cpLength;
    };
    Polyline.prototype.closestPointNormalizedLength = function (p) {
        var cpLength = this.closestPointLength(p);
        if (cpLength === 0) {
            return 0;
        }
        var length = this.length();
        if (length === 0) {
            return 0;
        }
        return cpLength / length;
    };
    Polyline.prototype.closestPointTangent = function (p) {
        var cpLength = this.closestPointLength(p);
        return this.tangentAtLength(cpLength);
    };
    Polyline.prototype.containsPoint = function (p) {
        if (this.points.length === 0) {
            return false;
        }
        var ref = point_1.Point.clone(p);
        var x = ref.x;
        var y = ref.y;
        var points = this.points;
        var count = points.length;
        var startIndex = count - 1;
        var intersectionCount = 0;
        for (var endIndex = 0; endIndex < count; endIndex += 1) {
            var start = points[startIndex];
            var end = points[endIndex];
            if (ref.equals(start)) {
                return true;
            }
            var segment = new line_1.Line(start, end);
            if (segment.containsPoint(p)) {
                return true;
            }
            // do we have an intersection?
            if ((y <= start.y && y > end.y) || (y > start.y && y <= end.y)) {
                // this conditional branch IS NOT entered when `segment` is collinear/coincident with `ray`
                // (when `y === start.y === end.y`)
                // this conditional branch IS entered when `segment` touches `ray` at only one point
                // (e.g. when `y === start.y !== end.y`)
                // since this branch is entered again for the following segment, the two touches cancel out
                var xDifference = start.x - x > end.x - x ? start.x - x : end.x - x;
                if (xDifference >= 0) {
                    // segment lies at least partially to the right of `p`
                    var rayEnd = new point_1.Point(x + xDifference, y); // right
                    var ray = new line_1.Line(p, rayEnd);
                    if (segment.intersectsWithLine(ray)) {
                        // an intersection was detected to the right of `p`
                        intersectionCount += 1;
                    }
                } // else: `segment` lies completely to the left of `p` (i.e. no intersection to the right)
            }
            // move to check the next polyline segment
            startIndex = endIndex;
        }
        // returns `true` for odd numbers of intersections (even-odd algorithm)
        return intersectionCount % 2 === 1;
    };
    Polyline.prototype.intersectsWithLine = function (line) {
        var intersections = [];
        for (var i = 0, n = this.points.length - 1; i < n; i += 1) {
            var a = this.points[i];
            var b = this.points[i + 1];
            var int = line.intersectsWithLine(new line_1.Line(a, b));
            if (int) {
                intersections.push(int);
            }
        }
        return intersections.length > 0 ? intersections : null;
    };
    Polyline.prototype.isDifferentiable = function () {
        for (var i = 0, ii = this.points.length - 1; i < ii; i += 1) {
            var a = this.points[i];
            var b = this.points[i + 1];
            var line = new line_1.Line(a, b);
            if (line.isDifferentiable()) {
                return true;
            }
        }
        return false;
    };
    Polyline.prototype.length = function () {
        var len = 0;
        for (var i = 0, ii = this.points.length - 1; i < ii; i += 1) {
            var a = this.points[i];
            var b = this.points[i + 1];
            len += a.distance(b);
        }
        return len;
    };
    Polyline.prototype.pointAt = function (ratio) {
        var points = this.points;
        var count = points.length;
        if (count === 0) {
            return null;
        }
        if (count === 1) {
            return points[0].clone();
        }
        if (ratio <= 0) {
            return points[0].clone();
        }
        if (ratio >= 1) {
            return points[count - 1].clone();
        }
        var total = this.length();
        var length = total * ratio;
        return this.pointAtLength(length);
    };
    Polyline.prototype.pointAtLength = function (length) {
        var points = this.points;
        var count = points.length;
        if (count === 0) {
            return null;
        }
        if (count === 1) {
            return points[0].clone();
        }
        var fromStart = true;
        if (length < 0) {
            fromStart = false;
            length = -length; // eslint-disable-line
        }
        var tmp = 0;
        for (var i = 0, ii = count - 1; i < ii; i += 1) {
            var index = fromStart ? i : ii - 1 - i;
            var a = points[index];
            var b = points[index + 1];
            var l = new line_1.Line(a, b);
            var d = a.distance(b);
            if (length <= tmp + d) {
                return l.pointAtLength((fromStart ? 1 : -1) * (length - tmp));
            }
            tmp += d;
        }
        var lastPoint = fromStart ? points[count - 1] : points[0];
        return lastPoint.clone();
    };
    Polyline.prototype.tangentAt = function (ratio) {
        var points = this.points;
        var count = points.length;
        if (count === 0 || count === 1) {
            return null;
        }
        if (ratio < 0) {
            ratio = 0; // eslint-disable-line
        }
        if (ratio > 1) {
            ratio = 1; // eslint-disable-line
        }
        var total = this.length();
        var length = total * ratio;
        return this.tangentAtLength(length);
    };
    Polyline.prototype.tangentAtLength = function (length) {
        var points = this.points;
        var count = points.length;
        if (count === 0 || count === 1) {
            return null;
        }
        var fromStart = true;
        if (length < 0) {
            fromStart = false;
            length = -length; // eslint-disable-line
        }
        var lastValidLine;
        var tmp = 0;
        for (var i = 0, ii = count - 1; i < ii; i += 1) {
            var index = fromStart ? i : ii - 1 - i;
            var a = points[index];
            var b = points[index + 1];
            var l = new line_1.Line(a, b);
            var d = a.distance(b);
            if (l.isDifferentiable()) {
                // has a tangent line (line length is not 0)
                if (length <= tmp + d) {
                    return l.tangentAtLength((fromStart ? 1 : -1) * (length - tmp));
                }
                lastValidLine = l;
            }
            tmp += d;
        }
        if (lastValidLine) {
            var ratio = fromStart ? 1 : 0;
            return lastValidLine.tangentAt(ratio);
        }
        return null;
    };
    Polyline.prototype.simplify = function (
    // TODO: Accept startIndex and endIndex to specify where to start and end simplification
    options) {
        if (options === void 0) { options = {}; }
        var points = this.points;
        // we need at least 3 points
        if (points.length < 3) {
            return this;
        }
        var threshold = options.threshold || 0;
        // start at the beginning of the polyline and go forward
        var currentIndex = 0;
        // we need at least one intermediate point (3 points) in every iteration
        // as soon as that stops being true, we know we reached the end of the polyline
        while (points[currentIndex + 2]) {
            var firstIndex = currentIndex;
            var middleIndex = currentIndex + 1;
            var lastIndex = currentIndex + 2;
            var firstPoint = points[firstIndex];
            var middlePoint = points[middleIndex];
            var lastPoint = points[lastIndex];
            var chord = new line_1.Line(firstPoint, lastPoint); // = connection between first and last point
            var closestPoint = chord.closestPoint(middlePoint); // = closest point on chord from middle point
            var closestPointDistance = closestPoint.distance(middlePoint);
            if (closestPointDistance <= threshold) {
                // middle point is close enough to the chord = simplify
                // 1) remove middle point:
                points.splice(middleIndex, 1);
                // 2) in next iteration, investigate the newly-created triplet of points
                //    - do not change `currentIndex`
                //    = (first point stays, point after removed point becomes middle point)
            }
            else {
                // middle point is far from the chord
                // 1) preserve middle point
                // 2) in next iteration, move `currentIndex` by one step:
                currentIndex += 1;
                //    = (point after first point becomes first point)
            }
        }
        // `points` array was modified in-place
        return this;
    };
    Polyline.prototype.toHull = function () {
        var points = this.points;
        var count = points.length;
        if (count === 0) {
            return new Polyline();
        }
        // Step 1: find the starting point -- point with
        // the lowest y (if equality, highest x).
        var startPoint = points[0];
        for (var i = 1; i < count; i += 1) {
            if (points[i].y < startPoint.y) {
                startPoint = points[i];
            }
            else if (points[i].y === startPoint.y && points[i].x > startPoint.x) {
                startPoint = points[i];
            }
        }
        // Step 2: sort the list of points by angle between line
        // from start point to current point and the x-axis (theta).
        // Step 2a: create the point records = [point, originalIndex, angle]
        var sortedRecords = [];
        for (var i = 0; i < count; i += 1) {
            var angle = startPoint.theta(points[i]);
            if (angle === 0) {
                // Give highest angle to start point.
                // The start point will end up at end of sorted list.
                // The start point will end up at beginning of hull points list.
                angle = 360;
            }
            sortedRecords.push([points[i], i, angle]);
        }
        // Step 2b: sort the list in place
        sortedRecords.sort(function (record1, record2) {
            var ret = record1[2] - record2[2];
            if (ret === 0) {
                ret = record2[1] - record1[1];
            }
            return ret;
        });
        // Step 2c: duplicate start record from the top of
        // the stack to the bottom of the stack.
        if (sortedRecords.length > 2) {
            var startPoint_1 = sortedRecords[sortedRecords.length - 1];
            sortedRecords.unshift(startPoint_1);
        }
        // Step 3
        // ------
        // Step 3a: go through sorted points in order and find those with
        // right turns, and we want to get our results in clockwise order.
        // Dictionary of points with left turns - cannot be on the hull.
        var insidePoints = {};
        // Stack of records with right turns - hull point candidates.
        var hullRecords = [];
        var getKey = function (record) {
            return record[0].toString() + "@" + record[1];
        };
        while (sortedRecords.length !== 0) {
            var currentRecord = sortedRecords.pop();
            var currentPoint = currentRecord[0];
            // Check if point has already been discarded.
            if (insidePoints[getKey(currentRecord)]) {
                continue;
            }
            var correctTurnFound = false;
            while (!correctTurnFound) {
                if (hullRecords.length < 2) {
                    // Not enough points for comparison, just add current point.
                    hullRecords.push(currentRecord);
                    correctTurnFound = true;
                }
                else {
                    var lastHullRecord = hullRecords.pop();
                    var lastHullPoint = lastHullRecord[0];
                    var secondLastHullRecord = hullRecords.pop();
                    var secondLastHullPoint = secondLastHullRecord[0];
                    var crossProduct = secondLastHullPoint.cross(lastHullPoint, currentPoint);
                    if (crossProduct < 0) {
                        // Found a right turn.
                        hullRecords.push(secondLastHullRecord);
                        hullRecords.push(lastHullRecord);
                        hullRecords.push(currentRecord);
                        correctTurnFound = true;
                    }
                    else if (crossProduct === 0) {
                        // the three points are collinear
                        // three options:
                        // there may be a 180 or 0 degree angle at lastHullPoint
                        // or two of the three points are coincident
                        // we have to take rounding errors into account
                        var THRESHOLD = 1e-10;
                        var angleBetween = lastHullPoint.angleBetween(secondLastHullPoint, currentPoint);
                        if (Math.abs(angleBetween - 180) < THRESHOLD) {
                            // rouding around 180 to 180
                            // if the cross product is 0 because the angle is 180 degrees
                            // discard last hull point (add to insidePoints)
                            // insidePoints.unshift(lastHullPoint);
                            insidePoints[getKey(lastHullRecord)] = lastHullPoint;
                            // reenter second-to-last hull point (will be last at next iter)
                            hullRecords.push(secondLastHullRecord);
                            // do not do anything with current point
                            // correct turn not found
                        }
                        else if (lastHullPoint.equals(currentPoint) ||
                            secondLastHullPoint.equals(lastHullPoint)) {
                            // if the cross product is 0 because two points are the same
                            // discard last hull point (add to insidePoints)
                            // insidePoints.unshift(lastHullPoint);
                            insidePoints[getKey(lastHullRecord)] = lastHullPoint;
                            // reenter second-to-last hull point (will be last at next iter)
                            hullRecords.push(secondLastHullRecord);
                            // do not do anything with current point
                            // correct turn not found
                        }
                        else if (Math.abs(((angleBetween + 1) % 360) - 1) < THRESHOLD) {
                            // rounding around 0 and 360 to 0
                            // if the cross product is 0 because the angle is 0 degrees
                            // remove last hull point from hull BUT do not discard it
                            // reenter second-to-last hull point (will be last at next iter)
                            hullRecords.push(secondLastHullRecord);
                            // put last hull point back into the sorted point records list
                            sortedRecords.push(lastHullRecord);
                            // we are switching the order of the 0deg and 180deg points
                            // correct turn not found
                        }
                    }
                    else {
                        // found a left turn
                        // discard last hull point (add to insidePoints)
                        // insidePoints.unshift(lastHullPoint);
                        insidePoints[getKey(lastHullRecord)] = lastHullPoint;
                        // reenter second-to-last hull point (will be last at next iter of loop)
                        hullRecords.push(secondLastHullRecord);
                        // do not do anything with current point
                        // correct turn not found
                    }
                }
            }
        }
        // At this point, hullPointRecords contains the output points in clockwise order
        // the points start with lowest-y,highest-x startPoint, and end at the same point
        // Step 3b: remove duplicated startPointRecord from the end of the array
        if (hullRecords.length > 2) {
            hullRecords.pop();
        }
        // Step 4: find the lowest originalIndex record and put it at the beginning of hull
        var lowestHullIndex; // the lowest originalIndex on the hull
        var indexOfLowestHullIndexRecord = -1; // the index of the record with lowestHullIndex
        for (var i = 0, n = hullRecords.length; i < n; i += 1) {
            var currentHullIndex = hullRecords[i][1];
            if (lowestHullIndex === undefined || currentHullIndex < lowestHullIndex) {
                lowestHullIndex = currentHullIndex;
                indexOfLowestHullIndexRecord = i;
            }
        }
        var hullPointRecordsReordered = [];
        if (indexOfLowestHullIndexRecord > 0) {
            var newFirstChunk = hullRecords.slice(indexOfLowestHullIndexRecord);
            var newSecondChunk = hullRecords.slice(0, indexOfLowestHullIndexRecord);
            hullPointRecordsReordered = newFirstChunk.concat(newSecondChunk);
        }
        else {
            hullPointRecordsReordered = hullRecords;
        }
        var hullPoints = [];
        for (var i = 0, n = hullPointRecordsReordered.length; i < n; i += 1) {
            hullPoints.push(hullPointRecordsReordered[i][0]);
        }
        return new Polyline(hullPoints);
    };
    Polyline.prototype.equals = function (p) {
        var _this = this;
        if (p == null) {
            return false;
        }
        if (p.points.length !== this.points.length) {
            return false;
        }
        return p.points.every(function (a, i) { return a.equals(_this.points[i]); });
    };
    Polyline.prototype.clone = function () {
        return new Polyline(this.points.map(function (p) { return p.clone(); }));
    };
    Polyline.prototype.toJSON = function () {
        return this.points.map(function (p) { return p.toJSON(); });
    };
    Polyline.prototype.serialize = function () {
        return this.points.map(function (p) { return p.x + ", " + p.y; }).join(' ');
    };
    return Polyline;
}(geometry_1.Geometry));
exports.Polyline = Polyline;
(function (Polyline) {
    Polyline.toStringTag = "X6.Geometry." + Polyline.name;
    function isPolyline(instance) {
        if (instance == null) {
            return false;
        }
        if (instance instanceof Polyline) {
            return true;
        }
        var tag = instance[Symbol.toStringTag];
        var polyline = instance;
        if ((tag == null || tag === Polyline.toStringTag) &&
            typeof polyline.toHull === 'function' &&
            typeof polyline.simplify === 'function') {
            return true;
        }
        return false;
    }
    Polyline.isPolyline = isPolyline;
})(Polyline = exports.Polyline || (exports.Polyline = {}));
exports.Polyline = Polyline;
(function (Polyline) {
    function parse(svgString) {
        var str = svgString.trim();
        if (str === '') {
            return new Polyline();
        }
        var points = [];
        var coords = str.split(/\s*,\s*|\s+/);
        for (var i = 0, ii = coords.length; i < ii; i += 2) {
            points.push({ x: +coords[i], y: +coords[i + 1] });
        }
        return new Polyline(points);
    }
    Polyline.parse = parse;
})(Polyline = exports.Polyline || (exports.Polyline = {}));
exports.Polyline = Polyline;
//# sourceMappingURL=polyline.js.map