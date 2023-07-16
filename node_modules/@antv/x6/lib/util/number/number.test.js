"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _1 = require(".");
describe('NumberExt', function () {
    describe('#mod', function () {
        it('should work with positive numbers', function () {
            expect(_1.NumberExt.mod(12, 5)).toEqual(2);
        });
        it('should work with negative numbers', function () {
            expect(_1.NumberExt.mod(-12, 5)).toEqual(3);
            expect(_1.NumberExt.mod(12, -5)).toEqual(-3);
            expect(_1.NumberExt.mod(-12, -5)).toEqual(-2);
        });
    });
    describe('#random', function () {
        it('should return random number between lower and upper', function () {
            var rnd = _1.NumberExt.random(2, 5);
            expect(rnd).toBeGreaterThanOrEqual(2);
            expect(rnd).toBeLessThanOrEqual(5);
        });
        it('should automatically reverses the order of parameters', function () {
            var rnd = _1.NumberExt.random(5, 2);
            expect(rnd).toBeGreaterThanOrEqual(2);
            expect(rnd).toBeLessThanOrEqual(5);
        });
    });
    describe('#parseCssNumeric', function () {
        it('should work with valid params', function () {
            expect(_1.NumberExt.parseCssNumeric('12px')).toEqual({
                unit: 'px',
                value: 12,
            });
            expect(_1.NumberExt.parseCssNumeric('12px', ['px'])).toEqual({
                unit: 'px',
                value: 12,
            });
            expect(_1.NumberExt.parseCssNumeric('12px', 'px')).toEqual({
                unit: 'px',
                value: 12,
            });
        });
        it('should return null with invalid params', function () {
            expect(_1.NumberExt.parseCssNumeric('abc')).toBe(null);
            expect(_1.NumberExt.parseCssNumeric('12px', [])).toBe(null);
        });
    });
    describe('#normalizePercentage', function () {
        it('should return 0 when input is invalid', function () {
            expect(_1.NumberExt.normalizePercentage(null, 1)).toBe(0);
            expect(_1.NumberExt.normalizePercentage(Infinity, 1)).toBe(0);
        });
        it('should work with valid input', function () {
            expect(_1.NumberExt.normalizePercentage('500%', 1)).toBe(5);
            expect(_1.NumberExt.normalizePercentage(0.1, 10)).toBe(1);
        });
    });
    describe('#normalizeSides', function () {
        it('should return the same property', function () {
            expect(_1.NumberExt.normalizeSides(10)).toEqual({
                top: 10,
                right: 10,
                bottom: 10,
                left: 10,
            });
        });
        it('should work with object', function () {
            var slides = {
                left: 0,
                right: 10,
                top: 20,
                bottom: 30,
            };
            expect(_1.NumberExt.normalizeSides(slides)).toEqual(slides);
            slides = {
                left: 0,
                right: 10,
                vertical: 20,
            };
            expect(_1.NumberExt.normalizeSides(slides)).toEqual({
                left: 0,
                right: 10,
                top: 20,
                bottom: 20,
            });
            slides = {
                horizontal: 30,
                vertical: 20,
            };
            expect(_1.NumberExt.normalizeSides(slides)).toEqual({
                left: 30,
                right: 30,
                top: 20,
                bottom: 20,
            });
        });
    });
});
//# sourceMappingURL=number.test.js.map