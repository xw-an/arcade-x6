"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var format_1 = require("./format");
describe('String', function () {
    describe('#format', function () {
        it('should return format string', function () {
            var str = 'lives-Down_by the.River';
            expect((0, format_1.pascalCase)(str)).toBe('LivesDownByTheRiver');
            expect((0, format_1.constantCase)(str)).toBe('LIVES_DOWN_BY_THE_RIVER');
            expect((0, format_1.dotCase)(str)).toBe('lives.down.by.the.river');
            expect((0, format_1.pathCase)(str)).toBe('lives/down/by/the/river');
            expect((0, format_1.sentenceCase)(str)).toBe('Lives down by the river');
            expect((0, format_1.titleCase)(str)).toBe('Lives Down By The River');
        });
    });
});
//# sourceMappingURL=format.test.js.map