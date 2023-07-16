/// <reference types="jquery" />
import { ToolsView } from '../../view/tool';
import { Cell } from '../../model';
import { CellView, NodeView, EdgeView } from '../../view';
export declare class CellEditor extends ToolsView.ToolItem<NodeView | EdgeView, CellEditor.CellEditorOptions & {
    event: JQuery.MouseEventBase;
}> {
    private editor;
    private labelIndex;
    private distance;
    render(): this;
    createElement(): void;
    updateEditor(): this;
    onDocumentMouseDown(e: JQuery.MouseDownEvent): void;
    onDblClick(e: JQuery.DoubleClickEvent): void;
    onMouseDown(e: JQuery.MouseDownEvent): void;
    autoFocus(): void;
    selectText(): void;
}
export declare namespace CellEditor {
    interface CellEditorOptions extends ToolsView.ToolItem.Options {
        attrs: {
            fontSize: number;
            fontFamily: string;
            color: string;
            backgroundColor: string;
        };
        labelAddable?: boolean;
        getText: (this: CellView, args: {
            cell: Cell;
            index?: number;
        }) => string;
        setText: (this: CellView, args: {
            cell: Cell;
            value: string;
            index?: number;
            distance?: number;
        }) => void;
    }
}
export declare namespace CellEditor {
}
export declare namespace CellEditor {
    const NodeEditor: typeof ToolsView.ToolItem;
    const EdgeEditor: typeof ToolsView.ToolItem;
}
