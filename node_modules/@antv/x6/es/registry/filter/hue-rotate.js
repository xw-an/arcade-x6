import { getNumber } from './util';
export function hueRotate(args = {}) {
    const angle = getNumber(args.angle, 0);
    return `
      <filter>
        <feColorMatrix type="hueRotate" values="${angle}"/>
      </filter>
    `.trim();
}
//# sourceMappingURL=hue-rotate.js.map