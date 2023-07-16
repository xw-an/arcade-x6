/// <reference types="jquery" />
/// <reference types="jquery-mousewheel" />
import { View } from '../../view/view';
import { Graph } from '../../graph/graph';
export declare class Handle {
    readonly graph: Graph;
    protected readonly handleOptions: Handle.Options;
    protected handles: Handle.Metadata[];
    protected $handleContainer: JQuery<HTMLElement>;
    protected $pieToggles: {
        [name: string]: JQuery<HTMLElement>;
    };
    protected get handleClassName(): string;
    protected get pie(): {
        innerRadius: number;
        outerRadius: number;
        sliceAngle: number;
        startAngle: number;
        iconSize: number;
        toggles: {
            name: string;
            position: Handle.OrthPosition;
            attrs?: {
                [selector: string]: JQuery.PlainObject<any>;
            } | undefined;
        }[];
    };
    protected initHandles(this: Handle & View): void;
    protected onHandleMouseDown(this: Handle & View, evt: JQuery.MouseDownEvent): void;
    protected onHandleMouseMove(this: Handle & View, evt: JQuery.MouseMoveEvent): void;
    protected onHandleMouseUp(this: Handle & View, evt: JQuery.MouseUpEvent): void;
    protected triggerHandleAction(this: Handle & View, action: string, eventName: string, evt: JQuery.TriggeredEvent, args?: any): void;
    protected onPieToggleMouseDown(this: Handle & View, evt: JQuery.MouseDownEvent): void;
    protected setPieIcons(this: Handle & View): void;
    getHandleIdx(name: string): number;
    hasHandle(name: string): boolean;
    getHandle(name: string): Handle.Metadata | undefined;
    renderHandle(this: Handle & View, handle: Handle.Metadata): JQuery<any>;
    addHandle(this: Handle & View, handle: Handle.Metadata): Handle & View<any>;
    addHandles(this: Handle & View, handles: Handle.Metadata[]): Handle & View<any>;
    removeHandles(this: Handle & View): Handle & View<any>;
    removeHandle(this: Handle & View, name: string): Handle & View<any>;
    changeHandle(this: Handle & View, name: string, newHandle: Partial<Handle.Metadata>): Handle & View<any>;
    toggleHandle(this: Handle & View, name: string, selected?: boolean): Handle & View<any>;
    selectHandle(this: Handle & View, name: string): Handle & View<any>;
    deselectHandle(this: Handle & View, name: string): Handle & View<any>;
    deselectAllHandles(this: Handle & View): Handle & View<any>;
    protected getHandleElem(name: string): JQuery<HTMLElement>;
    protected updateHandleIcon(this: Handle & View, $handle: JQuery<HTMLElement>, icon?: string | null): void;
    protected isRendered(): boolean;
    protected isOpen(name?: string): boolean;
    protected toggleState(this: Handle & View, name?: string): void;
    protected applyAttrs(elem: HTMLElement | JQuery, attrs?: {
        [selector: string]: JQuery.PlainObject;
    }): void;
}
export declare namespace Handle {
    type Type = 'surround' | 'pie' | 'toolbar';
    type OrthPosition = 'e' | 'w' | 's' | 'n';
    type Position = OrthPosition | 'se' | 'sw' | 'ne' | 'nw';
    interface Metadata {
        /**
         * The name of the custom tool. This name will be also set as a
         * CSS class to the handle DOM element making it easy to select
         * it your CSS stylesheet.
         */
        name: string;
        position: Position;
        /**
         * The icon url used to render the tool. This icons is set as a
         * background image on the tool handle DOM element.
         */
        icon?: string | null;
        iconSelected?: string | null;
        content?: string | Element;
        events?: {
            [event: string]: string | ((args: EventArgs) => void);
        };
        attrs?: {
            [selector: string]: JQuery.PlainObject;
        };
    }
    interface Pie {
        innerRadius: number;
        outerRadius: number;
        sliceAngle: number;
        startAngle: number;
        iconSize: number;
        toggles: {
            name: string;
            position: OrthPosition;
            attrs?: {
                [selector: string]: JQuery.PlainObject;
            };
        }[];
    }
    interface Options {
        type?: Type;
        pie?: Partial<Pie>;
        handles?: Metadata[] | null;
        tinyThreshold?: number;
        smallThreshold?: number;
    }
    const defaultPieOptions: Pie;
    interface EventArgs {
        e: JQuery.TriggeredEvent;
        x: number;
        y: number;
        dx: number;
        dy: number;
        offsetX: number;
        offsetY: number;
    }
    interface EventData {
        action: string;
        clientX: number;
        clientY: number;
        startX: number;
        startY: number;
    }
}
