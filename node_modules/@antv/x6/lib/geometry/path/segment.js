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
exports.Segment = void 0;
var geometry_1 = require("../geometry");
var Segment = /** @class */ (function (_super) {
    __extends(Segment, _super);
    function Segment() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.isVisible = true;
        _this.isSegment = true;
        _this.isSubpathStart = false;
        return _this;
    }
    Object.defineProperty(Segment.prototype, "end", {
        get: function () {
            return this.endPoint;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Segment.prototype, "start", {
        get: function () {
            if (this.previousSegment == null) {
                throw new Error('Missing previous segment. (This segment cannot be the ' +
                    'first segment of a path, or segment has not yet been ' +
                    'added to a path.)');
            }
            return this.previousSegment.end;
        },
        enumerable: false,
        configurable: true
    });
    Segment.prototype.closestPointT = function (p, options) {
        if (this.closestPointNormalizedLength) {
            return this.closestPointNormalizedLength(p);
        }
        throw new Error('Neither `closestPointT` nor `closestPointNormalizedLength` method is implemented.');
    };
    // eslint-disable-next-line
    Segment.prototype.lengthAtT = function (t, options) {
        if (t <= 0) {
            return 0;
        }
        var length = this.length();
        if (t >= 1) {
            return length;
        }
        return length * t;
    };
    Segment.prototype.divideAtT = function (t) {
        if (this.divideAt) {
            return this.divideAt(t);
        }
        throw new Error('Neither `divideAtT` nor `divideAt` method is implemented.');
    };
    Segment.prototype.pointAtT = function (t) {
        if (this.pointAt) {
            return this.pointAt(t);
        }
        throw new Error('Neither `pointAtT` nor `pointAt` method is implemented.');
    };
    Segment.prototype.tangentAtT = function (t) {
        if (this.tangentAt) {
            return this.tangentAt(t);
        }
        throw new Error('Neither `tangentAtT` nor `tangentAt` method is implemented.');
    };
    return Segment;
}(geometry_1.Geometry));
exports.Segment = Segment;
//# sourceMappingURL=segment.js.map