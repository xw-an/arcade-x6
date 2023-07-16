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
exports.CurveTo = void 0;
var curve_1 = require("../curve");
var point_1 = require("../point");
var segment_1 = require("./segment");
var CurveTo = /** @class */ (function (_super) {
    __extends(CurveTo, _super);
    function CurveTo(arg0, arg1, arg2, arg3, arg4, arg5) {
        var _this = _super.call(this) || this;
        if (curve_1.Curve.isCurve(arg0)) {
            _this.controlPoint1 = arg0.controlPoint1.clone().round(2);
            _this.controlPoint2 = arg0.controlPoint2.clone().round(2);
            _this.endPoint = arg0.end.clone().round(2);
        }
        else if (typeof arg0 === 'number') {
            _this.controlPoint1 = new point_1.Point(arg0, arg1).round(2);
            _this.controlPoint2 = new point_1.Point(arg2, arg3).round(2);
            _this.endPoint = new point_1.Point(arg4, arg5).round(2);
        }
        else {
            _this.controlPoint1 = point_1.Point.create(arg0).round(2);
            _this.controlPoint2 = point_1.Point.create(arg1).round(2);
            _this.endPoint = point_1.Point.create(arg2).round(2);
        }
        return _this;
    }
    Object.defineProperty(CurveTo.prototype, "type", {
        get: function () {
            return 'C';
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CurveTo.prototype, "curve", {
        get: function () {
            return new curve_1.Curve(this.start, this.controlPoint1, this.controlPoint2, this.end);
        },
        enumerable: false,
        configurable: true
    });
    CurveTo.prototype.bbox = function () {
        return this.curve.bbox();
    };
    CurveTo.prototype.closestPoint = function (p) {
        return this.curve.closestPoint(p);
    };
    CurveTo.prototype.closestPointLength = function (p) {
        return this.curve.closestPointLength(p);
    };
    CurveTo.prototype.closestPointNormalizedLength = function (p) {
        return this.curve.closestPointNormalizedLength(p);
    };
    CurveTo.prototype.closestPointTangent = function (p) {
        return this.curve.closestPointTangent(p);
    };
    CurveTo.prototype.length = function () {
        return this.curve.length();
    };
    CurveTo.prototype.divideAt = function (ratio, options) {
        if (options === void 0) { options = {}; }
        // TODO: fix options
        var divided = this.curve.divideAt(ratio, options);
        return [new CurveTo(divided[0]), new CurveTo(divided[1])];
    };
    CurveTo.prototype.divideAtLength = function (length, options) {
        if (options === void 0) { options = {}; }
        // TODO: fix options
        var divided = this.curve.divideAtLength(length, options);
        return [new CurveTo(divided[0]), new CurveTo(divided[1])];
    };
    CurveTo.prototype.divideAtT = function (t) {
        var divided = this.curve.divideAtT(t);
        return [new CurveTo(divided[0]), new CurveTo(divided[1])];
    };
    CurveTo.prototype.getSubdivisions = function () {
        return [];
    };
    CurveTo.prototype.pointAt = function (ratio) {
        return this.curve.pointAt(ratio);
    };
    CurveTo.prototype.pointAtLength = function (length) {
        return this.curve.pointAtLength(length);
    };
    CurveTo.prototype.tangentAt = function (ratio) {
        return this.curve.tangentAt(ratio);
    };
    CurveTo.prototype.tangentAtLength = function (length) {
        return this.curve.tangentAtLength(length);
    };
    CurveTo.prototype.isDifferentiable = function () {
        if (!this.previousSegment) {
            return false;
        }
        var start = this.start;
        var control1 = this.controlPoint1;
        var control2 = this.controlPoint2;
        var end = this.end;
        return !(start.equals(control1) &&
            control1.equals(control2) &&
            control2.equals(end));
    };
    CurveTo.prototype.scale = function (sx, sy, origin) {
        this.controlPoint1.scale(sx, sy, origin);
        this.controlPoint2.scale(sx, sy, origin);
        this.end.scale(sx, sy, origin);
        return this;
    };
    CurveTo.prototype.rotate = function (angle, origin) {
        this.controlPoint1.rotate(angle, origin);
        this.controlPoint2.rotate(angle, origin);
        this.end.rotate(angle, origin);
        return this;
    };
    CurveTo.prototype.translate = function (tx, ty) {
        if (typeof tx === 'number') {
            this.controlPoint1.translate(tx, ty);
            this.controlPoint2.translate(tx, ty);
            this.end.translate(tx, ty);
        }
        else {
            this.controlPoint1.translate(tx);
            this.controlPoint2.translate(tx);
            this.end.translate(tx);
        }
        return this;
    };
    CurveTo.prototype.equals = function (s) {
        return (this.start.equals(s.start) &&
            this.end.equals(s.end) &&
            this.controlPoint1.equals(s.controlPoint1) &&
            this.controlPoint2.equals(s.controlPoint2));
    };
    CurveTo.prototype.clone = function () {
        return new CurveTo(this.controlPoint1, this.controlPoint2, this.end);
    };
    CurveTo.prototype.toJSON = function () {
        return {
            type: this.type,
            start: this.start.toJSON(),
            controlPoint1: this.controlPoint1.toJSON(),
            controlPoint2: this.controlPoint2.toJSON(),
            end: this.end.toJSON(),
        };
    };
    CurveTo.prototype.serialize = function () {
        var c1 = this.controlPoint1;
        var c2 = this.controlPoint2;
        var end = this.end;
        return [this.type, c1.x, c1.y, c2.x, c2.y, end.x, end.y].join(' ');
    };
    return CurveTo;
}(segment_1.Segment));
exports.CurveTo = CurveTo;
(function (CurveTo) {
    function create() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var len = args.length;
        var arg0 = args[0];
        // curve provided
        if (curve_1.Curve.isCurve(arg0)) {
            return new CurveTo(arg0);
        }
        // points provided
        if (point_1.Point.isPointLike(arg0)) {
            if (len === 3) {
                return new CurveTo(args[0], args[1], args[2]);
            }
            // this is a poly-bezier segment
            var segments_1 = [];
            for (var i = 0; i < len; i += 3) {
                segments_1.push(new CurveTo(args[i], args[i + 1], args[i + 2]));
            }
            return segments_1;
        }
        // coordinates provided
        if (len === 6) {
            return new CurveTo(args[0], args[1], args[2], args[3], args[4], args[5]);
        }
        // this is a poly-bezier segment
        var segments = [];
        for (var i = 0; i < len; i += 6) {
            segments.push(new CurveTo(args[i], args[i + 1], args[i + 2], args[i + 3], args[i + 4], args[i + 5]));
        }
        return segments;
    }
    CurveTo.create = create;
})(CurveTo = exports.CurveTo || (exports.CurveTo = {}));
exports.CurveTo = CurveTo;
//# sourceMappingURL=curveto.js.map