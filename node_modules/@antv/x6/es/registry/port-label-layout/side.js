import { toResult } from './util';
export const manual = (portPosition, elemBBox, args) => toResult({ position: elemBBox.getTopLeft() }, args);
export const left = (portPosition, elemBBox, args) => toResult({
    position: { x: -15, y: 0 },
    attrs: { '.': { y: '.3em', 'text-anchor': 'end' } },
}, args);
export const right = (portPosition, elemBBox, args) => toResult({
    position: { x: 15, y: 0 },
    attrs: { '.': { y: '.3em', 'text-anchor': 'start' } },
}, args);
export const top = (portPosition, elemBBox, args) => toResult({
    position: { x: 0, y: -15 },
    attrs: { '.': { 'text-anchor': 'middle' } },
}, args);
export const bottom = (portPosition, elemBBox, args) => toResult({
    position: { x: 0, y: 15 },
    attrs: { '.': { y: '.6em', 'text-anchor': 'middle' } },
}, args);
//# sourceMappingURL=side.js.map