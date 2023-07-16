import BScroll from '@better-scroll/core';
declare module '@better-scroll/core' {
    interface CustomOptions {
        observeDOM?: true;
    }
}
export default class ObserveDOM {
    scroll: BScroll;
    static pluginName: string;
    observer: MutationObserver;
    private stopObserver;
    private hooksFn;
    constructor(scroll: BScroll);
    init(): void;
    private handleMutationObserver;
    private handleHooks;
    private mutationObserverHandler;
    private startObserve;
    private shouldNotRefresh;
    private checkDOMUpdate;
    private registerHooks;
    private stopObserve;
    destroy(): void;
}
