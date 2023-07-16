export declare function isAsyncLike<T>(obj: any): obj is Promise<T>;
export declare function isAsync<T>(obj: any): obj is Promise<T>;
export declare type AsyncBoolean = boolean | Promise<boolean>;
export declare function toAsyncBoolean(...inputs: (any | any[])[]): AsyncBoolean;
export declare function toDeferredBoolean(...inputs: (any | any[])[]): Promise<boolean>;
