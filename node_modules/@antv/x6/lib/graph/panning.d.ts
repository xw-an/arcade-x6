/// <reference types="jquery" />
/// <reference types="jquery-mousewheel" />
import { ModifierKey } from '../types';
import { Base } from './base';
export declare class PanningManager extends Base {
    private panning;
    private clientX;
    private clientY;
    private mousewheelHandle;
    protected get widgetOptions(): PanningManager.Options;
    get pannable(): boolean;
    protected init(): void;
    protected startListening(): void;
    protected stopListening(): void;
    protected preparePanning({ e }: {
        e: JQuery.MouseDownEvent;
    }): void;
    allowPanning(e: JQuery.MouseDownEvent, strict?: boolean): boolean;
    protected startPanning(evt: JQuery.MouseDownEvent): void;
    protected pan(evt: JQuery.MouseMoveEvent): void;
    protected stopPanning(e: JQuery.MouseUpEvent): void;
    protected updateClassName(): void;
    protected onRightMouseDown(e: JQuery.MouseDownEvent): void;
    protected allowMouseWheel(e: JQueryMousewheel.JQueryMousewheelEventObject): boolean;
    protected onMouseWheel(e: JQueryMousewheel.JQueryMousewheelEventObject, deltaX: number, deltaY: number): void;
    autoPanning(x: number, y: number): void;
    enablePanning(): void;
    disablePanning(): void;
    dispose(): void;
}
export declare namespace PanningManager {
    type EventType = 'leftMouseDown' | 'rightMouseDown' | 'mouseWheel';
    export interface Options {
        enabled?: boolean;
        modifiers?: string | ModifierKey[] | null;
        eventTypes?: EventType[];
    }
    export {};
}
