import { IDisablable } from '../common';
import { Clipboard } from '../addon/clipboard';
import { Cell } from '../model/cell';
import { Graph } from './graph';
import { Base } from './base';
export declare class ClipboardManager extends Base implements IDisablable {
    widget: Clipboard;
    protected get commonOptions(): {
        useLocalStorage?: boolean | undefined;
    };
    protected get instanceOptions(): Graph.ClipboardManager.Options;
    get cells(): Cell<Cell.Properties>[];
    get disabled(): boolean;
    protected init(): void;
    enable(): void;
    disable(): void;
    copy(cells: Cell[], options?: Clipboard.CopyOptions): void;
    cut(cells: Cell[], options?: Clipboard.CopyOptions): void;
    paste(options?: Clipboard.PasteOptions, graph?: Graph): Cell<Cell.Properties>[];
    clean(force?: boolean): void;
    isEmpty(): boolean;
    dispose(): void;
}
export declare namespace ClipboardManager {
    interface ClipboardEventArgs {
        'clipboard:changed': {
            cells: Cell[];
        };
    }
    interface Options extends Clipboard.Options {
        enabled?: boolean;
    }
    interface CopyOptions extends Clipboard.CopyOptions {
    }
    interface PasteOptions extends Clipboard.PasteOptions {
    }
}
