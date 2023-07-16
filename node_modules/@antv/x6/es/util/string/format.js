import { camelCase, startCase, upperCase, lowerCase, upperFirst, } from 'lodash-es';
export { 
// kebabCase,
// startCase,
// snakeCase,
// lowerCase,
// upperCase,
// capitalize,
lowerFirst, upperFirst, camelCase, } from 'lodash-es';
// @see: https://medium.com/@robertsavian/javascript-case-converters-using-lodash-4f2f964091cc
const cacheStringFunction = (fn) => {
    const cache = Object.create(null);
    return ((str) => {
        const hit = cache[str];
        return hit || (cache[str] = fn(str));
    });
};
export const kebabCase = cacheStringFunction((s) => s.replace(/\B([A-Z])/g, '-$1').toLowerCase());
export const pascalCase = cacheStringFunction((s) => startCase(camelCase(s)).replace(/ /g, ''));
export const constantCase = cacheStringFunction((s) => upperCase(s).replace(/ /g, '_'));
export const dotCase = cacheStringFunction((s) => lowerCase(s).replace(/ /g, '.'));
export const pathCase = cacheStringFunction((s) => lowerCase(s).replace(/ /g, '/'));
export const sentenceCase = cacheStringFunction((s) => upperFirst(lowerCase(s)));
export const titleCase = cacheStringFunction((s) => startCase(camelCase(s)));
//# sourceMappingURL=format.js.map