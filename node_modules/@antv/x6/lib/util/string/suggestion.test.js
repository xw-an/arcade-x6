"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var suggestion_1 = require("./suggestion");
describe('String', function () {
    describe('#getSpellingSuggestion', function () {
        it('should return the best suggestion', function () {
            var candidates = ['asurance', 'assurance', 'assurances'];
            expect((0, suggestion_1.getSpellingSuggestion)('assurance', candidates, function (candidate) { return candidate; })).toBe('asurance');
            candidates = ['aransue', 'assurance', 'assurances'];
            expect((0, suggestion_1.getSpellingSuggestion)('assurance', candidates, function (candidate) { return candidate; })).toBe('assurances');
        });
    });
});
//# sourceMappingURL=suggestion.test.js.map