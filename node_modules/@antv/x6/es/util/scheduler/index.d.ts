export declare namespace Scheduler {
    type ITaskCallback = ((data: any) => void | ITaskCallback) | null;
    export const scheduleTask: (callback: ITaskCallback, data?: any) => void;
    export const shouldYield: () => boolean;
    export {};
}
