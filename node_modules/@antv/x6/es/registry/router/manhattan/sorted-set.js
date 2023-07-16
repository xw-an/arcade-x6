import { ArrayExt } from '../../../util';
const OPEN = 1;
const CLOSE = 2;
export class SortedSet {
    constructor() {
        this.items = [];
        this.hash = {};
        this.values = {};
    }
    add(item, value) {
        if (this.hash[item]) {
            // item removal
            this.items.splice(this.items.indexOf(item), 1);
        }
        else {
            this.hash[item] = OPEN;
        }
        this.values[item] = value;
        const index = ArrayExt.sortedIndexBy(this.items, item, (key) => this.values[key]);
        this.items.splice(index, 0, item);
    }
    pop() {
        const item = this.items.shift();
        if (item) {
            this.hash[item] = CLOSE;
        }
        return item;
    }
    isOpen(item) {
        return this.hash[item] === OPEN;
    }
    isClose(item) {
        return this.hash[item] === CLOSE;
    }
    isEmpty() {
        return this.items.length === 0;
    }
}
//# sourceMappingURL=sorted-set.js.map