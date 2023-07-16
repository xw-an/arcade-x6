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
exports.Rectangle = void 0;
var util = __importStar(require("./util"));
var angle_1 = require("./angle");
var line_1 = require("./line");
var point_1 = require("./point");
var geometry_1 = require("./geometry");
var Rectangle = /** @class */ (function (_super) {
    __extends(Rectangle, _super);
    function Rectangle(x, y, width, height) {
        var _this = _super.call(this) || this;
        _this.x = x == null ? 0 : x;
        _this.y = y == null ? 0 : y;
        _this.width = width == null ? 0 : width;
        _this.height = height == null ? 0 : height;
        return _this;
    }
    Object.defineProperty(Rectangle.prototype, Symbol.toStringTag, {
        get: function () {
            return Rectangle.toStringTag;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Rectangle.prototype, "left", {
        get: function () {
            return this.x;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Rectangle.prototype, "top", {
        get: function () {
            return this.y;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Rectangle.prototype, "right", {
        get: function () {
            return this.x + this.width;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Rectangle.prototype, "bottom", {
        get: function () {
            return this.y + this.height;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Rectangle.prototype, "origin", {
        get: function () {
            return new point_1.Point(this.x, this.y);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Rectangle.prototype, "topLeft", {
        get: function () {
            return new point_1.Point(this.x, this.y);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Rectangle.prototype, "topCenter", {
        get: function () {
            return new point_1.Point(this.x + this.width / 2, this.y);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Rectangle.prototype, "topRight", {
        get: function () {
            return new point_1.Point(this.x + this.width, this.y);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Rectangle.prototype, "center", {
        get: function () {
            return new point_1.Point(this.x + this.width / 2, this.y + this.height / 2);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Rectangle.prototype, "bottomLeft", {
        get: function () {
            return new point_1.Point(this.x, this.y + this.height);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Rectangle.prototype, "bottomCenter", {
        get: function () {
            return new point_1.Point(this.x + this.width / 2, this.y + this.height);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Rectangle.prototype, "bottomRight", {
        get: function () {
            return new point_1.Point(this.x + this.width, this.y + this.height);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Rectangle.prototype, "corner", {
        get: function () {
            return new point_1.Point(this.x + this.width, this.y + this.height);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Rectangle.prototype, "rightMiddle", {
        get: function () {
            return new point_1.Point(this.x + this.width, this.y + this.height / 2);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Rectangle.prototype, "leftMiddle", {
        get: function () {
            return new point_1.Point(this.x, this.y + this.height / 2);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Rectangle.prototype, "topLine", {
        get: function () {
            return new line_1.Line(this.topLeft, this.topRight);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Rectangle.prototype, "rightLine", {
        get: function () {
            return new line_1.Line(this.topRight, this.bottomRight);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Rectangle.prototype, "bottomLine", {
        get: function () {
            return new line_1.Line(this.bottomLeft, this.bottomRight);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Rectangle.prototype, "leftLine", {
        get: function () {
            return new line_1.Line(this.topLeft, this.bottomLeft);
        },
        enumerable: false,
        configurable: true
    });
    Rectangle.prototype.getOrigin = function () {
        return this.origin;
    };
    Rectangle.prototype.getTopLeft = function () {
        return this.topLeft;
    };
    Rectangle.prototype.getTopCenter = function () {
        return this.topCenter;
    };
    Rectangle.prototype.getTopRight = function () {
        return this.topRight;
    };
    Rectangle.prototype.getCenter = function () {
        return this.center;
    };
    Rectangle.prototype.getCenterX = function () {
        return this.x + this.width / 2;
    };
    Rectangle.prototype.getCenterY = function () {
        return this.y + this.height / 2;
    };
    Rectangle.prototype.getBottomLeft = function () {
        return this.bottomLeft;
    };
    Rectangle.prototype.getBottomCenter = function () {
        return this.bottomCenter;
    };
    Rectangle.prototype.getBottomRight = function () {
        return this.bottomRight;
    };
    Rectangle.prototype.getCorner = function () {
        return this.corner;
    };
    Rectangle.prototype.getRightMiddle = function () {
        return this.rightMiddle;
    };
    Rectangle.prototype.getLeftMiddle = function () {
        return this.leftMiddle;
    };
    Rectangle.prototype.getTopLine = function () {
        return this.topLine;
    };
    Rectangle.prototype.getRightLine = function () {
        return this.rightLine;
    };
    Rectangle.prototype.getBottomLine = function () {
        return this.bottomLine;
    };
    Rectangle.prototype.getLeftLine = function () {
        return this.leftLine;
    };
    /**
     * Returns a rectangle that is the bounding box of the rectangle.
     *
     * If `angle` is specified, the bounding box calculation will take into
     * account the rotation of the rectangle by angle degrees around its center.
     */
    Rectangle.prototype.bbox = function (angle) {
        if (!angle) {
            return this.clone();
        }
        var rad = angle_1.Angle.toRad(angle);
        var st = Math.abs(Math.sin(rad));
        var ct = Math.abs(Math.cos(rad));
        var w = this.width * ct + this.height * st;
        var h = this.width * st + this.height * ct;
        return new Rectangle(this.x + (this.width - w) / 2, this.y + (this.height - h) / 2, w, h);
    };
    Rectangle.prototype.round = function (precision) {
        if (precision === void 0) { precision = 0; }
        this.x = util.round(this.x, precision);
        this.y = util.round(this.y, precision);
        this.width = util.round(this.width, precision);
        this.height = util.round(this.height, precision);
        return this;
    };
    Rectangle.prototype.add = function (x, y, width, height) {
        var rect = Rectangle.create(x, y, width, height);
        var minX = Math.min(this.x, rect.x);
        var minY = Math.min(this.y, rect.y);
        var maxX = Math.max(this.x + this.width, rect.x + rect.width);
        var maxY = Math.max(this.y + this.height, rect.y + rect.height);
        this.x = minX;
        this.y = minY;
        this.width = maxX - minX;
        this.height = maxY - minY;
        return this;
    };
    Rectangle.prototype.update = function (x, y, width, height) {
        var rect = Rectangle.create(x, y, width, height);
        this.x = rect.x;
        this.y = rect.y;
        this.width = rect.width;
        this.height = rect.height;
        return this;
    };
    Rectangle.prototype.inflate = function (dx, dy) {
        var w = dx;
        var h = dy != null ? dy : dx;
        this.x -= w;
        this.y -= h;
        this.width += 2 * w;
        this.height += 2 * h;
        return this;
    };
    Rectangle.prototype.snapToGrid = function (gx, gy) {
        var origin = this.origin.snapToGrid(gx, gy);
        var corner = this.corner.snapToGrid(gx, gy);
        this.x = origin.x;
        this.y = origin.y;
        this.width = corner.x - origin.x;
        this.height = corner.y - origin.y;
        return this;
    };
    Rectangle.prototype.translate = function (tx, ty) {
        var p = point_1.Point.create(tx, ty);
        this.x += p.x;
        this.y += p.y;
        return this;
    };
    Rectangle.prototype.scale = function (sx, sy, origin) {
        if (origin === void 0) { origin = new point_1.Point(); }
        var pos = this.origin.scale(sx, sy, origin);
        this.x = pos.x;
        this.y = pos.y;
        this.width *= sx;
        this.height *= sy;
        return this;
    };
    Rectangle.prototype.rotate = function (degree, center) {
        if (center === void 0) { center = this.getCenter(); }
        if (degree !== 0) {
            var rad = angle_1.Angle.toRad(degree);
            var cos = Math.cos(rad);
            var sin = Math.sin(rad);
            var p1 = this.getOrigin();
            var p2 = this.getTopRight();
            var p3 = this.getBottomRight();
            var p4 = this.getBottomLeft();
            p1 = point_1.Point.rotateEx(p1, cos, sin, center);
            p2 = point_1.Point.rotateEx(p2, cos, sin, center);
            p3 = point_1.Point.rotateEx(p3, cos, sin, center);
            p4 = point_1.Point.rotateEx(p4, cos, sin, center);
            var rect = new Rectangle(p1.x, p1.y, 0, 0);
            rect.add(p2.x, p2.y, 0, 0);
            rect.add(p3.x, p3.y, 0, 0);
            rect.add(p4.x, p4.y, 0, 0);
            this.update(rect);
        }
        return this;
    };
    Rectangle.prototype.rotate90 = function () {
        var t = (this.width - this.height) / 2;
        this.x += t;
        this.y -= t;
        var tmp = this.width;
        this.width = this.height;
        this.height = tmp;
        return this;
    };
    /**
     * Translates the rectangle by `rect.x` and `rect.y` and expand it by
     * `rect.width` and `rect.height`.
     */
    Rectangle.prototype.moveAndExpand = function (rect) {
        var ref = Rectangle.clone(rect);
        this.x += ref.x || 0;
        this.y += ref.y || 0;
        this.width += ref.width || 0;
        this.height += ref.height || 0;
        return this;
    };
    /**
     * Returns an object where `sx` and `sy` give the maximum scaling that can be
     * applied to the rectangle so that it would still fit into `limit`. If
     * `origin` is specified, the rectangle is scaled around it; otherwise, it is
     * scaled around its center.
     */
    Rectangle.prototype.getMaxScaleToFit = function (limit, origin) {
        if (origin === void 0) { origin = this.center; }
        var rect = Rectangle.clone(limit);
        var ox = origin.x;
        var oy = origin.y;
        // Find the maximal possible scale for all corners, so when the scale
        // is applied the point is still inside the rectangle.
        var sx1 = Infinity;
        var sx2 = Infinity;
        var sx3 = Infinity;
        var sx4 = Infinity;
        var sy1 = Infinity;
        var sy2 = Infinity;
        var sy3 = Infinity;
        var sy4 = Infinity;
        // Top Left
        var p1 = rect.topLeft;
        if (p1.x < ox) {
            sx1 = (this.x - ox) / (p1.x - ox);
        }
        if (p1.y < oy) {
            sy1 = (this.y - oy) / (p1.y - oy);
        }
        // Bottom Right
        var p2 = rect.bottomRight;
        if (p2.x > ox) {
            sx2 = (this.x + this.width - ox) / (p2.x - ox);
        }
        if (p2.y > oy) {
            sy2 = (this.y + this.height - oy) / (p2.y - oy);
        }
        // Top Right
        var p3 = rect.topRight;
        if (p3.x > ox) {
            sx3 = (this.x + this.width - ox) / (p3.x - ox);
        }
        if (p3.y < oy) {
            sy3 = (this.y - oy) / (p3.y - oy);
        }
        // Bottom Left
        var p4 = rect.bottomLeft;
        if (p4.x < ox) {
            sx4 = (this.x - ox) / (p4.x - ox);
        }
        if (p4.y > oy) {
            sy4 = (this.y + this.height - oy) / (p4.y - oy);
        }
        return {
            sx: Math.min(sx1, sx2, sx3, sx4),
            sy: Math.min(sy1, sy2, sy3, sy4),
        };
    };
    /**
     * Returns a number that specifies the maximum scaling that can be applied to
     * the rectangle along both axes so that it would still fit into `limit`. If
     * `origin` is specified, the rectangle is scaled around it; otherwise, it is
     * scaled around its center.
     */
    Rectangle.prototype.getMaxUniformScaleToFit = function (limit, origin) {
        if (origin === void 0) { origin = this.center; }
        var scale = this.getMaxScaleToFit(limit, origin);
        return Math.min(scale.sx, scale.sy);
    };
    Rectangle.prototype.containsPoint = function (x, y) {
        return util.containsPoint(this, point_1.Point.create(x, y));
    };
    Rectangle.prototype.containsRect = function (x, y, width, height) {
        var b = Rectangle.create(x, y, width, height);
        var x1 = this.x;
        var y1 = this.y;
        var w1 = this.width;
        var h1 = this.height;
        var x2 = b.x;
        var y2 = b.y;
        var w2 = b.width;
        var h2 = b.height;
        // one of the dimensions is 0
        if (w1 === 0 || h1 === 0 || w2 === 0 || h2 === 0) {
            return false;
        }
        return x2 >= x1 && y2 >= y1 && x2 + w2 <= x1 + w1 && y2 + h2 <= y1 + h1;
    };
    /**
     * Returns an array of the intersection points of the rectangle and the line.
     * Return `null` if no intersection exists.
     */
    Rectangle.prototype.intersectsWithLine = function (line) {
        var rectLines = [
            this.topLine,
            this.rightLine,
            this.bottomLine,
            this.leftLine,
        ];
        var points = [];
        var dedupeArr = [];
        rectLines.forEach(function (l) {
            var p = line.intersectsWithLine(l);
            if (p !== null && dedupeArr.indexOf(p.toString()) < 0) {
                points.push(p);
                dedupeArr.push(p.toString());
            }
        });
        return points.length > 0 ? points : null;
    };
    /**
     * Returns the point on the boundary of the rectangle that is the intersection
     * of the rectangle with a line starting in the center the rectangle ending in
     * the point `p`.
     *
     * If `angle` is specified, the intersection will take into account the
     * rotation of the rectangle by `angle` degrees around its center.
     */
    Rectangle.prototype.intersectsWithLineFromCenterToPoint = function (p, angle) {
        var ref = point_1.Point.clone(p);
        var center = this.center;
        var result = null;
        if (angle != null && angle !== 0) {
            ref.rotate(angle, center);
        }
        var sides = [this.topLine, this.rightLine, this.bottomLine, this.leftLine];
        var connector = new line_1.Line(center, ref);
        for (var i = sides.length - 1; i >= 0; i -= 1) {
            var intersection = sides[i].intersectsWithLine(connector);
            if (intersection !== null) {
                result = intersection;
                break;
            }
        }
        if (result && angle != null && angle !== 0) {
            result.rotate(-angle, center);
        }
        return result;
    };
    Rectangle.prototype.intersectsWithRect = function (x, y, width, height) {
        var ref = Rectangle.create(x, y, width, height);
        // no intersection
        if (!this.isIntersectWithRect(ref)) {
            return null;
        }
        var myOrigin = this.origin;
        var myCorner = this.corner;
        var rOrigin = ref.origin;
        var rCorner = ref.corner;
        var xx = Math.max(myOrigin.x, rOrigin.x);
        var yy = Math.max(myOrigin.y, rOrigin.y);
        return new Rectangle(xx, yy, Math.min(myCorner.x, rCorner.x) - xx, Math.min(myCorner.y, rCorner.y) - yy);
    };
    Rectangle.prototype.isIntersectWithRect = function (x, y, width, height) {
        var ref = Rectangle.create(x, y, width, height);
        var myOrigin = this.origin;
        var myCorner = this.corner;
        var rOrigin = ref.origin;
        var rCorner = ref.corner;
        if (rCorner.x <= myOrigin.x ||
            rCorner.y <= myOrigin.y ||
            rOrigin.x >= myCorner.x ||
            rOrigin.y >= myCorner.y) {
            return false;
        }
        return true;
    };
    /**
     * Normalize the rectangle, i.e. make it so that it has non-negative
     * width and height. If width is less than `0`, the function swaps left and
     * right corners and if height is less than `0`, the top and bottom corners
     * are swapped.
     */
    Rectangle.prototype.normalize = function () {
        var newx = this.x;
        var newy = this.y;
        var newwidth = this.width;
        var newheight = this.height;
        if (this.width < 0) {
            newx = this.x + this.width;
            newwidth = -this.width;
        }
        if (this.height < 0) {
            newy = this.y + this.height;
            newheight = -this.height;
        }
        this.x = newx;
        this.y = newy;
        this.width = newwidth;
        this.height = newheight;
        return this;
    };
    /**
     * Returns a rectangle that is a union of this rectangle and rectangle `rect`.
     */
    Rectangle.prototype.union = function (rect) {
        var ref = Rectangle.clone(rect);
        var myOrigin = this.origin;
        var myCorner = this.corner;
        var rOrigin = ref.origin;
        var rCorner = ref.corner;
        var originX = Math.min(myOrigin.x, rOrigin.x);
        var originY = Math.min(myOrigin.y, rOrigin.y);
        var cornerX = Math.max(myCorner.x, rCorner.x);
        var cornerY = Math.max(myCorner.y, rCorner.y);
        return new Rectangle(originX, originY, cornerX - originX, cornerY - originY);
    };
    /**
     * Returns a string ("top", "left", "right" or "bottom") denoting the side of
     * the rectangle which is nearest to the point `p`.
     */
    Rectangle.prototype.getNearestSideToPoint = function (p) {
        var ref = point_1.Point.clone(p);
        var distLeft = ref.x - this.x;
        var distRight = this.x + this.width - ref.x;
        var distTop = ref.y - this.y;
        var distBottom = this.y + this.height - ref.y;
        var closest = distLeft;
        var side = 'left';
        if (distRight < closest) {
            closest = distRight;
            side = 'right';
        }
        if (distTop < closest) {
            closest = distTop;
            side = 'top';
        }
        if (distBottom < closest) {
            side = 'bottom';
        }
        return side;
    };
    /**
     * Returns a point on the boundary of the rectangle nearest to the point `p`.
     */
    Rectangle.prototype.getNearestPointToPoint = function (p) {
        var ref = point_1.Point.clone(p);
        if (this.containsPoint(ref)) {
            var side = this.getNearestSideToPoint(ref);
            switch (side) {
                case 'right':
                    return new point_1.Point(this.x + this.width, ref.y);
                case 'left':
                    return new point_1.Point(this.x, ref.y);
                case 'bottom':
                    return new point_1.Point(ref.x, this.y + this.height);
                case 'top':
                    return new point_1.Point(ref.x, this.y);
                default:
                    break;
            }
        }
        return ref.adhereToRect(this);
    };
    Rectangle.prototype.equals = function (rect) {
        return (rect != null &&
            rect.x === this.x &&
            rect.y === this.y &&
            rect.width === this.width &&
            rect.height === this.height);
    };
    Rectangle.prototype.clone = function () {
        return new Rectangle(this.x, this.y, this.width, this.height);
    };
    Rectangle.prototype.toJSON = function () {
        return { x: this.x, y: this.y, width: this.width, height: this.height };
    };
    Rectangle.prototype.serialize = function () {
        return this.x + " " + this.y + " " + this.width + " " + this.height;
    };
    return Rectangle;
}(geometry_1.Geometry));
exports.Rectangle = Rectangle;
(function (Rectangle) {
    Rectangle.toStringTag = "X6.Geometry." + Rectangle.name;
    function isRectangle(instance) {
        if (instance == null) {
            return false;
        }
        if (instance instanceof Rectangle) {
            return true;
        }
        var tag = instance[Symbol.toStringTag];
        var rect = instance;
        if ((tag == null || tag === Rectangle.toStringTag) &&
            typeof rect.x === 'number' &&
            typeof rect.y === 'number' &&
            typeof rect.width === 'number' &&
            typeof rect.height === 'number' &&
            typeof rect.inflate === 'function' &&
            typeof rect.moveAndExpand === 'function') {
            return true;
        }
        return false;
    }
    Rectangle.isRectangle = isRectangle;
})(Rectangle = exports.Rectangle || (exports.Rectangle = {}));
exports.Rectangle = Rectangle;
(function (Rectangle) {
    function isRectangleLike(o) {
        return (o != null &&
            typeof o === 'object' &&
            typeof o.x === 'number' &&
            typeof o.y === 'number' &&
            typeof o.width === 'number' &&
            typeof o.height === 'number');
    }
    Rectangle.isRectangleLike = isRectangleLike;
})(Rectangle = exports.Rectangle || (exports.Rectangle = {}));
exports.Rectangle = Rectangle;
(function (Rectangle) {
    function create(x, y, width, height) {
        if (x == null || typeof x === 'number') {
            return new Rectangle(x, y, width, height);
        }
        return clone(x);
    }
    Rectangle.create = create;
    function clone(rect) {
        if (Rectangle.isRectangle(rect)) {
            return rect.clone();
        }
        if (Array.isArray(rect)) {
            return new Rectangle(rect[0], rect[1], rect[2], rect[3]);
        }
        return new Rectangle(rect.x, rect.y, rect.width, rect.height);
    }
    Rectangle.clone = clone;
    function fromSize(size) {
        return new Rectangle(0, 0, size.width, size.height);
    }
    Rectangle.fromSize = fromSize;
    function fromPositionAndSize(pos, size) {
        return new Rectangle(pos.x, pos.y, size.width, size.height);
    }
    Rectangle.fromPositionAndSize = fromPositionAndSize;
    /**
     * Returns a new rectangle from the given ellipse.
     */
    function fromEllipse(ellipse) {
        return new Rectangle(ellipse.x - ellipse.a, ellipse.y - ellipse.b, 2 * ellipse.a, 2 * ellipse.b);
    }
    Rectangle.fromEllipse = fromEllipse;
})(Rectangle = exports.Rectangle || (exports.Rectangle = {}));
exports.Rectangle = Rectangle;
//# sourceMappingURL=rectangle.js.map