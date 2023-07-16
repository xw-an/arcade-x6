export { isFunction, once, noop, debounce, defer } from 'lodash-es';
declare type Fn = (...args: any[]) => any;
export declare function apply<T extends Fn>(fn: T, ctx: ThisParameterType<T>, args?: Parameters<T>): ReturnType<T>;
export declare function call<T extends Fn>(fn: T, ctx: ThisParameterType<T>, ...args: Parameters<T>): ReturnType<T>;
export declare function cacher<T extends Fn>(fn: T, ctx?: ThisParameterType<T>, postProcessor?: (v: any, hasCache?: boolean) => any): T;
