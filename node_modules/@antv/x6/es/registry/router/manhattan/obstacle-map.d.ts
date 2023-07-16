import { KeyValue } from '../../../types';
import { Rectangle, Point } from '../../../geometry';
import { Edge, Model } from '../../../model';
import { ResolvedOptions } from './options';
/**
 * Helper structure to identify whether a point lies inside an obstacle.
 */
export declare class ObstacleMap {
    options: ResolvedOptions;
    /**
     * How to divide the paper when creating the elements map
     */
    mapGridSize: number;
    map: KeyValue<Rectangle[]>;
    constructor(options: ResolvedOptions);
    /**
     * Builds a map of all nodes for quicker obstacle queries i.e. is a point
     * contained in any obstacle?
     *
     * A simplified grid search.
     */
    build(model: Model, edge: Edge): this;
    isAccessible(point: Point): boolean;
}
