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
exports.MoveTo = void 0;
var line_1 = require("../line");
var curve_1 = require("../curve");
var point_1 = require("../point");
var lineto_1 = require("./lineto");
var segment_1 = require("./segment");
var MoveTo = /** @class */ (function (_super) {
    __extends(MoveTo, _super);
    function MoveTo(x, y) {
        var _this = _super.call(this) || this;
        _this.isVisible = false;
        _this.isSubpathStart = true;
        if (line_1.Line.isLine(x) || curve_1.Curve.isCurve(x)) {
            _this.endPoint = x.end.clone().round(2);
        }
        else {
            _this.endPoint = point_1.Point.create(x, y).round(2);
        }
        return _this;
    }
    Object.defineProperty(MoveTo.prototype, "start", {
        get: function () {
            throw new Error('Illegal access. Moveto segments should not need a start property.');
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(MoveTo.prototype, "type", {
        get: function () {
            return 'M';
        },
        enumerable: false,
        configurable: true
    });
    MoveTo.prototype.bbox = function () {
        return null;
    };
    MoveTo.prototype.closestPoint = function () {
        return this.end.clone();
    };
    MoveTo.prototype.closestPointLength = function () {
        return 0;
    };
    MoveTo.prototype.closestPointNormalizedLength = function () {
        return 0;
    };
    MoveTo.prototype.closestPointT = function () {
        return 1;
    };
    MoveTo.prototype.closestPointTangent = function () {
        return null;
    };
    MoveTo.prototype.length = function () {
        return 0;
    };
    MoveTo.prototype.lengthAtT = function () {
        return 0;
    };
    MoveTo.prototype.divideAt = function () {
        return [this.clone(), this.clone()];
    };
    MoveTo.prototype.divideAtLength = function () {
        return [this.clone(), this.clone()];
    };
    MoveTo.prototype.getSubdivisions = function () {
        return [];
    };
    MoveTo.prototype.pointAt = function () {
        return this.end.clone();
    };
    MoveTo.prototype.pointAtLength = function () {
        return this.end.clone();
    };
    MoveTo.prototype.pointAtT = function () {
        return this.end.clone();
    };
    MoveTo.prototype.tangentAt = function () {
        return null;
    };
    MoveTo.prototype.tangentAtLength = function () {
        return null;
    };
    MoveTo.prototype.tangentAtT = function () {
        return null;
    };
    MoveTo.prototype.isDifferentiable = function () {
        return false;
    };
    MoveTo.prototype.scale = function (sx, sy, origin) {
        this.end.scale(sx, sy, origin);
        return this;
    };
    MoveTo.prototype.rotate = function (angle, origin) {
        this.end.rotate(angle, origin);
        return this;
    };
    MoveTo.prototype.translate = function (tx, ty) {
        if (typeof tx === 'number') {
            this.end.translate(tx, ty);
        }
        else {
            this.end.translate(tx);
        }
        return this;
    };
    MoveTo.prototype.clone = function () {
        return new MoveTo(this.end);
    };
    MoveTo.prototype.equals = function (s) {
        return this.type === s.type && this.end.equals(s.end);
    };
    MoveTo.prototype.toJSON = function () {
        return {
            type: this.type,
            end: this.end.toJSON(),
        };
    };
    MoveTo.prototype.serialize = function () {
        var end = this.end;
        return this.type + " " + end.x + " " + end.y;
    };
    return MoveTo;
}(segment_1.Segment));
exports.MoveTo = MoveTo;
(function (MoveTo) {
    function create() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var len = args.length;
        var arg0 = args[0];
        // line provided
        if (line_1.Line.isLine(arg0)) {
            return new MoveTo(arg0);
        }
        // curve provided
        if (curve_1.Curve.isCurve(arg0)) {
            return new MoveTo(arg0);
        }
        // points provided
        if (point_1.Point.isPointLike(arg0)) {
            if (len === 1) {
                return new MoveTo(arg0);
            }
            // this is a moveto-with-subsequent-poly-line segment
            var segments_1 = [];
            // points come one by one
            for (var i = 0; i < len; i += 1) {
                if (i === 0) {
                    segments_1.push(new MoveTo(args[i]));
                }
                else {
                    segments_1.push(new lineto_1.LineTo(args[i]));
                }
            }
            return segments_1;
        }
        // coordinates provided
        if (len === 2) {
            return new MoveTo(+args[0], +args[1]);
        }
        // this is a moveto-with-subsequent-poly-line segment
        var segments = [];
        for (var i = 0; i < len; i += 2) {
            var x = +args[i];
            var y = +args[i + 1];
            if (i === 0) {
                segments.push(new MoveTo(x, y));
            }
            else {
                segments.push(new lineto_1.LineTo(x, y));
            }
        }
        return segments;
    }
    MoveTo.create = create;
})(MoveTo = exports.MoveTo || (exports.MoveTo = {}));
exports.MoveTo = MoveTo;
//# sourceMappingURL=moveto.js.map