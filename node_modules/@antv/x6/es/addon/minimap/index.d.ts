/// <reference types="jquery" />
/// <reference types="jquery-mousewheel" />
import { View } from '../../view/view';
import { Graph } from '../../graph/graph';
import { EventArgs } from '../../graph/events';
export declare class MiniMap extends View {
    readonly options: MiniMap.Options;
    readonly container: HTMLDivElement;
    readonly $container: JQuery<HTMLElement>;
    protected readonly zoomHandle: HTMLDivElement;
    protected readonly $viewport: JQuery<HTMLElement>;
    protected readonly sourceGraph: Graph;
    protected readonly targetGraph: Graph;
    protected geometry: Util.ViewGeometry;
    protected ratio: number;
    private targetGraphTransforming;
    protected get graph(): Graph;
    protected get scroller(): import("..").Scroller | null;
    protected get graphContainer(): HTMLElement;
    protected get $graphContainer(): JQuery<any>;
    constructor(options: Partial<MiniMap.Options> & {
        graph: Graph;
    });
    protected startListening(): void;
    protected stopListening(): void;
    protected onRemove(): void;
    protected onTransform(options: {
        ui: boolean;
    }): void;
    protected onModelUpdated(): void;
    protected updatePaper(width: number, height: number): this;
    protected updatePaper({ width, height }: EventArgs['resize']): this;
    protected updateViewport(): void;
    protected startAction(evt: JQuery.MouseDownEvent): void;
    protected doAction(evt: JQuery.MouseMoveEvent): void;
    protected stopAction(): void;
    protected scrollTo(evt: JQuery.MouseDownEvent): void;
    dispose(): void;
}
export declare namespace MiniMap {
    interface Options {
        graph: Graph;
        container?: HTMLElement;
        width: number;
        height: number;
        padding: number;
        scalable?: boolean;
        minScale?: number;
        maxScale?: number;
        createGraph?: (options: Graph.Options) => Graph;
        graphOptions?: Graph.Options;
    }
}
declare namespace Util {
    const defaultOptions: Partial<MiniMap.Options>;
    const documentEvents: {
        mousemove: string;
        touchmove: string;
        mouseup: string;
        touchend: string;
    };
    interface ViewGeometry extends JQuery.PlainObject<number> {
        top: number;
        left: number;
        width: number;
        height: number;
    }
    interface EventData {
        frameId?: number;
        action: 'zooming' | 'panning';
        clientX: number;
        clientY: number;
        scrollLeft: number;
        scrollTop: number;
        zoom: number;
        scale: {
            sx: number;
            sy: number;
        };
        geometry: ViewGeometry;
        translateX: number;
        translateY: number;
    }
}
export {};
