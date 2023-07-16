import { getString, getNumber } from './util';
export function outline(args = {}) {
    const color = getString(args.color, 'blue');
    const width = getNumber(args.width, 1);
    const margin = getNumber(args.margin, 2);
    const opacity = getNumber(args.opacity, 1);
    const innerRadius = margin;
    const outerRadius = margin + width;
    return `
    <filter>
      <feFlood flood-color="${color}" flood-opacity="${opacity}" result="colored"/>
      <feMorphology in="SourceAlpha" result="morphedOuter" operator="dilate" radius="${outerRadius}" />
      <feMorphology in="SourceAlpha" result="morphedInner" operator="dilate" radius="${innerRadius}" />
      <feComposite result="morphedOuterColored" in="colored" in2="morphedOuter" operator="in"/>
      <feComposite operator="xor" in="morphedOuterColored" in2="morphedInner" result="outline"/>
      <feMerge>
        <feMergeNode in="outline"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  `.trim();
}
//# sourceMappingURL=outline.js.map