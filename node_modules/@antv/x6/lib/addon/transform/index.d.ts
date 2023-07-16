/// <reference types="jquery" />
/// <reference types="jquery-mousewheel" />
import { Node } from '../../model/node';
import { Widget } from '../common';
export declare class Transform extends Widget<Transform.Options> {
    protected handle: Element | null;
    protected prevShift: number;
    protected $container: JQuery<HTMLElement>;
    protected get node(): Node<Node.Properties>;
    protected get containerClassName(): string;
    protected get resizeClassName(): string;
    protected get rotateClassName(): string;
    protected init(options: Transform.Options): void;
    protected startListening(): void;
    protected stopListening(): void;
    protected renderHandles(): void;
    render(): this;
    update(): this;
    remove(): this;
    protected onKnobMouseDown(): void;
    protected onKnobMouseUp(): void;
    protected updateResizerDirections(): void;
    protected getTrueDirection(dir: Node.ResizeDirection): Node.ResizeDirection;
    protected toValidResizeDirection(dir: string): Node.ResizeDirection;
    protected startResizing(evt: JQuery.MouseDownEvent): void;
    protected prepareResizing(evt: JQuery.TriggeredEvent, relativeDirection: Node.ResizeDirection): void;
    protected startRotating(evt: JQuery.MouseDownEvent): void;
    protected onMouseMove(evt: JQuery.MouseMoveEvent): void;
    protected onMouseUp(evt: JQuery.MouseUpEvent): void;
    protected startHandle(handle?: Element | null): void;
    protected stopHandle(): void;
    protected startAction(evt: JQuery.MouseDownEvent): void;
    protected stopAction(evt: JQuery.MouseUpEvent): void;
}
export declare namespace Transform {
    type Direction = 'nw' | 'n' | 'ne' | 'e' | 'se' | 's' | 'sw' | 'w';
    interface Options extends Widget.Options {
        className?: string;
        minWidth?: number;
        maxWidth?: number;
        minHeight?: number;
        maxHeight?: number;
        resizable?: boolean;
        rotatable?: boolean;
        rotateGrid?: number;
        orthogonalResizing?: boolean;
        restrictedResizing?: boolean | number;
        autoScrollOnResizing?: boolean;
        /**
         * Set to `true` if you want the resizing to preserve the
         * aspect ratio of the node. Default is `false`.
         */
        preserveAspectRatio?: boolean;
        /**
         * Reaching the minimum width or height is whether to allow control points to reverse
         */
        allowReverse?: boolean;
    }
}
