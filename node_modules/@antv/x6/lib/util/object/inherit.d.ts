/**
 * @see https://github.com/microsoft/TypeScript/blob/5c85febb0ce9d6088cbe9b09cb42f73f9ee8ea05/src/compiler/transformers/es2015.ts#L4309
 */
export declare function inherit(cls: Function, base: Function): void;
/**
 * Extends class with specified class name.
 */
export declare function createClass<T extends new (...args: any[]) => any>(className: string, base: T): T;
