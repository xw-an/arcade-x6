import { Basecoat } from './basecoat';
export interface IDisablable {
    readonly disabled: boolean;
    enable(): void;
    disable(): void;
}
export declare abstract class Disablable<EventArgs = any> extends Basecoat<EventArgs> implements IDisablable {
    private _disabled?;
    get disabled(): boolean;
    enable(): void;
    disable(): void;
}
