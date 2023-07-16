"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var hashcode_1 = require("./hashcode");
describe('StringExt', function () {
    describe('#hashcode', function () {
        it('should return number when hashcode a string ', function () {
            expect((0, hashcode_1.hashcode)('')).toBe(2166136261);
            expect((0, hashcode_1.hashcode)('🦄🌈')).toBe(202573874);
            expect((0, hashcode_1.hashcode)('👌😎')).toBe(898715661);
            expect((0, hashcode_1.hashcode)('h')).toBe(3977000791);
            expect((0, hashcode_1.hashcode)('he')).toBe(1547363254);
            expect((0, hashcode_1.hashcode)('hel')).toBe(179613742);
            expect((0, hashcode_1.hashcode)('hell')).toBe(477198310);
            expect((0, hashcode_1.hashcode)('hello')).toBe(1335831723);
            expect((0, hashcode_1.hashcode)('hello ')).toBe(3801292497);
            expect((0, hashcode_1.hashcode)('hello w')).toBe(1402552146);
            expect((0, hashcode_1.hashcode)('hello wo')).toBe(3611200775);
            expect((0, hashcode_1.hashcode)('hello wor')).toBe(1282977583);
            expect((0, hashcode_1.hashcode)('hello worl')).toBe(2767971961);
            expect((0, hashcode_1.hashcode)('hello world')).toBe(3582672807);
            expect((0, hashcode_1.hashcode)('Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium. Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium. Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium.')).toBe(2964896417);
        });
    });
});
//# sourceMappingURL=hashcode.test.js.map