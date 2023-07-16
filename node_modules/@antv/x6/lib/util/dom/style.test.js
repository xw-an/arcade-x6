"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var style_1 = require("./style");
describe('Dom', function () {
    describe('#setPrefixedStyle', function () {
        it('should return prefixed attr', function () {
            var style = {};
            (0, style_1.setPrefixedStyle)(style, 'userDrag', 'true');
            expect(style).toEqual({
                userDrag: 'true',
                WebkitUserDrag: 'true',
            });
        });
        describe('#hasScrollbars', function () {
            var container = document.createElement('div');
            beforeAll(function () {
                container.style.overflow = 'auto';
                document.body.appendChild(container);
            });
            afterAll(function () {
                document.body.removeChild(container);
            });
            it('should return true with an elem has scrollbar', function () {
                expect((0, style_1.hasScrollbars)(container)).toBeTruthy();
                container.style.overflow = 'scroll';
                expect((0, style_1.hasScrollbars)(container)).toBeTruthy();
                container.style.overflow = 'hidden';
                expect((0, style_1.hasScrollbars)(container)).toBeFalsy();
            });
        });
    });
});
//# sourceMappingURL=style.test.js.map