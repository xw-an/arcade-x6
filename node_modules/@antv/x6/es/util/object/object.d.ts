export { has, pick, forIn, merge, extend, isEqual, isEmpty, isObject, isPlainObject, clone, cloneDeep, defaults, defaultsDeep, } from 'lodash-es';
export * from './mixins';
export * from './inherit';
export declare function ensure<T>(value: T | null | undefined, defaultValue: T): T;
export declare function getValue<T>(obj: any, key: string, defaultValue?: T): T | null;
export declare function getNumber(obj: any, key: string, defaultValue: number): number;
export declare function getBoolean(obj: any, key: string, defaultValue: boolean): boolean;
export declare function isMaliciousProp(prop: string): boolean;
export declare function getByPath(obj: any, path: string | string[], delimiter?: string | RegExp): any;
export declare function setByPath(obj: any, path: string | string[], value: any, delimiter?: string | RegExp): any;
export declare function unsetByPath(obj: any, path: string | string[], delimiter?: string | RegExp): any;
export declare function flatten(obj: any, delim?: string, stop?: (val: any) => boolean): {
    [key: string]: any;
};
