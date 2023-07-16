import { Disablable } from '../../common';
import { Graph } from '../../graph';
export declare class AutoSave extends Disablable<AutoSave.EventArgs> {
    protected readonly options: AutoSave.Options;
    protected get graph(): Graph;
    delay: number;
    throttle: number;
    threshold: number;
    private changeCount;
    private timestamp;
    constructor(options: AutoSave.Options);
    private onModelChanged;
    private save;
    reset(): void;
    dispose(): void;
}
export declare namespace AutoSave {
    interface Options {
        graph: Graph;
        /**
         * Minimum amount of seconds between two consecutive autosaves.
         */
        delay?: number;
        /**
         * Minimum amount of seconds and more than `threshold` changes
         * between two consecutive autosaves.
         */
        throttle?: number;
        /**
         * Minimum amount of ignored changes before an autosave.
         */
        threshold?: number;
    }
    const defaultOptions: Partial<Options>;
    interface EventArgs {
        save?: null;
    }
}
