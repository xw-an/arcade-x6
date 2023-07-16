import { Events } from './events';
import { Disposable } from './disposable';
export declare class Basecoat<EventArgs = any> extends Events<EventArgs> {
}
export interface Basecoat extends Disposable {
}
export declare namespace Basecoat {
    const dispose: typeof Disposable.dispose;
}
