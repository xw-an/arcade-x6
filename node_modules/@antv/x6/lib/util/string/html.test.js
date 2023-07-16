"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var html_1 = require("./html");
describe('String', function () {
    describe('html', function () {
        it('should removes attribute name starts with on', function () {
            var html = '<div onerror="onError()"></div>';
            expect((0, html_1.sanitizeHTML)(html)).toBe('<div></div>');
        });
        it('should removes attribute value starts with some word', function () {
            var html = '<div script="javascript:void"></div>';
            expect((0, html_1.sanitizeHTML)(html)).toBe('<div></div>');
            html = '<div data="data:void"></div>';
            expect((0, html_1.sanitizeHTML)(html)).toBe('<div></div>');
            html = '<div vbscript="vbscript:void"></div>';
            expect((0, html_1.sanitizeHTML)(html)).toBe('<div></div>');
        });
    });
});
//# sourceMappingURL=html.test.js.map