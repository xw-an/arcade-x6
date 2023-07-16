/// <reference types="jquery" />
import { ModifierKey } from '../types';
import { Selection } from '../addon/selection';
import { Cell } from '../model/cell';
import { EventArgs } from './events';
import { Base } from './base';
export declare class SelectionManager extends Base {
    widget: Selection;
    private movedMap;
    private unselectMap;
    protected get widgetOptions(): SelectionManager.Options;
    get rubberbandDisabled(): boolean;
    get disabled(): boolean;
    get length(): number;
    get cells(): Cell<Cell.Properties>[];
    protected init(): void;
    protected startListening(): void;
    protected stopListening(): void;
    protected onBlankMouseDown({ e }: EventArgs['blank:mousedown']): void;
    protected onBlankClick(): void;
    allowRubberband(e: JQuery.MouseDownEvent, strict?: boolean): boolean;
    allowMultipleSelection(e: JQuery.MouseDownEvent | JQuery.MouseUpEvent): boolean;
    protected onCellMouseMove({ cell }: EventArgs['cell:mousemove']): void;
    protected onCellMouseUp({ e, cell }: EventArgs['cell:mouseup']): void;
    protected onBoxMouseDown({ e, cell }: Selection.EventArgs['box:mousedown']): void;
    isEmpty(): boolean;
    isSelected(cell: Cell | string): boolean;
    protected getCells(cells: Cell | string | (Cell | string)[]): Cell<Cell.Properties>[];
    select(cells: Cell | string | (Cell | string)[], options?: Selection.AddOptions): this;
    unselect(cells: Cell | string | (Cell | string)[], options?: Selection.RemoveOptions): this;
    reset(cells?: Cell | string | (Cell | string)[], options?: Selection.SetOptions): this;
    clean(options?: Selection.SetOptions): this;
    enable(): this;
    disable(): this;
    startRubberband(e: JQuery.MouseDownEvent): this;
    enableRubberband(): this;
    disableRubberband(): this;
    isMultiple(): boolean;
    enableMultiple(): this;
    disableMultiple(): this;
    setModifiers(modifiers?: string | ModifierKey[] | null): this;
    setContent(content?: Selection.Content): this;
    setFilter(filter?: Selection.Filter): this;
    dispose(): void;
}
export declare namespace SelectionManager {
    interface Options extends Selection.CommonOptions {
        enabled?: boolean;
        rubberband?: boolean;
        modifiers?: string | ModifierKey[] | null;
        multiple?: boolean;
        multipleSelectionModifiers?: string | ModifierKey[] | null;
        selectCellOnMoved?: boolean;
        selectNodeOnMoved?: boolean;
        selectEdgeOnMoved?: boolean;
    }
    type Filter = Selection.Filter;
    type Content = Selection.Content;
    type SetOptions = Selection.SetOptions;
    type AddOptions = Selection.AddOptions;
    type RemoveOptions = Selection.RemoveOptions;
}
