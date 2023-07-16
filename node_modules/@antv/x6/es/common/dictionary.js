var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Disposable } from './disposable';
export class Dictionary extends Disposable {
    constructor() {
        super();
        this.clear();
    }
    clear() {
        this.map = new WeakMap();
        this.arr = [];
    }
    has(key) {
        return this.map.has(key);
    }
    get(key) {
        return this.map.get(key);
    }
    set(key, value) {
        this.map.set(key, value);
        this.arr.push(key);
    }
    delete(key) {
        const index = this.arr.indexOf(key);
        if (index >= 0) {
            this.arr.splice(index, 1);
        }
        const ret = this.map.get(key);
        this.map.delete(key);
        return ret;
    }
    each(iterator) {
        this.arr.forEach((key) => {
            const value = this.map.get(key);
            iterator(value, key);
        });
    }
    dispose() {
        this.clear();
    }
}
__decorate([
    Disposable.dispose()
], Dictionary.prototype, "dispose", null);
//# sourceMappingURL=dictionary.js.map