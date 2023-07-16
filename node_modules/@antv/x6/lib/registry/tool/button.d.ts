/// <reference types="jquery" />
import { Point } from '../../geometry';
import { CellView } from '../../view/cell';
import { NodeView } from '../../view/node';
import { EdgeView } from '../../view/edge';
import { ToolsView } from '../../view/tool';
import { Cell } from '../../model';
export declare class Button extends ToolsView.ToolItem<EdgeView | NodeView, Button.Options> {
    protected onRender(): void;
    update(): this;
    protected updatePosition(): void;
    protected getNodeMatrix(): DOMMatrix;
    protected getEdgeMatrix(): DOMMatrix;
    protected onMouseDown(e: JQuery.MouseDownEvent): void;
}
export declare namespace Button {
    interface Options extends ToolsView.ToolItem.Options {
        x?: number;
        y?: number;
        distance?: number;
        offset?: number | Point.PointLike;
        rotate?: boolean;
        useCellGeometry?: boolean;
        onClick?: (this: CellView, args: {
            e: JQuery.MouseDownEvent;
            cell: Cell;
            view: CellView;
            btn: Button;
        }) => any;
    }
}
export declare namespace Button {
}
export declare namespace Button {
    const Remove: typeof ToolsView.ToolItem;
}
