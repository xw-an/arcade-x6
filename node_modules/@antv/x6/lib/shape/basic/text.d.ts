import { NodeView } from '../../view';
declare const Text_base: typeof import("../base").Base;
export declare class Text extends Text_base {
}
export declare namespace Text {
    class View extends NodeView {
        confirmUpdate(flag: number, options?: any): number;
    }
}
export {};
