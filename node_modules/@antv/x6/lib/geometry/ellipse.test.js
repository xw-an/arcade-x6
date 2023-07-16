"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ellipse_1 = require("./ellipse");
var line_1 = require("./line");
var point_1 = require("./point");
var rectangle_1 = require("./rectangle");
describe('ellipse', function () {
    describe('#constructor', function () {
        it('should create an ellipse instance', function () {
            expect(new ellipse_1.Ellipse()).toBeInstanceOf(ellipse_1.Ellipse);
            expect(new ellipse_1.Ellipse(1)).toBeInstanceOf(ellipse_1.Ellipse);
            expect(new ellipse_1.Ellipse(1, 2)).toBeInstanceOf(ellipse_1.Ellipse);
            expect(new ellipse_1.Ellipse(1, 2, 3)).toBeInstanceOf(ellipse_1.Ellipse);
            expect(new ellipse_1.Ellipse(1, 2, 3, 4)).toBeInstanceOf(ellipse_1.Ellipse);
            expect(new ellipse_1.Ellipse(1, 2, 3, 4).x).toEqual(1);
            expect(new ellipse_1.Ellipse(1, 2, 3, 4).y).toEqual(2);
            expect(new ellipse_1.Ellipse(1, 2, 3, 4).a).toEqual(3);
            expect(new ellipse_1.Ellipse(1, 2, 3, 4).b).toEqual(4);
            expect(new ellipse_1.Ellipse().equals(new ellipse_1.Ellipse(0, 0, 0, 0)));
        });
        it('should return the center point', function () {
            var ellipse = new ellipse_1.Ellipse(1, 2, 3, 4);
            expect(ellipse.getCenter().equals({ x: 1, y: 2 }));
            expect(ellipse.center.equals({ x: 1, y: 2 }));
        });
    });
    describe('#Ellipse.create', function () {
        it('should create an ellipse from number', function () {
            var ellipse = ellipse_1.Ellipse.create(1, 2, 3, 4);
            expect(ellipse.x).toEqual(1);
            expect(ellipse.y).toEqual(2);
            expect(ellipse.a).toEqual(3);
            expect(ellipse.b).toEqual(4);
        });
        it('should create an ellipse from Ellipse instance', function () {
            var ellipse = ellipse_1.Ellipse.create(new ellipse_1.Ellipse(1, 2, 3, 4));
            expect(ellipse.x).toEqual(1);
            expect(ellipse.y).toEqual(2);
            expect(ellipse.a).toEqual(3);
            expect(ellipse.b).toEqual(4);
        });
        it('should create an ellipse from EllipseLike', function () {
            var ellipse = ellipse_1.Ellipse.create({ x: 1, y: 2, a: 3, b: 4 });
            expect(ellipse.x).toEqual(1);
            expect(ellipse.y).toEqual(2);
            expect(ellipse.a).toEqual(3);
            expect(ellipse.b).toEqual(4);
        });
        it('should create an ellipse from EllipseData', function () {
            var ellipse = ellipse_1.Ellipse.create([1, 2, 3, 4]);
            expect(ellipse.x).toEqual(1);
            expect(ellipse.y).toEqual(2);
            expect(ellipse.a).toEqual(3);
            expect(ellipse.b).toEqual(4);
        });
    });
    describe('#Ellipse.fromRect', function () {
        it('should create an ellipse from a rectangle instance', function () {
            var ellipse = ellipse_1.Ellipse.fromRect(new rectangle_1.Rectangle(1, 2, 3, 4));
            expect(ellipse.x).toEqual(2.5);
            expect(ellipse.y).toEqual(4);
            expect(ellipse.a).toEqual(1.5);
            expect(ellipse.b).toEqual(2);
        });
    });
    describe('#bbox', function () {
        it('should return the bbox', function () {
            expect(new ellipse_1.Ellipse(1, 2, 3, 4).bbox().toJSON()).toEqual({
                x: -2,
                y: -2,
                width: 6,
                height: 8,
            });
        });
    });
    describe('#inflate', function () {
        it('should inflate with the given `amount`', function () {
            expect(new ellipse_1.Ellipse(1, 2, 3, 4).inflate(2).toJSON()).toEqual({
                x: 1,
                y: 2,
                a: 7,
                b: 8,
            });
        });
        it('should inflate with the given `dx` and `dy`', function () {
            expect(new ellipse_1.Ellipse(1, 2, 3, 4).inflate(2, 3).toJSON()).toEqual({
                x: 1,
                y: 2,
                a: 7,
                b: 10,
            });
        });
    });
    describe('#normalizedDistance', function () {
        it('should return a normalized distance', function () {
            var ellipse = new ellipse_1.Ellipse(0, 0, 3, 4);
            expect(ellipse.normalizedDistance(1, 1) < 1).toBeTrue();
            expect(ellipse.normalizedDistance({ x: 5, y: 5 }) > 1).toBeTrue();
            expect(ellipse.normalizedDistance([0, 4]) === 1).toBeTrue();
        });
    });
    describe('#containsPoint', function () {
        var ellipse = new ellipse_1.Ellipse(0, 0, 3, 4);
        it('shoule return true when ellipse contains the given point', function () {
            expect(ellipse.containsPoint(1, 1)).toBeTrue();
        });
        it('shoule return true when the given point is on the boundary of the ellipse', function () {
            expect(ellipse.containsPoint([0, 4])).toBeTrue();
        });
        it('shoule return true when ellipse not contains the given point', function () {
            expect(ellipse.containsPoint({ x: 5, y: 5 })).toBeFalse();
        });
    });
    describe('#intersectsWithLine', function () {
        var ellipse = new ellipse_1.Ellipse(0, 0, 3, 4);
        it('should return the intersections with line', function () {
            expect(point_1.Point.equalPoints(ellipse.intersectsWithLine(new line_1.Line(0, -5, 0, 5)), [
                { x: 0, y: -4 },
                { x: 0, y: 4 },
            ])).toBeTrue();
            expect(point_1.Point.equalPoints(ellipse.intersectsWithLine(new line_1.Line(0, 0, 0, 5)), [
                { x: 0, y: 4 },
            ])).toBeTrue();
            expect(point_1.Point.equalPoints(ellipse.intersectsWithLine(new line_1.Line(3, 0, 3, 4)), [
                { x: 3, y: 0 },
            ])).toBeTrue();
        });
        it('should return null when not intersections', function () {
            expect(ellipse.intersectsWithLine(new line_1.Line(0, 0, 1, 1))).toBeNull();
            expect(ellipse.intersectsWithLine(new line_1.Line(3, 5, 3, 6))).toBeNull();
            expect(ellipse.intersectsWithLine(new line_1.Line(-6, -6, -6, 100))).toBeNull();
            expect(ellipse.intersectsWithLine(new line_1.Line(6, 6, 100, 100))).toBeNull();
        });
    });
    describe('#intersectsWithLineFromCenterToPoint', function () {
        var ellipse = new ellipse_1.Ellipse(0, 0, 3, 4);
        it('should return the intersection point when the given point is outside of the ellipse', function () {
            expect(ellipse
                .intersectsWithLineFromCenterToPoint({ x: 0, y: 6 })
                .round()
                .toJSON()).toEqual({ x: 0, y: 4 });
            expect(ellipse
                .intersectsWithLineFromCenterToPoint({ x: 6, y: 0 })
                .round()
                .toJSON()).toEqual({ x: 3, y: 0 });
            expect(ellipse
                .intersectsWithLineFromCenterToPoint({ x: 0, y: 6 }, 90)
                .round()
                .toJSON()).toEqual({ x: 0, y: 3 });
        });
        it('should return the intersection point when the given point is inside of the ellipse', function () {
            expect(ellipse
                .intersectsWithLineFromCenterToPoint({ x: 0, y: 0 }, 90)
                .round()
                .toJSON()).toEqual({ x: -0, y: -3 });
            expect(ellipse
                .intersectsWithLineFromCenterToPoint({ x: 0, y: 2 })
                .round()
                .toJSON()).toEqual({ x: 0, y: 4 });
            expect(ellipse
                .intersectsWithLineFromCenterToPoint({ x: 0, y: 2 }, 90)
                .round()
                .toJSON()).toEqual({ x: 0, y: 3 });
            expect(ellipse
                .intersectsWithLineFromCenterToPoint({ x: 2, y: 0 }, 90)
                .round()
                .toJSON()).toEqual({ x: 4, y: -0 });
        });
    });
    describe('#tangentTheta', function () {
        it('should return the tangent theta', function () {
            var ellipse = new ellipse_1.Ellipse(0, 0, 3, 4);
            expect(ellipse.tangentTheta({ x: 3, y: 0 })).toEqual(270);
            expect(ellipse.tangentTheta({ x: -3, y: 0 })).toEqual(90);
            expect(ellipse.tangentTheta({ x: 0, y: 4 })).toEqual(180);
            expect(ellipse.tangentTheta({ x: 0, y: -4 })).toEqual(-0);
        });
    });
    describe('#scale', function () {
        it('should scale the ellipse with the given `sx` and `sy`', function () {
            var ellipse = new ellipse_1.Ellipse(1, 2, 3, 4).scale(3, 4);
            expect(ellipse.x).toEqual(1);
            expect(ellipse.y).toEqual(2);
            expect(ellipse.a).toEqual(9);
            expect(ellipse.b).toEqual(16);
        });
    });
    describe('#translate', function () {
        it('should translate the ellipse with the given `dx` and `dy`', function () {
            var ellipse = new ellipse_1.Ellipse(1, 2, 3, 4).translate(3, 4);
            expect(ellipse.x).toEqual(4);
            expect(ellipse.y).toEqual(6);
            expect(ellipse.a).toEqual(3);
            expect(ellipse.b).toEqual(4);
        });
    });
    describe('#clone', function () {
        it('should return the cloned ellipse', function () {
            var ellipse = new ellipse_1.Ellipse(1, 2, 3, 4).clone();
            expect(ellipse.x).toEqual(1);
            expect(ellipse.y).toEqual(2);
            expect(ellipse.a).toEqual(3);
            expect(ellipse.b).toEqual(4);
        });
    });
    describe('#serialize', function () {
        it('should return the serialized string', function () {
            expect(new ellipse_1.Ellipse(1, 2, 3, 4).serialize()).toEqual('1 2 3 4');
        });
    });
});
//# sourceMappingURL=ellipse.test.js.map