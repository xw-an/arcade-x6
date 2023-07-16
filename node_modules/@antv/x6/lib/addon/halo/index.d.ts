/// <reference types="jquery" />
/// <reference types="jquery-mousewheel" />
import { Rectangle } from '../../geometry';
import { Cell } from '../../model/cell';
import { Edge } from '../../model/edge';
import { CellView } from '../../view/cell';
import { Widget, Handle } from '../common';
export declare class Halo extends Widget<Halo.Options> implements Handle {
    protected $container: JQuery<HTMLElement>;
    protected $content: JQuery<HTMLElement>;
    protected get type(): Handle.Type;
    protected get handleOptions(): Halo.Options;
    init(options: Halo.Options): void;
    protected startListening(): void;
    protected stopListening(): void;
    protected render(): this;
    remove(): this;
    protected update(): void;
    protected updateContent(): void;
    protected getBBox(): Rectangle;
    protected removeCell(): void;
    protected toggleFork(): void;
    protected toggleUnlink(): void;
    startBatch(): void;
    stopBatch(): void;
}
export declare namespace Halo {
    interface Options extends Handle.Options, Widget.Options {
        className?: string;
        /**
         * The preferred side for a self-loop edge created from Halo
         */
        loopEdgePreferredSide?: 'top' | 'bottom' | 'left' | 'right';
        loopEdgeWidth?: number;
        rotateGrid?: number;
        rotateEmbeds?: boolean;
        content?: false | string | ((cellView: CellView, boxElement: HTMLElement) => string);
        /**
         * If set to true, the cell position and dimensions will be used as a
         * basis for the Halo tools position. By default, this is set to `false`
         * which causes the Halo tools position be based on the bounding box of
         * the element view. Sometimes though, your shapes can have certain SVG
         * sub elements that stick out of the view and you don't want these sub
         * elements to affect the Halo tools position. In this case, set the
         * `useCellGeometry` to true.
         */
        useCellGeometry?: boolean;
        /**
         * This function will be called when cloning or forking actions take
         * place and it should return a clone of the original cell. This is
         * useful e.g. if you want the clone to be moved by an offset after
         * the user clicks the clone handle.
         */
        clone?: (cell: Cell, opt: any) => Cell;
        /**
         * A bounding box within which the Halo view will be rendered.
         */
        bbox?: Partial<Rectangle.RectangleLike> | ((this: Halo, view: CellView) => Partial<Rectangle.RectangleLike>);
        magnet?: (cellView: CellView, terminal: Edge.TerminalType) => Element;
    }
    type OrthPosition = 'e' | 'w' | 's' | 'n';
    type Position = OrthPosition | 'se' | 'sw' | 'ne' | 'nw';
    interface PieToggle {
        name: string;
        position?: OrthPosition;
        attrs?: {
            [selector: string]: JQuery.PlainObject;
        };
    }
    const defaultOptions: Options;
}
export interface Halo extends Handle {
}
