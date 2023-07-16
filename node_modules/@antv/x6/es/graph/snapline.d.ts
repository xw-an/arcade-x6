import { Snapline } from '../addon/snapline';
import { Base } from './base';
export declare class SnaplineManager extends Base {
    readonly widget: Snapline;
    dispose(): void;
}
export declare namespace SnaplineManager {
    type Filter = Snapline.Filter;
    interface Options extends Snapline.Options {
    }
}
