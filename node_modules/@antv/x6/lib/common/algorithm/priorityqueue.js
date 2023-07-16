"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PriorityQueue = void 0;
/**
 * An implementation of the Priority Queue abstract data type.
 *
 * @see: http://en.wikipedia.org/wiki/Priority_queue
 *
 * It is like a normal stack or queue, but where each item has assigned a
 * priority (a number). Items with higher priority are served before items
 * with lower priority. This implementation uses binary heap as an internal
 * representation of the queue. The time complexity of all the methods is as
 * follows:
 *
 * - create: `O(n)`
 * - insert: `O(log n)`
 * - remove: `O(log n)`
 * - peek: `O(1)`
 * - isEmpty: `O(1)`
 * - peekPriority: `O(1)`
 */
var PriorityQueue = /** @class */ (function () {
    function PriorityQueue(options) {
        if (options === void 0) { options = {}; }
        this.comparator = options.comparator || PriorityQueue.defaultComparator;
        this.index = {};
        this.data = options.data || [];
        this.heapify();
    }
    /**
     * Returns `true` if the priority queue is empty, `false` otherwise.
     */
    PriorityQueue.prototype.isEmpty = function () {
        return this.data.length === 0;
    };
    /**
     * Inserts a value with priority to the queue. Optionally pass a unique
     * id of this item. Passing unique IDs for each item you insert allows
     * you to use the `updatePriority()` operation.
     * @param priority
     * @param value
     * @param id
     */
    PriorityQueue.prototype.insert = function (priority, value, id) {
        var item = { priority: priority, value: value };
        var index = this.data.length;
        if (id) {
            item.id = id;
            this.index[id] = index;
        }
        this.data.push(item);
        this.bubbleUp(index);
        return this;
    };
    /**
     * Returns the value of an item with the highest priority.
     */
    PriorityQueue.prototype.peek = function () {
        return this.data[0] ? this.data[0].value : null;
    };
    /**
     * Returns the highest priority in the queue.
     */
    PriorityQueue.prototype.peekPriority = function () {
        return this.data[0] ? this.data[0].priority : null;
    };
    PriorityQueue.prototype.updatePriority = function (id, priority) {
        var index = this.index[id];
        if (typeof index === 'undefined') {
            throw new Error("Node with id '" + id + "' was not found in the heap.");
        }
        var data = this.data;
        var oldPriority = data[index].priority;
        var comp = this.comparator(priority, oldPriority);
        if (comp < 0) {
            data[index].priority = priority;
            this.bubbleUp(index);
        }
        else if (comp > 0) {
            data[index].priority = priority;
            this.bubbleDown(index);
        }
    };
    /**
     * Removes the item with the highest priority from the queue
     *
     * @returns The value of the removed item.
     */
    PriorityQueue.prototype.remove = function () {
        var data = this.data;
        var peek = data[0];
        var last = data.pop();
        if (peek.id) {
            delete this.index[peek.id];
        }
        if (data.length > 0) {
            data[0] = last;
            if (last.id) {
                this.index[last.id] = 0;
            }
            this.bubbleDown(0);
        }
        return peek ? peek.value : null;
    };
    PriorityQueue.prototype.heapify = function () {
        for (var i = 0; i < this.data.length; i += 1) {
            this.bubbleUp(i);
        }
    };
    PriorityQueue.prototype.bubbleUp = function (index) {
        var data = this.data;
        var tmp;
        var parent;
        var current = index;
        while (current > 0) {
            parent = (current - 1) >>> 1;
            if (this.comparator(data[current].priority, data[parent].priority) < 0) {
                tmp = data[parent];
                data[parent] = data[current];
                var id = data[current].id;
                if (id != null) {
                    this.index[id] = parent;
                }
                data[current] = tmp;
                id = data[current].id;
                if (id != null) {
                    this.index[id] = current;
                }
                current = parent;
            }
            else {
                break;
            }
        }
    };
    PriorityQueue.prototype.bubbleDown = function (index) {
        var data = this.data;
        var last = data.length - 1;
        var current = index;
        // eslint-disable-next-line
        while (true) {
            var left = (current << 1) + 1;
            var right = left + 1;
            var minIndex = current;
            if (left <= last &&
                this.comparator(data[left].priority, data[minIndex].priority) < 0) {
                minIndex = left;
            }
            if (right <= last &&
                this.comparator(data[right].priority, data[minIndex].priority) < 0) {
                minIndex = right;
            }
            if (minIndex !== current) {
                var tmp = data[minIndex];
                data[minIndex] = data[current];
                var id = data[current].id;
                if (id != null) {
                    this.index[id] = minIndex;
                }
                data[current] = tmp;
                id = data[current].id;
                if (id != null) {
                    this.index[id] = current;
                }
                current = minIndex;
            }
            else {
                break;
            }
        }
    };
    return PriorityQueue;
}());
exports.PriorityQueue = PriorityQueue;
(function (PriorityQueue) {
    PriorityQueue.defaultComparator = function (a, b) { return a - b; };
})(PriorityQueue = exports.PriorityQueue || (exports.PriorityQueue = {}));
exports.PriorityQueue = PriorityQueue;
//# sourceMappingURL=priorityqueue.js.map