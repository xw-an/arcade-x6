import { Point } from '../../geometry';
import { EdgeView } from '../../view';
export interface ResolveOptions {
    fixedAt?: number | string;
}
export declare function resolve<S extends Function, T>(fn: S): T;
export declare function getPointAtEdge(edgeView: EdgeView, value: string | number): Point | null;
