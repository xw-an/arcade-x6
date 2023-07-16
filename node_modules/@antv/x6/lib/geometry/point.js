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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Point = void 0;
var util = __importStar(require("./util"));
var angle_1 = require("./angle");
var geometry_1 = require("./geometry");
var Point = /** @class */ (function (_super) {
    __extends(Point, _super);
    function Point(x, y) {
        var _this = _super.call(this) || this;
        _this.x = x == null ? 0 : x;
        _this.y = y == null ? 0 : y;
        return _this;
    }
    Object.defineProperty(Point.prototype, Symbol.toStringTag, {
        get: function () {
            return Point.toStringTag;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Rounds the point to the given precision.
     */
    Point.prototype.round = function (precision) {
        if (precision === void 0) { precision = 0; }
        this.x = util.round(this.x, precision);
        this.y = util.round(this.y, precision);
        return this;
    };
    Point.prototype.add = function (x, y) {
        var p = Point.create(x, y);
        this.x += p.x;
        this.y += p.y;
        return this;
    };
    Point.prototype.update = function (x, y) {
        var p = Point.create(x, y);
        this.x = p.x;
        this.y = p.y;
        return this;
    };
    Point.prototype.translate = function (dx, dy) {
        var t = Point.create(dx, dy);
        this.x += t.x;
        this.y += t.y;
        return this;
    };
    /**
     * Rotate the point by `degree` around `center`.
     */
    Point.prototype.rotate = function (degree, center) {
        var p = Point.rotate(this, degree, center);
        this.x = p.x;
        this.y = p.y;
        return this;
    };
    /**
     * Scale point by `sx` and `sy` around the given `origin`. If origin is not
     * specified, the point is scaled around `0,0`.
     */
    Point.prototype.scale = function (sx, sy, origin) {
        if (origin === void 0) { origin = new Point(); }
        var ref = Point.create(origin);
        this.x = ref.x + sx * (this.x - ref.x);
        this.y = ref.y + sy * (this.y - ref.y);
        return this;
    };
    /**
     * Chooses the point closest to this point from among `points`. If `points`
     * is an empty array, `null` is returned.
     */
    Point.prototype.closest = function (points) {
        var _this = this;
        if (points.length === 1) {
            return Point.create(points[0]);
        }
        var ret = null;
        var min = Infinity;
        points.forEach(function (p) {
            var dist = _this.squaredDistance(p);
            if (dist < min) {
                ret = p;
                min = dist;
            }
        });
        return ret ? Point.create(ret) : null;
    };
    /**
     * Returns the distance between the point and another point `p`.
     */
    Point.prototype.distance = function (p) {
        return Math.sqrt(this.squaredDistance(p));
    };
    /**
     * Returns the squared distance between the point and another point `p`.
     *
     * Useful for distance comparisons in which real distance is not necessary
     * (saves one `Math.sqrt()` operation).
     */
    Point.prototype.squaredDistance = function (p) {
        var ref = Point.create(p);
        var dx = this.x - ref.x;
        var dy = this.y - ref.y;
        return dx * dx + dy * dy;
    };
    Point.prototype.manhattanDistance = function (p) {
        var ref = Point.create(p);
        return Math.abs(ref.x - this.x) + Math.abs(ref.y - this.y);
    };
    /**
     * Returns the magnitude of the point vector.
     *
     * @see http://en.wikipedia.org/wiki/Magnitude_(mathematics)
     */
    Point.prototype.magnitude = function () {
        return Math.sqrt(this.x * this.x + this.y * this.y) || 0.01;
    };
    /**
     * Returns the angle(in degrees) between vector from this point to `p` and
     * the x-axis.
     */
    Point.prototype.theta = function (p) {
        if (p === void 0) { p = new Point(); }
        var ref = Point.create(p);
        var y = -(ref.y - this.y); // invert the y-axis.
        var x = ref.x - this.x;
        var rad = Math.atan2(y, x);
        // Correction for III. and IV. quadrant.
        if (rad < 0) {
            rad = 2 * Math.PI + rad;
        }
        return (180 * rad) / Math.PI;
    };
    /**
     * Returns the angle(in degrees) between vector from this point to `p1` and
     * the vector from this point to `p2`.
     *
     * The ordering of points `p1` and `p2` is important.
     *
     * The function returns a value between `0` and `180` when the angle (in the
     * direction from `p1` to `p2`) is clockwise, and a value between `180` and
     * `360` when the angle is counterclockwise.
     *
     * Returns `NaN` if either of the points `p1` and `p2` is equal with this point.
     */
    Point.prototype.angleBetween = function (p1, p2) {
        if (this.equals(p1) || this.equals(p2)) {
            return NaN;
        }
        var angle = this.theta(p2) - this.theta(p1);
        if (angle < 0) {
            angle += 360;
        }
        return angle;
    };
    /**
     * Returns the angle(in degrees) between the line from `(0,0)` and this point
     * and the line from `(0,0)` to `p`.
     *
     * The function returns a value between `0` and `180` when the angle (in the
     * direction from this point to `p`) is clockwise, and a value between `180`
     * and `360` when the angle is counterclockwise. Returns `NaN` if called from
     * point `(0,0)` or if `p` is `(0,0)`.
     */
    Point.prototype.vectorAngle = function (p) {
        var zero = new Point(0, 0);
        return zero.angleBetween(this, p);
    };
    /**
     * Converts rectangular to polar coordinates.
     */
    Point.prototype.toPolar = function (origin) {
        this.update(Point.toPolar(this, origin));
        return this;
    };
    /**
     * Returns the change in angle(in degrees) that is the result of moving the
     * point from its previous position to its current position.
     *
     * More specifically, this function computes the angle between the line from
     * the ref point to the previous position of this point(i.e. current position
     * `-dx`, `-dy`) and the line from the `ref` point to the current position of
     * this point.
     *
     * The function returns a positive value between `0` and `180` when the angle
     * (in the direction from previous position of this point to its current
     * position) is clockwise, and a negative value between `0` and `-180` when
     * the angle is counterclockwise.
     *
     * The function returns `0` if the previous and current positions of this
     * point are the same (i.e. both `dx` and `dy` are `0`).
     */
    Point.prototype.changeInAngle = function (dx, dy, ref) {
        if (ref === void 0) { ref = new Point(); }
        // Revert the translation and measure the change in angle around x-axis.
        return this.clone().translate(-dx, -dy).theta(ref) - this.theta(ref);
    };
    /**
     * If the point lies outside the rectangle `rect`, adjust the point so that
     * it becomes the nearest point on the boundary of `rect`.
     */
    Point.prototype.adhereToRect = function (rect) {
        if (!util.containsPoint(rect, this)) {
            this.x = Math.min(Math.max(this.x, rect.x), rect.x + rect.width);
            this.y = Math.min(Math.max(this.y, rect.y), rect.y + rect.height);
        }
        return this;
    };
    /**
     * Returns the bearing(cardinal direction) between me and the given point.
     *
     * @see https://en.wikipedia.org/wiki/Cardinal_direction
     */
    Point.prototype.bearing = function (p) {
        var ref = Point.create(p);
        var lat1 = angle_1.Angle.toRad(this.y);
        var lat2 = angle_1.Angle.toRad(ref.y);
        var lon1 = this.x;
        var lon2 = ref.x;
        var dLon = angle_1.Angle.toRad(lon2 - lon1);
        var y = Math.sin(dLon) * Math.cos(lat2);
        var x = Math.cos(lat1) * Math.sin(lat2) -
            Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);
        var brng = angle_1.Angle.toDeg(Math.atan2(y, x));
        var bearings = ['NE', 'E', 'SE', 'S', 'SW', 'W', 'NW', 'N'];
        var index = brng - 22.5;
        if (index < 0) {
            index += 360;
        }
        index = parseInt((index / 45), 10);
        return bearings[index];
    };
    /**
     * Returns the cross product of the vector from me to `p1` and the vector
     * from me to `p2`.
     *
     * The left-hand rule is used because the coordinate system is left-handed.
     */
    Point.prototype.cross = function (p1, p2) {
        if (p1 != null && p2 != null) {
            var a = Point.create(p1);
            var b = Point.create(p2);
            return (b.x - this.x) * (a.y - this.y) - (b.y - this.y) * (a.x - this.x);
        }
        return NaN;
    };
    /**
     * Returns the dot product of this point with given other point.
     */
    Point.prototype.dot = function (p) {
        var ref = Point.create(p);
        return this.x * ref.x + this.y * ref.y;
    };
    Point.prototype.diff = function (dx, dy) {
        if (typeof dx === 'number') {
            return new Point(this.x - dx, this.y - dy);
        }
        var p = Point.create(dx);
        return new Point(this.x - p.x, this.y - p.y);
    };
    /**
     * Returns an interpolation between me and point `p` for a parametert in
     * the closed interval `[0, 1]`.
     */
    Point.prototype.lerp = function (p, t) {
        var ref = Point.create(p);
        return new Point((1 - t) * this.x + t * ref.x, (1 - t) * this.y + t * ref.y);
    };
    /**
     * Normalize the point vector, scale the line segment between `(0, 0)`
     * and the point in order for it to have the given length. If length is
     * not specified, it is considered to be `1`; in that case, a unit vector
     * is computed.
     */
    Point.prototype.normalize = function (length) {
        if (length === void 0) { length = 1; }
        var scale = length / this.magnitude();
        return this.scale(scale, scale);
    };
    /**
     * Moves this point along the line starting from `ref` to this point by a
     * certain `distance`.
     */
    Point.prototype.move = function (ref, distance) {
        var p = Point.create(ref);
        var rad = angle_1.Angle.toRad(p.theta(this));
        return this.translate(Math.cos(rad) * distance, -Math.sin(rad) * distance);
    };
    /**
     * Returns a point that is the reflection of me with the center of inversion
     * in `ref` point.
     */
    Point.prototype.reflection = function (ref) {
        return Point.create(ref).move(this, this.distance(ref));
    };
    Point.prototype.snapToGrid = function (gx, gy) {
        this.x = util.snapToGrid(this.x, gx);
        this.y = util.snapToGrid(this.y, gy == null ? gx : gy);
        return this;
    };
    Point.prototype.equals = function (p) {
        var ref = Point.create(p);
        return ref != null && ref.x === this.x && ref.y === this.y;
    };
    Point.prototype.clone = function () {
        return Point.clone(this);
    };
    /**
     * Returns the point as a simple JSON object. For example: `{ x: 0, y: 0 }`.
     */
    Point.prototype.toJSON = function () {
        return Point.toJSON(this);
    };
    Point.prototype.serialize = function () {
        return this.x + " " + this.y;
    };
    return Point;
}(geometry_1.Geometry));
exports.Point = Point;
(function (Point) {
    Point.toStringTag = "X6.Geometry." + Point.name;
    function isPoint(instance) {
        if (instance == null) {
            return false;
        }
        if (instance instanceof Point) {
            return true;
        }
        var tag = instance[Symbol.toStringTag];
        var point = instance;
        if ((tag == null || tag === Point.toStringTag) &&
            typeof point.x === 'number' &&
            typeof point.y === 'number' &&
            typeof point.toPolar === 'function') {
            return true;
        }
        return false;
    }
    Point.isPoint = isPoint;
})(Point = exports.Point || (exports.Point = {}));
exports.Point = Point;
(function (Point) {
    function isPointLike(p) {
        return (p != null &&
            typeof p === 'object' &&
            typeof p.x === 'number' &&
            typeof p.y === 'number');
    }
    Point.isPointLike = isPointLike;
    function isPointData(p) {
        return (p != null &&
            Array.isArray(p) &&
            p.length === 2 &&
            typeof p[0] === 'number' &&
            typeof p[1] === 'number');
    }
    Point.isPointData = isPointData;
})(Point = exports.Point || (exports.Point = {}));
exports.Point = Point;
(function (Point) {
    function create(x, y) {
        if (x == null || typeof x === 'number') {
            return new Point(x, y);
        }
        return clone(x);
    }
    Point.create = create;
    function clone(p) {
        if (Point.isPoint(p)) {
            return new Point(p.x, p.y);
        }
        if (Array.isArray(p)) {
            return new Point(p[0], p[1]);
        }
        return new Point(p.x, p.y);
    }
    Point.clone = clone;
    function toJSON(p) {
        if (Point.isPoint(p)) {
            return { x: p.x, y: p.y };
        }
        if (Array.isArray(p)) {
            return { x: p[0], y: p[1] };
        }
        return { x: p.x, y: p.y };
    }
    Point.toJSON = toJSON;
    /**
     * Returns a new Point object from the given polar coordinates.
     * @see http://en.wikipedia.org/wiki/Polar_coordinate_system
     */
    function fromPolar(r, rad, origin) {
        if (origin === void 0) { origin = new Point(); }
        var x = Math.abs(r * Math.cos(rad));
        var y = Math.abs(r * Math.sin(rad));
        var org = clone(origin);
        var deg = angle_1.Angle.normalize(angle_1.Angle.toDeg(rad));
        if (deg < 90) {
            y = -y;
        }
        else if (deg < 180) {
            x = -x;
            y = -y;
        }
        else if (deg < 270) {
            x = -x;
        }
        return new Point(org.x + x, org.y + y);
    }
    Point.fromPolar = fromPolar;
    /**
     * Converts rectangular to polar coordinates.
     */
    function toPolar(point, origin) {
        if (origin === void 0) { origin = new Point(); }
        var p = clone(point);
        var o = clone(origin);
        var dx = p.x - o.x;
        var dy = p.y - o.y;
        return new Point(Math.sqrt(dx * dx + dy * dy), // r
        angle_1.Angle.toRad(o.theta(p)));
    }
    Point.toPolar = toPolar;
    function equals(p1, p2) {
        if (p1 === p2) {
            return true;
        }
        if (p1 != null && p2 != null) {
            return p1.x === p2.x && p1.y === p2.y;
        }
        return false;
    }
    Point.equals = equals;
    function equalPoints(p1, p2) {
        if ((p1 == null && p2 != null) ||
            (p1 != null && p2 == null) ||
            (p1 != null && p2 != null && p1.length !== p2.length)) {
            return false;
        }
        if (p1 != null && p2 != null) {
            for (var i = 0, ii = p1.length; i < ii; i += 1) {
                if (!equals(p1[i], p2[i])) {
                    return false;
                }
            }
        }
        return true;
    }
    Point.equalPoints = equalPoints;
    /**
     * Returns a point with random coordinates that fall within the range
     * `[x1, x2]` and `[y1, y2]`.
     */
    function random(x1, x2, y1, y2) {
        return new Point(util.random(x1, x2), util.random(y1, y2));
    }
    Point.random = random;
    function rotate(point, angle, center) {
        var rad = angle_1.Angle.toRad(angle_1.Angle.normalize(-angle));
        var sin = Math.sin(rad);
        var cos = Math.cos(rad);
        return rotateEx(point, cos, sin, center);
    }
    Point.rotate = rotate;
    function rotateEx(point, cos, sin, center) {
        if (center === void 0) { center = new Point(); }
        var source = clone(point);
        var origin = clone(center);
        var dx = source.x - origin.x;
        var dy = source.y - origin.y;
        var x1 = dx * cos - dy * sin;
        var y1 = dy * cos + dx * sin;
        return new Point(x1 + origin.x, y1 + origin.y);
    }
    Point.rotateEx = rotateEx;
})(Point = exports.Point || (exports.Point = {}));
exports.Point = Point;
//# sourceMappingURL=point.js.map