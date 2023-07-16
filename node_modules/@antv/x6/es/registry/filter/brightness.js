import { getNumber } from './util';
export function brightness(args = {}) {
    const amount = getNumber(args.amount, 1);
    return `
    <filter>
      <feComponentTransfer>
        <feFuncR type="linear" slope="${amount}"/>
        <feFuncG type="linear" slope="${amount}"/>
        <feFuncB type="linear" slope="${amount}"/>
      </feComponentTransfer>
    </filter>
  `.trim();
}
//# sourceMappingURL=brightness.js.map