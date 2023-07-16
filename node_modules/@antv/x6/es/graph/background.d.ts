import { Background } from '../registry';
import { Base } from './base';
export declare class BackgroundManager extends Base {
    protected optionsCache: BackgroundManager.Options | null;
    protected get elem(): HTMLDivElement;
    protected init(): void;
    protected startListening(): void;
    protected stopListening(): void;
    protected updateBackgroundImage(options?: BackgroundManager.Options): void;
    protected drawBackgroundImage(img?: HTMLImageElement | null, options?: BackgroundManager.Options): void;
    protected updateBackgroundColor(color?: string | null): void;
    protected updateBackgroundOptions(options?: BackgroundManager.Options): void;
    update(): void;
    draw(options?: BackgroundManager.Options): void;
    clear(): void;
    dispose(): void;
}
export declare namespace BackgroundManager {
    type Options = Background.Options | Background.NativeItem | Background.ManaualItem;
}
