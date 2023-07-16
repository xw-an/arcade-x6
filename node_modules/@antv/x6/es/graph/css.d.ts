import { Base } from './base';
export declare class CSSManager extends Base {
    protected init(): void;
    dispose(): void;
}
export declare namespace CSSManager {
    function ensure(): void;
    function clean(): void;
}
