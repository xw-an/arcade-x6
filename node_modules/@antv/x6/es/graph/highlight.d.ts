import { KeyValue } from '../types';
import { CellView } from '../view';
import { Highlighter } from '../registry';
import { EventArgs } from './events';
import { Base } from './base';
export declare class HighlightManager extends Base {
    protected readonly highlights: KeyValue<HighlightManager.Cache>;
    protected init(): void;
    protected startListening(): void;
    protected stopListening(): void;
    protected onCellHighlight({ view: cellView, magnet, options, }: EventArgs['cell:highlight']): void;
    protected onCellUnhighlight({ magnet, options, }: EventArgs['cell:unhighlight']): void;
    protected resolveHighlighter(options: CellView.HighlightOptions): {
        name: string;
        highlighter: Highlighter.CommonDefinition;
        args: KeyValue<any>;
    } | null;
    protected getHighlighterId(magnet: Element, options: NonNullable<ReturnType<typeof HighlightManager.prototype.resolveHighlighter>>): string;
    protected unhighlight(id: string): void;
    dispose(): void;
}
export declare namespace HighlightManager {
    interface Cache {
        highlighter: Highlighter.Definition<KeyValue>;
        cellView: CellView;
        magnet: Element;
        args: KeyValue;
    }
    type Options = Highlighter.NativeItem | Highlighter.ManaualItem;
}
