"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var sinon_1 = __importDefault(require("sinon"));
var _1 = require(".");
describe('FunctionExt', function () {
    describe('#call', function () {
        it('should invoke function with empty args', function () {
            var spy = sinon_1.default.spy();
            var ctx = {};
            _1.FunctionExt.call(spy, ctx);
            expect(spy.calledOn(ctx)).toBeTruthy();
            expect(spy.calledWith()).toBeTruthy();
        });
        it('should invoke function with one args', function () {
            var spy = sinon_1.default.spy();
            var ctx = {};
            _1.FunctionExt.call(spy, ctx, 1);
            expect(spy.calledOn(ctx)).toBeTruthy();
            expect(spy.calledWith(1)).toBeTruthy();
        });
        it('should invoke function with two args', function () {
            var spy = sinon_1.default.spy();
            var ctx = {};
            _1.FunctionExt.call(spy, ctx, 1, '2');
            expect(spy.calledOn(ctx)).toBeTruthy();
            expect(spy.calledWith(1, '2')).toBeTruthy();
        });
        it('should invoke function with three args', function () {
            var spy = sinon_1.default.spy();
            var ctx = {};
            _1.FunctionExt.call(spy, ctx, 1, '2', true);
            expect(spy.calledOn(ctx)).toBeTruthy();
            expect(spy.calledWith(1, '2', true)).toBeTruthy();
        });
        it('should invoke function with four args', function () {
            var spy = sinon_1.default.spy();
            var ctx = {};
            var obj = {};
            _1.FunctionExt.call(spy, ctx, 1, '2', true, obj);
            expect(spy.calledOn(ctx)).toBeTruthy();
            expect(spy.calledWith(1, '2', true, obj)).toBeTruthy();
        });
        it('should invoke function with five args', function () {
            var spy = sinon_1.default.spy();
            var ctx = {};
            var obj = {};
            var reg = /a/g;
            _1.FunctionExt.call(spy, ctx, 1, '2', true, obj, reg);
            expect(spy.calledOn(ctx)).toBeTruthy();
            expect(spy.calledWith(1, '2', true, obj, reg)).toBeTruthy();
        });
        it('should invoke function with six args', function () {
            var spy = sinon_1.default.spy();
            var ctx = {};
            var obj = {};
            var reg = /a/g;
            var arr = [1, 2, 3];
            _1.FunctionExt.call(spy, ctx, 1, '2', true, obj, reg, arr);
            expect(spy.calledOn(ctx)).toBeTruthy();
            expect(spy.calledWith(1, '2', true, obj, reg, arr)).toBeTruthy();
        });
        it('should invoke function with more args', function () {
            var spy = sinon_1.default.spy();
            var ctx = {};
            var obj = {};
            var reg = /a/g;
            var arr = [1, 2, 3];
            _1.FunctionExt.call(spy, ctx, 1, '2', true, obj, reg, arr, 'more');
            expect(spy.calledOn(ctx)).toBeTruthy();
            expect(spy.calledWith(1, '2', true, obj, reg, arr, 'more')).toBeTruthy();
        });
    });
    describe('#apply', function () {
        it('should invoke function with empty args', function () {
            var spy = sinon_1.default.spy();
            var ctx = {};
            _1.FunctionExt.apply(spy, ctx);
            expect(spy.calledOn(ctx)).toBeTruthy();
            expect(spy.calledWith()).toBeTruthy();
        });
        it('should invoke function with one args', function () {
            var spy = sinon_1.default.spy();
            var ctx = {};
            _1.FunctionExt.apply(spy, ctx, [1]);
            expect(spy.calledOn(ctx)).toBeTruthy();
            expect(spy.calledWith(1)).toBeTruthy();
        });
        it('should invoke function with two args', function () {
            var spy = sinon_1.default.spy();
            var ctx = {};
            _1.FunctionExt.apply(spy, ctx, [1, '2']);
            expect(spy.calledOn(ctx)).toBeTruthy();
            expect(spy.calledWith(1, '2')).toBeTruthy();
        });
        it('should invoke function with three args', function () {
            var spy = sinon_1.default.spy();
            var ctx = {};
            _1.FunctionExt.apply(spy, ctx, [1, '2', true]);
            expect(spy.calledOn(ctx)).toBeTruthy();
            expect(spy.calledWith(1, '2', true)).toBeTruthy();
        });
        it('should invoke function with four args', function () {
            var spy = sinon_1.default.spy();
            var ctx = {};
            var obj = {};
            _1.FunctionExt.apply(spy, ctx, [1, '2', true, obj]);
            expect(spy.calledOn(ctx)).toBeTruthy();
            expect(spy.calledWith(1, '2', true, obj)).toBeTruthy();
        });
        it('should invoke function with five args', function () {
            var spy = sinon_1.default.spy();
            var ctx = {};
            var obj = {};
            var reg = /a/g;
            _1.FunctionExt.apply(spy, ctx, [1, '2', true, obj, reg]);
            expect(spy.calledOn(ctx)).toBeTruthy();
            expect(spy.calledWith(1, '2', true, obj, reg)).toBeTruthy();
        });
        it('should invoke function with six args', function () {
            var spy = sinon_1.default.spy();
            var ctx = {};
            var obj = {};
            var reg = /a/g;
            var arr = [1, 2, 3];
            _1.FunctionExt.apply(spy, ctx, [1, '2', true, obj, reg, arr]);
            expect(spy.calledOn(ctx)).toBeTruthy();
            expect(spy.calledWith(1, '2', true, obj, reg, arr)).toBeTruthy();
        });
        it('should invoke function with more args', function () {
            var spy = sinon_1.default.spy();
            var ctx = {};
            var obj = {};
            var reg = /a/g;
            var arr = [1, 2, 3];
            _1.FunctionExt.apply(spy, ctx, [1, '2', true, obj, reg, arr, 'more']);
            expect(spy.calledOn(ctx)).toBeTruthy();
            expect(spy.calledWith(1, '2', true, obj, reg, arr, 'more')).toBeTruthy();
        });
    });
    describe('#cacher', function () {
        it('shoule cache function results with same args', function () {
            var counter = 0;
            var raw = function (a, b) {
                counter += 1;
                return a + b;
            };
            var fn = _1.FunctionExt.cacher(raw);
            var ret1 = fn(1, 2);
            expect(counter).toBe(1);
            var ret2 = fn(1, 2);
            expect(counter).toBe(1);
            expect(ret1).toBe(ret2);
            fn(2, 3);
            expect(counter).toBe(2);
        });
        it('shoule remove cache when reach the max cache count', function () {
            var counter = 0;
            var raw = function (a, b) {
                counter += 1;
                return a + b;
            };
            var fn = _1.FunctionExt.cacher(raw);
            fn(1, 2);
            expect(counter).toBe(1);
            for (var i = 0; i < 1000; i += 1) {
                fn(i, i);
            }
            fn(1, 2);
            expect(counter).toBe(1002);
        });
        it('shoule cache function with specified context', function () {
            var ctx = {};
            var spy = sinon_1.default.spy();
            var fn = _1.FunctionExt.cacher(spy, ctx);
            fn();
            expect(spy.calledOn(ctx)).toBeTruthy();
        });
        it('shoule return result processed by post processor', function () {
            var counter = 0;
            var raw = function (a, b) {
                counter += 1;
                return a + b;
            };
            var processor = function (v, hasCache) {
                return hasCache ? -v : v;
            };
            var fn = _1.FunctionExt.cacher(raw, {}, processor);
            var ret1 = fn(1, 2);
            var ret2 = fn(1, 2);
            expect(counter).toBe(1);
            expect(ret1).toBe(3);
            expect(ret2).toBe(-3);
        });
    });
});
//# sourceMappingURL=function.test.js.map