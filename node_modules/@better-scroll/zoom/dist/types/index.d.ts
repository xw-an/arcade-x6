import BScroll from '@better-scroll/core';
export declare type ZoomOptions = Partial<ZoomConfig> | true;
export interface ZoomConfig {
    start: number;
    min: number;
    max: number;
    initialOrigin: [OriginX, OriginY];
    minimalZoomDistance: number;
    bounceTime: number;
}
declare type OriginX = number | 'left' | 'right' | 'center';
declare type OriginY = number | 'top' | 'bottom' | 'center';
declare module '@better-scroll/core' {
    interface CustomOptions {
        zoom?: ZoomOptions;
    }
    interface CustomAPI {
        zoom: PluginAPI;
    }
}
interface PluginAPI {
    zoomTo(scale: number, x: OriginX, y: OriginY, bounceTime?: number): void;
}
interface Point {
    x: number;
    y: number;
    baseScale: number;
}
export default class Zoom implements PluginAPI {
    scroll: BScroll;
    static pluginName: string;
    origin: Point;
    scale: number;
    zoomOpt: ZoomConfig;
    numberOfFingers: number;
    private zoomed;
    private startDistance;
    private startScale;
    private wrapper;
    private prevScale;
    private hooksFn;
    constructor(scroll: BScroll);
    init(): void;
    zoomTo(scale: number, x: OriginX, y: OriginY, bounceTime?: number): void;
    private handleBScroll;
    private handleOptions;
    private handleHooks;
    private setTransformOrigin;
    private tryInitialZoomTo;
    private fingersOperation;
    private _doZoomTo;
    private _zoomTo;
    private resolveOrigin;
    zoomStart(e: TouchEvent): void;
    zoom(e: TouchEvent): void;
    zoomEnd(): void;
    private getFingerDistance;
    private shouldRebound;
    private dampingScale;
    private setScale;
    private resetBoundaries;
    private getNewPos;
    private registerHooks;
    destroy(): void;
}
export {};
