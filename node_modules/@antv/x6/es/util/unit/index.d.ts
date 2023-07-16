declare const supportedUnits: {
    px(val: number): number;
    mm(val: number): number;
    cm(val: number): number;
    in(val: number): number;
    pt(val: number): number;
    pc(val: number): number;
};
export declare type Unit = keyof typeof supportedUnits;
export declare namespace Unit {
    function measure(cssWidth: string, cssHeight: string, unit?: Unit): {
        width: number;
        height: number;
    };
    function toPx(val: number, unit?: Unit): number;
}
export {};
