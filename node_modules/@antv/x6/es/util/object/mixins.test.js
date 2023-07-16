import { applyMixins } from './mixins';
describe('Ojbect', () => {
    describe('applyMixins', () => {
        class Disposable {
            dispose() {
                this.isDisposed = true;
            }
        }
        class Activatable {
            activate() {
                this.isActive = true;
            }
            deactivate() {
                this.isActive = false;
            }
        }
        class SmartObject {
            interact() {
                this.activate();
                this.dispose();
            }
        }
        applyMixins(SmartObject, Disposable, Activatable);
        it('should do the mixing', () => {
            const smartObj = new SmartObject();
            expect(smartObj.isDisposed).toBeUndefined();
            expect(smartObj.isActive).toBeUndefined();
            smartObj.interact();
            expect(smartObj.isDisposed).toBeTruthy();
            expect(smartObj.isActive).toBeTruthy();
        });
    });
});
//# sourceMappingURL=mixins.test.js.map