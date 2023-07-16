export { isNull, isNil, isUndefined, isString, isNumber, isBoolean, isObject, isArray, isArrayLike, isFunction, } from 'lodash-es';
export const isWindow = (value) => value && value === value.window;
export const isNumeric = (value) => !Array.isArray(value) && value - parseFloat(value) + 1 >= 0;
//# sourceMappingURL=lang.js.map