"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SortedSet = void 0;
var util_1 = require("../../../util");
var OPEN = 1;
var CLOSE = 2;
var SortedSet = /** @class */ (function () {
    function SortedSet() {
        this.items = [];
        this.hash = {};
        this.values = {};
    }
    SortedSet.prototype.add = function (item, value) {
        var _this = this;
        if (this.hash[item]) {
            // item removal
            this.items.splice(this.items.indexOf(item), 1);
        }
        else {
            this.hash[item] = OPEN;
        }
        this.values[item] = value;
        var index = util_1.ArrayExt.sortedIndexBy(this.items, item, function (key) { return _this.values[key]; });
        this.items.splice(index, 0, item);
    };
    SortedSet.prototype.pop = function () {
        var item = this.items.shift();
        if (item) {
            this.hash[item] = CLOSE;
        }
        return item;
    };
    SortedSet.prototype.isOpen = function (item) {
        return this.hash[item] === OPEN;
    };
    SortedSet.prototype.isClose = function (item) {
        return this.hash[item] === CLOSE;
    };
    SortedSet.prototype.isEmpty = function () {
        return this.items.length === 0;
    };
    return SortedSet;
}());
exports.SortedSet = SortedSet;
//# sourceMappingURL=sorted-set.js.map