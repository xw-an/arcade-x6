import { Disposable } from './disposable';
export declare class Dictionary<T extends Record<string, any>, V> extends Disposable {
    private map;
    private arr;
    constructor();
    clear(): void;
    has(key: T): boolean;
    get(key: T): V | undefined;
    set(key: T, value: V): void;
    delete(key: T): V | undefined;
    each(iterator: (value: V, key: T) => void): void;
    dispose(): void;
}
