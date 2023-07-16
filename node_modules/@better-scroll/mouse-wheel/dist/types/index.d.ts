import BScroll from '@better-scroll/core';
import { ApplyOrder } from '@better-scroll/shared-utils';
export declare type MouseWheelOptions = Partial<MouseWheelConfig> | true;
export interface MouseWheelConfig {
    speed: number;
    invert: boolean;
    easeTime: number;
    discreteTime: number;
    throttleTime: number;
    dampingFactor: number;
}
declare module '@better-scroll/core' {
    interface CustomOptions {
        mouseWheel?: MouseWheelOptions;
    }
}
export default class MouseWheel {
    scroll: BScroll;
    static pluginName: string;
    static applyOrder: ApplyOrder;
    mouseWheelOpt: MouseWheelConfig;
    private eventRegister;
    private wheelEndTimer;
    private wheelMoveTimer;
    private wheelStart;
    private deltaCache;
    private hooksFn;
    constructor(scroll: BScroll);
    private init;
    private handleBScroll;
    private handleOptions;
    private handleHooks;
    private registerEvent;
    private registerHooks;
    private wheelHandler;
    private wheelStartHandler;
    private cleanCache;
    private wheelMoveHandler;
    private wheelEndDetector;
    private getWheelDelta;
    private beforeHandler;
    private getEaseTime;
    destroy(): void;
}
