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
exports.Curve = void 0;
var point_1 = require("./point");
var line_1 = require("./line");
var rectangle_1 = require("./rectangle");
var polyline_1 = require("./polyline");
var geometry_1 = require("./geometry");
var Curve = /** @class */ (function (_super) {
    __extends(Curve, _super);
    function Curve(start, controlPoint1, controlPoint2, end) {
        var _this = _super.call(this) || this;
        _this.PRECISION = 3;
        _this.start = point_1.Point.create(start);
        _this.controlPoint1 = point_1.Point.create(controlPoint1);
        _this.controlPoint2 = point_1.Point.create(controlPoint2);
        _this.end = point_1.Point.create(end);
        return _this;
    }
    Object.defineProperty(Curve.prototype, Symbol.toStringTag, {
        get: function () {
            return Curve.toStringTag;
        },
        enumerable: false,
        configurable: true
    });
    Curve.prototype.bbox = function () {
        var start = this.start;
        var controlPoint1 = this.controlPoint1;
        var controlPoint2 = this.controlPoint2;
        var end = this.end;
        var x0 = start.x;
        var y0 = start.y;
        var x1 = controlPoint1.x;
        var y1 = controlPoint1.y;
        var x2 = controlPoint2.x;
        var y2 = controlPoint2.y;
        var x3 = end.x;
        var y3 = end.y;
        var points = []; // local extremes
        var tvalues = []; // t values of local extremes
        var bounds = [[], []];
        var a;
        var b;
        var c;
        var t;
        var t1;
        var t2;
        var b2ac;
        var sqrtb2ac;
        for (var i = 0; i < 2; i += 1) {
            if (i === 0) {
                b = 6 * x0 - 12 * x1 + 6 * x2;
                a = -3 * x0 + 9 * x1 - 9 * x2 + 3 * x3;
                c = 3 * x1 - 3 * x0;
            }
            else {
                b = 6 * y0 - 12 * y1 + 6 * y2;
                a = -3 * y0 + 9 * y1 - 9 * y2 + 3 * y3;
                c = 3 * y1 - 3 * y0;
            }
            if (Math.abs(a) < 1e-12) {
                if (Math.abs(b) < 1e-12) {
                    continue;
                }
                t = -c / b;
                if (t > 0 && t < 1)
                    tvalues.push(t);
                continue;
            }
            b2ac = b * b - 4 * c * a;
            sqrtb2ac = Math.sqrt(b2ac);
            if (b2ac < 0)
                continue;
            t1 = (-b + sqrtb2ac) / (2 * a);
            if (t1 > 0 && t1 < 1)
                tvalues.push(t1);
            t2 = (-b - sqrtb2ac) / (2 * a);
            if (t2 > 0 && t2 < 1)
                tvalues.push(t2);
        }
        var x;
        var y;
        var mt;
        var j = tvalues.length;
        var jlen = j;
        while (j) {
            j -= 1;
            t = tvalues[j];
            mt = 1 - t;
            x =
                mt * mt * mt * x0 +
                    3 * mt * mt * t * x1 +
                    3 * mt * t * t * x2 +
                    t * t * t * x3;
            bounds[0][j] = x;
            y =
                mt * mt * mt * y0 +
                    3 * mt * mt * t * y1 +
                    3 * mt * t * t * y2 +
                    t * t * t * y3;
            bounds[1][j] = y;
            points[j] = { X: x, Y: y };
        }
        tvalues[jlen] = 0;
        tvalues[jlen + 1] = 1;
        points[jlen] = { X: x0, Y: y0 };
        points[jlen + 1] = { X: x3, Y: y3 };
        bounds[0][jlen] = x0;
        bounds[1][jlen] = y0;
        bounds[0][jlen + 1] = x3;
        bounds[1][jlen + 1] = y3;
        tvalues.length = jlen + 2;
        bounds[0].length = jlen + 2;
        bounds[1].length = jlen + 2;
        points.length = jlen + 2;
        var left = Math.min.apply(null, bounds[0]);
        var top = Math.min.apply(null, bounds[1]);
        var right = Math.max.apply(null, bounds[0]);
        var bottom = Math.max.apply(null, bounds[1]);
        return new rectangle_1.Rectangle(left, top, right - left, bottom - top);
    };
    Curve.prototype.closestPoint = function (p, options) {
        if (options === void 0) { options = {}; }
        return this.pointAtT(this.closestPointT(p, options));
    };
    Curve.prototype.closestPointLength = function (p, options) {
        if (options === void 0) { options = {}; }
        var opts = this.getOptions(options);
        return this.lengthAtT(this.closestPointT(p, opts), opts);
    };
    Curve.prototype.closestPointNormalizedLength = function (p, options) {
        if (options === void 0) { options = {}; }
        var opts = this.getOptions(options);
        var cpLength = this.closestPointLength(p, opts);
        if (!cpLength) {
            return 0;
        }
        var length = this.length(opts);
        if (length === 0) {
            return 0;
        }
        return cpLength / length;
    };
    Curve.prototype.closestPointT = function (p, options) {
        if (options === void 0) { options = {}; }
        var precision = this.getPrecision(options);
        var subdivisions = this.getDivisions(options);
        var precisionRatio = Math.pow(10, -precision); // eslint-disable-line
        var investigatedSubdivision = null;
        var investigatedSubdivisionStartT = 0;
        var investigatedSubdivisionEndT = 0;
        var distFromStart = 0;
        var distFromEnd = 0;
        var chordLength = 0;
        var minSumDist = null;
        var count = subdivisions.length;
        var piece = count > 0 ? 1 / count : 0;
        subdivisions.forEach(function (division, i) {
            var startDist = division.start.distance(p);
            var endDist = division.end.distance(p);
            var sumDist = startDist + endDist;
            if (minSumDist == null || sumDist < minSumDist) {
                investigatedSubdivision = division;
                investigatedSubdivisionStartT = i * piece;
                investigatedSubdivisionEndT = (i + 1) * piece;
                distFromStart = startDist;
                distFromEnd = endDist;
                minSumDist = sumDist;
                chordLength = division.endpointDistance();
            }
        });
        // Recursively divide investigated subdivision, until distance between
        // baselinePoint and closest path endpoint is within `10^(-precision)`,
        // then return the closest endpoint of that final subdivision.
        // eslint-disable-next-line
        while (true) {
            // check if we have reached at least one required observed precision
            // - calculated as: the difference in distances from point to start and end divided by the distance
            // - note that this function is not monotonic = it doesn't converge stably but has "teeth"
            // - the function decreases while one of the endpoints is fixed but "jumps" whenever we switch
            // - this criterion works well for points lying far away from the curve
            var startPrecisionRatio = distFromStart
                ? Math.abs(distFromStart - distFromEnd) / distFromStart
                : 0;
            var endPrecisionRatio = distFromEnd != null
                ? Math.abs(distFromStart - distFromEnd) / distFromEnd
                : 0;
            var hasRequiredPrecision = startPrecisionRatio < precisionRatio ||
                endPrecisionRatio < precisionRatio;
            // check if we have reached at least one required minimal distance
            // - calculated as: the subdivision chord length multiplied by precisionRatio
            // - calculation is relative so it will work for arbitrarily large/small curves and their subdivisions
            // - this is a backup criterion that works well for points lying "almost at" the curve
            var hasMiniStartDistance = distFromStart
                ? distFromStart < chordLength * precisionRatio
                : true;
            var hasMiniEndDistance = distFromEnd
                ? distFromEnd < chordLength * precisionRatio
                : true;
            var hasMiniDistance = hasMiniStartDistance || hasMiniEndDistance;
            if (hasRequiredPrecision || hasMiniDistance) {
                return distFromStart <= distFromEnd
                    ? investigatedSubdivisionStartT
                    : investigatedSubdivisionEndT;
            }
            // otherwise, set up for next iteration
            var divided = investigatedSubdivision.divide(0.5);
            piece /= 2;
            var startDist1 = divided[0].start.distance(p);
            var endDist1 = divided[0].end.distance(p);
            var sumDist1 = startDist1 + endDist1;
            var startDist2 = divided[1].start.distance(p);
            var endDist2 = divided[1].end.distance(p);
            var sumDist2 = startDist2 + endDist2;
            if (sumDist1 <= sumDist2) {
                investigatedSubdivision = divided[0];
                investigatedSubdivisionEndT -= piece;
                distFromStart = startDist1;
                distFromEnd = endDist1;
            }
            else {
                investigatedSubdivision = divided[1];
                investigatedSubdivisionStartT += piece;
                distFromStart = startDist2;
                distFromEnd = endDist2;
            }
        }
    };
    Curve.prototype.closestPointTangent = function (p, options) {
        if (options === void 0) { options = {}; }
        return this.tangentAtT(this.closestPointT(p, options));
    };
    Curve.prototype.containsPoint = function (p, options) {
        if (options === void 0) { options = {}; }
        var polyline = this.toPolyline(options);
        return polyline.containsPoint(p);
    };
    Curve.prototype.divideAt = function (ratio, options) {
        if (options === void 0) { options = {}; }
        if (ratio <= 0) {
            return this.divideAtT(0);
        }
        if (ratio >= 1) {
            return this.divideAtT(1);
        }
        var t = this.tAt(ratio, options);
        return this.divideAtT(t);
    };
    Curve.prototype.divideAtLength = function (length, options) {
        if (options === void 0) { options = {}; }
        var t = this.tAtLength(length, options);
        return this.divideAtT(t);
    };
    Curve.prototype.divide = function (t) {
        return this.divideAtT(t);
    };
    Curve.prototype.divideAtT = function (t) {
        var start = this.start;
        var controlPoint1 = this.controlPoint1;
        var controlPoint2 = this.controlPoint2;
        var end = this.end;
        if (t <= 0) {
            return [
                new Curve(start, start, start, start),
                new Curve(start, controlPoint1, controlPoint2, end),
            ];
        }
        if (t >= 1) {
            return [
                new Curve(start, controlPoint1, controlPoint2, end),
                new Curve(end, end, end, end),
            ];
        }
        var dividerPoints = this.getSkeletonPoints(t);
        var startControl1 = dividerPoints.startControlPoint1;
        var startControl2 = dividerPoints.startControlPoint2;
        var divider = dividerPoints.divider;
        var dividerControl1 = dividerPoints.dividerControlPoint1;
        var dividerControl2 = dividerPoints.dividerControlPoint2;
        return [
            new Curve(start, startControl1, startControl2, divider),
            new Curve(divider, dividerControl1, dividerControl2, end),
        ];
    };
    Curve.prototype.endpointDistance = function () {
        return this.start.distance(this.end);
    };
    Curve.prototype.getSkeletonPoints = function (t) {
        var start = this.start;
        var control1 = this.controlPoint1;
        var control2 = this.controlPoint2;
        var end = this.end;
        // shortcuts for `t` values that are out of range
        if (t <= 0) {
            return {
                startControlPoint1: start.clone(),
                startControlPoint2: start.clone(),
                divider: start.clone(),
                dividerControlPoint1: control1.clone(),
                dividerControlPoint2: control2.clone(),
            };
        }
        if (t >= 1) {
            return {
                startControlPoint1: control1.clone(),
                startControlPoint2: control2.clone(),
                divider: end.clone(),
                dividerControlPoint1: end.clone(),
                dividerControlPoint2: end.clone(),
            };
        }
        var midpoint1 = new line_1.Line(start, control1).pointAt(t);
        var midpoint2 = new line_1.Line(control1, control2).pointAt(t);
        var midpoint3 = new line_1.Line(control2, end).pointAt(t);
        var subControl1 = new line_1.Line(midpoint1, midpoint2).pointAt(t);
        var subControl2 = new line_1.Line(midpoint2, midpoint3).pointAt(t);
        var divideLine = new line_1.Line(subControl1, subControl2).pointAt(t);
        return {
            startControlPoint1: midpoint1,
            startControlPoint2: subControl1,
            divider: divideLine,
            dividerControlPoint1: subControl2,
            dividerControlPoint2: midpoint3,
        };
    };
    Curve.prototype.getSubdivisions = function (options) {
        if (options === void 0) { options = {}; }
        var precision = this.getPrecision(options);
        var subdivisions = [
            new Curve(this.start, this.controlPoint1, this.controlPoint2, this.end),
        ];
        if (precision === 0) {
            return subdivisions;
        }
        var previousLength = this.endpointDistance();
        var precisionRatio = Math.pow(10, -precision); // eslint-disable-line
        // Recursively divide curve at `t = 0.5`, until the difference between
        // observed length at subsequent iterations is lower than precision.
        var iteration = 0;
        var _loop_1 = function () {
            iteration += 1;
            var divisions = [];
            subdivisions.forEach(function (c) {
                // dividing at t = 0.5 (not at middle length!)
                var divided = c.divide(0.5);
                divisions.push(divided[0], divided[1]);
            });
            // measure new length
            var length_1 = divisions.reduce(function (memo, c) { return memo + c.endpointDistance(); }, 0);
            // check if we have reached required observed precision
            // sine-like curves may have the same observed length in iteration 0 and 1 - skip iteration 1
            // not a problem for further iterations because cubic curves cannot have more than two local extrema
            // (i.e. cubic curves cannot intersect the baseline more than once)
            // therefore two subsequent iterations cannot produce sampling with equal length
            var ratio = length_1 !== 0 ? (length_1 - previousLength) / length_1 : 0;
            if (iteration > 1 && ratio < precisionRatio) {
                return { value: divisions };
            }
            subdivisions = divisions;
            previousLength = length_1;
        };
        // eslint-disable-next-line
        while (true) {
            var state_1 = _loop_1();
            if (typeof state_1 === "object")
                return state_1.value;
        }
    };
    Curve.prototype.length = function (options) {
        if (options === void 0) { options = {}; }
        var divisions = this.getDivisions(options);
        return divisions.reduce(function (memo, c) {
            return memo + c.endpointDistance();
        }, 0);
    };
    Curve.prototype.lengthAtT = function (t, options) {
        if (options === void 0) { options = {}; }
        if (t <= 0) {
            return 0;
        }
        var precision = options.precision === undefined ? this.PRECISION : options.precision;
        var subCurve = this.divide(t)[0];
        return subCurve.length({ precision: precision });
    };
    Curve.prototype.pointAt = function (ratio, options) {
        if (options === void 0) { options = {}; }
        if (ratio <= 0) {
            return this.start.clone();
        }
        if (ratio >= 1) {
            return this.end.clone();
        }
        var t = this.tAt(ratio, options);
        return this.pointAtT(t);
    };
    Curve.prototype.pointAtLength = function (length, options) {
        if (options === void 0) { options = {}; }
        var t = this.tAtLength(length, options);
        return this.pointAtT(t);
    };
    Curve.prototype.pointAtT = function (t) {
        if (t <= 0) {
            return this.start.clone();
        }
        if (t >= 1) {
            return this.end.clone();
        }
        return this.getSkeletonPoints(t).divider;
    };
    Curve.prototype.isDifferentiable = function () {
        var start = this.start;
        var control1 = this.controlPoint1;
        var control2 = this.controlPoint2;
        var end = this.end;
        return !(start.equals(control1) &&
            control1.equals(control2) &&
            control2.equals(end));
    };
    Curve.prototype.tangentAt = function (ratio, options) {
        if (options === void 0) { options = {}; }
        if (!this.isDifferentiable())
            return null;
        if (ratio < 0) {
            ratio = 0; // eslint-disable-line
        }
        else if (ratio > 1) {
            ratio = 1; // eslint-disable-line
        }
        var t = this.tAt(ratio, options);
        return this.tangentAtT(t);
    };
    Curve.prototype.tangentAtLength = function (length, options) {
        if (options === void 0) { options = {}; }
        if (!this.isDifferentiable()) {
            return null;
        }
        var t = this.tAtLength(length, options);
        return this.tangentAtT(t);
    };
    Curve.prototype.tangentAtT = function (t) {
        if (!this.isDifferentiable()) {
            return null;
        }
        if (t < 0) {
            t = 0; // eslint-disable-line
        }
        if (t > 1) {
            t = 1; // eslint-disable-line
        }
        var skeletonPoints = this.getSkeletonPoints(t);
        var p1 = skeletonPoints.startControlPoint2;
        var p2 = skeletonPoints.dividerControlPoint1;
        var tangentStart = skeletonPoints.divider;
        var tangentLine = new line_1.Line(p1, p2);
        // move so that tangent line starts at the point requested
        tangentLine.translate(tangentStart.x - p1.x, tangentStart.y - p1.y);
        return tangentLine;
    };
    Curve.prototype.getPrecision = function (options) {
        if (options === void 0) { options = {}; }
        return options.precision == null ? this.PRECISION : options.precision;
    };
    Curve.prototype.getDivisions = function (options) {
        if (options === void 0) { options = {}; }
        if (options.subdivisions != null) {
            return options.subdivisions;
        }
        var precision = this.getPrecision(options);
        return this.getSubdivisions({ precision: precision });
    };
    Curve.prototype.getOptions = function (options) {
        if (options === void 0) { options = {}; }
        var precision = this.getPrecision(options);
        var subdivisions = this.getDivisions(options);
        return { precision: precision, subdivisions: subdivisions };
    };
    Curve.prototype.tAt = function (ratio, options) {
        if (options === void 0) { options = {}; }
        if (ratio <= 0) {
            return 0;
        }
        if (ratio >= 1) {
            return 1;
        }
        var opts = this.getOptions(options);
        var total = this.length(opts);
        var length = total * ratio;
        return this.tAtLength(length, opts);
    };
    Curve.prototype.tAtLength = function (length, options) {
        if (options === void 0) { options = {}; }
        var fromStart = true;
        if (length < 0) {
            fromStart = false;
            length = -length; // eslint-disable-line
        }
        var precision = this.getPrecision(options);
        var subdivisions = this.getDivisions(options);
        var opts = { precision: precision, subdivisions: subdivisions };
        var investigatedSubdivision = null;
        var investigatedSubdivisionStartT;
        var investigatedSubdivisionEndT;
        var baselinePointDistFromStart = 0;
        var baselinePointDistFromEnd = 0;
        var memo = 0;
        var count = subdivisions.length;
        var piece = count > 0 ? 1 / count : 0;
        for (var i = 0; i < count; i += 1) {
            var index = fromStart ? i : count - 1 - i;
            var division = subdivisions[i];
            var dist = division.endpointDistance();
            if (length <= memo + dist) {
                investigatedSubdivision = division;
                investigatedSubdivisionStartT = index * piece;
                investigatedSubdivisionEndT = (index + 1) * piece;
                baselinePointDistFromStart = fromStart
                    ? length - memo
                    : dist + memo - length;
                baselinePointDistFromEnd = fromStart
                    ? dist + memo - length
                    : length - memo;
                break;
            }
            memo += dist;
        }
        if (investigatedSubdivision == null) {
            return fromStart ? 1 : 0;
        }
        // note that precision affects what length is recorded
        // (imprecise measurements underestimate length by up to 10^(-precision) of the precise length)
        // e.g. at precision 1, the length may be underestimated by up to 10% and cause this function to return 1
        var total = this.length(opts);
        var precisionRatio = Math.pow(10, -precision); // eslint-disable-line
        // recursively divide investigated subdivision:
        // until distance between baselinePoint and closest path endpoint is within 10^(-precision)
        // then return the closest endpoint of that final subdivision
        // eslint-disable-next-line
        while (true) {
            var ratio = void 0;
            ratio = total !== 0 ? baselinePointDistFromStart / total : 0;
            if (ratio < precisionRatio) {
                return investigatedSubdivisionStartT;
            }
            ratio = total !== 0 ? baselinePointDistFromEnd / total : 0;
            if (ratio < precisionRatio) {
                return investigatedSubdivisionEndT;
            }
            // otherwise, set up for next iteration
            var newBaselinePointDistFromStart = void 0;
            var newBaselinePointDistFromEnd = void 0;
            var divided = investigatedSubdivision.divide(0.5);
            piece /= 2;
            var baseline1Length = divided[0].endpointDistance();
            var baseline2Length = divided[1].endpointDistance();
            if (baselinePointDistFromStart <= baseline1Length) {
                investigatedSubdivision = divided[0];
                investigatedSubdivisionEndT -= piece;
                newBaselinePointDistFromStart = baselinePointDistFromStart;
                newBaselinePointDistFromEnd =
                    baseline1Length - newBaselinePointDistFromStart;
            }
            else {
                investigatedSubdivision = divided[1];
                investigatedSubdivisionStartT += piece;
                newBaselinePointDistFromStart =
                    baselinePointDistFromStart - baseline1Length;
                newBaselinePointDistFromEnd =
                    baseline2Length - newBaselinePointDistFromStart;
            }
            baselinePointDistFromStart = newBaselinePointDistFromStart;
            baselinePointDistFromEnd = newBaselinePointDistFromEnd;
        }
    };
    Curve.prototype.toPoints = function (options) {
        if (options === void 0) { options = {}; }
        var subdivisions = this.getDivisions(options);
        var points = [subdivisions[0].start.clone()];
        subdivisions.forEach(function (c) { return points.push(c.end.clone()); });
        return points;
    };
    Curve.prototype.toPolyline = function (options) {
        if (options === void 0) { options = {}; }
        return new polyline_1.Polyline(this.toPoints(options));
    };
    Curve.prototype.scale = function (sx, sy, origin) {
        this.start.scale(sx, sy, origin);
        this.controlPoint1.scale(sx, sy, origin);
        this.controlPoint2.scale(sx, sy, origin);
        this.end.scale(sx, sy, origin);
        return this;
    };
    Curve.prototype.rotate = function (angle, origin) {
        this.start.rotate(angle, origin);
        this.controlPoint1.rotate(angle, origin);
        this.controlPoint2.rotate(angle, origin);
        this.end.rotate(angle, origin);
        return this;
    };
    Curve.prototype.translate = function (tx, ty) {
        if (typeof tx === 'number') {
            this.start.translate(tx, ty);
            this.controlPoint1.translate(tx, ty);
            this.controlPoint2.translate(tx, ty);
            this.end.translate(tx, ty);
        }
        else {
            this.start.translate(tx);
            this.controlPoint1.translate(tx);
            this.controlPoint2.translate(tx);
            this.end.translate(tx);
        }
        return this;
    };
    Curve.prototype.equals = function (c) {
        return (c != null &&
            this.start.equals(c.start) &&
            this.controlPoint1.equals(c.controlPoint1) &&
            this.controlPoint2.equals(c.controlPoint2) &&
            this.end.equals(c.end));
    };
    Curve.prototype.clone = function () {
        return new Curve(this.start, this.controlPoint1, this.controlPoint2, this.end);
    };
    Curve.prototype.toJSON = function () {
        return {
            start: this.start.toJSON(),
            controlPoint1: this.controlPoint1.toJSON(),
            controlPoint2: this.controlPoint2.toJSON(),
            end: this.end.toJSON(),
        };
    };
    Curve.prototype.serialize = function () {
        return [
            this.start.serialize(),
            this.controlPoint1.serialize(),
            this.controlPoint2.serialize(),
            this.end.serialize(),
        ].join(' ');
    };
    return Curve;
}(geometry_1.Geometry));
exports.Curve = Curve;
(function (Curve) {
    Curve.toStringTag = "X6.Geometry." + Curve.name;
    function isCurve(instance) {
        if (instance == null) {
            return false;
        }
        if (instance instanceof Curve) {
            return true;
        }
        var tag = instance[Symbol.toStringTag];
        var curve = instance;
        try {
            if ((tag == null || tag === Curve.toStringTag) &&
                point_1.Point.isPoint(curve.start) &&
                point_1.Point.isPoint(curve.controlPoint1) &&
                point_1.Point.isPoint(curve.controlPoint2) &&
                point_1.Point.isPoint(curve.end) &&
                typeof curve.toPoints === 'function' &&
                typeof curve.toPolyline === 'function') {
                return true;
            }
        }
        catch (e) {
            return false;
        }
        return false;
    }
    Curve.isCurve = isCurve;
})(Curve = exports.Curve || (exports.Curve = {}));
exports.Curve = Curve;
(function (Curve) {
    function getFirstControlPoints(rhs) {
        var n = rhs.length;
        var x = []; // `x` is a solution vector.
        var tmp = [];
        var b = 2.0;
        x[0] = rhs[0] / b;
        // Decomposition and forward substitution.
        for (var i = 1; i < n; i += 1) {
            tmp[i] = 1 / b;
            b = (i < n - 1 ? 4.0 : 3.5) - tmp[i];
            x[i] = (rhs[i] - x[i - 1]) / b;
        }
        for (var i = 1; i < n; i += 1) {
            // Backsubstitution.
            x[n - i - 1] -= tmp[n - i] * x[n - i];
        }
        return x;
    }
    function getCurveControlPoints(points) {
        var knots = points.map(function (p) { return point_1.Point.clone(p); });
        var firstControlPoints = [];
        var secondControlPoints = [];
        var n = knots.length - 1;
        // Special case: Bezier curve should be a straight line.
        if (n === 1) {
            // 3P1 = 2P0 + P3
            firstControlPoints[0] = new point_1.Point((2 * knots[0].x + knots[1].x) / 3, (2 * knots[0].y + knots[1].y) / 3);
            // P2 = 2P1 – P0
            secondControlPoints[0] = new point_1.Point(2 * firstControlPoints[0].x - knots[0].x, 2 * firstControlPoints[0].y - knots[0].y);
            return [firstControlPoints, secondControlPoints];
        }
        // Calculate first Bezier control points.
        // Right hand side vector.
        var rhs = [];
        // Set right hand side X values.
        for (var i = 1; i < n - 1; i += 1) {
            rhs[i] = 4 * knots[i].x + 2 * knots[i + 1].x;
        }
        rhs[0] = knots[0].x + 2 * knots[1].x;
        rhs[n - 1] = (8 * knots[n - 1].x + knots[n].x) / 2.0;
        // Get first control points X-values.
        var x = getFirstControlPoints(rhs);
        // Set right hand side Y values.
        for (var i = 1; i < n - 1; i += 1) {
            rhs[i] = 4 * knots[i].y + 2 * knots[i + 1].y;
        }
        rhs[0] = knots[0].y + 2 * knots[1].y;
        rhs[n - 1] = (8 * knots[n - 1].y + knots[n].y) / 2.0;
        // Get first control points Y-values.
        var y = getFirstControlPoints(rhs);
        // Fill output arrays.
        for (var i = 0; i < n; i += 1) {
            // First control point.
            firstControlPoints.push(new point_1.Point(x[i], y[i]));
            // Second control point.
            if (i < n - 1) {
                secondControlPoints.push(new point_1.Point(2 * knots[i + 1].x - x[i + 1], 2 * knots[i + 1].y - y[i + 1]));
            }
            else {
                secondControlPoints.push(new point_1.Point((knots[n].x + x[n - 1]) / 2, (knots[n].y + y[n - 1]) / 2));
            }
        }
        return [firstControlPoints, secondControlPoints];
    }
    function throughPoints(points) {
        if (points == null || (Array.isArray(points) && points.length < 2)) {
            throw new Error('At least 2 points are required');
        }
        var controlPoints = getCurveControlPoints(points);
        var curves = [];
        for (var i = 0, ii = controlPoints[0].length; i < ii; i += 1) {
            var controlPoint1 = new point_1.Point(controlPoints[0][i].x, controlPoints[0][i].y);
            var controlPoint2 = new point_1.Point(controlPoints[1][i].x, controlPoints[1][i].y);
            curves.push(new Curve(points[i], controlPoint1, controlPoint2, points[i + 1]));
        }
        return curves;
    }
    Curve.throughPoints = throughPoints;
})(Curve = exports.Curve || (exports.Curve = {}));
exports.Curve = Curve;
//# sourceMappingURL=curve.js.map