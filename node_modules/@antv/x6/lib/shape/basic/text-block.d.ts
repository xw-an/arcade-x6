import { Size } from '../../types';
import { Attr } from '../../registry';
import { Node } from '../../model';
import { Store } from '../../model/store';
import { NodeView } from '../../view';
export declare class TextBlock<Properties extends TextBlock.Properties = TextBlock.Properties> extends Node<Properties> {
    readonly store: Store<TextBlock.Properties>;
    get content(): string;
    set content(val: string);
    getContent(): string;
    setContent(content?: string, options?: Node.SetOptions): void;
    protected setup(): void;
    protected updateSize(size: Size): void;
    protected updateContent(content?: string): void;
}
export declare namespace TextBlock {
    interface Properties extends Node.Properties {
        content?: string;
    }
}
export declare namespace TextBlock {
}
export declare namespace TextBlock {
    class View extends NodeView<TextBlock> {
        confirmUpdate(flag: number, options?: any): number;
        update(partialAttrs?: Attr.CellAttrs): void;
        updateContent(partialAttrs?: Attr.CellAttrs): void;
    }
    namespace View {
    }
}
