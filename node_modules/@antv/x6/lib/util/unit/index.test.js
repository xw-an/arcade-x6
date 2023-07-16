"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var index_1 = require("./index");
describe('Unit', function () {
    describe('#toPx', function () {
        it('should return correct px', function () {
            expect(Math.floor(index_1.Unit.toPx(10, 'mm'))).toBe(37);
            // expect(Math.floor(Unit.toPx(10, 'cm'))).toBe(376)
            // expect(Math.floor(Unit.toPx(10, 'in'))).toBe(956)
            expect(Math.floor(index_1.Unit.toPx(10, 'pt'))).toBe(13);
            expect(Math.floor(index_1.Unit.toPx(10, 'pc'))).toBe(159);
        });
    });
});
//# sourceMappingURL=index.test.js.map