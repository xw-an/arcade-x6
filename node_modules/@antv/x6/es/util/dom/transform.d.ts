import { Point } from '../../geometry';
import { Scale, Rotation, Translation } from './matrix';
export interface TransformOptions {
    absolute?: boolean;
}
export declare function transform(elem: Element): DOMMatrix;
export declare function transform(elem: SVGElement, matrix: DOMMatrix, options?: TransformOptions): void;
export declare function translate(elem: Element): Translation;
export declare function translate(elem: Element, tx: number, ty?: number, options?: TransformOptions): void;
export declare function rotate(elem: Element): Rotation;
export declare function rotate(elem: Element, angle: number, cx?: number, cy?: number, options?: TransformOptions): void;
export declare function scale(elem: Element): Scale;
export declare function scale(elem: Element, sx: number, sy?: number): void;
export declare function translateAndAutoOrient(elem: SVGElement, position: Point.PointLike | Point.PointData, reference: Point.PointLike | Point.PointData, target?: SVGElement): void;
