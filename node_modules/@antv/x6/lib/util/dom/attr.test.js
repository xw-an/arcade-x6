"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var vector_1 = require("../vector");
var attr_1 = require("./attr");
describe('Dom', function () {
    describe('attr', function () {
        describe('#styleToObject', function () {
            it('should parse style string to object', function () {
                var ret = { fill: 'red', stroke: 'blue' };
                expect((0, attr_1.styleToObject)('fill=red; stroke=blue')).toEqual(ret);
                expect((0, attr_1.styleToObject)('fill=red; stroke=blue;')).toEqual(ret);
            });
            it('should parse key-only string', function () {
                expect((0, attr_1.styleToObject)(';fill=red;;stroke')).toEqual({
                    fill: 'red',
                    stroke: '',
                });
            });
            it('should ingore empty section', function () {
                expect((0, attr_1.styleToObject)(';fill=red;;')).toEqual({ fill: 'red' });
            });
            it('should parse empty string to empty object', function () {
                expect((0, attr_1.styleToObject)('')).toEqual({});
            });
        });
        describe('#mergeAttrs', function () {
            it('shoule merge attrs by extend', function () {
                expect((0, attr_1.mergeAttrs)({ x: 5, y: 10 }, { y: 20 })).toEqual({ x: 5, y: 20 });
            });
            it('should append class attribute', function () {
                expect((0, attr_1.mergeAttrs)({ x: 5, y: 10, class: 'foo' }, { y: 20, class: 'bar' })).toEqual({ x: 5, y: 20, class: 'foo bar' });
            });
            it('shoule merge style object', function () {
                var result = { x: 5, y: 20, style: { fill: 'red', stroke: 'orange' } };
                expect((0, attr_1.mergeAttrs)({ x: 5, y: 10, style: { fill: 'red', stroke: 'blue' } }, { y: 20, style: { stroke: 'orange' } })).toEqual(result);
                expect((0, attr_1.mergeAttrs)({ x: 5, y: 10, style: 'fill=red; stroke=blue' }, { y: 20, style: { stroke: 'orange' } })).toEqual(result);
                expect((0, attr_1.mergeAttrs)({ x: 5, y: 10, style: 'fill=red; stroke=blue' }, { y: 20, style: 'stroke=orange' })).toEqual(result);
                expect((0, attr_1.mergeAttrs)({ x: 5, y: 10, style: { fill: 'red', stroke: 'blue' } }, { y: 20, style: 'stroke=orange' })).toEqual(result);
            });
        });
        describe('#setAttribute', function () {
            it('should set attribute with string/number value', function () {
                var vel = vector_1.Vector.create('g');
                vel.setAttribute('foo', 'test');
                vel.setAttribute('bar', 100);
                expect(vel.getAttribute('foo')).toEqual('test');
                expect(vel.getAttribute('bar')).toEqual('100');
            });
            it('should remove attribute when value is null/undefined', function () {
                var vel = vector_1.Vector.create('g');
                vel.setAttribute('foo', 'test');
                vel.setAttribute('bar', 100);
                expect(vel.getAttribute('foo')).toEqual('test');
                expect(vel.getAttribute('bar')).toEqual('100');
                vel.setAttribute('foo');
                vel.setAttribute('bar', null);
                expect(vel.getAttribute('foo')).toEqual(null);
                expect(vel.getAttribute('bar')).toEqual(null);
            });
            it('shoud set/remove qualified attribute', function () {
                var vel = vector_1.Vector.create('g');
                vel.setAttribute('xlink:href', 'test');
                expect(vel.getAttribute('xlink:href')).toEqual('test');
                vel.removeAttribute('xlink:href');
                expect(vel.getAttribute('xlink:href')).toEqual(null);
            });
        });
        describe('#attr', function () {
            it('should get all attributes', function () {
                var vel = vector_1.Vector.create('g');
                vel.setAttribute('foo', 'test');
                vel.setAttribute('bar', '100');
                var _a = vel.attr(), id = _a.id, attrs = __rest(_a, ["id"]);
                expect(attrs).toEqual({ foo: 'test', bar: '100' });
            });
            it('should set/get single attribute', function () {
                var vel = vector_1.Vector.create('g');
                vel.attr('foo', 'test');
                expect(vel.attr('foo')).toEqual('test');
            });
            it('should set attributes', function () {
                var vel = vector_1.Vector.create('g');
                vel.attr({ foo: 'test', bar: 100 });
                var _a = vel.attr(), id = _a.id, attrs = __rest(_a, ["id"]);
                expect(attrs).toEqual({ foo: 'test', bar: '100' });
            });
        });
    });
});
//# sourceMappingURL=attr.test.js.map