export { isNaN, isNumber, isFinite, isInteger, isSafeInteger, clamp, inRange, toFinite, toNumber, toInteger, toSafeInteger, parseInt, } from 'lodash-es';
export { isNumeric } from '../lang/lang';
/**
 * Returns the remainder of division of `n` by `m`. You should use this
 * instead of the built-in operation as the built-in operation does not
 * properly handle negative numbers.
 */
export declare function mod(n: number, m: number): number;
export declare function random(lower: number, upper: number): number;
export declare function isPercentage(val: any): val is string;
export declare function normalizePercentage(num: number | string | null | undefined, ref: number): number;
export declare function parseCssNumeric(val: string, units?: string | string[]): {
    unit: string;
    value: number;
} | null;
export declare type SideOptions = number | {
    vertical?: number;
    horizontal?: number;
    left?: number;
    top?: number;
    right?: number;
    bottom?: number;
};
export declare function normalizeSides(box?: SideOptions): {
    top: number;
    right: number;
    bottom: number;
    left: number;
};
