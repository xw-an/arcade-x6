"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _1 = require(".");
describe('JSONExt', function () {
    describe('isPrimitive()', function () {
        it('should return `true` if the value is a primitive', function () {
            expect(_1.JSONExt.isPrimitive(null)).toEqual(true);
            expect(_1.JSONExt.isPrimitive(false)).toEqual(true);
            expect(_1.JSONExt.isPrimitive(true)).toEqual(true);
            expect(_1.JSONExt.isPrimitive(1)).toEqual(true);
            expect(_1.JSONExt.isPrimitive('1')).toEqual(true);
        });
        it('should return `false` if the value is not a primitive', function () {
            expect(_1.JSONExt.isPrimitive([])).toEqual(false);
            expect(_1.JSONExt.isPrimitive({})).toEqual(false);
        });
    });
    describe('isArray()', function () {
        it('should test whether a JSON value is an array', function () {
            expect(_1.JSONExt.isArray([])).toEqual(true);
            expect(_1.JSONExt.isArray(null)).toEqual(false);
            expect(_1.JSONExt.isArray(1)).toEqual(false);
        });
    });
    describe('isObject()', function () {
        it('should test whether a JSON value is an object', function () {
            expect(_1.JSONExt.isObject({ a: 1 })).toEqual(true);
            expect(_1.JSONExt.isObject({})).toEqual(true);
            expect(_1.JSONExt.isObject([])).toEqual(false);
            expect(_1.JSONExt.isObject(1)).toEqual(false);
        });
    });
    describe('deepEqual()', function () {
        it('should compare two JSON values for deep equality', function () {
            expect(_1.JSONExt.deepEqual([], [])).toEqual(true);
            expect(_1.JSONExt.deepEqual([1], [1])).toEqual(true);
            expect(_1.JSONExt.deepEqual({}, {})).toEqual(true);
            expect(_1.JSONExt.deepEqual({ a: [] }, { a: [] })).toEqual(true);
            expect(_1.JSONExt.deepEqual({ a: { b: null } }, { a: { b: null } })).toEqual(true);
            expect(_1.JSONExt.deepEqual({ a: '1' }, { a: '1' })).toEqual(true);
            expect(_1.JSONExt.deepEqual({ a: { b: null } }, { a: { b: '1' } })).toEqual(false);
            expect(_1.JSONExt.deepEqual({ a: [] }, { a: [1] })).toEqual(false);
            expect(_1.JSONExt.deepEqual([1], [1, 2])).toEqual(false);
            expect(_1.JSONExt.deepEqual(null, [1, 2])).toEqual(false);
            expect(_1.JSONExt.deepEqual([1], {})).toEqual(false);
            expect(_1.JSONExt.deepEqual([1], [2])).toEqual(false);
            expect(_1.JSONExt.deepEqual({}, { a: 1 })).toEqual(false);
            expect(_1.JSONExt.deepEqual({ b: 1 }, { a: 1 })).toEqual(false);
        });
    });
    describe('deepCopy()', function () {
        it('should deep copy an object', function () {
            var v1 = null;
            var v2 = true;
            var v3 = false;
            var v4 = 'foo';
            var v5 = 42;
            var v6 = [1, 2, 3, [4, 5, 6], { a: 12, b: [4, 5] }, false];
            var v7 = { a: false, b: [null, [1, 2]], c: { a: 1 } };
            var r1 = _1.JSONExt.deepCopy(v1);
            var r2 = _1.JSONExt.deepCopy(v2);
            var r3 = _1.JSONExt.deepCopy(v3);
            var r4 = _1.JSONExt.deepCopy(v4);
            var r5 = _1.JSONExt.deepCopy(v5);
            var r6 = _1.JSONExt.deepCopy(v6);
            var r7 = _1.JSONExt.deepCopy(v7);
            expect(v1).toEqual(r1);
            expect(v2).toEqual(r2);
            expect(v3).toEqual(r3);
            expect(v4).toEqual(r4);
            expect(v5).toEqual(r5);
            expect(v6).toEqual(r6);
            expect(v7).toEqual(r7);
            expect(v6).toEqual(r6);
            expect(v6[3]).not.toBe(r6[3]);
            expect(v6[4]).not.toBe(r6[4]);
            expect(v6[4].b).not.toBe(r6[4].b);
            expect(v7).toEqual(r7);
            expect(v7.b).not.toBe(r7.b);
            expect(v7.b[1]).not.toBe(r7.b[1]);
            expect(v7.c).not.toBe(r7.c);
        });
    });
});
//# sourceMappingURL=index.test.js.map