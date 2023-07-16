import { Point, Path } from '../../geometry';
import * as Dom from '../dom/core';
export declare class Vector {
    node: SVGElement;
    protected get [Symbol.toStringTag](): string;
    get type(): string;
    get id(): string;
    set id(id: string);
    constructor(elem: Vector | SVGElement | string, attrs?: Dom.Attributes, children?: SVGElement | Vector | (SVGElement | Vector)[]);
    /**
     * Returns the current transformation matrix of the Vector element.
     */
    transform(): DOMMatrix;
    /**
     * Applies the provided transformation matrix to the Vector element.
     */
    transform(matrix: DOMMatrix, options?: Dom.TransformOptions): this;
    /**
     * Returns the current translate metadata of the Vector element.
     */
    translate(): Dom.Translation;
    /**
     * Translates the element by `tx` pixels in x axis and `ty` pixels
     * in y axis. `ty` is optional in which case the translation in y axis
     * is considered zero.
     */
    translate(tx: number, ty?: number, options?: Dom.TransformOptions): this;
    /**
     * Returns the current rotate metadata of the Vector element.
     */
    rotate(): Dom.Rotation;
    /**
     * Rotates the element by `angle` degrees. If the optional `cx` and `cy`
     * coordinates are passed, they will be used as an origin for the rotation.
     */
    rotate(angle: number, cx?: number, cy?: number, options?: Dom.TransformOptions): this;
    /**
     * Returns the current scale metadata of the Vector element.
     */
    scale(): Dom.Scale;
    /**
     * Scale the element by `sx` and `sy` factors. If `sy` is not specified,
     * it will be considered the same as `sx`.
     */
    scale(sx: number, sy?: number): this;
    /**
     * Returns an SVGMatrix that specifies the transformation necessary
     * to convert this coordinate system into `target` coordinate system.
     */
    getTransformToElement(target: SVGElement | Vector): DOMMatrix;
    removeAttribute(name: string): this;
    getAttribute(name: string): string | null;
    setAttribute(name: string, value?: string | number | null): this;
    setAttributes(attrs: {
        [attr: string]: string | number | null | undefined;
    }): this;
    attr(): {
        [attr: string]: string;
    };
    attr(name: string): string;
    attr(attrs: {
        [attr: string]: string | number | null | undefined;
    }): this;
    attr(name: string, value: string | number): this;
    svg(): Vector;
    defs(): Vector;
    text(content: string, options?: Dom.TextOptions): this;
    tagName(): string;
    clone(): Vector;
    remove(): this;
    empty(): this;
    append(elems: SVGElement | DocumentFragment | Vector | (SVGElement | DocumentFragment | Vector)[]): this;
    appendTo(target: Element | Vector): this;
    prepend(elems: SVGElement | DocumentFragment | Vector | (SVGElement | DocumentFragment | Vector)[]): this;
    before(elems: SVGElement | DocumentFragment | Vector | (SVGElement | DocumentFragment | Vector)[]): this;
    replace(elem: SVGElement | Vector): Vector;
    first(): Vector | null;
    last(): Vector | null;
    get(index: number): Vector | null;
    indexOf(elem: SVGElement | Vector): number;
    find(selector: string): Vector[];
    findOne(selector: string): Vector | null;
    findParentByClass(className: string, terminator?: SVGElement): Vector | null;
    matches(selector: string): boolean;
    contains(child: SVGElement | Vector): boolean;
    wrap(node: SVGElement | Vector): Vector;
    parent(type?: string): Vector | null;
    children(): Vector[];
    eachChild(fn: (this: Vector, currentValue: Vector, index: number, children: Vector[]) => void, deep?: boolean): this;
    index(): number;
    hasClass(className: string): boolean;
    addClass(className: string): this;
    removeClass(className?: string): this;
    toggleClass(className: string, stateVal?: boolean): this;
    toLocalPoint(x: number, y: number): DOMPoint;
    toGeometryShape(): import("../../geometry").Polyline | import("../../geometry").Rectangle | import("../../geometry").Line | Path | import("../../geometry").Ellipse;
    translateCenterToPoint(p: Point.PointLike): this;
    translateAndAutoOrient(position: Point.PointLike | Point.PointData, reference: Point.PointLike | Point.PointData, target?: SVGElement): this;
    animate(options: Dom.AnimationOptions): () => any;
    animateTransform(options: Dom.AnimationOptions): () => any;
    animateAlongPath(options: Dom.AnimationOptions, path: SVGPathElement): () => void;
    /**
     * Normalize this element's d attribute. SVGPathElements without
     * a path data attribute obtain a value of 'M 0 0'.
     */
    normalizePath(): this;
    /**
     * Returns the bounding box of the element after transformations are applied.
     * If `withoutTransformations` is `true`, transformations of the element
     * will not be considered when computing the bounding box. If `target` is
     * specified, bounding box will be computed relatively to the target element.
     */
    bbox(withoutTransformations?: boolean, target?: SVGElement): import("../../geometry").Rectangle;
    getBBox(options?: {
        target?: SVGElement | Vector | null;
        recursive?: boolean;
    }): import("../../geometry").Rectangle;
    /**
     * Samples the underlying SVG element (it currently works only on
     * paths - where it is most useful anyway). Returns an array of objects
     * of the form `{ x: Number, y: Number, distance: Number }`. Each of these
     * objects represent a point on the path. This basically creates a discrete
     * representation of the path (which is possible a curve). The sampling
     * interval defines the accuracy of the sampling. In other words, we travel
     * from the beginning of the path to the end by interval distance (on the
     * path, not between the resulting points) and collect the discrete points
     * on the path. This is very useful in many situations. For example, SVG
     * does not provide a built-in mechanism to find intersections between two
     * paths. Using sampling, we can just generate bunch of points for each of
     * the path and find the closest ones from each set.
     */
    sample(interval?: number): {
        distance: number;
        x: number;
        y: number;
    }[];
    toPath(): Vector;
    toPathData(): string | null;
}
export declare namespace Vector {
    const toStringTag: string;
    function isVector(instance: any): instance is Vector;
    function create(elem: Vector | SVGElement | string, attrs?: Dom.Attributes, children?: SVGElement | Vector | (SVGElement | Vector)[]): Vector;
    function createVectors(markup: string): Vector[];
    function toNode<T extends SVGElement = SVGElement>(elem: SVGElement | DocumentFragment | Vector): T;
    function toNodes(elems: SVGElement | DocumentFragment | Vector | (SVGElement | DocumentFragment | Vector)[]): SVGElement[];
}
