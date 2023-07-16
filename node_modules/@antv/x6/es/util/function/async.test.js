var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { toDeferredBoolean } from './async';
describe('async', () => {
    describe('#toDeferredBoolean', () => {
        it('should return a promise resloved true when input is true or truthy promise', () => __awaiter(void 0, void 0, void 0, function* () {
            let ret = yield toDeferredBoolean(Promise.resolve(true));
            expect(ret).toBeTruthy();
            ret = yield toDeferredBoolean(true, [true], Promise.resolve(true));
            expect(ret).toBe(true);
        }));
        it('should return a promise resloved false when some input is falsy', () => __awaiter(void 0, void 0, void 0, function* () {
            const ret = yield toDeferredBoolean(true, [true], Promise.resolve(false));
            expect(ret).toBe(false);
        }));
    });
});
//# sourceMappingURL=async.test.js.map