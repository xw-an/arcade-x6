import { getNumber } from './util';
export function invert(args = {}) {
    const amount = getNumber(args.amount, 1);
    const amount2 = 1 - amount;
    return `
      <filter>
        <feComponentTransfer>
          <feFuncR type="table" tableValues="${amount} ${amount2}"/>
          <feFuncG type="table" tableValues="${amount} ${amount2}"/>
          <feFuncB type="table" tableValues="${amount} ${amount2}"/>
        </feComponentTransfer>
      </filter>
    `.trim();
}
//# sourceMappingURL=invert.js.map