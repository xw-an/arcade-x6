/// <reference types="jquery" />
import Mousetrap from 'mousetrap';
import { Disposable, IDisablable } from '../common';
import { Graph } from './graph';
export declare class Keyboard extends Disposable implements IDisablable {
    readonly options: Keyboard.Options;
    readonly target: HTMLElement | Document;
    readonly container: HTMLElement;
    readonly mousetrap: Mousetrap.MousetrapInstance;
    protected get graph(): Graph;
    constructor(options: Keyboard.Options);
    get disabled(): boolean;
    enable(): void;
    disable(): void;
    on(keys: string | string[], callback: Keyboard.Handler, action?: Keyboard.Action): void;
    off(keys: string | string[], action?: Keyboard.Action): void;
    private focus;
    private getKeys;
    protected formatkey(key: string): string;
    protected isGraphEvent(e: KeyboardEvent): boolean;
    isInputEvent(e: KeyboardEvent | JQuery.MouseUpEvent): boolean;
    isEnabledForEvent(e: KeyboardEvent): boolean;
    dispose(): void;
}
export declare namespace Keyboard {
    type Action = 'keypress' | 'keydown' | 'keyup';
    type Handler = (e: KeyboardEvent) => void;
    interface Options {
        graph: Graph;
        enabled?: boolean;
        /**
         * Specifies if keyboard event should bind on docuemnt or on container.
         *
         * Default is `false` that will bind keyboard event on the container.
         */
        global?: boolean;
        format?: (this: Graph, key: string) => string;
        guard?: (this: Graph, e: KeyboardEvent) => boolean;
    }
}
export declare namespace Keyboard {
    function createMousetrap(keyboard: Keyboard): Mousetrap.MousetrapInstance;
}
