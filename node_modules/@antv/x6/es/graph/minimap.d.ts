import { Base } from './base';
import { MiniMap } from '../addon/minimap';
export declare class MiniMapManager extends Base {
    widget: MiniMap | null;
    protected get widgetOptions(): MiniMapManager.Options;
    protected init(): void;
    dispose(): void;
}
export declare namespace MiniMapManager {
    interface Options extends Omit<MiniMap.Options, 'graph' | 'container'> {
        enabled: boolean;
        container: HTMLElement;
    }
}
