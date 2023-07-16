export declare function uniqueId(): string;
export declare function ensureId(elem: Element): string;
/**
 * Returns true if object is an instance of SVGGraphicsElement.
 * @see https://developer.mozilla.org/en-US/docs/Web/API/SVGGraphicsElement
 */
export declare function isSVGGraphicsElement(elem?: any | null): elem is SVGGraphicsElement;
export declare const ns: {
    svg: string;
    xmlns: string;
    xml: string;
    xlink: string;
    xhtml: string;
};
export declare const svgVersion = "1.1";
export declare function createElement<T extends Element>(tagName: string, doc?: Document): T;
export declare function createElementNS<T extends Element>(tagName: string, namespaceURI?: string, doc?: Document): T;
export declare function createSvgElement<T extends SVGElement>(tagName: string, doc?: Document): T;
export declare function createSvgDocument(content?: string): SVGSVGElement;
export declare function parseXML(data: string, options?: {
    async?: boolean;
    mimeType?: 'text/html' | 'text/xml' | 'application/xml' | 'application/xhtml+xml' | 'image/svg+xml';
}): Document;
export declare function tagName(node: Element, lowercase?: boolean): string;
export declare function index(elem: Element): number;
export declare function find(elem: Element, selector: string): NodeListOf<Element>;
export declare function findOne(elem: Element, selector: string): Element | null;
export declare function findParentByClass(elem: Element, className: string, terminator?: Element): ParentNode | null;
export declare function contains(parent: Element, child: Element): boolean;
export declare function remove(elem: Element): void;
export declare function empty(elem: Element): void;
export declare function append(elem: Element, elems: Element | DocumentFragment | (Element | DocumentFragment)[]): void;
export declare function prepend(elem: Element, elems: Element | DocumentFragment | (Element | DocumentFragment)[]): void;
export declare function before(elem: Element, elems: Element | DocumentFragment | (Element | DocumentFragment)[]): void;
export declare function appendTo(elem: Element, target: Element): void;
export declare function isHTMLElement(elem: any): elem is HTMLElement;
export declare function clickable(elem: Element): boolean;
export declare function isInputElement(elem: any): boolean;
