import { KeyValue } from '../types';
import { Timing, Interp } from '../common';
import { Cell } from './cell';
export declare class Animation {
    protected readonly cell: Cell;
    protected readonly ids: {
        [path: string]: number;
    };
    protected readonly cache: {
        [path: string]: {
            startValue: any;
            targetValue: any;
            options: Animation.StartOptions<any>;
        };
    };
    constructor(cell: Cell);
    get(): string[];
    start<T extends Animation.TargetValue>(path: string | string[], targetValue: T, options?: Animation.StartOptions<T>, delim?: string): () => void;
    stop<T extends Animation.TargetValue>(path: string | string[], options?: Animation.StopOptions<T>, delim?: string): this;
    private clean;
    private getTiming;
    private getInterp;
    private getArgs;
}
export declare namespace Animation {
    interface BaseOptions {
        delay: number;
        duration: number;
        timing: Timing.Names | Timing.Definition;
    }
    type TargetValue = string | number | KeyValue<number>;
    interface CallbackArgs<T> {
        cell: Cell;
        path: string;
        startValue: T;
        targetValue: T;
    }
    interface ProgressArgs<T> extends CallbackArgs<T> {
        progress: number;
        currentValue: T;
    }
    interface StopArgs<T> extends CallbackArgs<T> {
        jumpedToEnd?: boolean;
    }
    interface StartOptions<T> extends Partial<BaseOptions>, StopOptions<T> {
        interp?: Interp.Definition<any>;
        /**
         * A function to call when the animation begins.
         */
        start?: (options: CallbackArgs<T>) => void;
        /**
         * A function to be called after each step of the animation, only once per
         * animated element regardless of the number of animated properties.
         */
        progress?: (options: ProgressArgs<T>) => void;
    }
    interface StopOptions<T> {
        /**
         * A Boolean indicating whether to complete the animation immediately.
         * Defaults to `false`.
         */
        jumpedToEnd?: boolean;
        /**
         * A function that is called once the animation completes.
         */
        complete?: (options: CallbackArgs<T>) => void;
        /**
         * A function to be called when the animation stops.
         */
        stop?: (options: StopArgs<T>) => void;
        /**
         * A function to be called when the animation completes or stops.
         */
        finish?: (options: CallbackArgs<T>) => void;
    }
    const defaultOptions: BaseOptions;
}
