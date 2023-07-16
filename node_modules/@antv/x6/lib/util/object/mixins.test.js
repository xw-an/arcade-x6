"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mixins_1 = require("./mixins");
describe('Ojbect', function () {
    describe('applyMixins', function () {
        var Disposable = /** @class */ (function () {
            function Disposable() {
            }
            Disposable.prototype.dispose = function () {
                this.isDisposed = true;
            };
            return Disposable;
        }());
        var Activatable = /** @class */ (function () {
            function Activatable() {
            }
            Activatable.prototype.activate = function () {
                this.isActive = true;
            };
            Activatable.prototype.deactivate = function () {
                this.isActive = false;
            };
            return Activatable;
        }());
        var SmartObject = /** @class */ (function () {
            function SmartObject() {
            }
            SmartObject.prototype.interact = function () {
                this.activate();
                this.dispose();
            };
            return SmartObject;
        }());
        (0, mixins_1.applyMixins)(SmartObject, Disposable, Activatable);
        it('should do the mixing', function () {
            var smartObj = new SmartObject();
            expect(smartObj.isDisposed).toBeUndefined();
            expect(smartObj.isActive).toBeUndefined();
            smartObj.interact();
            expect(smartObj.isDisposed).toBeTruthy();
            expect(smartObj.isActive).toBeTruthy();
        });
    });
});
//# sourceMappingURL=mixins.test.js.map