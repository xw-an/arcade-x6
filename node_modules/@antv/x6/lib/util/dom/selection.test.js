"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var selection_1 = require("./selection");
describe('Dom', function () {
    describe('#clearSelection', function () {
        var input = document.createElement('input');
        beforeAll(function () {
            input.value = '12345';
            document.body.appendChild(input);
            input.select();
        });
        afterAll(function () {
            document.body.removeChild(input);
        });
        it('should clear input selection', function () {
            var _a, _b;
            expect((_a = window.getSelection()) === null || _a === void 0 ? void 0 : _a.toString()).toBe('12345');
            (0, selection_1.clearSelection)();
            expect((_b = window.getSelection()) === null || _b === void 0 ? void 0 : _b.toString()).toBe('');
        });
    });
});
//# sourceMappingURL=selection.test.js.map