import { Assign, NonUndefined } from 'utility-types';
import { KeyValue } from '../types';
import { Basecoat } from '../common';
export declare class Store<D> extends Basecoat<Store.EventArgs<D>> {
    protected data: D;
    protected previous: D;
    protected changed: Partial<D>;
    protected pending: boolean;
    protected changing: boolean;
    protected pendingOptions: Store.MutateOptions | null;
    constructor(data?: Partial<D>);
    protected mutate<K extends keyof D>(data: Partial<D>, options?: Store.MutateOptions): this;
    get(): D;
    get<K extends keyof D>(key: K): D[K];
    get<K extends keyof D>(key: K, defaultValue: D[K]): NonUndefined<D[K]>;
    get<T>(key: string): T;
    get<T>(key: string, defaultValue: T): T;
    getPrevious<T>(key: keyof D): T | undefined;
    set<K extends keyof D>(key: K, value: D[K] | null | undefined | void, options?: Store.SetOptions): this;
    set(key: string, value: any, options?: Store.SetOptions): this;
    set(data: D, options?: Store.SetOptions): this;
    remove<K extends keyof D>(key: K | K[], options?: Store.SetOptions): this;
    remove(options?: Store.SetOptions): this;
    getByPath<T>(path: string | string[]): T;
    setByPath<K extends keyof D>(path: string | string[], value: any, options?: Store.SetByPathOptions): this;
    removeByPath<K extends keyof D>(path: string | string[], options?: Store.SetOptions): this;
    hasChanged(): boolean;
    hasChanged<K extends keyof D>(key: K | null): boolean;
    hasChanged(key: string | null): boolean;
    /**
     * Returns an object containing all the data that have changed,
     * or `null` if there are no changes. Useful for determining what
     * parts of a view need to be updated.
     */
    getChanges(diff?: Partial<D>): Partial<D> | null;
    /**
     * Returns a copy of the store's `data` object.
     */
    toJSON(): D;
    clone<T extends typeof Store>(): T;
    dispose(): void;
}
export declare namespace Store {
    export interface SetOptions extends KeyValue {
        silent?: boolean;
    }
    export interface MutateOptions extends SetOptions {
        unset?: boolean;
    }
    export interface SetByPathOptions extends SetOptions {
        rewrite?: boolean;
    }
    type CommonArgs<D> = {
        store: Store<D>;
    };
    export interface EventArgs<D, K extends keyof D = keyof D> {
        'change:*': Assign<{
            key: K;
            current: D[K];
            previous: D[K];
            options: MutateOptions;
        }, CommonArgs<D>>;
        changed: Assign<{
            current: D;
            previous: D;
            options: MutateOptions;
        }, CommonArgs<D>>;
        disposed: CommonArgs<D>;
    }
    export {};
}
