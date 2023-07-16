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
exports.Close = void 0;
var line_1 = require("../line");
var lineto_1 = require("./lineto");
var segment_1 = require("./segment");
var Close = /** @class */ (function (_super) {
    __extends(Close, _super);
    function Close() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(Close.prototype, "end", {
        get: function () {
            if (!this.subpathStartSegment) {
                throw new Error('Missing subpath start segment. (This segment needs a subpath ' +
                    'start segment (e.g. MoveTo), or segment has not yet been added' +
                    ' to a path.)');
            }
            return this.subpathStartSegment.end;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Close.prototype, "type", {
        get: function () {
            return 'Z';
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Close.prototype, "line", {
        get: function () {
            return new line_1.Line(this.start, this.end);
        },
        enumerable: false,
        configurable: true
    });
    Close.prototype.bbox = function () {
        return this.line.bbox();
    };
    Close.prototype.closestPoint = function (p) {
        return this.line.closestPoint(p);
    };
    Close.prototype.closestPointLength = function (p) {
        return this.line.closestPointLength(p);
    };
    Close.prototype.closestPointNormalizedLength = function (p) {
        return this.line.closestPointNormalizedLength(p);
    };
    Close.prototype.closestPointTangent = function (p) {
        return this.line.closestPointTangent(p);
    };
    Close.prototype.length = function () {
        return this.line.length();
    };
    Close.prototype.divideAt = function (ratio) {
        var divided = this.line.divideAt(ratio);
        return [
            // do not actually cut into the segment, first divided part can stay as Z
            divided[1].isDifferentiable() ? new lineto_1.LineTo(divided[0]) : this.clone(),
            new lineto_1.LineTo(divided[1]),
        ];
    };
    Close.prototype.divideAtLength = function (length) {
        var divided = this.line.divideAtLength(length);
        return [
            divided[1].isDifferentiable() ? new lineto_1.LineTo(divided[0]) : this.clone(),
            new lineto_1.LineTo(divided[1]),
        ];
    };
    Close.prototype.getSubdivisions = function () {
        return [];
    };
    Close.prototype.pointAt = function (ratio) {
        return this.line.pointAt(ratio);
    };
    Close.prototype.pointAtLength = function (length) {
        return this.line.pointAtLength(length);
    };
    Close.prototype.tangentAt = function (ratio) {
        return this.line.tangentAt(ratio);
    };
    Close.prototype.tangentAtLength = function (length) {
        return this.line.tangentAtLength(length);
    };
    Close.prototype.isDifferentiable = function () {
        if (!this.previousSegment || !this.subpathStartSegment) {
            return false;
        }
        return !this.start.equals(this.end);
    };
    Close.prototype.scale = function () {
        return this;
    };
    Close.prototype.rotate = function () {
        return this;
    };
    Close.prototype.translate = function () {
        return this;
    };
    Close.prototype.equals = function (s) {
        return (this.type === s.type &&
            this.start.equals(s.start) &&
            this.end.equals(s.end));
    };
    Close.prototype.clone = function () {
        return new Close();
    };
    Close.prototype.toJSON = function () {
        return {
            type: this.type,
            start: this.start.toJSON(),
            end: this.end.toJSON(),
        };
    };
    Close.prototype.serialize = function () {
        return this.type;
    };
    return Close;
}(segment_1.Segment));
exports.Close = Close;
(function (Close) {
    function create() {
        return new Close();
    }
    Close.create = create;
})(Close = exports.Close || (exports.Close = {}));
exports.Close = Close;
//# sourceMappingURL=close.js.map