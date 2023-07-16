import BScroll from '@better-scroll/core';
export declare type PullUpLoadOptions = Partial<PullUpLoadConfig> | true;
export interface PullUpLoadConfig {
    threshold: number;
}
declare module '@better-scroll/core' {
    interface CustomOptions {
        pullUpLoad?: PullUpLoadOptions;
    }
    interface CustomAPI {
        pullUpLoad: PluginAPI;
    }
}
interface PluginAPI {
    finishPullUp(): void;
    openPullUp(config?: PullUpLoadOptions): void;
    closePullUp(): void;
    autoPullUpLoad(): void;
}
export default class PullUp implements PluginAPI {
    scroll: BScroll;
    static pluginName: string;
    private hooksFn;
    pulling: boolean;
    watching: boolean;
    options: PullUpLoadConfig;
    constructor(scroll: BScroll);
    private init;
    private handleBScroll;
    private handleOptions;
    private handleHooks;
    private registerHooks;
    private watch;
    private unwatch;
    private checkPullUp;
    finishPullUp(): void;
    openPullUp(config?: PullUpLoadOptions): void;
    closePullUp(): void;
    autoPullUpLoad(): void;
}
export {};
