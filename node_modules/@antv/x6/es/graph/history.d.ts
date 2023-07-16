import { KeyValue } from '../types';
import { Basecoat, IDisablable } from '../common';
import { Cell } from '../model/cell';
import { Model } from '../model/model';
import { Graph } from './graph';
export declare class HistoryManager extends Basecoat<HistoryManager.EventArgs> implements IDisablable {
    readonly model: Model;
    readonly graph: Graph;
    readonly options: HistoryManager.CommonOptions;
    readonly validator: HistoryManager.Validator;
    protected redoStack: HistoryManager.Commands[];
    protected undoStack: HistoryManager.Commands[];
    protected batchCommands: HistoryManager.Command[] | null;
    protected batchLevel: number;
    protected lastBatchIndex: number;
    protected freezed: boolean;
    protected readonly handlers: (<T extends HistoryManager.ModelEvents>(event: T, args: Model.EventArgs[T]) => any)[];
    constructor(options: HistoryManager.Options);
    get disabled(): boolean;
    enable(): void;
    disable(): void;
    undo(options?: KeyValue): this;
    redo(options?: KeyValue): this;
    /**
     * Same as `undo()` but does not store the undo-ed command to the
     * `redoStack`. Canceled command therefore cannot be redo-ed.
     */
    cancel(options?: KeyValue): this;
    clean(options?: KeyValue): this;
    canUndo(): boolean;
    canRedo(): boolean;
    validate(events: string | string[], ...callbacks: HistoryManager.Validator.Callback[]): this;
    dispose(): void;
    protected startListening(): void;
    protected stopListening(): void;
    protected createCommand(options?: {
        batch: boolean;
    }): HistoryManager.Command;
    protected revertCommand(cmd: HistoryManager.Commands, options?: KeyValue): void;
    protected applyCommand(cmd: HistoryManager.Commands, options?: KeyValue): void;
    protected executeCommand(cmd: HistoryManager.Command, revert: boolean, options: KeyValue): void;
    protected addCommand<T extends keyof Model.EventArgs>(event: T, args: Model.EventArgs[T]): void;
    /**
     * Gather multiple changes into a single command. These commands could
     * be reverted with single `undo()` call. From the moment the function
     * is called every change made on model is not stored into the undoStack.
     * Changes are temporarily kept until `storeBatchCommand()` is called.
     */
    protected initBatchCommand(options: KeyValue): void;
    /**
     * Store changes temporarily kept in the undoStack. You have to call this
     * function as many times as `initBatchCommand()` been called.
     */
    protected storeBatchCommand(options: KeyValue): void;
    protected filterBatchCommand(batchCommands: HistoryManager.Command[]): Graph.HistoryManager.Command[];
    protected notify(event: keyof HistoryManager.EventArgs, cmd: HistoryManager.Commands | null, options: KeyValue): void;
    protected push(cmd: HistoryManager.Command, options: KeyValue): void;
    /**
     * Conditionally combine multiple undo items into one.
     *
     * Currently this is only used combine a `cell:changed:position` event
     * followed by multiple `cell:change:parent` and `cell:change:children`
     * events, such that a "move + embed" action can be undone in one step.
     *
     * See https://github.com/antvis/X6/issues/2421
     *
     * This is an ugly WORKAROUND. It does not solve deficiencies in the batch
     * system itself.
     */
    private consolidateCommands;
}
export declare namespace HistoryManager {
    export type ModelEvents = keyof Model.EventArgs;
    export interface CommonOptions {
        enabled?: boolean;
        ignoreAdd?: boolean;
        ignoreRemove?: boolean;
        ignoreChange?: boolean;
        eventNames?: (keyof Model.EventArgs)[];
        /**
         * A function evaluated before any command is added. If the function
         * returns `false`, the command does not get stored. This way you can
         * control which commands do not get registered for undo/redo.
         */
        beforeAddCommand?: <T extends ModelEvents>(this: HistoryManager, event: T, args: Model.EventArgs[T]) => any;
        afterAddCommand?: <T extends ModelEvents>(this: HistoryManager, event: T, args: Model.EventArgs[T], cmd: Command) => any;
        executeCommand?: (this: HistoryManager, cmd: Command, revert: boolean, options: KeyValue) => any;
        /**
         * An array of options property names that passed in undo actions.
         */
        revertOptionsList?: string[];
        /**
         * An array of options property names that passed in redo actions.
         */
        applyOptionsList?: string[];
        /**
         * Determine whether to cancel an invalid command or not.
         */
        cancelInvalid?: boolean;
    }
    export interface Options extends Partial<CommonOptions> {
        graph: Graph;
    }
    interface Data {
        id?: string;
    }
    export interface CreationData extends Data {
        edge?: boolean;
        node?: boolean;
        props: Cell.Properties;
    }
    export interface ChangingData extends Data {
        key: string;
        prev: KeyValue;
        next: KeyValue;
    }
    export interface Command {
        batch: boolean;
        modelChange?: boolean;
        event?: ModelEvents;
        data: CreationData | ChangingData;
        options?: KeyValue;
    }
    export type Commands = HistoryManager.Command[] | HistoryManager.Command;
    export {};
}
export declare namespace HistoryManager {
    interface Args<T = never> {
        cmds: Command[] | T;
        options: KeyValue;
    }
    export interface EventArgs extends Validator.EventArgs {
        /**
         * Triggered when a command was undone.
         */
        undo: Args;
        /**
         * Triggered when a command were redone.
         */
        redo: Args;
        /**
         * Triggered when a command was canceled.
         */
        cancel: Args;
        /**
         * Triggered when command(s) were added to the stack.
         */
        add: Args;
        /**
         * Triggered when all commands were clean.
         */
        clean: Args<null>;
        /**
         * Triggered when any change was made to stacks.
         */
        change: Args<null>;
        /**
         * Triggered when a batch command received.
         */
        batch: {
            cmd: Command;
            options: KeyValue;
        };
    }
    export {};
}
export declare namespace HistoryManager {
    /**
     * Runs a set of callbacks to determine if a command is valid. This is
     * useful for checking if a certain action in your application does
     * lead to an invalid state of the graph.
     */
    class Validator extends Basecoat<Validator.EventArgs> {
        protected readonly command: HistoryManager;
        protected readonly cancelInvalid: boolean;
        protected readonly map: {
            [event: string]: Validator.Callback[][];
        };
        constructor(options: Validator.Options);
        protected onCommandAdded({ cmds }: HistoryManager.EventArgs['add']): boolean;
        protected isValidCommand(cmd: HistoryManager.Command): boolean;
        validate(events: string | string[], ...callbacks: Validator.Callback[]): this;
        dispose(): void;
    }
    namespace Validator {
        interface Options {
            history: HistoryManager;
            /**
             * To cancel (= undo + delete from redo stack) a command if is not valid.
             */
            cancelInvalid?: boolean;
        }
        type Callback = (err: Error | null, cmd: HistoryManager.Command, next: (err: Error | null) => any) => any;
        interface EventArgs {
            invalid: {
                err: Error;
            };
        }
    }
}
