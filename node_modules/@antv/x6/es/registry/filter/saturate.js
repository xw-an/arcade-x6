import { getNumber } from './util';
export function saturate(args = {}) {
    const amount = getNumber(args.amount, 1);
    return `
      <filter>
        <feColorMatrix type="saturate" values="${1 - amount}"/>
      </filter>
    `.trim();
}
//# sourceMappingURL=saturate.js.map