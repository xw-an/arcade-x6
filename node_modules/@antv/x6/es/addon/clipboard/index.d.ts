import { Graph } from '../../graph/graph';
import { Cell } from '../../model/cell';
import { Edge } from '../../model/edge';
import { Node } from '../../model/node';
import { Model } from '../../model/model';
export declare class Clipboard {
    protected options: Clipboard.Options;
    cells: Cell[];
    copy(cells: Cell[], graph: Graph | Model, options?: Clipboard.CopyOptions): void;
    cut(cells: Cell[], graph: Graph | Model, options?: Clipboard.CopyOptions): void;
    paste(graph: Graph | Model, options?: Clipboard.PasteOptions): Cell<Cell.Properties>[];
    serialize(options: Clipboard.PasteOptions): void;
    deserialize(options: Clipboard.PasteOptions): void;
    isEmpty(): boolean;
    clean(): void;
}
export declare namespace Clipboard {
    interface Options {
        useLocalStorage?: boolean;
    }
    interface CopyOptions extends Options {
        deep?: boolean;
    }
    interface PasteOptions extends Options {
        /**
         * Set of properties to be set on each copied node on every `paste()` call.
         * It is defined as an object. e.g. `{ zIndex: 1 }`.
         */
        nodeProps?: Node.Properties;
        /**
         * Set of properties to be set on each copied edge on every `paste()` call.
         * It is defined as an object. e.g. `{ zIndex: 1 }`.
         */
        edgeProps?: Edge.Properties;
        /**
         * An increment that is added to the pasted cells position on every
         * `paste()` call. It can be either a number or an object with `dx`
         * and `dy` attributes. It defaults to `{ dx: 20, dy: 20 }`.
         */
        offset?: number | {
            dx: number;
            dy: number;
        };
    }
}
