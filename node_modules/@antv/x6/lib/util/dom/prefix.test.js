"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var prefix_1 = require("./prefix");
describe('Dom', function () {
    describe('#prefix', function () {
        it('should return prefixed name with compatibility name', function () {
            expect((0, prefix_1.getVendorPrefixedName)('userDrag')).toBe('WebkitUserDrag');
        });
    });
});
//# sourceMappingURL=prefix.test.js.map