"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var ellipse_1 = require("./ellipse");
var line_1 = require("./line");
var point_1 = require("./point");
var rectangle_1 = require("./rectangle");
describe('rectangle', function () {
    describe('#constructor', function () {
        it('should create a rectangle instance', function () {
            expect(new rectangle_1.Rectangle()).toBeInstanceOf(rectangle_1.Rectangle);
            expect(new rectangle_1.Rectangle(1)).toBeInstanceOf(rectangle_1.Rectangle);
            expect(new rectangle_1.Rectangle(1, 2)).toBeInstanceOf(rectangle_1.Rectangle);
            expect(new rectangle_1.Rectangle(1, 2).x).toEqual(1);
            expect(new rectangle_1.Rectangle(1, 2).y).toEqual(2);
            expect(new rectangle_1.Rectangle(1, 2).width).toEqual(0);
            expect(new rectangle_1.Rectangle(1, 2).height).toEqual(0);
            expect(new rectangle_1.Rectangle().equals(new rectangle_1.Rectangle(0, 0, 0, 0)));
        });
        it('should work with key points', function () {
            var rect = new rectangle_1.Rectangle(1, 2, 3, 4);
            expect(rect.origin.equals({ x: 1, y: 2 })).toBeTrue();
            expect(rect.topLeft.equals({ x: 1, y: 2 })).toBeTrue();
            expect(rect.topCenter.equals({ x: 2.5, y: 2 })).toBeTrue();
            expect(rect.topRight.equals({ x: 4, y: 2 })).toBeTrue();
            expect(rect.center.equals({ x: 2.5, y: 4 })).toBeTrue();
            expect(rect.bottomLeft.equals({ x: 1, y: 6 })).toBeTrue();
            expect(rect.bottomCenter.equals({ x: 2.5, y: 6 })).toBeTrue();
            expect(rect.bottomRight.equals({ x: 4, y: 6 })).toBeTrue();
            expect(rect.corner.equals({ x: 4, y: 6 })).toBeTrue();
            expect(rect.leftMiddle.equals({ x: 1, y: 4 })).toBeTrue();
            expect(rect.rightMiddle.equals({ x: 4, y: 4 })).toBeTrue();
        });
        it('should return the key points', function () {
            var rect = new rectangle_1.Rectangle(1, 2, 3, 4);
            expect(rect.getOrigin().equals({ x: 1, y: 2 })).toBeTrue();
            expect(rect.getTopLeft().equals({ x: 1, y: 2 })).toBeTrue();
            expect(rect.getTopCenter().equals({ x: 2.5, y: 2 })).toBeTrue();
            expect(rect.getTopRight().equals({ x: 4, y: 2 })).toBeTrue();
            expect(rect.getCenter().equals({ x: 2.5, y: 4 })).toBeTrue();
            expect(rect.getBottomLeft().equals({ x: 1, y: 6 })).toBeTrue();
            expect(rect.getBottomCenter().equals({ x: 2.5, y: 6 })).toBeTrue();
            expect(rect.getBottomRight().equals({ x: 4, y: 6 })).toBeTrue();
            expect(rect.getCorner().equals({ x: 4, y: 6 })).toBeTrue();
            expect(rect.getLeftMiddle().equals({ x: 1, y: 4 })).toBeTrue();
            expect(rect.getRightMiddle().equals({ x: 4, y: 4 })).toBeTrue();
            expect(rect.getCenterX()).toEqual(2.5);
            expect(rect.getCenterY()).toEqual(4);
        });
        it('should work with key lines', function () {
            var rect = new rectangle_1.Rectangle(1, 2, 3, 4);
            expect(rect.topLine.equals(new line_1.Line(1, 2, 4, 2)));
            expect(rect.rightLine.equals(new line_1.Line(4, 2, 4, 6)));
            expect(rect.bottomLine.equals(new line_1.Line(1, 6, 4, 6)));
            expect(rect.leftLine.equals(new line_1.Line(1, 2, 1, 6)));
        });
        it('should return the key lines', function () {
            var rect = new rectangle_1.Rectangle(1, 2, 3, 4);
            expect(rect.getTopLine().equals(new line_1.Line(1, 2, 4, 2)));
            expect(rect.getRightLine().equals(new line_1.Line(4, 2, 4, 6)));
            expect(rect.getBottomLine().equals(new line_1.Line(1, 6, 4, 6)));
            expect(rect.getLeftLine().equals(new line_1.Line(1, 2, 1, 6)));
        });
    });
    describe('#Rectangle.clone', function () {
        it('should clone rectangle', function () {
            var obj = { x: 1, y: 2, width: 3, height: 4 };
            expect(rectangle_1.Rectangle.clone(new rectangle_1.Rectangle(1, 2, 3, 4)).toJSON()).toEqual(obj);
            expect(rectangle_1.Rectangle.clone(obj).toJSON()).toEqual(obj);
            expect(rectangle_1.Rectangle.clone([1, 2, 3, 4]).toJSON()).toEqual(obj);
        });
    });
    describe('#Rectangle.isRectangleLike', function () {
        it('should return true if the given object is a rectangle-like object', function () {
            var obj = { x: 1, y: 2, width: 3, height: 4 };
            expect(rectangle_1.Rectangle.isRectangleLike(obj)).toBeTrue();
            expect(rectangle_1.Rectangle.isRectangleLike(__assign(__assign({}, obj), { z: 10 }))).toBeTrue();
            expect(rectangle_1.Rectangle.isRectangleLike(__assign(__assign({}, obj), { z: 10, s: 's' }))).toBeTrue();
        });
        it('should return false if the given object is a rectangle-like object', function () {
            expect(rectangle_1.Rectangle.isRectangleLike({ x: 1 })).toBeFalse();
            expect(rectangle_1.Rectangle.isRectangleLike({ y: 2 })).toBeFalse();
            expect(rectangle_1.Rectangle.isRectangleLike({})).toBeFalse();
            expect(rectangle_1.Rectangle.isRectangleLike(null)).toBeFalse();
            expect(rectangle_1.Rectangle.isRectangleLike(false)).toBeFalse();
            expect(rectangle_1.Rectangle.isRectangleLike(1)).toBeFalse();
            expect(rectangle_1.Rectangle.isRectangleLike('s')).toBeFalse();
        });
    });
    describe('#Rectangle.fromSize', function () {
        it('should create a rectangle from the given size', function () {
            expect(rectangle_1.Rectangle.fromSize({ width: 10, height: 8 }).toJSON()).toEqual({
                x: 0,
                y: 0,
                width: 10,
                height: 8,
            });
        });
    });
    describe('#Rectangle.fromPositionAndSize', function () {
        it('should create a rectangle from the given position and size', function () {
            expect(rectangle_1.Rectangle.fromPositionAndSize({ x: 2, y: 5 }, { width: 10, height: 8 }).toJSON()).toEqual({
                x: 2,
                y: 5,
                width: 10,
                height: 8,
            });
        });
    });
    describe('#Rectangle.fromEllipse', function () {
        it('should create a rectangle from the given ellipse', function () {
            expect(rectangle_1.Rectangle.fromEllipse(new ellipse_1.Ellipse(1, 2, 3, 4)).toJSON()).toEqual({
                x: -2,
                y: -2,
                width: 6,
                height: 8,
            });
        });
    });
    describe('#valueOf', function () {
        it('should return JSON object', function () {
            var obj = { x: 1, y: 2, width: 3, height: 4 };
            var rect = rectangle_1.Rectangle.create(obj);
            expect(rect.valueOf()).toEqual(obj);
        });
    });
    describe('#toString', function () {
        it('should return JSON string', function () {
            var obj = { x: 1, y: 2, width: 3, height: 4 };
            var rect = rectangle_1.Rectangle.create(obj);
            expect(rect.toString()).toEqual(JSON.stringify(obj));
        });
    });
    describe('#bbox', function () {
        it('should return a rectangle that is the bounding box of the rectangle.', function () {
            var rect = new rectangle_1.Rectangle(1, 2, 3, 4);
            expect(rect.bbox().equals(rect)).toBeTrue();
        });
        it('should rotate the rectangle if angle specified.', function () {
            var rect = new rectangle_1.Rectangle(0, 0, 2, 4);
            expect(rect.bbox(90).round().equals(new rectangle_1.Rectangle(-1, 1, 4, 2))).toBeTrue();
        });
    });
    describe('#add', function () {
        it('should add the given `rect` to me', function () {
            var rect = new rectangle_1.Rectangle(1, 2, 3, 4);
            expect(rect.add(0, 0, 0, 0)).toEqual(new rectangle_1.Rectangle(0, 0, 4, 6));
        });
    });
    describe('#update', function () {
        it('should update me with the given `rect`', function () {
            var rect = new rectangle_1.Rectangle(1, 2, 3, 4);
            expect(rect.update(0, 0, 1, 1)).toEqual(new rectangle_1.Rectangle(0, 0, 1, 1));
        });
    });
    describe('#inflate', function () {
        it('should inflate me with the given `amount`', function () {
            var rect = new rectangle_1.Rectangle(1, 2, 3, 4);
            expect(rect.inflate(2)).toEqual(new rectangle_1.Rectangle(-1, 0, 7, 8));
        });
        it('should inflate me with the given `dx` and `dy`', function () {
            var rect = new rectangle_1.Rectangle(1, 2, 3, 4);
            expect(rect.inflate(2, 1)).toEqual(new rectangle_1.Rectangle(-1, 1, 7, 6));
        });
    });
    describe('#snapToGrid', function () {
        it('should snap to grid', function () {
            var rect1 = new rectangle_1.Rectangle(2, 6, 33, 44);
            var rect2 = rect1.clone().snapToGrid(10);
            var rect3 = rect1.clone().snapToGrid(3, 5);
            expect(rect2.equals({ x: 0, y: 10, width: 40, height: 40 })).toBeTrue();
            expect(rect3.equals({ x: 3, y: 5, width: 33, height: 45 })).toBeTrue();
        });
    });
    describe('#translate', function () {
        it('should translate x and y by adding the given `dx` and `dy` values respectively', function () {
            var rect = new rectangle_1.Rectangle(1, 2, 3, 4);
            expect(rect.clone().translate(2, 3).toJSON()).toEqual({
                x: 3,
                y: 5,
                width: 3,
                height: 4,
            });
            expect(rect.clone().translate(new point_1.Point(-2, 4)).toJSON()).toEqual({
                x: -1,
                y: 6,
                width: 3,
                height: 4,
            });
        });
    });
    describe('#scale', function () {
        it('should scale point with the given amount', function () {
            expect(new rectangle_1.Rectangle(1, 2, 3, 4).scale(2, 3).toJSON()).toEqual({
                x: 2,
                y: 6,
                width: 6,
                height: 12,
            });
        });
        it('should scale point with the given amount and center ', function () {
            expect(new rectangle_1.Rectangle(20, 30, 10, 20).scale(2, 3, new point_1.Point(40, 45)).toJSON()).toEqual({ x: 0, y: 0, width: 20, height: 60 });
        });
    });
    describe('#rotate', function () {
        it('should rorate the rect by the given angle', function () {
            expect(new rectangle_1.Rectangle(1, 2, 3, 4).rotate(180).round().toJSON()).toEqual({
                x: 1,
                y: 2,
                width: 3,
                height: 4,
            });
        });
        it('should keep the same when the given angle is `0`', function () {
            expect(new rectangle_1.Rectangle(1, 2, 3, 4).rotate(0).toJSON()).toEqual({
                x: 1,
                y: 2,
                width: 3,
                height: 4,
            });
        });
    });
    describe('#rotate90', function () {
        it("should rorate the rect by 90deg around it's center", function () {
            expect(new rectangle_1.Rectangle(1, 2, 3, 4).rotate90().toJSON()).toEqual({
                x: 0.5,
                y: 2.5,
                width: 4,
                height: 3,
            });
        });
    });
    describe('#getMaxScaleToFit', function () {
        it('should return the scale amount', function () {
            var scale1 = new rectangle_1.Rectangle(1, 2, 3, 4).getMaxScaleToFit([5, 6, 7, 8]);
            var scale2 = new rectangle_1.Rectangle(1, 2, 3, 4).getMaxScaleToFit([0, 0, 7, 8]);
            expect(scale1.sx.toFixed(2)).toEqual('0.16');
            expect(scale1.sy.toFixed(2)).toEqual('0.20');
            expect(scale2.sx.toFixed(2)).toEqual('0.33');
            expect(scale2.sy.toFixed(2)).toEqual('0.50');
        });
    });
    describe('#getMaxUniformScaleToFit', function () {
        it('should return the scale amount', function () {
            var s1 = new rectangle_1.Rectangle(1, 2, 3, 4).getMaxUniformScaleToFit([5, 6, 7, 8]);
            var s2 = new rectangle_1.Rectangle(1, 2, 3, 4).getMaxUniformScaleToFit([0, 0, 7, 8]);
            expect(s1.toFixed(2)).toEqual('0.16');
            expect(s2.toFixed(2)).toEqual('0.33');
        });
    });
    describe('#moveAndExpand', function () {
        it('should translate and expand me by the given `rect`', function () {
            expect(new rectangle_1.Rectangle(1, 2, 3, 4)
                .moveAndExpand(new rectangle_1.Rectangle(1, 2, 3, 4))
                .toJSON()).toEqual({ x: 2, y: 4, width: 6, height: 8 });
            expect(new rectangle_1.Rectangle(1, 2, 3, 4).moveAndExpand(new rectangle_1.Rectangle()).toJSON()).toEqual({ x: 1, y: 2, width: 3, height: 4 });
        });
    });
    describe('#containsPoint', function () {
        it('should return true when rect contains the given point', function () {
            expect(new rectangle_1.Rectangle(50, 50, 100, 100).containsPoint(60, 60)).toBeTrue();
        });
    });
    describe('#containsRect', function () {
        it('should return true when rect is completely inside the other rect', function () {
            expect(new rectangle_1.Rectangle(50, 50, 100, 100).containsRect(60, 60, 80, 80)).toBeTrue();
        });
        it('should return true when rect is equal the other rect', function () {
            expect(new rectangle_1.Rectangle(50, 50, 100, 100).containsRect({
                x: 50,
                y: 50,
                width: 100,
                height: 100,
            })).toBeTrue();
        });
        it('should return false when rect is not inside the other rect', function () {
            expect(new rectangle_1.Rectangle(50, 50, 100, 100).containsRect(20, 20, 200, 200)).toBeFalse();
            expect(new rectangle_1.Rectangle(50, 50, 100, 100).containsRect(40, 40, 100, 100)).toBeFalse();
            expect(new rectangle_1.Rectangle(50, 50, 100, 100).containsRect(60, 60, 100, 40)).toBeFalse();
            expect(new rectangle_1.Rectangle(50, 50, 100, 100).containsRect(60, 60, 100, 100)).toBeFalse();
            expect(new rectangle_1.Rectangle(50, 50, 100, 100).containsRect(60, 60, 40, 100)).toBeFalse();
        });
        it('should return false when one of the dimensions is `0`', function () {
            expect(new rectangle_1.Rectangle(50, 50, 100, 100).containsRect(75, 75, 0, 0)).toBeFalse();
            expect(new rectangle_1.Rectangle(50, 50, 0, 0).containsRect(50, 50, 0, 0)).toBeFalse();
        });
    });
    describe('#intersectsWithRect', function () {
        it('should return the intersection', function () {
            var _a, _b, _c;
            // inside
            expect((_a = new rectangle_1.Rectangle(20, 20, 100, 100)
                .intersectsWithRect([40, 40, 20, 20])) === null || _a === void 0 ? void 0 : _a.toJSON()).toEqual({ x: 40, y: 40, width: 20, height: 20 });
            expect((_b = new rectangle_1.Rectangle(20, 20, 100, 100)
                .intersectsWithRect([0, 0, 100, 100])) === null || _b === void 0 ? void 0 : _b.toJSON()).toEqual({ x: 20, y: 20, width: 80, height: 80 });
            expect((_c = new rectangle_1.Rectangle(20, 20, 100, 100)
                .intersectsWithRect([40, 40, 100, 100])) === null || _c === void 0 ? void 0 : _c.toJSON()).toEqual({ x: 40, y: 40, width: 80, height: 80 });
        });
        it('should return null when no intersection', function () {
            expect(new rectangle_1.Rectangle(20, 20, 100, 100).intersectsWithRect([140, 140, 20, 20])).toBeNull();
        });
    });
    describe('#intersectsWithLine', function () {
        it('should return the intersection points', function () {
            var points1 = new rectangle_1.Rectangle(0, 0, 4, 4).intersectsWithLine(new line_1.Line(2, 2, 2, 8));
            var points2 = new rectangle_1.Rectangle(0, 0, 4, 4).intersectsWithLine(new line_1.Line(2, -2, 2, 8));
            expect(point_1.Point.equalPoints(points1, [{ x: 2, y: 4 }]));
            expect(point_1.Point.equalPoints(points2, [
                { x: 2, y: 0 },
                { x: 2, y: 4 },
            ]));
        });
        it('should return null when no intersection exists', function () {
            expect(new rectangle_1.Rectangle(0, 0, 4, 4).intersectsWithLine(new line_1.Line(-2, -2, -2, -8))).toBeNull();
        });
    });
    describe('#intersectsWithLineFromCenterToPoint', function () {
        it('should return the intersection point', function () {
            var _a, _b;
            expect((_a = new rectangle_1.Rectangle(0, 0, 4, 4)
                .intersectsWithLineFromCenterToPoint([2, 8])) === null || _a === void 0 ? void 0 : _a.equals([2, 4])).toBeTrue();
            expect((_b = new rectangle_1.Rectangle(0, 0, 4, 4)
                .intersectsWithLineFromCenterToPoint([2, 8], 90)) === null || _b === void 0 ? void 0 : _b.round().equals([2, 4])).toBeTrue();
        });
        it('should return null when no intersection exists', function () {
            expect(new rectangle_1.Rectangle(0, 0, 4, 4).intersectsWithLineFromCenterToPoint([3, 3])).toBeNull();
        });
    });
    describe('#normalize', function () {
        it('should keep the same when width and height is positive', function () {
            expect(new rectangle_1.Rectangle(1, 2, 3, 4).normalize().toJSON()).toEqual({
                x: 1,
                y: 2,
                width: 3,
                height: 4,
            });
        });
        it('should make the width positive', function () {
            expect(new rectangle_1.Rectangle(1, 2, -3, 4).normalize().toJSON()).toEqual({
                x: -2,
                y: 2,
                width: 3,
                height: 4,
            });
        });
        it('should make the height positive', function () {
            expect(new rectangle_1.Rectangle(1, 2, 3, -4).normalize().toJSON()).toEqual({
                x: 1,
                y: -2,
                width: 3,
                height: 4,
            });
        });
    });
    describe('#union', function () { });
    describe('#getNearestSideToPoint', function () {
        it('should return the nearest side to point when point is on the side', function () {
            var rect = new rectangle_1.Rectangle(0, 0, 4, 4);
            expect(rect.getNearestSideToPoint({ x: 0, y: 0 })).toEqual('left');
            expect(rect.getNearestSideToPoint({ x: 4, y: 4 })).toEqual('right');
            expect(rect.getNearestSideToPoint({ x: 0, y: 4 })).toEqual('left');
            expect(rect.getNearestSideToPoint({ x: 4, y: 0 })).toEqual('right');
            expect(rect.getNearestSideToPoint({ x: 2, y: 0 })).toEqual('top');
            expect(rect.getNearestSideToPoint({ x: 0, y: 2 })).toEqual('left');
            expect(rect.getNearestSideToPoint({ x: 4, y: 2 })).toEqual('right');
            expect(rect.getNearestSideToPoint({ x: 2, y: 4 })).toEqual('bottom');
        });
        it('should return the nearest side to point when point is outside', function () {
            var rect = new rectangle_1.Rectangle(0, 0, 4, 4);
            expect(rect.getNearestSideToPoint({ x: 5, y: 5 })).toEqual('right');
            expect(rect.getNearestSideToPoint({ x: 5, y: 4 })).toEqual('right');
            expect(rect.getNearestSideToPoint({ x: 5, y: 2 })).toEqual('right');
            expect(rect.getNearestSideToPoint({ x: 5, y: 0 })).toEqual('right');
            expect(rect.getNearestSideToPoint({ x: 5, y: -1 })).toEqual('right');
            expect(rect.getNearestSideToPoint({ x: -1, y: 5 })).toEqual('left');
            expect(rect.getNearestSideToPoint({ x: -1, y: 4 })).toEqual('left');
            expect(rect.getNearestSideToPoint({ x: -1, y: 2 })).toEqual('left');
            expect(rect.getNearestSideToPoint({ x: -1, y: 0 })).toEqual('left');
            expect(rect.getNearestSideToPoint({ x: -1, y: -1 })).toEqual('left');
            expect(rect.getNearestSideToPoint({ x: 0, y: 5 })).toEqual('bottom');
            expect(rect.getNearestSideToPoint({ x: 2, y: 5 })).toEqual('bottom');
            expect(rect.getNearestSideToPoint({ x: 4, y: 5 })).toEqual('bottom');
            expect(rect.getNearestSideToPoint({ x: 0, y: -1 })).toEqual('top');
            expect(rect.getNearestSideToPoint({ x: 2, y: -1 })).toEqual('top');
            expect(rect.getNearestSideToPoint({ x: 4, y: -1 })).toEqual('top');
        });
        it('should return the nearest side to point when point is inside', function () {
            var rect = new rectangle_1.Rectangle(0, 0, 4, 4);
            expect(rect.getNearestSideToPoint({ x: 2, y: 1 })).toEqual('top');
            expect(rect.getNearestSideToPoint({ x: 3, y: 2 })).toEqual('right');
            expect(rect.getNearestSideToPoint({ x: 2, y: 3 })).toEqual('bottom');
            expect(rect.getNearestSideToPoint({ x: 1, y: 2 })).toEqual('left');
        });
    });
    describe('#getNearestPointToPoint', function () {
        it('should return the nearest point to point when point is inside the rect', function () {
            var rect = new rectangle_1.Rectangle(0, 0, 4, 4);
            // left
            expect(rect.getNearestPointToPoint({ x: 1, y: 2 }).toJSON()).toEqual({
                x: 0,
                y: 2,
            });
            // right
            expect(rect.getNearestPointToPoint({ x: 3, y: 2 }).toJSON()).toEqual({
                x: 4,
                y: 2,
            });
            // top
            expect(rect.getNearestPointToPoint({ x: 2, y: 1 }).toJSON()).toEqual({
                x: 2,
                y: 0,
            });
            // bottom
            expect(rect.getNearestPointToPoint({ x: 2, y: 3 }).toJSON()).toEqual({
                x: 2,
                y: 4,
            });
        });
        it('should return the nearest point to point when point is outside the rect', function () {
            var rect = new rectangle_1.Rectangle(0, 0, 4, 4);
            expect(rect.getNearestPointToPoint({ x: 5, y: 5 }).toJSON()).toEqual({
                x: 4,
                y: 4,
            });
            expect(rect.getNearestPointToPoint({ x: -1, y: -1 }).toJSON()).toEqual({
                x: 0,
                y: 0,
            });
        });
    });
    describe('#serialize', function () {
        it('should return the serialized string', function () {
            expect(new rectangle_1.Rectangle(1, 2, 3, 4).serialize()).toEqual('1 2 3 4');
        });
    });
});
//# sourceMappingURL=rectangle.test.js.map