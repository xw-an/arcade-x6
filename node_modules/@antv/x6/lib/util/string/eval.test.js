"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var eval_1 = require("./eval");
describe('string', function () {
    describe('#eval', function () {
        it('should eval string expressions', function () {
            expect((0, eval_1.exec)('1 + 1')).toBe(2);
            expect((0, eval_1.exec)('"a" + "b"')).toBe('ab');
        });
        it('should return null with invalid expression', function () {
            expect((0, eval_1.exec)('1 +')).toBe(null);
        });
    });
});
//# sourceMappingURL=eval.test.js.map