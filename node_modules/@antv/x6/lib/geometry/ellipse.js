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
exports.Ellipse = void 0;
var point_1 = require("./point");
var rectangle_1 = require("./rectangle");
var geometry_1 = require("./geometry");
var Ellipse = /** @class */ (function (_super) {
    __extends(Ellipse, _super);
    function Ellipse(x, y, a, b) {
        var _this = _super.call(this) || this;
        _this.x = x == null ? 0 : x;
        _this.y = y == null ? 0 : y;
        _this.a = a == null ? 0 : a;
        _this.b = b == null ? 0 : b;
        return _this;
    }
    Object.defineProperty(Ellipse.prototype, Symbol.toStringTag, {
        get: function () {
            return Ellipse.toStringTag;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Ellipse.prototype, "center", {
        get: function () {
            return new point_1.Point(this.x, this.y);
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Returns a rectangle that is the bounding box of the ellipse.
     */
    Ellipse.prototype.bbox = function () {
        return rectangle_1.Rectangle.fromEllipse(this);
    };
    /**
     * Returns a point that is the center of the ellipse.
     */
    Ellipse.prototype.getCenter = function () {
        return this.center;
    };
    Ellipse.prototype.inflate = function (dx, dy) {
        var w = dx;
        var h = dy != null ? dy : dx;
        this.a += 2 * w;
        this.b += 2 * h;
        return this;
    };
    Ellipse.prototype.normalizedDistance = function (x, y) {
        var ref = point_1.Point.create(x, y);
        var dx = ref.x - this.x;
        var dy = ref.y - this.y;
        var a = this.a;
        var b = this.b;
        return (dx * dx) / (a * a) + (dy * dy) / (b * b);
    };
    Ellipse.prototype.containsPoint = function (x, y) {
        return this.normalizedDistance(x, y) <= 1;
    };
    /**
     * Returns an array of the intersection points of the ellipse and the line.
     * Returns `null` if no intersection exists.
     */
    Ellipse.prototype.intersectsWithLine = function (line) {
        var intersections = [];
        var rx = this.a;
        var ry = this.b;
        var a1 = line.start;
        var a2 = line.end;
        var dir = line.vector();
        var diff = a1.diff(new point_1.Point(this.x, this.y));
        var mDir = new point_1.Point(dir.x / (rx * rx), dir.y / (ry * ry));
        var mDiff = new point_1.Point(diff.x / (rx * rx), diff.y / (ry * ry));
        var a = dir.dot(mDir);
        var b = dir.dot(mDiff);
        var c = diff.dot(mDiff) - 1.0;
        var d = b * b - a * c;
        if (d < 0) {
            return null;
        }
        if (d > 0) {
            var root = Math.sqrt(d);
            var ta = (-b - root) / a;
            var tb = (-b + root) / a;
            if ((ta < 0 || ta > 1) && (tb < 0 || tb > 1)) {
                // outside
                return null;
            }
            if (ta >= 0 && ta <= 1) {
                intersections.push(a1.lerp(a2, ta));
            }
            if (tb >= 0 && tb <= 1) {
                intersections.push(a1.lerp(a2, tb));
            }
        }
        else {
            var t = -b / a;
            if (t >= 0 && t <= 1) {
                intersections.push(a1.lerp(a2, t));
            }
            else {
                // outside
                return null;
            }
        }
        return intersections;
    };
    /**
     * Returns the point on the boundary of the ellipse that is the
     * intersection of the ellipse with a line starting in the center
     * of the ellipse ending in the point `p`.
     *
     * If angle is specified, the intersection will take into account
     * the rotation of the ellipse by angle degrees around its center.
     */
    Ellipse.prototype.intersectsWithLineFromCenterToPoint = function (p, angle) {
        if (angle === void 0) { angle = 0; }
        var ref = point_1.Point.clone(p);
        if (angle) {
            ref.rotate(angle, this.getCenter());
        }
        var dx = ref.x - this.x;
        var dy = ref.y - this.y;
        var result;
        if (dx === 0) {
            result = this.bbox().getNearestPointToPoint(ref);
            if (angle) {
                return result.rotate(-angle, this.getCenter());
            }
            return result;
        }
        var m = dy / dx;
        var mSquared = m * m;
        var aSquared = this.a * this.a;
        var bSquared = this.b * this.b;
        var x = Math.sqrt(1 / (1 / aSquared + mSquared / bSquared));
        x = dx < 0 ? -x : x;
        var y = m * x;
        result = new point_1.Point(this.x + x, this.y + y);
        if (angle) {
            return result.rotate(-angle, this.getCenter());
        }
        return result;
    };
    /**
     * Returns the angle between the x-axis and the tangent from a point. It is
     * valid for points lying on the ellipse boundary only.
     */
    Ellipse.prototype.tangentTheta = function (p) {
        var ref = point_1.Point.clone(p);
        var x0 = ref.x;
        var y0 = ref.y;
        var a = this.a;
        var b = this.b;
        var center = this.bbox().center;
        var cx = center.x;
        var cy = center.y;
        var refPointDelta = 30;
        var q1 = x0 > center.x + a / 2;
        var q3 = x0 < center.x - a / 2;
        var x;
        var y;
        if (q1 || q3) {
            y = x0 > center.x ? y0 - refPointDelta : y0 + refPointDelta;
            x =
                (a * a) / (x0 - cx) -
                    (a * a * (y0 - cy) * (y - cy)) / (b * b * (x0 - cx)) +
                    cx;
        }
        else {
            x = y0 > center.y ? x0 + refPointDelta : x0 - refPointDelta;
            y =
                (b * b) / (y0 - cy) -
                    (b * b * (x0 - cx) * (x - cx)) / (a * a * (y0 - cy)) +
                    cy;
        }
        return new point_1.Point(x, y).theta(ref);
    };
    Ellipse.prototype.scale = function (sx, sy) {
        this.a *= sx;
        this.b *= sy;
        return this;
    };
    Ellipse.prototype.rotate = function (angle, origin) {
        var rect = rectangle_1.Rectangle.fromEllipse(this);
        rect.rotate(angle, origin);
        var ellipse = Ellipse.fromRect(rect);
        this.a = ellipse.a;
        this.b = ellipse.b;
        this.x = ellipse.x;
        this.y = ellipse.y;
        return this;
    };
    Ellipse.prototype.translate = function (dx, dy) {
        var p = point_1.Point.create(dx, dy);
        this.x += p.x;
        this.y += p.y;
        return this;
    };
    Ellipse.prototype.equals = function (ellipse) {
        return (ellipse != null &&
            ellipse.x === this.x &&
            ellipse.y === this.y &&
            ellipse.a === this.a &&
            ellipse.b === this.b);
    };
    Ellipse.prototype.clone = function () {
        return new Ellipse(this.x, this.y, this.a, this.b);
    };
    Ellipse.prototype.toJSON = function () {
        return { x: this.x, y: this.y, a: this.a, b: this.b };
    };
    Ellipse.prototype.serialize = function () {
        return this.x + " " + this.y + " " + this.a + " " + this.b;
    };
    return Ellipse;
}(geometry_1.Geometry));
exports.Ellipse = Ellipse;
(function (Ellipse) {
    Ellipse.toStringTag = "X6.Geometry." + Ellipse.name;
    function isEllipse(instance) {
        if (instance == null) {
            return false;
        }
        if (instance instanceof Ellipse) {
            return true;
        }
        var tag = instance[Symbol.toStringTag];
        var ellipse = instance;
        if ((tag == null || tag === Ellipse.toStringTag) &&
            typeof ellipse.x === 'number' &&
            typeof ellipse.y === 'number' &&
            typeof ellipse.a === 'number' &&
            typeof ellipse.b === 'number' &&
            typeof ellipse.inflate === 'function' &&
            typeof ellipse.normalizedDistance === 'function') {
            return true;
        }
        return false;
    }
    Ellipse.isEllipse = isEllipse;
})(Ellipse = exports.Ellipse || (exports.Ellipse = {}));
exports.Ellipse = Ellipse;
(function (Ellipse) {
    function create(x, y, a, b) {
        if (x == null || typeof x === 'number') {
            return new Ellipse(x, y, a, b);
        }
        return parse(x);
    }
    Ellipse.create = create;
    function parse(e) {
        if (Ellipse.isEllipse(e)) {
            return e.clone();
        }
        if (Array.isArray(e)) {
            return new Ellipse(e[0], e[1], e[2], e[3]);
        }
        return new Ellipse(e.x, e.y, e.a, e.b);
    }
    Ellipse.parse = parse;
    function fromRect(rect) {
        var center = rect.center;
        return new Ellipse(center.x, center.y, rect.width / 2, rect.height / 2);
    }
    Ellipse.fromRect = fromRect;
})(Ellipse = exports.Ellipse || (exports.Ellipse = {}));
exports.Ellipse = Ellipse;
//# sourceMappingURL=ellipse.js.map