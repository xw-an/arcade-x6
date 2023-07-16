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
export declare class PriorityQueue<T> {
    protected readonly comparator: PriorityQueue.Comparator;
    protected index: {
        [key: string]: number;
    };
    protected data: PriorityQueue.Data<T>;
    constructor(options?: PriorityQueue.Options<T>);
    /**
     * Returns `true` if the priority queue is empty, `false` otherwise.
     */
    isEmpty(): boolean;
    /**
     * Inserts a value with priority to the queue. Optionally pass a unique
     * id of this item. Passing unique IDs for each item you insert allows
     * you to use the `updatePriority()` operation.
     * @param priority
     * @param value
     * @param id
     */
    insert(priority: number, value: T, id?: string): this;
    /**
     * Returns the value of an item with the highest priority.
     */
    peek(): T | null;
    /**
     * Returns the highest priority in the queue.
     */
    peekPriority(): number | null;
    updatePriority(id: string, priority: number): void;
    /**
     * Removes the item with the highest priority from the queue
     *
     * @returns The value of the removed item.
     */
    remove(): T | null;
    protected heapify(): void;
    protected bubbleUp(index: number): void;
    protected bubbleDown(index: number): void;
}
export declare namespace PriorityQueue {
    interface Options<T> {
        comparator?: Comparator;
        data?: Data<T>;
    }
    type Data<T> = DataItem<T>[];
    interface DataItem<T> {
        priority: number;
        value: T;
        id?: string;
    }
    type Comparator = (a: number, b: number) => number;
}
export declare namespace PriorityQueue {
    const defaultComparator: Comparator;
}
