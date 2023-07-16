import { Point } from '../../geometry';
import { Edge } from '../../model/edge';
import { CellView } from '../../view/cell';
import { EdgeView } from '../../view/edge';
export declare function getAnchor(this: EdgeView, pos: Point.PointLike, terminalView: CellView, terminalMagnet: Element, type: Edge.TerminalType): string | import("..").NodeAnchor.NativeItem<"left" | "top" | "right" | "bottom" | "center" | "topLeft" | "topRight" | "bottomLeft" | "bottomRight" | "orth" | "nodeCenter" | "midSide"> | import("..").NodeAnchor.ManaualItem | undefined;
export declare function getViewBBox(view: CellView, quick?: boolean): import("../../geometry").Rectangle;
