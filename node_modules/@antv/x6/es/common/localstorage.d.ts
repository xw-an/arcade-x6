export declare namespace LocalStorage {
    function insert<T>(collection: string, doc: T, cb: Types.Callback): void;
    function find<T>(collection: string, query: Types.Query, cb: Types.Callback): void;
    function remove(collection: string, query: Types.Query, cb: Types.Callback): void;
}
declare namespace Types {
    interface Index {
        keys: string[];
    }
    type Callback = <T>(err: Error | null, ret?: T) => any;
    type Query = {
        id: string;
    } | null | undefined;
}
export {};
