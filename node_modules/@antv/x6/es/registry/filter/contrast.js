import { getNumber } from './util';
export function contrast(args = {}) {
    const amount = getNumber(args.amount, 1);
    const amount2 = 0.5 - amount / 2;
    return `
    <filter>
     <feComponentTransfer>
        <feFuncR type="linear" slope="${amount}" intercept="${amount2}"/>
        <feFuncG type="linear" slope="${amount}" intercept="${amount2}"/>
        <feFuncB type="linear" slope="${amount}" intercept="${amount2}"/>
      </feComponentTransfer>
    </filter>
  `.trim();
}
//# sourceMappingURL=contrast.js.map