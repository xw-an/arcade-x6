import { Attr } from '../attr';
import { Highlighter } from './index';
export interface StrokeHighlighterOptions {
    padding?: number;
    rx?: number;
    ry?: number;
    attrs?: Attr.SimpleAttrs;
}
export declare const stroke: Highlighter.Definition<StrokeHighlighterOptions>;
