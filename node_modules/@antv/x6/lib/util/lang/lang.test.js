"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _1 = require(".");
describe('Lang', function () {
    describe('#isNumeric', function () {
        it('should return true with numberic string', function () {
            expect(_1.Lang.isNumeric('1')).toBe(true);
            expect(_1.Lang.isNumeric('1.2')).toBe(true);
        });
        it('should return true with invalid types', function () {
            expect(_1.Lang.isNumeric(null)).toBe(false);
            expect(_1.Lang.isNumeric(undefined)).toBe(false);
            expect(_1.Lang.isNumeric({ a: 1 })).toBe(false);
            expect(_1.Lang.isNumeric([1])).toBe(false);
            expect(_1.Lang.isNumeric(new Date())).toBe(false);
            expect(_1.Lang.isNumeric(/a/g)).toBe(false);
        });
    });
    describe('#isWindow', function () {
        it('should return `true` for window', function () {
            expect(_1.Lang.isWindow(window)).toBe(true);
        });
        it('should return `false` for non window', function () {
            expect(_1.Lang.isWindow(1)).toBe(false);
            expect(_1.Lang.isWindow(false)).toBe(false);
            expect(_1.Lang.isWindow('a')).toBe(false);
            expect(_1.Lang.isWindow(/x/)).toBe(false);
            expect(_1.Lang.isWindow({ a: 1 })).toBe(false);
            expect(_1.Lang.isWindow([1, 2, 3])).toBe(false);
            expect(_1.Lang.isWindow(new Date())).toBe(false);
            expect(_1.Lang.isWindow(new Error())).toBe(false);
        });
    });
});
//# sourceMappingURL=lang.test.js.map