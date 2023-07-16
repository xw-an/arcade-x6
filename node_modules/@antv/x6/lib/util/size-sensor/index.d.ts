import { Listener } from './types';
export declare namespace SizeSensor {
    const bind: (element: Element, cb: Listener) => () => void;
    const clear: (element: Element) => void;
}
