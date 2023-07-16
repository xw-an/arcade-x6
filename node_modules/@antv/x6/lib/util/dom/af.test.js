"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var sinon_1 = __importDefault(require("sinon"));
var af_1 = require("./af");
describe('af', function () {
    describe('#requestAnimationFrame', function () {
        it('should call the callback', function (done) {
            (0, af_1.requestAnimationFrame)(function () {
                expect(1).toEqual(1);
                done();
            });
        });
    });
    describe('#cancelAnimationFrame', function () {
        it('requestAnimationFrame can be cancel', function (done) {
            var spy = sinon_1.default.spy();
            var id = (0, af_1.requestAnimationFrame)(spy);
            (0, af_1.cancelAnimationFrame)(id);
            setTimeout(function () {
                expect(spy.callCount).toEqual(0);
                done();
            }, 100);
        });
    });
});
//# sourceMappingURL=af.test.js.map