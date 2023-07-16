import { clearSelection } from './selection';
describe('Dom', () => {
    describe('#clearSelection', () => {
        const input = document.createElement('input');
        beforeAll(() => {
            input.value = '12345';
            document.body.appendChild(input);
            input.select();
        });
        afterAll(() => {
            document.body.removeChild(input);
        });
        it('should clear input selection', () => {
            var _a, _b;
            expect((_a = window.getSelection()) === null || _a === void 0 ? void 0 : _a.toString()).toBe('12345');
            clearSelection();
            expect((_b = window.getSelection()) === null || _b === void 0 ? void 0 : _b.toString()).toBe('');
        });
    });
});
//# sourceMappingURL=selection.test.js.map