/// <reference types="jquery" />
import { Attr } from '../registry';
import { KeyValue, Nilable } from '../types';
export declare type Markup = string | Markup.JSONMarkup | Markup.JSONMarkup[];
export declare namespace Markup {
    type Selectors = KeyValue<Element | Element[]>;
    interface JSONMarkup {
        /**
         * The namespace URI of the element. It defaults to SVG namespace
         * `"http://www.w3.org/2000/svg"`.
         */
        ns?: string | null;
        /**
         * The type of element to be created.
         */
        tagName: string;
        /**
         * A unique selector for targeting the element within the `attr`
         * cell attribute.
         */
        selector?: string | null;
        /**
         * A selector for targeting multiple elements within the `attr`
         * cell attribute. The group selector name must not be the same
         * as an existing selector name.
         */
        groupSelector?: string | string[] | null;
        attrs?: Attr.SimpleAttrs;
        style?: JQuery.PlainObject<string | number>;
        className?: string | string[];
        children?: JSONMarkup[];
        textContent?: string;
    }
    interface ParseResult {
        fragment: DocumentFragment;
        selectors: Selectors;
        groups: KeyValue<Element[]>;
    }
}
export declare namespace Markup {
    function isJSONMarkup(markup?: Nilable<Markup>): boolean;
    function isStringMarkup(markup?: Nilable<Markup>): markup is string;
    function clone(markup?: Nilable<Markup>): string | JSONMarkup | JSONMarkup[] | null | undefined;
    /**
     * Removes blank space in markup to prevent create empty text node.
     */
    function sanitize(markup: string): string;
    function parseStringMarkup(markup: string): {
        fragment: DocumentFragment;
        selectors: Selectors;
        groups: KeyValue<Element[]>;
    };
    function parseJSONMarkup(markup: JSONMarkup | JSONMarkup[], options?: {
        ns?: string;
    }): ParseResult;
    function renderMarkup(markup: Markup): {
        elem?: Element;
        selectors?: Selectors;
    };
    function parseLabelStringMarkup(markup: string): {
        fragment: DocumentFragment;
        selectors: {};
    };
}
export declare namespace Markup {
    function getSelector(elem: Element, stop: Element, prev?: string): string | undefined;
    function xml2json(xml: string): {
        markup: JSONMarkup[];
        attrs: Attr.CellAttrs;
    };
}
export declare namespace Markup {
    function getPortContainerMarkup(): Markup;
    function getPortMarkup(): Markup;
    function getPortLabelMarkup(): Markup;
}
export declare namespace Markup {
    function getEdgeMarkup(): Markup;
    function getEdgeToolMarkup(): Markup;
    function getEdgeVertexMarkup(): Markup;
    function getEdgeArrowheadMarkup(): Markup;
}
export declare namespace Markup {
    function getForeignObjectMarkup(bare?: boolean): Markup.JSONMarkup;
}
