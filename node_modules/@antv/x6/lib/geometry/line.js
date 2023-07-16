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
exports.Line = void 0;
var point_1 = require("./point");
var geometry_1 = require("./geometry");
var rectangle_1 = require("./rectangle");
var Line = /** @class */ (function (_super) {
    __extends(Line, _super);
    function Line(x1, y1, x2, y2) {
        var _this = _super.call(this) || this;
        if (typeof x1 === 'number' && typeof y1 === 'number') {
            _this.start = new point_1.Point(x1, y1);
            _this.end = new point_1.Point(x2, y2);
        }
        else {
            _this.start = point_1.Point.create(x1);
            _this.end = point_1.Point.create(y1);
        }
        return _this;
    }
    Object.defineProperty(Line.prototype, Symbol.toStringTag, {
        get: function () {
            return Line.toStringTag;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Line.prototype, "center", {
        get: function () {
            return new point_1.Point((this.start.x + this.end.x) / 2, (this.start.y + this.end.y) / 2);
        },
        enumerable: false,
        configurable: true
    });
    Line.prototype.getCenter = function () {
        return this.center;
    };
    /**
     * Rounds the line to the given `precision`.
     */
    Line.prototype.round = function (precision) {
        if (precision === void 0) { precision = 0; }
        this.start.round(precision);
        this.end.round(precision);
        return this;
    };
    Line.prototype.translate = function (tx, ty) {
        if (typeof tx === 'number') {
            this.start.translate(tx, ty);
            this.end.translate(tx, ty);
        }
        else {
            this.start.translate(tx);
            this.end.translate(tx);
        }
        return this;
    };
    /**
     * Rotate the line by `angle` around `origin`.
     */
    Line.prototype.rotate = function (angle, origin) {
        this.start.rotate(angle, origin);
        this.end.rotate(angle, origin);
        return this;
    };
    /**
     * Scale the line by `sx` and `sy` about the given `origin`. If origin is not
     * specified, the line is scaled around `0,0`.
     */
    Line.prototype.scale = function (sx, sy, origin) {
        this.start.scale(sx, sy, origin);
        this.end.scale(sx, sy, origin);
        return this;
    };
    /**
     * Returns the length of the line.
     */
    Line.prototype.length = function () {
        return Math.sqrt(this.squaredLength());
    };
    /**
     * Useful for distance comparisons in which real length is not necessary
     * (saves one `Math.sqrt()` operation).
     */
    Line.prototype.squaredLength = function () {
        var dx = this.start.x - this.end.x;
        var dy = this.start.y - this.end.y;
        return dx * dx + dy * dy;
    };
    /**
     * Scale the line so that it has the requested length. The start point of
     * the line is preserved.
     */
    Line.prototype.setLength = function (length) {
        var total = this.length();
        if (!total) {
            return this;
        }
        var scale = length / total;
        return this.scale(scale, scale, this.start);
    };
    Line.prototype.parallel = function (distance) {
        var line = this.clone();
        if (!line.isDifferentiable()) {
            return line;
        }
        var start = line.start, end = line.end;
        var eRef = start.clone().rotate(270, end);
        var sRef = end.clone().rotate(90, start);
        start.move(sRef, distance);
        end.move(eRef, distance);
        return line;
    };
    /**
     * Returns the vector of the line with length equal to length of the line.
     */
    Line.prototype.vector = function () {
        return new point_1.Point(this.end.x - this.start.x, this.end.y - this.start.y);
    };
    /**
     * Returns the angle of incline of the line.
     *
     * The function returns `NaN` if the start and end endpoints of the line
     * both lie at the same coordinates(it is impossible to determine the angle
     * of incline of a line that appears to be a point). The
     * `line.isDifferentiable()` function may be used in advance to determine
     * whether the angle of incline can be computed for a given line.
     */
    Line.prototype.angle = function () {
        var horizontal = new point_1.Point(this.start.x + 1, this.start.y);
        return this.start.angleBetween(this.end, horizontal);
    };
    /**
     * Returns a rectangle that is the bounding box of the line.
     */
    Line.prototype.bbox = function () {
        var left = Math.min(this.start.x, this.end.x);
        var top = Math.min(this.start.y, this.end.y);
        var right = Math.max(this.start.x, this.end.x);
        var bottom = Math.max(this.start.y, this.end.y);
        return new rectangle_1.Rectangle(left, top, right - left, bottom - top);
    };
    /**
     * Returns the bearing (cardinal direction) of the line.
     *
     * The return value is one of the following strings:
     * 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW' and 'N'.
     *
     * The function returns 'N' if the two endpoints of the line are coincident.
     */
    Line.prototype.bearing = function () {
        return this.start.bearing(this.end);
    };
    /**
     * Returns the point on the line that lies closest to point `p`.
     */
    Line.prototype.closestPoint = function (p) {
        return this.pointAt(this.closestPointNormalizedLength(p));
    };
    /**
     * Returns the length of the line up to the point that lies closest to point `p`.
     */
    Line.prototype.closestPointLength = function (p) {
        return this.closestPointNormalizedLength(p) * this.length();
    };
    /**
     * Returns a line that is tangent to the line at the point that lies closest
     * to point `p`.
     */
    Line.prototype.closestPointTangent = function (p) {
        return this.tangentAt(this.closestPointNormalizedLength(p));
    };
    /**
     * Returns the normalized length (distance from the start of the line / total
     * line length) of the line up to the point that lies closest to point.
     */
    Line.prototype.closestPointNormalizedLength = function (p) {
        var product = this.vector().dot(new Line(this.start, p).vector());
        var normalized = Math.min(1, Math.max(0, product / this.squaredLength()));
        // normalized returns `NaN` if this line has zero length
        if (Number.isNaN(normalized)) {
            return 0;
        }
        return normalized;
    };
    /**
     * Returns a point on the line that lies `rate` (normalized length) away from
     * the beginning of the line.
     */
    Line.prototype.pointAt = function (ratio) {
        var start = this.start;
        var end = this.end;
        if (ratio <= 0) {
            return start.clone();
        }
        if (ratio >= 1) {
            return end.clone();
        }
        return start.lerp(end, ratio);
    };
    /**
     * Returns a point on the line that lies length away from the beginning of
     * the line.
     */
    Line.prototype.pointAtLength = function (length) {
        var start = this.start;
        var end = this.end;
        var fromStart = true;
        if (length < 0) {
            fromStart = false; // start calculation from end point
            length = -length; // eslint-disable-line
        }
        var total = this.length();
        if (length >= total) {
            return fromStart ? end.clone() : start.clone();
        }
        var rate = (fromStart ? length : total - length) / total;
        return this.pointAt(rate);
    };
    /**
     * Divides the line into two lines at the point that lies `rate` (normalized
     * length) away from the beginning of the line.
     */
    Line.prototype.divideAt = function (ratio) {
        var dividerPoint = this.pointAt(ratio);
        return [
            new Line(this.start, dividerPoint),
            new Line(dividerPoint, this.end),
        ];
    };
    /**
     * Divides the line into two lines at the point that lies length away from
     * the beginning of the line.
     */
    Line.prototype.divideAtLength = function (length) {
        var dividerPoint = this.pointAtLength(length);
        return [
            new Line(this.start, dividerPoint),
            new Line(dividerPoint, this.end),
        ];
    };
    /**
     * Returns `true` if the point `p` lies on the line. Return `false` otherwise.
     */
    Line.prototype.containsPoint = function (p) {
        var start = this.start;
        var end = this.end;
        // cross product of 0 indicates that this line and
        // the vector to `p` are collinear.
        if (start.cross(p, end) !== 0) {
            return false;
        }
        var length = this.length();
        if (new Line(start, p).length() > length) {
            return false;
        }
        if (new Line(p, end).length() > length) {
            return false;
        }
        return true;
    };
    Line.prototype.intersect = function (shape, options) {
        var ret = shape.intersectsWithLine(this, options);
        if (ret) {
            return Array.isArray(ret) ? ret : [ret];
        }
        return null;
    };
    /**
     * Returns the intersection point of the line with another line. Returns
     * `null` if no intersection exists.
     */
    Line.prototype.intersectsWithLine = function (line) {
        var pt1Dir = new point_1.Point(this.end.x - this.start.x, this.end.y - this.start.y);
        var pt2Dir = new point_1.Point(line.end.x - line.start.x, line.end.y - line.start.y);
        var det = pt1Dir.x * pt2Dir.y - pt1Dir.y * pt2Dir.x;
        var deltaPt = new point_1.Point(line.start.x - this.start.x, line.start.y - this.start.y);
        var alpha = deltaPt.x * pt2Dir.y - deltaPt.y * pt2Dir.x;
        var beta = deltaPt.x * pt1Dir.y - deltaPt.y * pt1Dir.x;
        if (det === 0 || alpha * det < 0 || beta * det < 0) {
            return null;
        }
        if (det > 0) {
            if (alpha > det || beta > det) {
                return null;
            }
        }
        else if (alpha < det || beta < det) {
            return null;
        }
        return new point_1.Point(this.start.x + (alpha * pt1Dir.x) / det, this.start.y + (alpha * pt1Dir.y) / det);
    };
    /**
     * Returns `true` if a tangent line can be found for the line.
     *
     * Tangents cannot be found if both of the line endpoints are coincident
     * (the line appears to be a point).
     */
    Line.prototype.isDifferentiable = function () {
        return !this.start.equals(this.end);
    };
    /**
     * Returns the perpendicular distance between the line and point. The
     * distance is positive if the point lies to the right of the line, negative
     * if the point lies to the left of the line, and `0` if the point lies on
     * the line.
     */
    Line.prototype.pointOffset = function (p) {
        var ref = point_1.Point.clone(p);
        var start = this.start;
        var end = this.end;
        var determinant = (end.x - start.x) * (ref.y - start.y) -
            (end.y - start.y) * (ref.x - start.x);
        return determinant / this.length();
    };
    Line.prototype.pointSquaredDistance = function (x, y) {
        var p = point_1.Point.create(x, y);
        return this.closestPoint(p).squaredDistance(p);
    };
    Line.prototype.pointDistance = function (x, y) {
        var p = point_1.Point.create(x, y);
        return this.closestPoint(p).distance(p);
    };
    /**
     * Returns a line tangent to the line at point that lies `rate` (normalized
     * length) away from the beginning of the line.
     */
    Line.prototype.tangentAt = function (ratio) {
        if (!this.isDifferentiable()) {
            return null;
        }
        var start = this.start;
        var end = this.end;
        var tangentStart = this.pointAt(ratio);
        var tangentLine = new Line(start, end);
        tangentLine.translate(tangentStart.x - start.x, tangentStart.y - start.y);
        return tangentLine;
    };
    /**
     * Returns a line tangent to the line at point that lies `length` away from
     * the beginning of the line.
     */
    Line.prototype.tangentAtLength = function (length) {
        if (!this.isDifferentiable()) {
            return null;
        }
        var start = this.start;
        var end = this.end;
        var tangentStart = this.pointAtLength(length);
        var tangentLine = new Line(start, end);
        tangentLine.translate(tangentStart.x - start.x, tangentStart.y - start.y);
        return tangentLine;
    };
    Line.prototype.relativeCcw = function (x, y) {
        var ref = point_1.Point.create(x, y);
        var dx1 = ref.x - this.start.x;
        var dy1 = ref.y - this.start.y;
        var dx2 = this.end.x - this.start.x;
        var dy2 = this.end.y - this.start.y;
        var ccw = dx1 * dy2 - dy1 * dx2;
        if (ccw === 0) {
            ccw = dx1 * dx2 + dy1 * dy2;
            if (ccw > 0.0) {
                dx1 -= dx2;
                dy1 -= dy2;
                ccw = dx1 * dx2 + dy1 * dy2;
                if (ccw < 0.0) {
                    ccw = 0.0;
                }
            }
        }
        return ccw < 0.0 ? -1 : ccw > 0.0 ? 1 : 0;
    };
    /**
     * Return `true` if the line equals the other line.
     */
    Line.prototype.equals = function (l) {
        return (l != null &&
            this.start.x === l.start.x &&
            this.start.y === l.start.y &&
            this.end.x === l.end.x &&
            this.end.y === l.end.y);
    };
    /**
     * Returns another line which is a clone of the line.
     */
    Line.prototype.clone = function () {
        return new Line(this.start, this.end);
    };
    Line.prototype.toJSON = function () {
        return { start: this.start.toJSON(), end: this.end.toJSON() };
    };
    Line.prototype.serialize = function () {
        return [this.start.serialize(), this.end.serialize()].join(' ');
    };
    return Line;
}(geometry_1.Geometry));
exports.Line = Line;
(function (Line) {
    Line.toStringTag = "X6.Geometry." + Line.name;
    function isLine(instance) {
        if (instance == null) {
            return false;
        }
        if (instance instanceof Line) {
            return true;
        }
        var tag = instance[Symbol.toStringTag];
        var line = instance;
        try {
            if ((tag == null || tag === Line.toStringTag) &&
                point_1.Point.isPoint(line.start) &&
                point_1.Point.isPoint(line.end) &&
                typeof line.vector === 'function' &&
                typeof line.bearing === 'function' &&
                typeof line.parallel === 'function' &&
                typeof line.intersect === 'function') {
                return true;
            }
        }
        catch (e) {
            return false;
        }
        return false;
    }
    Line.isLine = isLine;
})(Line = exports.Line || (exports.Line = {}));
exports.Line = Line;
//# sourceMappingURL=line.js.map