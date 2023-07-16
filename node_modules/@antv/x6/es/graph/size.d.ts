import { Base } from './base';
export declare class SizeManager extends Base {
    protected hasScroller(): boolean;
    protected getContainer(): HTMLElement;
    protected init(): void;
    resize(width?: number, height?: number): void;
    resizeGraph(width?: number, height?: number): void;
    resizeScroller(width?: number, height?: number): void;
    resizePage(width?: number, height?: number): void;
    dispose(): void;
}
