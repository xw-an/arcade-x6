export declare const CASE_SENSITIVE_ATTR: string[];
export declare type Attributes = {
    [key: string]: string | number | null | undefined;
};
export declare function getAttribute(elem: Element, name: string): string | null;
export declare function removeAttribute(elem: Element, name: string): void;
export declare function setAttribute(elem: Element, name: string, value?: string | number | null | undefined): void;
export declare function setAttributes(elem: Element, attrs: {
    [attr: string]: string | number | null | undefined;
}): void;
export declare function attr(elem: Element): {
    [attr: string]: string;
};
export declare function attr(elem: Element, name: string): string;
export declare function attr(elem: Element, attrs: {
    [attr: string]: string | number | null | undefined;
}): void;
export declare function attr(elem: Element, name: string, value: string | number | null | undefined): void;
export declare function qualifyAttr(name: string): {
    ns: any;
    local: string;
};
export declare function kebablizeAttrs(attrs: Attributes): Attributes;
export declare function styleToObject(styleString: string): {
    [name: string]: string;
};
export declare function mergeAttrs(target: {
    [attr: string]: any;
}, source: {
    [attr: string]: any;
}): {
    [attr: string]: any;
};
