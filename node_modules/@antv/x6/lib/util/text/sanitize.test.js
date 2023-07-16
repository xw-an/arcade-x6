"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var sanitize_1 = require("./sanitize");
describe('Text', function () {
    describe('#sanitize', function () {
        it('should sanitize text', function () {
            expect((0, sanitize_1.sanitize)('hell o')).toBe('hell\u00A0o');
        });
    });
});
//# sourceMappingURL=sanitize.test.js.map