/// <reference types="jquery" />
/// <reference types="jquery-mousewheel" />
import { Size, KeyValue } from '../types';
import { Rectangle } from '../geometry';
import { NumberExt, Unit } from '../util';
import { Base } from './base';
export declare class PrintManager extends Base {
    show(options?: Partial<PrintManager.Options>): void;
    protected get className(): string;
    protected showPrintWindow($pages: JQuery<HTMLElement>[] | false, options: PrintManager.Options): void;
    protected createPrintPage(pageArea: Rectangle.RectangleLike, options: PrintManager.Options): {
        $page: JQuery<HTMLElement>;
        sheetSize: PrintManager.SheetSize;
    };
    protected createPrintPages(options: PrintManager.Options): JQuery<HTMLElement>[];
    protected get styleSheetId(): string;
    protected updatePrintStyle(size: KeyValue<string>, options: PrintManager.Options): void;
    protected getPrintArea(options: PrintManager.Options): Rectangle.RectangleLike;
    protected getPageSize(area: Rectangle.RectangleLike, poster: PrintManager.Page): Size;
    protected getPageAreas(area: Rectangle.RectangleLike, pageSize: Size): Rectangle[];
    protected getSheetSize(options: PrintManager.Options): PrintManager.SheetSize;
    protected getPageInfo(graphArea: Rectangle.RectangleLike, pageArea: Rectangle.RectangleLike, sheetSize: Size): {
        bbox: Rectangle;
        scale: number;
        fitHorizontal: boolean;
    };
    dispose(): void;
}
export declare namespace PrintManager {
    type Page = boolean | Size | {
        rows: number;
        columns: number;
    };
    interface Options {
        size?: string;
        sheet: Size;
        sheetUnit?: Unit;
        area?: Rectangle.RectangleLike;
        page?: Page;
        margin?: NumberExt.SideOptions;
        marginUnit?: Unit;
        padding?: NumberExt.SideOptions;
        ready: ($pages: JQuery<HTMLElement>[], readyToPrint: ($pages: JQuery<HTMLElement>[] | false) => any, options: {
            sheetSize: SheetSize;
        }) => any;
    }
    interface SheetSize extends Size {
        cssWidth: string;
        cssHeight: string;
    }
    const defaultOptions: Options;
}
