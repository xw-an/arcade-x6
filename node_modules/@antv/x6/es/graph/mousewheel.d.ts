/// <reference types="jquery-mousewheel" />
import { Graph } from './graph';
import { ModifierKey } from '../types';
import { Disposable, IDisablable } from '../common';
export declare class MouseWheel extends Disposable implements IDisablable {
    readonly options: MouseWheel.Options;
    readonly target: HTMLElement | Document;
    readonly container: HTMLElement;
    protected cumulatedFactor: number;
    protected currentScale: number | null;
    protected startPos: {
        x: number;
        y: number;
    };
    private mousewheelHandle;
    protected get graph(): Graph;
    constructor(options: MouseWheel.Options);
    get disabled(): boolean;
    enable(force?: boolean): void;
    disable(): void;
    protected allowMouseWheel(evt: JQueryMousewheel.JQueryMousewheelEventObject): any;
    protected onMouseWheel(evt: JQueryMousewheel.JQueryMousewheelEventObject): void;
    dispose(): void;
}
export declare namespace MouseWheel {
    interface Options {
        graph: Graph;
        enabled?: boolean;
        global?: boolean;
        factor?: number;
        minScale?: number;
        maxScale?: number;
        modifiers?: string | ModifierKey[] | null;
        guard?: (this: Graph, e: WheelEvent) => boolean;
        zoomAtMousePosition?: boolean;
    }
}
