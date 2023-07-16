"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var color_1 = require("./color");
describe('Color', function () {
    describe('#constructor', function () {
        it('shoud create instance from named color', function () {
            var black = new color_1.Color(color_1.Color.named.black);
            expect(black.r).toBe(0);
            expect(black.g).toBe(0);
            expect(black.b).toBe(0);
            expect(black.a).toBe(1);
            var white = new color_1.Color(color_1.Color.named.white);
            expect(white.r).toBe(255);
            expect(white.g).toBe(255);
            expect(white.b).toBe(255);
            expect(black.a).toBe(1);
        });
        it('should create instance from hex color', function () {
            var black = new color_1.Color('#000000');
            expect(black.r).toBe(0);
            expect(black.g).toBe(0);
            expect(black.b).toBe(0);
            expect(black.a).toBe(1);
            var white = new color_1.Color('#fff');
            expect(white.r).toBe(255);
            expect(white.g).toBe(255);
            expect(white.b).toBe(255);
            expect(black.a).toBe(1);
        });
        it('should create instance from rgba array', function () {
            var black = new color_1.Color([0, 0, 0, 1]);
            expect(black.r).toBe(0);
            expect(black.g).toBe(0);
            expect(black.b).toBe(0);
            expect(black.a).toBe(1);
        });
        it('should create instance from rgba values', function () {
            var black = new color_1.Color(-1, 0, 300, 1);
            expect(black.r).toBe(0);
            expect(black.g).toBe(0);
            expect(black.b).toBe(255);
            expect(black.a).toBe(1);
        });
    });
    describe('#randomHex', function () {
        it('shoud return valid random hex value', function () {
            expect(color_1.Color.randomHex()).toMatch(/^#[0-9A-F]{6}/);
        });
    });
    describe('#randomRGBA', function () {
        it('shoud generate an rgba color string', function () {
            expect(color_1.Color.randomRGBA().startsWith('rgba')).toBe(true);
            expect(color_1.Color.randomRGBA(true).startsWith('rgba')).toBe(true);
        });
    });
    describe('#invert', function () {
        it('shoud return invert value of a color value', function () {
            expect(color_1.Color.invert('#ffffff', false)).toBe('#000000');
            expect(color_1.Color.invert('#000', false)).toBe('#ffffff');
            expect(color_1.Color.invert('234567', false)).toBe('dcba98');
        });
        it('decide font color in white or black depending on background color', function () {
            expect(color_1.Color.invert('#121212', true)).toBe('#ffffff');
            expect(color_1.Color.invert('#feeade', true)).toBe('#000000');
        });
        it('shoud throw exception with invalid color value', function () {
            expect(function () {
                color_1.Color.invert('#abcd', false);
            }).toThrowError('Invalid hex color.');
        });
    });
});
//# sourceMappingURL=color.test.js.map