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
exports.LineTo = void 0;
var line_1 = require("../line");
var point_1 = require("../point");
var segment_1 = require("./segment");
var LineTo = /** @class */ (function (_super) {
    __extends(LineTo, _super);
    function LineTo(x, y) {
        var _this = _super.call(this) || this;
        if (line_1.Line.isLine(x)) {
            _this.endPoint = x.end.clone().round(2);
        }
        else {
            _this.endPoint = point_1.Point.create(x, y).round(2);
        }
        return _this;
    }
    Object.defineProperty(LineTo.prototype, "type", {
        get: function () {
            return 'L';
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(LineTo.prototype, "line", {
        get: function () {
            return new line_1.Line(this.start, this.end);
        },
        enumerable: false,
        configurable: true
    });
    LineTo.prototype.bbox = function () {
        return this.line.bbox();
    };
    LineTo.prototype.closestPoint = function (p) {
        return this.line.closestPoint(p);
    };
    LineTo.prototype.closestPointLength = function (p) {
        return this.line.closestPointLength(p);
    };
    LineTo.prototype.closestPointNormalizedLength = function (p) {
        return this.line.closestPointNormalizedLength(p);
    };
    LineTo.prototype.closestPointTangent = function (p) {
        return this.line.closestPointTangent(p);
    };
    LineTo.prototype.length = function () {
        return this.line.length();
    };
    LineTo.prototype.divideAt = function (ratio) {
        var divided = this.line.divideAt(ratio);
        return [new LineTo(divided[0]), new LineTo(divided[1])];
    };
    LineTo.prototype.divideAtLength = function (length) {
        var divided = this.line.divideAtLength(length);
        return [new LineTo(divided[0]), new LineTo(divided[1])];
    };
    LineTo.prototype.getSubdivisions = function () {
        return [];
    };
    LineTo.prototype.pointAt = function (ratio) {
        return this.line.pointAt(ratio);
    };
    LineTo.prototype.pointAtLength = function (length) {
        return this.line.pointAtLength(length);
    };
    LineTo.prototype.tangentAt = function (ratio) {
        return this.line.tangentAt(ratio);
    };
    LineTo.prototype.tangentAtLength = function (length) {
        return this.line.tangentAtLength(length);
    };
    LineTo.prototype.isDifferentiable = function () {
        if (this.previousSegment == null) {
            return false;
        }
        return !this.start.equals(this.end);
    };
    LineTo.prototype.clone = function () {
        return new LineTo(this.end);
    };
    LineTo.prototype.scale = function (sx, sy, origin) {
        this.end.scale(sx, sy, origin);
        return this;
    };
    LineTo.prototype.rotate = function (angle, origin) {
        this.end.rotate(angle, origin);
        return this;
    };
    LineTo.prototype.translate = function (tx, ty) {
        if (typeof tx === 'number') {
            this.end.translate(tx, ty);
        }
        else {
            this.end.translate(tx);
        }
        return this;
    };
    LineTo.prototype.equals = function (s) {
        return (this.type === s.type &&
            this.start.equals(s.start) &&
            this.end.equals(s.end));
    };
    LineTo.prototype.toJSON = function () {
        return {
            type: this.type,
            start: this.start.toJSON(),
            end: this.end.toJSON(),
        };
    };
    LineTo.prototype.serialize = function () {
        var end = this.end;
        return this.type + " " + end.x + " " + end.y;
    };
    return LineTo;
}(segment_1.Segment));
exports.LineTo = LineTo;
(function (LineTo) {
    function create() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var len = args.length;
        var arg0 = args[0];
        // line provided
        if (line_1.Line.isLine(arg0)) {
            return new LineTo(arg0);
        }
        // points provided
        if (point_1.Point.isPointLike(arg0)) {
            if (len === 1) {
                return new LineTo(arg0);
            }
            // poly-line segment
            return args.map(function (arg) { return new LineTo(arg); });
        }
        // coordinates provided
        if (len === 2) {
            return new LineTo(+args[0], +args[1]);
        }
        // poly-line segment
        var segments = [];
        for (var i = 0; i < len; i += 2) {
            var x = +args[i];
            var y = +args[i + 1];
            segments.push(new LineTo(x, y));
        }
        return segments;
    }
    LineTo.create = create;
})(LineTo = exports.LineTo || (exports.LineTo = {}));
exports.LineTo = LineTo;
//# sourceMappingURL=lineto.js.map