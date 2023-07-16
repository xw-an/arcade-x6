/// <reference types="jquery" />
import { ModifierKey } from '../types';
import { Scroller } from '../addon/scroller';
import { Base } from './base';
export declare class ScrollerManager extends Base {
    widget: Scroller | null;
    protected get widgetOptions(): ScrollerManager.Options;
    get pannable(): boolean;
    protected init(): void;
    protected startListening(): void;
    protected stopListening(): void;
    protected onRightMouseDown(e: JQuery.MouseDownEvent): void;
    protected preparePanning({ e }: {
        e: JQuery.MouseDownEvent;
    }): void;
    allowPanning(e: JQuery.MouseDownEvent, strict?: boolean): boolean | null;
    protected updateClassName(isPanning?: boolean): void;
    enablePanning(): void;
    disablePanning(): void;
    lock(): void;
    unlock(): void;
    update(): void;
    enableAutoResize(): void;
    disableAutoResize(): void;
    resize(width?: number, height?: number): void;
    dispose(): void;
}
export declare namespace ScrollerManager {
    type EventType = 'leftMouseDown' | 'rightMouseDown';
    export interface Options extends Scroller.CommonOptions {
        enabled?: boolean;
        pannable?: boolean | {
            enabled: boolean;
            eventTypes: EventType[];
        };
        /**
         * alt, ctrl, shift, meta
         */
        modifiers?: string | ModifierKey[] | null;
    }
    export {};
}
