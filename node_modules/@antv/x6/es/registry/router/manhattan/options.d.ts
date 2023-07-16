import { Point, Rectangle } from '../../../geometry';
import { Edge, Node } from '../../../model';
import { EdgeView } from '../../../view';
import { Router } from '../index';
export declare type Direction = 'top' | 'right' | 'bottom' | 'left';
declare type Callable<T> = T | ((this: ManhattanRouterOptions) => T);
export interface ResolvedOptions {
    /**
     * The size of step to find a route (the grid of the manhattan pathfinder).
     */
    step: number;
    /**
     * The number of route finding loops that cause the router to abort returns
     * fallback route instead.
     */
    maxLoopCount: number;
    /**
     * The number of decimal places to round floating point coordinates.
     */
    precision: number;
    /**
     * The maximum change of direction.
     */
    maxDirectionChange: number;
    /**
     * Should the router use perpendicular edgeView option? Does not connect
     * to the anchor of node but rather a point close-by that is orthogonal.
     */
    perpendicular: boolean;
    /**
     * Should the source and/or target not be considered as obstacles?
     */
    excludeTerminals: Edge.TerminalType[];
    /**
     * Should certain types of nodes not be considered as obstacles?
     */
    excludeShapes: string[];
    /**
     * Should certain nodes not be considered as obstacles?
     */
    excludeNodes: (Node | string)[];
    /**
     * Should certain hidden nodes not be considered as obstacles?
     */
    excludeHiddenNodes: boolean;
    /**
     * Possible starting directions from a node.
     */
    startDirections: Direction[];
    /**
     * Possible ending directions to a node.
     */
    endDirections: Direction[];
    /**
     * Specify the directions used above and what they mean
     */
    directionMap: {
        top: Point.PointLike;
        right: Point.PointLike;
        bottom: Point.PointLike;
        left: Point.PointLike;
    };
    /**
     * Returns the cost of an orthogonal step.
     */
    cost: number;
    /**
     * Returns an array of directions to find next points on the route different
     * from start/end directions.
     */
    directions: {
        cost: number;
        offsetX: number;
        offsetY: number;
        angle?: number;
        gridOffsetX?: number;
        gridOffsetY?: number;
    }[];
    /**
     * A penalty received for direction change.
     */
    penalties: {
        [key: number]: number;
    };
    padding?: {
        top: number;
        right: number;
        bottom: number;
        left: number;
    };
    /**
     * The padding applied on the element bounding boxes.
     */
    paddingBox: Rectangle.RectangleLike;
    fallbackRouter: Router.Definition<any>;
    draggingRouter?: ((this: EdgeView, dragFrom: Point.PointLike, dragTo: Point.PointLike, options: ResolvedOptions) => Point[]) | null;
    fallbackRoute?: (this: EdgeView, from: Point, to: Point, options: ResolvedOptions) => Point[] | null;
    previousDirectionAngle?: number | null;
}
export declare type ManhattanRouterOptions = {
    [Key in keyof ResolvedOptions]: Callable<ResolvedOptions[Key]>;
};
export declare const defaults: ManhattanRouterOptions;
export declare function resolve<T>(input: Callable<T>, options: ManhattanRouterOptions): any;
export declare function resolveOptions(options: ManhattanRouterOptions): ResolvedOptions;
export {};
