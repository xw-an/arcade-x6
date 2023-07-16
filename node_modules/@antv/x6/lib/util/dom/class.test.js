"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vector_1 = require("../vector");
var class_1 = require("./class");
describe('Dom', function () {
    describe('class', function () {
        describe('hasClass', function () {
            it('should return `false` when element or selector is null', function () {
                expect((0, class_1.hasClass)(null, null)).toBe(false);
            });
            it('should return `false` for invalid element', function () {
                var text = document.createTextNode('');
                (0, class_1.addClass)(text, 'test');
                expect((0, class_1.hasClass)(text, 'test')).toBe(false);
                var vc = vector_1.Vector.create(document.createComment(''));
                vc.addClass('test');
                expect(vc.hasClass('test')).toBe(false);
            });
        });
        describe('#addClass', function () {
            var div;
            var vel;
            beforeEach(function () {
                div = vector_1.Vector.create('div');
                vel = vector_1.Vector.create('g');
            });
            it('should add class to HTMLDivElement', function () {
                div.addClass('test').addClass(null);
                var cls = div.node.getAttribute('class');
                expect(div.hasClass('test')).toBe(true);
                expect(cls.indexOf('test') !== -1).toBe(true);
                expect(div.attr('class')).toEqual('test');
            });
            it('should add class to SVGGElement', function () {
                vel.addClass('test');
                var cls = vel.node.getAttribute('class');
                expect(vel.hasClass('test')).toBe(true);
                expect(cls.indexOf('test') !== -1).toBe(true);
                expect(vel.attr('class')).toEqual('test');
            });
            it('should append to class list', function () {
                vel.attr('class', 'foo');
                vel.addClass('test');
                var cls = vel.node.getAttribute('class');
                expect(vel.hasClass('test')).toBe(true);
                expect(cls.indexOf('test') !== -1).toBe(true);
                expect(vel.attr('class')).toEqual('foo test');
                vel.addClass('foo bar baz');
                expect(vel.attr('class')).toEqual('foo test bar baz');
            });
            it('should not add the same class twice in same element', function () {
                div.addClass('foo').addClass('foo');
                expect(div.attr('class')).toEqual('foo');
                vel.addClass('foo foo');
                expect(vel.attr('class')).toEqual('foo');
            });
            it('should not add empty string', function () {
                vel.addClass('test');
                vel.addClass(' ');
                expect(vel.attr('class')).toEqual('test');
            });
            it('should call hook', function () {
                vel.addClass('test');
                vel.addClass(' ');
                (0, class_1.addClass)(vel.node, function (cls) { return cls + " foo"; });
                expect(vel.attr('class')).toEqual('test foo');
            });
        });
        describe('#removeClass', function () {
            var vel = vector_1.Vector.create('g');
            it('should remove one', function () {
                vel.removeClass();
                vel.addClass('foo bar');
                vel.removeClass('foo test');
                expect(vel.attr('class')).toEqual('bar');
            });
            it('should remove all', function () {
                vel.removeClass();
                vel.addClass('foo bar');
                vel.removeClass();
                expect(vel.attr('class')).toEqual('');
            });
            it('should call hook', function () {
                vel.removeClass();
                vel.addClass('foo bar');
                (0, class_1.removeClass)(vel.node, function (cls) { return cls.split(' ')[1]; });
                expect(vel.attr('class')).toEqual('foo');
            });
            it('should do nothing for invalid element or selector', function () {
                (0, class_1.removeClass)(null);
                (0, class_1.removeClass)(null, null);
            });
        });
        describe('#toggleClass', function () {
            var vel = vector_1.Vector.create('g');
            it('should do nothing for invalid element or selector', function () {
                (0, class_1.toggleClass)(null, 'foo');
                (0, class_1.toggleClass)(null, null);
            });
            it('should toggle class', function () {
                vel.removeClass();
                vel.toggleClass('foo bar');
                expect(vel.attr('class')).toEqual('foo bar');
                vel.toggleClass('foo');
                expect(vel.attr('class')).toEqual('bar');
                vel.toggleClass('foo');
                expect(vel.attr('class')).toEqual('bar foo');
            });
            it('should not toggle empty strings', function () {
                vel.removeClass();
                vel.toggleClass('foo bar');
                expect(vel.attr('class')).toEqual('foo bar');
                vel.toggleClass(' ');
                expect(vel.attr('class')).toEqual('foo bar');
                vel.toggleClass(' ');
                expect(vel.attr('class')).toEqual('foo bar');
            });
            it('should work with the specified next state', function () {
                vel.removeClass();
                vel.toggleClass('foo bar');
                expect(vel.attr('class')).toEqual('foo bar');
                vel.toggleClass('foo', true);
                expect(vel.attr('class')).toEqual('foo bar');
                vel.toggleClass('foo', true);
                expect(vel.attr('class')).toEqual('foo bar');
                vel.toggleClass('foo', false);
                expect(vel.attr('class')).toEqual('bar');
            });
            it('should call hook', function () {
                vel.removeClass();
                (0, class_1.toggleClass)(vel.node, function () { return 'foo bar'; });
                expect(vel.attr('class')).toEqual('foo bar');
                (0, class_1.toggleClass)(vel.node, function () { return 'foo'; }, false);
                expect(vel.attr('class')).toEqual('bar');
            });
        });
    });
});
//# sourceMappingURL=class.test.js.map