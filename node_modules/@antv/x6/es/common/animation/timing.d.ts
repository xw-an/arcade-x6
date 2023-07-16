import { FunctionKeys } from 'utility-types';
export declare namespace Timing {
    type Definition = (t: number) => number;
    type Names = FunctionKeys<typeof Timing>;
}
export declare namespace Timing {
    const linear: Definition;
    const quad: Definition;
    const cubic: Definition;
    const inout: Definition;
    const exponential: Definition;
    const bounce: Definition;
}
export declare namespace Timing {
    const decorators: {
        reverse(f: Definition): Definition;
        reflect(f: Definition): Definition;
        clamp(f: Definition, n?: number, x?: number): Definition;
        back(s?: number): Definition;
        elastic(x?: number): Definition;
    };
}
export declare namespace Timing {
    function easeInSine(t: number): number;
    function easeOutSine(t: number): number;
    function easeInOutSine(t: number): number;
    function easeInQuad(t: number): number;
    function easeOutQuad(t: number): number;
    function easeInOutQuad(t: number): number;
    function easeInCubic(t: number): number;
    function easeOutCubic(t: number): number;
    function easeInOutCubic(t: number): number;
    function easeInQuart(t: number): number;
    function easeOutQuart(t: number): number;
    function easeInOutQuart(t: number): number;
    function easeInQuint(t: number): number;
    function easeOutQuint(t: number): number;
    function easeInOutQuint(t: number): number;
    function easeInExpo(t: number): number;
    function easeOutExpo(t: number): number;
    function easeInOutExpo(t: number): number;
    function easeInCirc(t: number): number;
    function easeOutCirc(t: number): number;
    function easeInOutCirc(t: number): number;
    function easeInBack(t: number, magnitude?: number): number;
    function easeOutBack(t: number, magnitude?: number): number;
    function easeInOutBack(t: number, magnitude?: number): number;
    function easeInElastic(t: number, magnitude?: number): number;
    function easeOutElastic(t: number, magnitude?: number): number;
    function easeInOutElastic(t: number, magnitude?: number): number;
    function easeOutBounce(t: number): number;
    function easeInBounce(t: number): number;
    function easeInOutBounce(t: number): number;
}
