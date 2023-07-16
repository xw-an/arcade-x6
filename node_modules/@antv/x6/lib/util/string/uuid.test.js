"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var uuid_1 = require("./uuid");
describe('string', function () {
    describe('#uuid', function () {
        it('should generate uuids with RFC-4122 format', function () {
            for (var i = 0; i < 10000; i += 1) {
                expect((0, uuid_1.uuid)()).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/);
            }
        });
    });
});
//# sourceMappingURL=uuid.test.js.map