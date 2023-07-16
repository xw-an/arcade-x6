/// <reference types="jquery" />
import { KeyValue } from '../types';
import { NodeTool, EdgeTool } from '../registry/tool';
import { View } from './view';
import { CellView } from './cell';
import { Markup } from './markup';
export declare class ToolsView extends View {
    tools: ToolsView.ToolItem[] | null;
    options: ToolsView.Options;
    cellView: CellView;
    svgContainer: SVGGElement;
    htmlContainer: HTMLDivElement;
    get name(): string | undefined;
    get graph(): import("..").Graph;
    get cell(): import("..").Cell<import("..").Cell.Properties>;
    protected get [Symbol.toStringTag](): string;
    constructor(options?: ToolsView.Options);
    protected createContainer(svg: boolean, options: ToolsView.Options): SVGElement | HTMLElement;
    config(options: ToolsView.ConfigOptions): this;
    update(options?: ToolsView.UpdateOptions): this;
    focus(focusedTool: ToolsView.ToolItem | null): this;
    blur(blurredTool: ToolsView.ToolItem | null): this;
    hide(): this;
    show(): this;
    remove(): this;
    mount(): this;
}
export declare namespace ToolsView {
    interface Options extends ConfigOptions {
        className?: string;
    }
    interface ConfigOptions {
        view?: CellView;
        name?: string;
        local?: boolean;
        items?: (ToolItem | string | NodeTool.NativeNames | NodeTool.NativeItem | NodeTool.ManaualItem | EdgeTool.NativeNames | EdgeTool.NativeItem | EdgeTool.ManaualItem)[] | null;
    }
    interface UpdateOptions {
        toolId?: string;
    }
}
export declare namespace ToolsView {
    const toStringTag: string;
    function isToolsView(instance: any): instance is ToolsView;
}
export declare namespace ToolsView {
    class ToolItem<TargetView extends CellView = CellView, Options extends ToolItem.Options = ToolItem.Options> extends View {
        protected static defaults: ToolItem.Options;
        static getDefaults<T extends ToolItem.Options>(): T;
        static config<T extends ToolItem.Options = ToolItem.Options>(options: Partial<T>): void;
        static getOptions<T extends ToolItem.Options = ToolItem.Options>(options: Partial<T>): T;
        readonly options: Options;
        container: HTMLElement | SVGElement;
        parent: ToolsView;
        protected cellView: TargetView;
        protected visible: boolean;
        protected childNodes: KeyValue<Element>;
        get graph(): import("..").Graph;
        get cell(): import("..").Cell<import("..").Cell.Properties>;
        get name(): string | undefined;
        protected get [Symbol.toStringTag](): string;
        constructor(options?: Partial<Options>);
        protected init(): void;
        protected getOptions(options: Partial<Options>): Options;
        delegateEvents(): this;
        config(view: CellView, toolsView: ToolsView): this;
        render(): this;
        protected onRender(): void;
        update(): this;
        protected stamp(elem: Element): void;
        show(): this;
        hide(): this;
        isVisible(): boolean;
        focus(): this;
        blur(): this;
        protected guard(evt: JQuery.TriggeredEvent): any;
    }
    namespace ToolItem {
        interface Options {
            name?: string;
            tagName?: string;
            isSVGElement?: boolean;
            className?: string;
            markup?: Markup;
            events?: View.Events | null;
            documentEvents?: View.Events | null;
            focusOpacity?: number;
        }
    }
    namespace ToolItem {
        type Definition = typeof ToolItem | (new (options: ToolItem.Options) => ToolItem);
        function define<T extends Options>(options: T): typeof ToolItem;
    }
    namespace ToolItem {
        const toStringTag: string;
        function isToolItem(instance: any): instance is ToolItem;
    }
}
