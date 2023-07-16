/// <reference types="jquery" />
/// <reference types="jquery-mousewheel" />
import { Attr } from '../registry';
import { KeyValue } from '../types';
import { Basecoat } from '../common';
import { Markup } from './markup';
export declare abstract class View<EventArgs = any> extends Basecoat<EventArgs> {
    readonly cid: string;
    container: Element;
    protected selectors: Markup.Selectors;
    get priority(): number;
    constructor();
    confirmUpdate(flag: number, options: any): number;
    $(elem: any): JQuery<any>;
    empty(elem?: Element): this;
    unmount(elem?: Element): this;
    remove(elem?: Element): this;
    protected onRemove(): void;
    setClass(className: string | string[], elem?: Element): void;
    addClass(className: string | string[], elem?: Element): this;
    removeClass(className: string | string[], elem?: Element): this;
    setStyle(style: JQuery.PlainObject<string | number>, elem?: Element): this;
    setAttrs(attrs?: Attr.SimpleAttrs | null, elem?: Element): this;
    /**
     * Returns the value of the specified attribute of `node`.
     *
     * If the node does not set a value for attribute, start recursing up
     * the DOM tree from node to lookup for attribute at the ancestors of
     * node. If the recursion reaches CellView's root node and attribute
     * is not found even there, return `null`.
     */
    findAttr(attrName: string, elem?: Element): string | null;
    find(selector?: string, rootElem?: Element, selectors?: Markup.Selectors): Element[];
    findOne(selector?: string, rootElem?: Element, selectors?: Markup.Selectors): Element | null;
    findByAttr(attrName: string, elem?: Element): Element | null;
    getSelector(elem: Element, prevSelector?: string): string | undefined;
    prefixClassName(className: string): string;
    delegateEvents(events: View.Events, append?: boolean): this;
    undelegateEvents(): this;
    delegateDocumentEvents(events: View.Events, data?: KeyValue): this;
    undelegateDocumentEvents(): this;
    protected delegateEvent(eventName: string, selector: string | Record<string, unknown>, listener: any): this;
    protected undelegateEvent(eventName: string, selector: string, listener: any): this;
    protected undelegateEvent(eventName: string): this;
    protected undelegateEvent(eventName: string, listener: any): this;
    protected addEventListeners(elem: Element | Document | JQuery, events: View.Events, data?: KeyValue): this;
    protected removeEventListeners(elem: Element | Document | JQuery): this;
    protected getEventNamespace(): string;
    protected getEventHandler(handler: string | Function): Function | undefined;
    getEventTarget(e: JQuery.TriggeredEvent, options?: {
        fromPoint?: boolean;
    }): any;
    stopPropagation(e: JQuery.TriggeredEvent): this;
    isPropagationStopped(e: JQuery.TriggeredEvent): boolean;
    getEventData<T extends KeyValue>(e: JQuery.TriggeredEvent): T;
    setEventData<T extends KeyValue>(e: JQuery.TriggeredEvent, data: T): T;
    protected eventData<T extends KeyValue>(e: JQuery.TriggeredEvent, data?: T): T;
    normalizeEvent<T extends JQuery.TriggeredEvent>(evt: T): T;
}
export declare namespace View {
    type Events = KeyValue<string | Function>;
}
export declare namespace View {
    function $(elem: any): JQuery<any>;
    function createElement(tagName?: string, isSvgElement?: boolean): SVGElement | HTMLElement;
    function find(selector: string | null | undefined, rootElem: Element, selectors: Markup.Selectors): {
        isCSSSelector?: boolean;
        elems: Element[];
    };
    function normalizeEvent<T extends JQuery.TriggeredEvent>(evt: T): T;
}
export declare namespace View {
    const views: {
        [cid: string]: View;
    };
    function getView(cid: string): View<any>;
}
