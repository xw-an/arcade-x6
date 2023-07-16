export declare function getClass(elem: Element): string;
export declare function hasClass(elem: Element | null, selector: string | null): boolean;
export declare function addClass(elem: Element | null, selector: ((cls: string) => string) | string | null): void;
export declare function removeClass(elem: Element | null, selector?: ((cls: string) => string) | string | null): void;
export declare function toggleClass(elem: Element | null, selector: ((cls: string, state?: boolean) => string) | string | null, stateVal?: boolean): void;
