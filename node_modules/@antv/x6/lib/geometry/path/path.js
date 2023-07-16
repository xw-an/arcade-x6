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
exports.Path = void 0;
var util_1 = require("../util");
var line_1 = require("../line");
var point_1 = require("../point");
var curve_1 = require("../curve");
var polyline_1 = require("../polyline");
var rectangle_1 = require("../rectangle");
var geometry_1 = require("../geometry");
var close_1 = require("./close");
var lineto_1 = require("./lineto");
var moveto_1 = require("./moveto");
var curveto_1 = require("./curveto");
var normalize_1 = require("./normalize");
var Util = __importStar(require("./util"));
var Path = /** @class */ (function (_super) {
    __extends(Path, _super);
    function Path(args) {
        var _this = _super.call(this) || this;
        _this.PRECISION = 3;
        _this.segments = [];
        if (Array.isArray(args)) {
            if (line_1.Line.isLine(args[0]) || curve_1.Curve.isCurve(args[0])) {
                var previousObj_1 = null;
                var arr = args;
                arr.forEach(function (o, i) {
                    if (i === 0) {
                        _this.appendSegment(Path.createSegment('M', o.start));
                    }
                    if (previousObj_1 != null && !previousObj_1.end.equals(o.start)) {
                        _this.appendSegment(Path.createSegment('M', o.start));
                    }
                    if (line_1.Line.isLine(o)) {
                        _this.appendSegment(Path.createSegment('L', o.end));
                    }
                    else if (curve_1.Curve.isCurve(o)) {
                        _this.appendSegment(Path.createSegment('C', o.controlPoint1, o.controlPoint2, o.end));
                    }
                    previousObj_1 = o;
                });
            }
            else {
                var arr = args;
                arr.forEach(function (s) {
                    if (s.isSegment) {
                        _this.appendSegment(s);
                    }
                });
            }
        }
        else if (args != null) {
            if (line_1.Line.isLine(args)) {
                _this.appendSegment(Path.createSegment('M', args.start));
                _this.appendSegment(Path.createSegment('L', args.end));
            }
            else if (curve_1.Curve.isCurve(args)) {
                _this.appendSegment(Path.createSegment('M', args.start));
                _this.appendSegment(Path.createSegment('C', args.controlPoint1, args.controlPoint2, args.end));
            }
            else if (polyline_1.Polyline.isPolyline(args)) {
                if (args.points && args.points.length) {
                    args.points.forEach(function (point, index) {
                        var segment = index === 0
                            ? Path.createSegment('M', point)
                            : Path.createSegment('L', point);
                        _this.appendSegment(segment);
                    });
                }
            }
            else if (args.isSegment) {
                _this.appendSegment(args);
            }
        }
        return _this;
    }
    Object.defineProperty(Path.prototype, Symbol.toStringTag, {
        get: function () {
            return Path.toStringTag;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Path.prototype, "start", {
        get: function () {
            var segments = this.segments;
            var count = segments.length;
            if (count === 0) {
                return null;
            }
            for (var i = 0; i < count; i += 1) {
                var segment = segments[i];
                if (segment.isVisible) {
                    return segment.start;
                }
            }
            // if no visible segment, return last segment end point
            return segments[count - 1].end;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Path.prototype, "end", {
        get: function () {
            var segments = this.segments;
            var count = segments.length;
            if (count === 0) {
                return null;
            }
            for (var i = count - 1; i >= 0; i -= 1) {
                var segment = segments[i];
                if (segment.isVisible) {
                    return segment.end;
                }
            }
            // if no visible segment, return last segment end point
            return segments[count - 1].end;
        },
        enumerable: false,
        configurable: true
    });
    Path.prototype.moveTo = function () {
        var _a;
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return this.appendSegment((_a = moveto_1.MoveTo.create).call.apply(_a, __spreadArray([null], args, false)));
    };
    Path.prototype.lineTo = function () {
        var _a;
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return this.appendSegment((_a = lineto_1.LineTo.create).call.apply(_a, __spreadArray([null], args, false)));
    };
    Path.prototype.curveTo = function () {
        var _a;
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return this.appendSegment((_a = curveto_1.CurveTo.create).call.apply(_a, __spreadArray([null], args, false)));
    };
    Path.prototype.arcTo = function (rx, ry, xAxisRotation, largeArcFlag, sweepFlag, endX, endY) {
        var start = this.end || new point_1.Point();
        var points = typeof endX === 'number'
            ? Util.arcToCurves(start.x, start.y, rx, ry, xAxisRotation, largeArcFlag, sweepFlag, endX, endY)
            : Util.arcToCurves(start.x, start.y, rx, ry, xAxisRotation, largeArcFlag, sweepFlag, endX.x, endX.y);
        if (points != null) {
            for (var i = 0, ii = points.length; i < ii; i += 6) {
                this.curveTo(points[i], points[i + 1], points[i + 2], points[i + 3], points[i + 4], points[i + 5]);
            }
        }
        return this;
    };
    Path.prototype.quadTo = function (x1, y1, x, y) {
        var start = this.end || new point_1.Point();
        var data = ['M', start.x, start.y];
        if (typeof x1 === 'number') {
            data.push('Q', x1, y1, x, y);
        }
        else {
            var p = y1;
            data.push("Q", x1.x, x1.y, p.x, p.y);
        }
        var path = Path.parse(data.join(' '));
        this.appendSegment(path.segments.slice(1));
        return this;
    };
    Path.prototype.close = function () {
        return this.appendSegment(close_1.Close.create());
    };
    Path.prototype.drawPoints = function (points, options) {
        if (options === void 0) { options = {}; }
        var raw = Util.drawPoints(points, options);
        var sub = Path.parse(raw);
        if (sub && sub.segments) {
            this.appendSegment(sub.segments);
        }
    };
    Path.prototype.bbox = function () {
        var segments = this.segments;
        var count = segments.length;
        if (count === 0) {
            return null;
        }
        var bbox;
        for (var i = 0; i < count; i += 1) {
            var segment = segments[i];
            if (segment.isVisible) {
                var segmentBBox = segment.bbox();
                if (segmentBBox != null) {
                    bbox = bbox ? bbox.union(segmentBBox) : segmentBBox;
                }
            }
        }
        if (bbox != null) {
            return bbox;
        }
        // if the path has only invisible elements, return end point of last segment
        var lastSegment = segments[count - 1];
        return new rectangle_1.Rectangle(lastSegment.end.x, lastSegment.end.y, 0, 0);
    };
    Path.prototype.appendSegment = function (seg) {
        var count = this.segments.length;
        var previousSegment = count !== 0 ? this.segments[count - 1] : null;
        var currentSegment;
        var nextSegment = null;
        if (Array.isArray(seg)) {
            for (var i = 0, ii = seg.length; i < ii; i += 1) {
                var segment = seg[i];
                currentSegment = this.prepareSegment(segment, previousSegment, nextSegment);
                this.segments.push(currentSegment);
                previousSegment = currentSegment;
            }
        }
        else if (seg != null && seg.isSegment) {
            currentSegment = this.prepareSegment(seg, previousSegment, nextSegment);
            this.segments.push(currentSegment);
        }
        return this;
    };
    Path.prototype.insertSegment = function (index, seg) {
        var count = this.segments.length;
        if (index < 0) {
            index = count + index + 1; // eslint-disable-line
        }
        if (index > count || index < 0) {
            throw new Error('Index out of range.');
        }
        var currentSegment;
        var previousSegment = null;
        var nextSegment = null;
        if (count !== 0) {
            if (index >= 1) {
                previousSegment = this.segments[index - 1];
                nextSegment = previousSegment.nextSegment;
            }
            else {
                previousSegment = null;
                nextSegment = this.segments[0];
            }
        }
        if (!Array.isArray(seg)) {
            currentSegment = this.prepareSegment(seg, previousSegment, nextSegment);
            this.segments.splice(index, 0, currentSegment);
        }
        else {
            for (var i = 0, ii = seg.length; i < ii; i += 1) {
                var segment = seg[i];
                currentSegment = this.prepareSegment(segment, previousSegment, nextSegment);
                this.segments.splice(index + i, 0, currentSegment);
                previousSegment = currentSegment;
            }
        }
        return this;
    };
    Path.prototype.removeSegment = function (index) {
        var idx = this.fixIndex(index);
        var removedSegment = this.segments.splice(idx, 1)[0];
        var previousSegment = removedSegment.previousSegment;
        var nextSegment = removedSegment.nextSegment;
        // link the previous and next segments together (if present)
        if (previousSegment) {
            previousSegment.nextSegment = nextSegment;
        }
        if (nextSegment) {
            nextSegment.previousSegment = previousSegment;
        }
        if (removedSegment.isSubpathStart && nextSegment) {
            this.updateSubpathStartSegment(nextSegment);
        }
        return removedSegment;
    };
    Path.prototype.replaceSegment = function (index, seg) {
        var idx = this.fixIndex(index);
        var currentSegment;
        var replacedSegment = this.segments[idx];
        var previousSegment = replacedSegment.previousSegment;
        var nextSegment = replacedSegment.nextSegment;
        var updateSubpathStart = replacedSegment.isSubpathStart;
        if (!Array.isArray(seg)) {
            currentSegment = this.prepareSegment(seg, previousSegment, nextSegment);
            this.segments.splice(idx, 1, currentSegment);
            if (updateSubpathStart && currentSegment.isSubpathStart) {
                // already updated by `prepareSegment`
                updateSubpathStart = false;
            }
        }
        else {
            this.segments.splice(index, 1);
            for (var i = 0, ii = seg.length; i < ii; i += 1) {
                var segment = seg[i];
                currentSegment = this.prepareSegment(segment, previousSegment, nextSegment);
                this.segments.splice(index + i, 0, currentSegment);
                previousSegment = currentSegment;
                if (updateSubpathStart && currentSegment.isSubpathStart) {
                    updateSubpathStart = false;
                }
            }
        }
        if (updateSubpathStart && nextSegment) {
            this.updateSubpathStartSegment(nextSegment);
        }
    };
    Path.prototype.getSegment = function (index) {
        var idx = this.fixIndex(index);
        return this.segments[idx];
    };
    Path.prototype.fixIndex = function (index) {
        var length = this.segments.length;
        if (length === 0) {
            throw new Error('Path has no segments.');
        }
        var i = index;
        while (i < 0) {
            i = length + i;
        }
        if (i >= length || i < 0) {
            throw new Error('Index out of range.');
        }
        return i;
    };
    Path.prototype.segmentAt = function (ratio, options) {
        if (options === void 0) { options = {}; }
        var index = this.segmentIndexAt(ratio, options);
        if (!index) {
            return null;
        }
        return this.getSegment(index);
    };
    Path.prototype.segmentAtLength = function (length, options) {
        if (options === void 0) { options = {}; }
        var index = this.segmentIndexAtLength(length, options);
        if (!index)
            return null;
        return this.getSegment(index);
    };
    Path.prototype.segmentIndexAt = function (ratio, options) {
        if (options === void 0) { options = {}; }
        if (this.segments.length === 0) {
            return null;
        }
        var rate = (0, util_1.clamp)(ratio, 0, 1);
        var opt = this.getOptions(options);
        var len = this.length(opt);
        var length = len * rate;
        return this.segmentIndexAtLength(length, opt);
    };
    Path.prototype.segmentIndexAtLength = function (length, options) {
        if (options === void 0) { options = {}; }
        var count = this.segments.length;
        if (count === 0) {
            return null;
        }
        var fromStart = true;
        if (length < 0) {
            fromStart = false;
            length = -length; // eslint-disable-line
        }
        var precision = this.getPrecision(options);
        var segmentSubdivisions = this.getSubdivisions(options);
        var memo = 0;
        var lastVisibleIndex = null;
        for (var i = 0; i < count; i += 1) {
            var index = fromStart ? i : count - 1 - i;
            var segment = this.segments[index];
            var subdivisions = segmentSubdivisions[index];
            var len = segment.length({ precision: precision, subdivisions: subdivisions });
            if (segment.isVisible) {
                if (length <= memo + len) {
                    return index;
                }
                lastVisibleIndex = index;
            }
            memo += len;
        }
        // If length requested is higher than the length of the path, return
        // last visible segment index. If no visible segment, return null.
        return lastVisibleIndex;
    };
    Path.prototype.getSegmentSubdivisions = function (options) {
        if (options === void 0) { options = {}; }
        var precision = this.getPrecision(options);
        var segmentSubdivisions = [];
        for (var i = 0, ii = this.segments.length; i < ii; i += 1) {
            var segment = this.segments[i];
            var subdivisions = segment.getSubdivisions({ precision: precision });
            segmentSubdivisions.push(subdivisions);
        }
        return segmentSubdivisions;
    };
    Path.prototype.updateSubpathStartSegment = function (segment) {
        var previous = segment.previousSegment;
        var current = segment;
        while (current && !current.isSubpathStart) {
            // assign previous segment's subpath start segment to this segment
            if (previous != null) {
                current.subpathStartSegment = previous.subpathStartSegment;
            }
            else {
                current.subpathStartSegment = null;
            }
            previous = current;
            current = current.nextSegment;
        }
    };
    Path.prototype.prepareSegment = function (segment, previousSegment, nextSegment) {
        segment.previousSegment = previousSegment;
        segment.nextSegment = nextSegment;
        if (previousSegment != null) {
            previousSegment.nextSegment = segment;
        }
        if (nextSegment != null) {
            nextSegment.previousSegment = segment;
        }
        var updateSubpathStart = segment;
        if (segment.isSubpathStart) {
            // move to
            segment.subpathStartSegment = segment;
            updateSubpathStart = nextSegment;
        }
        // assign previous segment's subpath start (or self if it is a subpath start) to subsequent segments
        if (updateSubpathStart != null) {
            this.updateSubpathStartSegment(updateSubpathStart);
        }
        return segment;
    };
    Path.prototype.closestPoint = function (p, options) {
        if (options === void 0) { options = {}; }
        var t = this.closestPointT(p, options);
        if (!t) {
            return null;
        }
        return this.pointAtT(t);
    };
    Path.prototype.closestPointLength = function (p, options) {
        if (options === void 0) { options = {}; }
        var opts = this.getOptions(options);
        var t = this.closestPointT(p, opts);
        if (!t) {
            return 0;
        }
        return this.lengthAtT(t, opts);
    };
    Path.prototype.closestPointNormalizedLength = function (p, options) {
        if (options === void 0) { options = {}; }
        var opts = this.getOptions(options);
        var cpLength = this.closestPointLength(p, opts);
        if (cpLength === 0) {
            return 0;
        }
        var length = this.length(opts);
        if (length === 0) {
            return 0;
        }
        return cpLength / length;
    };
    Path.prototype.closestPointT = function (p, options) {
        if (options === void 0) { options = {}; }
        if (this.segments.length === 0) {
            return null;
        }
        var precision = this.getPrecision(options);
        var segmentSubdivisions = this.getSubdivisions(options);
        var closestPointT;
        var minSquaredDistance = Infinity;
        for (var i = 0, ii = this.segments.length; i < ii; i += 1) {
            var segment = this.segments[i];
            var subdivisions = segmentSubdivisions[i];
            if (segment.isVisible) {
                var segmentClosestPointT = segment.closestPointT(p, {
                    precision: precision,
                    subdivisions: subdivisions,
                });
                var segmentClosestPoint = segment.pointAtT(segmentClosestPointT);
                var squaredDistance = (0, util_1.squaredLength)(segmentClosestPoint, p);
                if (squaredDistance < minSquaredDistance) {
                    closestPointT = { segmentIndex: i, value: segmentClosestPointT };
                    minSquaredDistance = squaredDistance;
                }
            }
        }
        if (closestPointT) {
            return closestPointT;
        }
        return { segmentIndex: this.segments.length - 1, value: 1 };
    };
    Path.prototype.closestPointTangent = function (p, options) {
        if (options === void 0) { options = {}; }
        if (this.segments.length === 0) {
            return null;
        }
        var precision = this.getPrecision(options);
        var segmentSubdivisions = this.getSubdivisions(options);
        var closestPointTangent;
        var minSquaredDistance = Infinity;
        for (var i = 0, ii = this.segments.length; i < ii; i += 1) {
            var segment = this.segments[i];
            var subdivisions = segmentSubdivisions[i];
            if (segment.isDifferentiable()) {
                var segmentClosestPointT = segment.closestPointT(p, {
                    precision: precision,
                    subdivisions: subdivisions,
                });
                var segmentClosestPoint = segment.pointAtT(segmentClosestPointT);
                var squaredDistance = (0, util_1.squaredLength)(segmentClosestPoint, p);
                if (squaredDistance < minSquaredDistance) {
                    closestPointTangent = segment.tangentAtT(segmentClosestPointT);
                    minSquaredDistance = squaredDistance;
                }
            }
        }
        if (closestPointTangent) {
            return closestPointTangent;
        }
        return null;
    };
    Path.prototype.containsPoint = function (p, options) {
        if (options === void 0) { options = {}; }
        var polylines = this.toPolylines(options);
        if (!polylines) {
            return false;
        }
        var numIntersections = 0;
        for (var i = 0, ii = polylines.length; i < ii; i += 1) {
            var polyline = polylines[i];
            if (polyline.containsPoint(p)) {
                numIntersections += 1;
            }
        }
        // returns `true` for odd numbers of intersections (even-odd algorithm)
        return numIntersections % 2 === 1;
    };
    Path.prototype.pointAt = function (ratio, options) {
        if (options === void 0) { options = {}; }
        if (this.segments.length === 0) {
            return null;
        }
        if (ratio <= 0) {
            return this.start.clone();
        }
        if (ratio >= 1) {
            return this.end.clone();
        }
        var opts = this.getOptions(options);
        var pathLength = this.length(opts);
        var length = pathLength * ratio;
        return this.pointAtLength(length, opts);
    };
    Path.prototype.pointAtLength = function (length, options) {
        if (options === void 0) { options = {}; }
        if (this.segments.length === 0) {
            return null;
        }
        if (length === 0) {
            return this.start.clone();
        }
        var fromStart = true;
        if (length < 0) {
            fromStart = false;
            length = -length; // eslint-disable-line
        }
        var precision = this.getPrecision(options);
        var segmentSubdivisions = this.getSubdivisions(options);
        var lastVisibleSegment;
        var memo = 0;
        for (var i = 0, ii = this.segments.length; i < ii; i += 1) {
            var index = fromStart ? i : ii - 1 - i;
            var segment = this.segments[index];
            var subdivisions = segmentSubdivisions[index];
            var d = segment.length({
                precision: precision,
                subdivisions: subdivisions,
            });
            if (segment.isVisible) {
                if (length <= memo + d) {
                    return segment.pointAtLength((fromStart ? 1 : -1) * (length - memo), {
                        precision: precision,
                        subdivisions: subdivisions,
                    });
                }
                lastVisibleSegment = segment;
            }
            memo += d;
        }
        // if length requested is higher than the length of the path,
        // return last visible segment endpoint
        if (lastVisibleSegment) {
            return fromStart ? lastVisibleSegment.end : lastVisibleSegment.start;
        }
        // if no visible segment, return last segment end point
        var lastSegment = this.segments[this.segments.length - 1];
        return lastSegment.end.clone();
    };
    Path.prototype.pointAtT = function (t) {
        var segments = this.segments;
        var numSegments = segments.length;
        if (numSegments === 0)
            return null; // if segments is an empty array
        var segmentIndex = t.segmentIndex;
        if (segmentIndex < 0)
            return segments[0].pointAtT(0);
        if (segmentIndex >= numSegments) {
            return segments[numSegments - 1].pointAtT(1);
        }
        var tValue = (0, util_1.clamp)(t.value, 0, 1);
        return segments[segmentIndex].pointAtT(tValue);
    };
    Path.prototype.divideAt = function (ratio, options) {
        if (options === void 0) { options = {}; }
        if (this.segments.length === 0) {
            return null;
        }
        var rate = (0, util_1.clamp)(ratio, 0, 1);
        var opts = this.getOptions(options);
        var len = this.length(opts);
        var length = len * rate;
        return this.divideAtLength(length, opts);
    };
    Path.prototype.divideAtLength = function (length, options) {
        if (options === void 0) { options = {}; }
        if (this.segments.length === 0) {
            return null;
        }
        var fromStart = true;
        if (length < 0) {
            fromStart = false;
            length = -length; // eslint-disable-line
        }
        var precision = this.getPrecision(options);
        var segmentSubdivisions = this.getSubdivisions(options);
        var memo = 0;
        var divided;
        var dividedSegmentIndex;
        var lastValidSegment;
        var lastValidSegmentIndex;
        var t;
        for (var i = 0, ii = this.segments.length; i < ii; i += 1) {
            var index_1 = fromStart ? i : ii - 1 - i;
            var segment = this.getSegment(index_1);
            var subdivisions = segmentSubdivisions[index_1];
            var opts = { precision: precision, subdivisions: subdivisions };
            var len = segment.length(opts);
            if (segment.isDifferentiable()) {
                lastValidSegment = segment;
                lastValidSegmentIndex = index_1;
                if (length <= memo + len) {
                    dividedSegmentIndex = index_1;
                    divided = segment.divideAtLength((fromStart ? 1 : -1) * (length - memo), opts);
                    break;
                }
            }
            memo += len;
        }
        if (!lastValidSegment) {
            return null;
        }
        if (!divided) {
            dividedSegmentIndex = lastValidSegmentIndex;
            t = fromStart ? 1 : 0;
            divided = lastValidSegment.divideAtT(t);
        }
        // create a copy of this path and replace the identified segment with its two divided parts:
        var pathCopy = this.clone();
        var index = dividedSegmentIndex;
        pathCopy.replaceSegment(index, divided);
        var divisionStartIndex = index;
        var divisionMidIndex = index + 1;
        var divisionEndIndex = index + 2;
        // do not insert the part if it looks like a point
        if (!divided[0].isDifferentiable()) {
            pathCopy.removeSegment(divisionStartIndex);
            divisionMidIndex -= 1;
            divisionEndIndex -= 1;
        }
        // insert a Moveto segment to ensure secondPath will be valid:
        var movetoEnd = pathCopy.getSegment(divisionMidIndex).start;
        pathCopy.insertSegment(divisionMidIndex, Path.createSegment('M', movetoEnd));
        divisionEndIndex += 1;
        // do not insert the part if it looks like a point
        if (!divided[1].isDifferentiable()) {
            pathCopy.removeSegment(divisionEndIndex - 1);
            divisionEndIndex -= 1;
        }
        // ensure that Closepath segments in secondPath will be assigned correct subpathStartSegment:
        var secondPathSegmentIndexConversion = divisionEndIndex - divisionStartIndex - 1;
        for (var i = divisionEndIndex, ii = pathCopy.segments.length; i < ii; i += 1) {
            var originalSegment = this.getSegment(i - secondPathSegmentIndexConversion);
            var segment = pathCopy.getSegment(i);
            if (segment.type === 'Z' &&
                !originalSegment.subpathStartSegment.end.equals(segment.subpathStartSegment.end)) {
                // pathCopy segment's subpathStartSegment is different from original segment's one
                // convert this Closepath segment to a Lineto and replace it in pathCopy
                var convertedSegment = Path.createSegment('L', originalSegment.end);
                pathCopy.replaceSegment(i, convertedSegment);
            }
        }
        // distribute pathCopy segments into two paths and return those:
        var firstPath = new Path(pathCopy.segments.slice(0, divisionMidIndex));
        var secondPath = new Path(pathCopy.segments.slice(divisionMidIndex));
        return [firstPath, secondPath];
    };
    Path.prototype.intersectsWithLine = function (line, options) {
        if (options === void 0) { options = {}; }
        var polylines = this.toPolylines(options);
        if (polylines == null) {
            return null;
        }
        var intersections = null;
        for (var i = 0, ii = polylines.length; i < ii; i += 1) {
            var polyline = polylines[i];
            var intersection = line.intersect(polyline);
            if (intersection) {
                if (intersections == null) {
                    intersections = [];
                }
                if (Array.isArray(intersection)) {
                    intersections.push.apply(intersections, intersection);
                }
                else {
                    intersections.push(intersection);
                }
            }
        }
        return intersections;
    };
    Path.prototype.isDifferentiable = function () {
        for (var i = 0, ii = this.segments.length; i < ii; i += 1) {
            var segment = this.segments[i];
            if (segment.isDifferentiable()) {
                return true;
            }
        }
        return false;
    };
    Path.prototype.isValid = function () {
        var segments = this.segments;
        var isValid = segments.length === 0 || segments[0].type === 'M';
        return isValid;
    };
    Path.prototype.length = function (options) {
        if (options === void 0) { options = {}; }
        if (this.segments.length === 0) {
            return 0;
        }
        var segmentSubdivisions = this.getSubdivisions(options);
        var length = 0;
        for (var i = 0, ii = this.segments.length; i < ii; i += 1) {
            var segment = this.segments[i];
            var subdivisions = segmentSubdivisions[i];
            length += segment.length({ subdivisions: subdivisions });
        }
        return length;
    };
    Path.prototype.lengthAtT = function (t, options) {
        if (options === void 0) { options = {}; }
        var count = this.segments.length;
        if (count === 0) {
            return 0;
        }
        var segmentIndex = t.segmentIndex;
        if (segmentIndex < 0) {
            return 0;
        }
        var tValue = (0, util_1.clamp)(t.value, 0, 1);
        if (segmentIndex >= count) {
            segmentIndex = count - 1;
            tValue = 1;
        }
        var precision = this.getPrecision(options);
        var segmentSubdivisions = this.getSubdivisions(options);
        var length = 0;
        for (var i = 0; i < segmentIndex; i += 1) {
            var segment_1 = this.segments[i];
            var subdivisions_1 = segmentSubdivisions[i];
            length += segment_1.length({ precision: precision, subdivisions: subdivisions_1 });
        }
        var segment = this.segments[segmentIndex];
        var subdivisions = segmentSubdivisions[segmentIndex];
        length += segment.lengthAtT(tValue, { precision: precision, subdivisions: subdivisions });
        return length;
    };
    Path.prototype.tangentAt = function (ratio, options) {
        if (options === void 0) { options = {}; }
        if (this.segments.length === 0) {
            return null;
        }
        var rate = (0, util_1.clamp)(ratio, 0, 1);
        var opts = this.getOptions(options);
        var len = this.length(opts);
        var length = len * rate;
        return this.tangentAtLength(length, opts);
    };
    Path.prototype.tangentAtLength = function (length, options) {
        if (options === void 0) { options = {}; }
        if (this.segments.length === 0) {
            return null;
        }
        var fromStart = true;
        if (length < 0) {
            fromStart = false;
            length = -length; // eslint-disable-line
        }
        var precision = this.getPrecision(options);
        var segmentSubdivisions = this.getSubdivisions(options);
        var lastValidSegment;
        var memo = 0;
        for (var i = 0, ii = this.segments.length; i < ii; i += 1) {
            var index = fromStart ? i : ii - 1 - i;
            var segment = this.segments[index];
            var subdivisions = segmentSubdivisions[index];
            var len = segment.length({ precision: precision, subdivisions: subdivisions });
            if (segment.isDifferentiable()) {
                if (length <= memo + len) {
                    return segment.tangentAtLength((fromStart ? 1 : -1) * (length - memo), {
                        precision: precision,
                        subdivisions: subdivisions,
                    });
                }
                lastValidSegment = segment;
            }
            memo += len;
        }
        // if length requested is higher than the length of the path, return tangent of endpoint of last valid segment
        if (lastValidSegment) {
            var t = fromStart ? 1 : 0;
            return lastValidSegment.tangentAtT(t);
        }
        // if no valid segment, return null
        return null;
    };
    Path.prototype.tangentAtT = function (t) {
        var count = this.segments.length;
        if (count === 0) {
            return null;
        }
        var segmentIndex = t.segmentIndex;
        if (segmentIndex < 0) {
            return this.segments[0].tangentAtT(0);
        }
        if (segmentIndex >= count) {
            return this.segments[count - 1].tangentAtT(1);
        }
        var tValue = (0, util_1.clamp)(t.value, 0, 1);
        return this.segments[segmentIndex].tangentAtT(tValue);
    };
    Path.prototype.getPrecision = function (options) {
        if (options === void 0) { options = {}; }
        return options.precision == null ? this.PRECISION : options.precision;
    };
    Path.prototype.getSubdivisions = function (options) {
        if (options === void 0) { options = {}; }
        if (options.segmentSubdivisions == null) {
            var precision = this.getPrecision(options);
            return this.getSegmentSubdivisions({ precision: precision });
        }
        return options.segmentSubdivisions;
    };
    Path.prototype.getOptions = function (options) {
        if (options === void 0) { options = {}; }
        var precision = this.getPrecision(options);
        var segmentSubdivisions = this.getSubdivisions(options);
        return { precision: precision, segmentSubdivisions: segmentSubdivisions };
    };
    Path.prototype.toPoints = function (options) {
        if (options === void 0) { options = {}; }
        var segments = this.segments;
        var count = segments.length;
        if (count === 0) {
            return null;
        }
        var segmentSubdivisions = this.getSubdivisions(options);
        var points = [];
        var partialPoints = [];
        for (var i = 0; i < count; i += 1) {
            var segment = segments[i];
            if (segment.isVisible) {
                var divisions = segmentSubdivisions[i];
                if (divisions.length > 0) {
                    // eslint-disable-next-line no-loop-func
                    divisions.forEach(function (c) { return partialPoints.push(c.start); });
                }
                else {
                    partialPoints.push(segment.start);
                }
            }
            else if (partialPoints.length > 0) {
                partialPoints.push(segments[i - 1].end);
                points.push(partialPoints);
                partialPoints = [];
            }
        }
        if (partialPoints.length > 0) {
            partialPoints.push(this.end);
            points.push(partialPoints);
        }
        return points;
    };
    Path.prototype.toPolylines = function (options) {
        if (options === void 0) { options = {}; }
        var points = this.toPoints(options);
        if (!points) {
            return null;
        }
        return points.map(function (arr) { return new polyline_1.Polyline(arr); });
    };
    Path.prototype.scale = function (sx, sy, origin) {
        this.segments.forEach(function (s) { return s.scale(sx, sy, origin); });
        return this;
    };
    Path.prototype.rotate = function (angle, origin) {
        this.segments.forEach(function (segment) { return segment.rotate(angle, origin); });
        return this;
    };
    Path.prototype.translate = function (tx, ty) {
        if (typeof tx === 'number') {
            this.segments.forEach(function (s) { return s.translate(tx, ty); });
        }
        else {
            this.segments.forEach(function (s) { return s.translate(tx); });
        }
        return this;
    };
    Path.prototype.clone = function () {
        var path = new Path();
        this.segments.forEach(function (s) { return path.appendSegment(s.clone()); });
        return path;
    };
    Path.prototype.equals = function (p) {
        if (p == null) {
            return false;
        }
        var segments = this.segments;
        var otherSegments = p.segments;
        var count = segments.length;
        if (otherSegments.length !== count) {
            return false;
        }
        for (var i = 0; i < count; i += 1) {
            var a = segments[i];
            var b = otherSegments[i];
            if (a.type !== b.type || !a.equals(b)) {
                return false;
            }
        }
        return true;
    };
    Path.prototype.toJSON = function () {
        return this.segments.map(function (s) { return s.toJSON(); });
    };
    Path.prototype.serialize = function () {
        if (!this.isValid()) {
            throw new Error('Invalid path segments.');
        }
        return this.segments.map(function (s) { return s.serialize(); }).join(' ');
    };
    Path.prototype.toString = function () {
        return this.serialize();
    };
    return Path;
}(geometry_1.Geometry));
exports.Path = Path;
(function (Path) {
    Path.toStringTag = "X6.Geometry." + Path.name;
    function isPath(instance) {
        if (instance == null) {
            return false;
        }
        if (instance instanceof Path) {
            return true;
        }
        var tag = instance[Symbol.toStringTag];
        var path = instance;
        if ((tag == null || tag === Path.toStringTag) &&
            Array.isArray(path.segments) &&
            typeof path.moveTo === 'function' &&
            typeof path.lineTo === 'function' &&
            typeof path.curveTo === 'function') {
            return true;
        }
        return false;
    }
    Path.isPath = isPath;
})(Path = exports.Path || (exports.Path = {}));
exports.Path = Path;
(function (Path) {
    function parse(pathData) {
        if (!pathData) {
            return new Path();
        }
        var path = new Path();
        var commandRe = /(?:[a-zA-Z] *)(?:(?:-?\d+(?:\.\d+)?(?:e[-+]?\d+)? *,? *)|(?:-?\.\d+ *,? *))+|(?:[a-zA-Z] *)(?! |\d|-|\.)/g;
        var commands = Path.normalize(pathData).match(commandRe);
        if (commands != null) {
            for (var i = 0, ii = commands.length; i < ii; i += 1) {
                var command = commands[i];
                var argRe = /(?:[a-zA-Z])|(?:(?:-?\d+(?:\.\d+)?(?:e[-+]?\d+)?))|(?:(?:-?\.\d+))/g;
                // args = [type, coordinate1, coordinate2...]
                var args = command.match(argRe);
                if (args != null) {
                    var type = args[0];
                    var coords = args.slice(1).map(function (a) { return +a; });
                    var segment = createSegment.call.apply(createSegment, __spreadArray([null, type], coords, false));
                    path.appendSegment(segment);
                }
            }
        }
        return path;
    }
    Path.parse = parse;
    function createSegment(type) {
        var _a, _b, _c;
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        if (type === 'M') {
            return (_a = moveto_1.MoveTo.create).call.apply(_a, __spreadArray([null], args, false));
        }
        if (type === 'L') {
            return (_b = lineto_1.LineTo.create).call.apply(_b, __spreadArray([null], args, false));
        }
        if (type === 'C') {
            return (_c = curveto_1.CurveTo.create).call.apply(_c, __spreadArray([null], args, false));
        }
        if (type === 'z' || type === 'Z') {
            return close_1.Close.create();
        }
        throw new Error("Invalid path segment type \"" + type + "\"");
    }
    Path.createSegment = createSegment;
})(Path = exports.Path || (exports.Path = {}));
exports.Path = Path;
(function (Path) {
    Path.normalize = normalize_1.normalizePathData;
    Path.isValid = Util.isValid;
    Path.drawArc = Util.drawArc;
    Path.drawPoints = Util.drawPoints;
    Path.arcToCurves = Util.arcToCurves;
})(Path = exports.Path || (exports.Path = {}));
exports.Path = Path;
//# sourceMappingURL=path.js.map