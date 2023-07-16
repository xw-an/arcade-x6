import { Rectangle } from '../geometry';
import { Dictionary } from '../common';
import { Attr } from '../registry/attr';
import { Markup } from './markup';
import { CellView } from './cell';
export declare class AttrManager {
    protected view: CellView;
    constructor(view: CellView);
    protected get cell(): import("..").Cell<import("..").Cell.Properties>;
    protected getDefinition(attrName: string): Attr.Definition | null;
    protected processAttrs(elem: Element, raw: Attr.ComplexAttrs): AttrManager.ProcessedAttrs;
    protected mergeProcessedAttrs(allProcessedAttrs: AttrManager.ProcessedAttrs, roProcessedAttrs: AttrManager.ProcessedAttrs): void;
    protected findAttrs(cellAttrs: Attr.CellAttrs, rootNode: Element, selectorCache: {
        [selector: string]: Element[];
    }, selectors: Markup.Selectors): Dictionary<Element, {
        elem: Element;
        array: boolean;
        priority: number | number[];
        attrs: Attr.ComplexAttrs;
    }>;
    protected updateRelativeAttrs(elem: Element, processedAttrs: AttrManager.ProcessedAttrs, refBBox: Rectangle, options: AttrManager.UpdateOptions): void;
    update(rootNode: Element, attrs: Attr.CellAttrs, options: AttrManager.UpdateOptions): void;
}
export declare namespace AttrManager {
    interface UpdateOptions {
        rootBBox: Rectangle;
        selectors: Markup.Selectors;
        scalableNode?: Element | null;
        rotatableNode?: Element | null;
        /**
         * Rendering only the specified attributes.
         */
        attrs?: Attr.CellAttrs | null;
        /**
         * Whether to force synchronous rendering
         */
        forceSync?: boolean;
    }
    interface ProcessedAttrs {
        raw: Attr.ComplexAttrs;
        normal?: Attr.SimpleAttrs | undefined;
        set?: Attr.ComplexAttrs | undefined;
        offset?: Attr.ComplexAttrs | undefined;
        position?: Attr.ComplexAttrs | undefined;
        delay?: Attr.ComplexAttrs | undefined;
    }
    const DELAY_ATTRS: string[];
}
